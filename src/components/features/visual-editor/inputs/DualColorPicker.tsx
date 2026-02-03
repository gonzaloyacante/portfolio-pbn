'use client'

import { ColorPicker } from '@/components/ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { Sun, Moon } from 'lucide-react'

interface DualColorPickerProps {
  lightColor: string
  darkColor: string
  onChangeLight: (color: string) => void
  onChangeDark: (color: string) => void
  label?: string
}

export function DualColorPicker({
  lightColor,
  darkColor,
  onChangeLight,
  onChangeDark,
  label = 'Color',
}: DualColorPickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
      </div>

      <Tabs defaultValue="light" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="light" className="flex items-center gap-2">
            <Sun className="h-3.5 w-3.5" />
            Light
          </TabsTrigger>
          <TabsTrigger value="dark" className="flex items-center gap-2">
            <Moon className="h-3.5 w-3.5" />
            Dark
          </TabsTrigger>
        </TabsList>
        <TabsContent value="light" className="pt-2">
          <ColorPicker color={lightColor} onChange={onChangeLight} label="Color (Modo Claro)" />
        </TabsContent>
        <TabsContent value="dark" className="pt-2">
          <ColorPicker color={darkColor} onChange={onChangeDark} label="Color (Modo Oscuro)" />
        </TabsContent>
        <p className="text-muted-foreground mt-1 text-center text-[10px]">
          * Deja el color vacío (o null) para heredar del tema global
        </p>
      </Tabs>
    </div>
  )
}
