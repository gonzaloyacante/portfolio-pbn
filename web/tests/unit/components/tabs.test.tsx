import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'

describe('Tabs', () => {
  const renderTabs = (
    props: { defaultValue?: string; value?: string; onValueChange?: (v: string) => void } = {}
  ) =>
    render(
      <Tabs
        defaultValue={props.defaultValue ?? 'tab1'}
        value={props.value}
        onValueChange={props.onValueChange}
      >
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    )

  it('renders tab triggers', () => {
    renderTabs()
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
  })

  it('shows first tab content by default', () => {
    renderTabs()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
  })

  it('switches content on tab click', () => {
    renderTabs()
    fireEvent.click(screen.getByText('Tab 2'))
    expect(screen.getByText('Content 2')).toBeInTheDocument()
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
  })

  it('controlled mode with value prop', () => {
    renderTabs({ value: 'tab2' })
    expect(screen.getByText('Content 2')).toBeInTheDocument()
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
  })

  it('calls onValueChange on tab click', () => {
    const onChange = vi.fn()
    renderTabs({ onValueChange: onChange })
    fireEvent.click(screen.getByText('Tab 2'))
    expect(onChange).toHaveBeenCalledWith('tab2')
  })

  it('applies active styling to selected tab trigger', () => {
    renderTabs()
    const activeTab = screen.getByText('Tab 1')
    expect(activeTab.className).toContain('bg-primary')
  })

  it('does not apply active styling to unselected tab', () => {
    renderTabs()
    const inactiveTab = screen.getByText('Tab 2')
    expect(inactiveTab.className).not.toContain('bg-primary')
  })

  it('renders correct content for each tab when switching', () => {
    renderTabs()

    fireEvent.click(screen.getByText('Tab 3'))
    expect(screen.getByText('Content 3')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Tab 1'))
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  it('handles multiple tabs', () => {
    renderTabs()
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(3)
  })

  it('applies custom className to TabsList', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList className="custom-list">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
      </Tabs>
    )
    const list = screen.getByText('A').parentElement
    expect(list?.className).toContain('custom-list')
  })

  it('renders with custom trigger content', () => {
    render(
      <Tabs defaultValue="icon">
        <TabsList>
          <TabsTrigger value="icon">
            <span data-testid="icon-span">🎨</span> Design
          </TabsTrigger>
        </TabsList>
        <TabsContent value="icon">Design content</TabsContent>
      </Tabs>
    )
    expect(screen.getByTestId('icon-span')).toBeInTheDocument()
    expect(screen.getByText('Design content')).toBeInTheDocument()
  })

  it('throws error when TabsTrigger is used outside Tabs', () => {
    expect(() => {
      render(<TabsTrigger value="orphan">Orphan</TabsTrigger>)
    }).toThrow('TabsTrigger must be used within Tabs')
  })

  it('throws error when TabsContent is used outside Tabs', () => {
    expect(() => {
      render(<TabsContent value="orphan">Orphan Content</TabsContent>)
    }).toThrow('TabsContent must be used within Tabs')
  })

  it('tab triggers are buttons', () => {
    renderTabs()
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(3)
    buttons.forEach((btn) => {
      expect(btn.getAttribute('type')).toBe('button')
    })
  })

  it('defaultValue=tab2 shows Content 2 initially', () => {
    renderTabs({ defaultValue: 'tab2' })
    expect(screen.getByText('Content 2')).toBeInTheDocument()
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
  })
})
