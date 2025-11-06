import { render, screen } from '@testing-library/react'
import { useSession } from '@/hooks/useSession'
import AdminLayout from '@/components/AdminLayout'

// Mock the useSession hook
jest.mock('@/hooks/useSession')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe('AdminLayout', () => {
  const mockChildren = <div>Admin Content</div>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state when session is loading', () => {
    mockUseSession.mockReturnValue({
      user: null,
      loading: true,
      error: null,
    })

    render(<AdminLayout>{mockChildren}</AdminLayout>)
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    mockUseSession.mockReturnValue({
      user: null,
      loading: false,
      error: null,
    })

    render(<AdminLayout>{mockChildren}</AdminLayout>)
    
    expect(screen.getByText('Redirigiendo...')).toBeInTheDocument()
  })

  it('shows access denied for non-admin users', () => {
    mockUseSession.mockReturnValue({
      user: {
        id: 1,
        email: 'user@example.com',
        role: 'EDITOR',
      },
      loading: false,
      error: null,
    })

    render(<AdminLayout>{mockChildren}</AdminLayout>)
    
    expect(screen.getByText('Acceso denegado')).toBeInTheDocument()
    expect(screen.getByText('No tienes permisos para acceder a esta sección.')).toBeInTheDocument()
  })

  it('renders admin content for admin users', () => {
    mockUseSession.mockReturnValue({
      user: {
        id: 1,
        email: 'admin@example.com',
        role: 'ADMIN',
      },
      loading: false,
      error: null,
    })

    render(<AdminLayout>{mockChildren}</AdminLayout>)
    
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
    expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
  })

  it('renders with custom title and right content', () => {
    mockUseSession.mockReturnValue({
      user: {
        id: 1,
        email: 'admin@example.com',
        role: 'ADMIN',
      },
      loading: false,
      error: null,
    })

    const rightContent = <button>Custom Button</button>

    render(
      <AdminLayout title="Custom Title" right={rightContent}>
        {mockChildren}
      </AdminLayout>
    )
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Button')).toBeInTheDocument()
  })
})
