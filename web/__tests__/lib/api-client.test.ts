import { apiClient, ApiError } from '@/lib/api-client'

// Mock fetch globally
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('request method', () => {
    it('makes successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await apiClient.getProjects()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/projects',
        expect.objectContaining({
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      expect(result).toEqual(mockData)
    })

    it('handles HTTP errors correctly', async () => {
      const errorResponse = { error: 'Not found', code: 'NOT_FOUND' }
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => errorResponse,
      } as Response)

      try {
        await apiClient.getProject('999')
        fail('Expected ApiError to be thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect(error).toMatchObject({
          message: 'Not found',
          status: 404,
          code: 'NOT_FOUND',
        })
      }
    })

    it('handles network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      try {
        await apiClient.getProjects()
        fail('Expected ApiError to be thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect(error).toMatchObject({
          message: 'Network error',
          status: 0,
          code: 'NETWORK_ERROR',
        })
      }
    })

    it('handles timeout errors', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({} as Response), 15000)
          })
      )

      const promise = apiClient.getProjects()
      
      // Fast-forward time to trigger timeout
      jest.advanceTimersByTime(10000)

      await expect(promise).rejects.toThrow(ApiError)
      await expect(promise).rejects.toMatchObject({
        message: 'Request timeout',
        status: 408,
        code: 'TIMEOUT',
      })
    }, 15000)
  })

  describe('auth methods', () => {
    it('makes login request with credentials', async () => {
      const mockResponse = { token: 'abc123', user: { id: 1 } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await apiClient.login('test@example.com', 'password')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password',
          }),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('makes logout request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      await apiClient.logout()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/auth/logout',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })

  describe('CRUD operations', () => {
    it('creates project with POST request', async () => {
      const projectData = { title: 'New Project', description: 'Test' }
      const mockResponse = { id: 1, ...projectData }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await apiClient.createProject(projectData)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/projects',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(projectData),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('updates project with PUT request', async () => {
      const projectData = { title: 'Updated Project' }
      const mockResponse = { id: 1, ...projectData }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await apiClient.updateProject('1', projectData)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/projects/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(projectData),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('deletes project with DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      await apiClient.deleteProject('1')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/projects/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })
  })
})

describe('ApiError', () => {
  it('creates error with message and status', () => {
    const error = new ApiError('Test error', 400, 'BAD_REQUEST')

    expect(error.message).toBe('Test error')
    expect(error.status).toBe(400)
    expect(error.code).toBe('BAD_REQUEST')
    expect(error.name).toBe('ApiError')
  })

  it('creates error without code', () => {
    const error = new ApiError('Test error', 500)

    expect(error.message).toBe('Test error')
    expect(error.status).toBe(500)
    expect(error.code).toBeUndefined()
  })
})
