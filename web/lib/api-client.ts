import { ENV } from './env'

// Cliente API centralizado con manejo de errores y tipos
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiRequestOptions extends RequestInit {
  timeout?: number
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = ENV.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { timeout = 10000, ...fetchOptions } = options
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        signal: controller.signal,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.error || `HTTP ${response.status}`,
          response.status,
          errorData.code
        )
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT')
      }
      
      throw new ApiError('Network error', 0, 'NETWORK_ERROR')
    }
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request('/api/auth/logout', { method: 'POST' })
  }

  async getSession() {
    return this.request('/api/auth/session')
  }

  // Projects
  async getProjects() {
    return this.request('/api/projects')
  }

  async getProject(id: string) {
    return this.request(`/api/projects/${id}`)
  }

  async createProject(data: any) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: string, data: any) {
    return this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: string) {
    return this.request(`/api/projects/${id}`, { method: 'DELETE' })
  }

  // Categories
  async getCategories() {
    return this.request('/api/categories')
  }

  async createCategory(data: any) {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: string, data: any) {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: string) {
    return this.request(`/api/categories/${id}`, { method: 'DELETE' })
  }

  // Gallery
  async getGallery() {
    return this.request('/api/gallery')
  }

  async updateGalleryOrder(images: any[]) {
    return this.request('/api/gallery/order', {
      method: 'PUT',
      body: JSON.stringify({ images }),
    })
  }

  async addToGallery(imageIds: string[]) {
    return this.request('/api/gallery', {
      method: 'POST',
      body: JSON.stringify({ imageIds }),
    })
  }

  async removeFromGallery(imageId: string) {
    return this.request(`/api/gallery/${imageId}`, { method: 'DELETE' })
  }

  // Settings
  async getSettings() {
    return this.request('/api/settings')
  }

  async updateSettings(data: any) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Contact
  async getContact() {
    return this.request('/api/contact')
  }

  async updateContact(data: any) {
    return this.request('/api/contact', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Presentation
  async getPresentation() {
    return this.request('/api/presentation')
  }

  async updatePresentation(data: any) {
    return this.request('/api/presentation', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()
