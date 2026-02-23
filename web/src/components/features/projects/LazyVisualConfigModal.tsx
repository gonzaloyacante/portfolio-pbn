'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { VisualConfigModalProps } from './VisualConfigModal'

const VisualConfigModal = dynamic(() => import('./VisualConfigModal'), {
  ssr: false,
  loading: () => null,
}) as ComponentType<VisualConfigModalProps<FieldValues>>

export default function LazyVisualConfigModal<T extends FieldValues>(
  props: VisualConfigModalProps<T>
) {
  return <VisualConfigModal {...(props as VisualConfigModalProps<FieldValues>)} />
}
