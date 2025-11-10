import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

interface AdminCardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  headerAction?: ReactNode
  hover?: boolean
  gradient?: boolean
}

export function AdminCard({
  children,
  className,
  title,
  description,
  headerAction,
  hover = false,
  gradient = false,
}: AdminCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 shadow-sm backdrop-blur-sm transition-all duration-300",
        hover && "hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-300/50 dark:hover:border-pink-700/50 hover:-translate-y-1",
        gradient && "bg-gradient-to-br from-white via-pink-50/20 to-purple-50/20 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900",
        className
      )}
    >
      {(title || headerAction) && (
        <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-gray-100 dark:border-gray-700/30">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className={cn("p-6", (title || headerAction) && "pt-4")}>
        {children}
      </div>
    </div>
  )
}

interface AdminStatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
}

export function AdminStatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
}: AdminStatsCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 p-6 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300",
        onClick && "cursor-pointer hover:-translate-y-1 hover:border-pink-300/50 dark:hover:border-pink-700/50"
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          {icon && (
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 text-pink-600 dark:text-pink-400">
              {icon}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs. mes anterior
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
