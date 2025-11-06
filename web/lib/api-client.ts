// API client for frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
    localStorage.setItem("auth_token", token)
  }

  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return this.token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      }

      const token = this.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
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

  // Auth
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  // Projects
  async getProjects() {
    return this.request("/projects")
  }

  async getProject(slug: string) {
    return this.request(`/projects/${slug}`)
  }

  async getProjectsByCategory(categorySlug: string) {
    return this.request(`/projects/category/${categorySlug}`)
  }

  async createProject(data: any) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: string, data: any) {
    return this.request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: "DELETE",
    })
  }

  // Contacts
  async submitContact(data: any) {
    return this.request("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getContacts() {
    return this.request("/contacts")
  }

  async getContact(id: string) {
    return this.request(`/contacts/${id}`)
  }

  async updateContact(id: string, data: any) {
    return this.request(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteContact(id: string) {
    return this.request(`/contacts/${id}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
