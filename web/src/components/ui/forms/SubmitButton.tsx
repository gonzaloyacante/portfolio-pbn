'use client'

import { useFormStatus } from 'react-dom'
import Button, { ButtonProps } from './Button'

/**
 * Button that automatically disables and shows loading state
 * while its parent <form> Server Action is pending.
 * Use inside <form action={serverAction}> without any extra state.
 */
export function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending || props.disabled} loading={pending} {...props}>
      {children}
    </Button>
  )
}
