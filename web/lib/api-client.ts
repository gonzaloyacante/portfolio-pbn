// API client for frontend - Portfolio PBN v2
// Now using Next.js API Routes instead of external backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  success?: boolean
  total?: number
  limit?: number
  offset?: number
}

interface PaginationParams {
  limit?: number
  offset?: number
}

class ApiClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      // Save token in cookie for middleware
      document.cookie = `auth_token=${token}; path=/; max-age=3600; SameSite=Strict`
      // Also save in localStorage as backup
      localStorage.setItem("auth_token", token)
    }
  }

  getToken() {
    if (typeof window !== "undefined") {
      // Try to get from cookie first
      const cookieMatch = document.cookie.match(/auth_token=([^;]+)/)
      if (cookieMatch) return cookieMatch[1]
      // Fallback to localStorage
      return localStorage.getItem("auth_token")
    }
    return this.token
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      // Remove cookie
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      // Remove from localStorage
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      }

      const token = this.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include", // Para cookies (refresh token)
      })

      if (!response.ok) {
        const error = await response.json()
        return { error: error.error || "An error occurred" }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: "Network error" }
    }
  }

  // ============================================
  // AUTH
  // ============================================

  async register(email: string, password: string, name: string) {
    const result = await this.request<{ accessToken: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })
    
    if (result.error) {
      throw new Error(result.error)
    }
    
    if (!result.data) {
      throw new Error("No se recibió respuesta del servidor")
    }
    
    if (!result.data.accessToken) {
      throw new Error("Token de acceso no recibido")
    }
    
    this.setToken(result.data.accessToken)
    return result.data
  }

  async login(email: string, password: string) {
    const result = await this.request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    
    // Manejar respuesta de error del servidor
    if (!result.success && result.error) {
      throw new Error(result.message || result.error || "Error al iniciar sesión")
    }
    
    if (result.error) {
      throw new Error(result.error)
    }
    
    // La respuesta exitosa viene en result.data.data
    const userData = result.data?.data || result.data
    
    if (!userData) {
      throw new Error("No se recibió respuesta del servidor")
    }
    
    if (!userData.token) {
      throw new Error("Token de acceso no recibido")
    }
    
    this.setToken(userData.token)
    return userData
  }

  async logout() {
    const result = await this.request("/auth/logout", { method: "POST" })
    this.clearToken()
    return result.data
  }

  async refreshToken() {
    const result = await this.request<{ accessToken: string }>("/auth/refresh", { method: "POST" })
    if (result.data?.accessToken) {
      this.setToken(result.data.accessToken)
    }
    return result.data
  }

  async getMe() {
    const result = await this.request<any>("/auth/me")
    return result.data
  }

  // ============================================
  // PROJECTS
  // ============================================

  async getProjects(params?: { category?: string; featured?: boolean } & PaginationParams) {
    const query = new URLSearchParams()
    if (params?.category) query.append("category", params.category)
    if (params?.featured !== undefined) query.append("featured", params.featured.toString())
    if (params?.limit) query.append("limit", params.limit.toString())
    if (params?.offset) query.append("offset", params.offset.toString())

    const result = await this.request<any>(`/projects?${query}`)
    // API returns { data: projects[], total, limit, offset }
    return result?.data?.data || []
  }

  async getProject(id: string) {
    const result = await this.request<any>(`/projects/${id}`)
    return result.data
  }

  async getProjectBySlug(slug: string) {
    const result = await this.request<any>(`/projects/${slug}`)
    return result.data
  }

  async getProjectsByCategory(categorySlug: string, params?: PaginationParams) {
    const query = new URLSearchParams()
    if (params?.limit) query.append("limit", params.limit.toString())
    if (params?.offset) query.append("offset", params.offset.toString())

    const result = await this.request<any>(`/projects/category/${categorySlug}?${query}`)
    return result.data
  }

  // Admin
  async getAllProjectsAdmin(params?: PaginationParams) {
    const query = new URLSearchParams()
    if (params?.limit) query.append("limit", params.limit.toString())
    if (params?.offset) query.append("offset", params.offset.toString())

    const result = await this.request<any>(`/admin/projects?${query}`)
    return result?.data?.data || []
  }

  async createProject(data: any) {
    const result = await this.request<any>("/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async updateProject(id: string, data: any) {
    const result = await this.request<any>(`/admin/projects?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async deleteProject(id: string) {
    const result = await this.request(`/admin/projects?id=${id}`, { method: "DELETE" })
    return result.data
  }

  async addProjectImage(projectId: string, data: { url: string; alt: string; order?: number }) {
    const result = await this.request<any>(`/admin/projects/images?projectId=${projectId}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async deleteProjectImage(projectId: string, imageId: string) {
    const result = await this.request(`/admin/projects/images?projectId=${projectId}&imageId=${imageId}`, { method: "DELETE" })
    return result.data
  }

  // ============================================
  // CATEGORIES
  // ============================================

  async getCategories() {
  const result = await this.request<any>("/categories")
  return result?.data?.data || []
  }

  async getCategoryBySlug(slug: string) {
    const result = await this.request<any>(`/categories/${slug}`)
    return result.data
  }

  // Admin
  async createCategory(data: any) {
    const result = await this.request<any>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async updateCategory(id: string, data: any) {
    const result = await this.request<any>(`/categories?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async deleteCategory(id: string) {
    const result = await this.request(`/categories?id=${id}`, { method: "DELETE" })
    return result.data
  }

  // ============================================
  // CONTACTS
  // ============================================

  async submitContact(data: any) {
    const result = await this.request<any>("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return result.data
  }

  // Admin
  async getContacts(params?: { status?: string } & PaginationParams) {
    const query = new URLSearchParams()
    if (params?.status) query.append("status", params.status)
    if (params?.limit) query.append("limit", params.limit.toString())
    if (params?.offset) query.append("offset", params.offset.toString())

    const result = await this.request<any>(`/admin/contacts?${query}`)
    return result?.data?.data || []
  }

  async getContact(id: string) {
    const result = await this.request<any>(`/admin/contacts/${id}`)
    return result.data
  }

  async updateContact(id: string, data: any) {
    const result = await this.request<any>(`/admin/contacts?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async deleteContact(id: string) {
    const result = await this.request(`/admin/contacts?id=${id}`, { method: "DELETE" })
    return result.data
  }

  // ============================================
  // SKILLS
  // ============================================

  async getSkills() {
  const result = await this.request<any>("/skills")
  return result?.data?.data || []
  }

  // Admin
  async createSkill(data: any) {
    const result = await this.request<any>("/skills", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async updateSkill(id: string, data: any) {
    const result = await this.request<any>(`/skills?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async deleteSkill(id: string) {
    const result = await this.request(`/skills?id=${id}`, { method: "DELETE" })
    return result.data
  }

  // ============================================
  // SOCIAL LINKS
  // ============================================

  async getSocialLinks() {
    const result = await this.request<any>("/social-links")
    return result?.data?.data || []
  }

  // Admin
  async createSocialLink(data: any) {
    const result = await this.request<any>("/social-links", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async updateSocialLink(id: string, data: any) {
    const result = await this.request<any>(`/social-links?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async deleteSocialLink(id: string) {
    const result = await this.request(`/social-links?id=${id}`, { method: "DELETE" })
    return result.data
  }

  // ============================================
  // SETTINGS
  // ============================================

  async getSettings() {
    const result = await this.request<any>("/settings")
    return result.data
  }

  // Admin
  async updateSettings(data: any) {
    const result = await this.request<any>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return result.data
  }

  // ============================================
  // CMS - DESIGN SETTINGS
  // ============================================

  async getDesignSettings() {
    const result = await this.request<any>("/design-settings")
    return result.data
  }

  async updateDesignSettings(data: any) {
    const result = await this.request<any>("/design-settings", {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return result.data
  }

  // ============================================
  // CMS - PAGE SECTIONS
  // ============================================

  async getPageSections(pageName?: string) {
    const query = pageName ? `?pageName=${pageName}` : ""
    const result = await this.request<any>(`/page-sections${query}`)
    return result.data?.data || []
  }

  async getPageSection(id: string) {
    const result = await this.request<any>(`/page-sections/${id}`)
    return result.data
  }

  async createPageSection(data: any) {
    const result = await this.request<any>("/page-sections", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async updatePageSection(id: string, data: any) {
    const result = await this.request<any>(`/page-sections?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async deletePageSection(id: string) {
    await this.request<any>(`/page-sections?id=${id}`, {
      method: "DELETE",
    })
  }

  async reorderPageSections(sections: Array<{ id: string; order: number }>) {
    const result = await this.request<any>("/page-sections/reorder", {
      method: "PUT",
      body: JSON.stringify({ sections }),
    })
    return result.data
  }

  // ============================================
  // CMS - CONTENT BLOCKS
  // ============================================

  async getContentBlocks() {
    const result = await this.request<any>("/content-blocks")
    return result.data?.data || []
  }

  async getContentBlock(id: string) {
    const result = await this.request<any>(`/content-blocks/${id}`)
    return result.data
  }

  async createContentBlock(data: any) {
    const result = await this.request<any>("/content-blocks", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async updateContentBlock(id: string, data: any) {
    const result = await this.request<any>(`/content-blocks?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return result.data
  }

  async deleteContentBlock(id: string) {
    await this.request<any>(`/content-blocks?id=${id}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
