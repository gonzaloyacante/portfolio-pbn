import { Section } from '@/components/layout'

interface DeviceData {
  mobile: number
  tablet: number
  desktop: number
}

interface DeviceUsageProps {
  deviceUsage: DeviceData
}

export default function DeviceUsage({ deviceUsage }: DeviceUsageProps) {
  const total = deviceUsage.mobile + deviceUsage.tablet + deviceUsage.desktop
  const mobilePercent = total > 0 ? Math.round((deviceUsage.mobile / total) * 100) : 0
  const tabletPercent = total > 0 ? Math.round((deviceUsage.tablet / total) * 100) : 0
  const desktopPercent = 100 - mobilePercent - tabletPercent

  return (
    <Section title="📱 Dispositivos">
      {total > 0 ? (
        <div className="space-y-4">
          {/* Barra proporcional */}
          <div className="bg-muted flex h-6 overflow-hidden rounded-full">
            {mobilePercent > 0 && (
              <div
                className="bg-secondary text-secondary-foreground flex h-full items-center justify-center text-xs font-bold transition-all"
                style={{ width: `${mobilePercent}%` }}
              >
                {mobilePercent > 12 && `${mobilePercent}%`}
              </div>
            )}
            {tabletPercent > 0 && (
              <div
                className="bg-primary/60 text-primary-foreground flex h-full items-center justify-center text-xs font-bold transition-all"
                style={{ width: `${tabletPercent}%` }}
              >
                {tabletPercent > 12 && `${tabletPercent}%`}
              </div>
            )}
            <div
              className="bg-primary text-primary-foreground flex h-full items-center justify-center text-xs font-bold transition-all"
              style={{ width: `${desktopPercent}%` }}
            >
              {desktopPercent > 12 && `${desktopPercent}%`}
            </div>
          </div>

          {/* Leyenda */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { color: 'bg-secondary', value: deviceUsage.mobile, label: '📱 Móvil' },
              { color: 'bg-primary/60', value: deviceUsage.tablet, label: '📟 Tablet' },
              { color: 'bg-primary', value: deviceUsage.desktop, label: '💻 Escritorio' },
            ].map(({ color, value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`${color} h-4 w-4 rounded`} />
                <div>
                  <p className="text-foreground text-lg font-bold">{value}</p>
                  <p className="text-muted-foreground text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-6 text-center">
          <span className="text-4xl">📱</span>
          <p className="text-muted-foreground mt-2 text-sm">Sin datos de dispositivos</p>
        </div>
      )}
    </Section>
  )
}
