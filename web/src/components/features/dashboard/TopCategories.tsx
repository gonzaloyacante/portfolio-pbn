import { Section } from '@/components/layout'

interface CategoryView {
  title: string
  count: number
}

interface TopCategoriesProps {
  categories: CategoryView[]
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function TopCategories({ categories }: TopCategoriesProps) {
  return (
    <Section title="⭐ Top Categorías">
      {categories.length > 0 ? (
        <div className="space-y-2">
          {categories.slice(0, 5).map((category, idx) => (
            <div
              key={idx}
              className="bg-card border-border flex items-center justify-between rounded-xl border p-3 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{MEDALS[idx] ?? `${idx + 1}.`}</span>
                <span className="text-foreground text-sm font-bold">
                  {category.title.length > 20 ? category.title.slice(0, 20) + '…' : category.title}
                </span>
              </div>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-bold">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center">
          <span className="text-4xl">⭐</span>
          <p className="text-muted-foreground mt-2 text-sm">Sin categorías vistas aún</p>
        </div>
      )}
    </Section>
  )
}
