'use client'

import * as React from 'react'

type TabsContextValue = {
  value: string
  onValueChange: (value: string) => void
  registerTrigger: (value: string, node: HTMLButtonElement | null) => () => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
  }
>(({ defaultValue, value, onValueChange, children, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue)

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  // Map local al componente Tabs (padre). Se mantiene estable entre renders
  // porque está declarado aquí y se pasa por context, no dentro de un useState.
  const triggersMapRef = React.useRef<Map<string, HTMLButtonElement>>(new Map())

  const registerTrigger = React.useCallback(
    (triggerValue: string, node: HTMLButtonElement | null) => {
      if (node) {
        triggersMapRef.current.set(triggerValue, node)
      } else {
        triggersMapRef.current.delete(triggerValue)
      }
      return () => {
        triggersMapRef.current.delete(triggerValue)
      }
    },
    []
  )

  const contextValue = React.useMemo<TabsContextValue>(
    () => ({ value: currentValue || '', onValueChange: handleValueChange, registerTrigger }),
    [currentValue, handleValueChange, registerTrigger]
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div ref={ref} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
})
Tabs.displayName = 'Tabs'

export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={`bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1 ${className}`}
        {...props}
      />
    )
  }
)
TabsList.displayName = 'TabsList'

export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, onKeyDown, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const isActive = context.value === value

  // Sincroniza el ref del DOM node al triggersMap del padre vía un effect
  // (no un callback ref) para que React Compiler no se queje del patrón.
  // El effect cleanup garantiza que un trigger desmontado se borra del map.
  React.useEffect(() => {
    if (typeof ref !== 'object' || !ref) return
    const node = ref.current
    return context.registerTrigger(value, node)
  }, [context, ref, value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e)
    // Leemos el map del padre a través del nodo DOM: buscamos el TabsContext.Provider
    // ancestro y leemos su map via un side-channel. Para mantener simpleza,
    // hacemos focus moviéndose al siguiente/previo *hermano* directo del DOM,
    // lo cual funciona correctamente con cualquier TabsList plana.
    const triggerNodes = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    ).filter((n) => n.closest('[role="tablist"]') === e.currentTarget.closest('[role="tablist"]'))
    if (triggerNodes.length === 0) return
    const currentIndex = triggerNodes.indexOf(e.currentTarget)
    if (currentIndex === -1) return

    let nextIndex: number | null = null
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % triggerNodes.length
    else if (e.key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + triggerNodes.length) % triggerNodes.length
    else if (e.key === 'Home') nextIndex = 0
    else if (e.key === 'End') nextIndex = triggerNodes.length - 1

    if (nextIndex !== null) {
      e.preventDefault()
      const next = triggerNodes[nextIndex]
      next.focus()
      // Mantenemos coherencia con el patrón activando el cambio
      context.onValueChange(next.getAttribute('data-tab-value') ?? next.textContent ?? '')
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      data-tab-value={value}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={`inline-flex cursor-pointer items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'hover:bg-background/50 hover:text-foreground'
      } ${className}`}
      onClick={() => context.onValueChange(value)}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
})
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  if (context.value !== value) return null

  return (
    <div
      ref={ref}
      role="tabpanel"
      tabIndex={0}
      className={`mt-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
      {...props}
    />
  )
})
TabsContent.displayName = 'TabsContent'
