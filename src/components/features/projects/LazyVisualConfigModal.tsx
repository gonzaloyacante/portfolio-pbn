'use client'

import dynamic from 'next/dynamic'
import type { FieldValues } from 'react-hook-form'
import type { VisualConfigModalProps } from './VisualConfigModal'

const VisualConfigModal = dynamic(() => import('./VisualConfigModal'), {
  ssr: false,
  loading: () => null,
})

export default function LazyVisualConfigModal<T extends FieldValues>(
  props: VisualConfigModalProps<T>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <VisualConfigModal {...(props as any)} />
}
