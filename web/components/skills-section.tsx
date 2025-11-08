"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useDesign } from "./design-provider"

interface SkillsData {
  title: string
  subtitle?: string
  config: {
    layout?: "grid" | "circular" | "list"
    columns?: number
    iconSize?: string
    showProgress?: boolean
    skills?: Array<{ name: string; icon?: string; level?: number }>
  }
}

interface Skill {
  id: string
  name: string
  icon?: string
  level?: number
  category?: string
}

export default function SkillsSection() {
  const { settings } = useDesign()
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [sections, skillsFromApi] = await Promise.all([
          apiClient.getPageSections("home"),
          apiClient.getSkills(),
        ])

        const skillsSection = sections.find((s: any) => s.sectionType === "SKILLS")
        if (skillsSection) {
          setSkillsData(skillsSection)
        }

        setSkills(skillsFromApi || [])
      } catch (error) {
        console.error("Error loading skills:", error)
      }
    }
    loadData()
  }, [])

  const config = skillsData?.config || {}
  const layout = config.layout || "grid"
  const columns = config.columns || 3
  const iconSize = config.iconSize || "3rem"
  const showProgress = config.showProgress || false

  const displaySkills = config.skills && config.skills.length > 0 ? config.skills : skills

  if (!skillsData) return null

  return (
    <section
      className="py-12 md:py-24 px-4 md:px-8"
      style={{ padding: settings?.sectionPadding }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: settings?.containerMaxWidth || "1200px" }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              fontFamily: settings?.headingFont,
              color: settings?.primaryColor,
            }}
          >
            {skillsData.title}
          </h2>
          {skillsData.subtitle && (
            <p
              className="text-lg"
              style={{
                color: settings?.textColor ? `${settings.textColor}80` : "var(--muted)",
                fontFamily: settings?.bodyFont,
              }}
            >
              {skillsData.subtitle}
            </p>
          )}
        </div>

        {/* Skills Grid/List/Circular */}
        {layout === "grid" && (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: settings?.elementSpacing || "2rem",
            }}
          >
            {displaySkills.map((skill: any, idx: number) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-lg transition-all"
                style={{
                  backgroundColor: settings?.accentColor
                    ? `${settings.accentColor}10`
                    : "var(--card)",
                  borderRadius: settings?.borderRadius,
                  boxShadow: settings?.boxShadow,
                  transition: `all ${settings?.transitionSpeed || "0.3s"}`,
                }}
              >
                {skill.icon && (
                  <div
                    className="mb-4"
                    style={{
                      fontSize: iconSize,
                      color: settings?.primaryColor,
                    }}
                  >
                    {skill.icon}
                  </div>
                )}
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{
                    color: settings?.textColor,
                    fontFamily: settings?.bodyFont,
                  }}
                >
                  {skill.name}
                </h3>
                {showProgress && skill.level && (
                  <div className="w-full mt-3">
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: `${settings?.accentColor}30` }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${skill.level}%`,
                          backgroundColor: settings?.primaryColor,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {layout === "circular" && (
          <div className="flex flex-wrap justify-center gap-8">
            {displaySkills.map((skill: any, idx: number) => (
              <div
                key={idx}
                className="flex flex-col items-center"
                style={{ width: iconSize }}
              >
                <div
                  className="rounded-full flex items-center justify-center mb-3 hover:scale-110 transition-transform"
                  style={{
                    width: iconSize,
                    height: iconSize,
                    backgroundColor: settings?.primaryColor,
                    color: "#fff",
                    fontSize: `calc(${iconSize} / 2)`,
                    transition: `all ${settings?.transitionSpeed || "0.3s"}`,
                  }}
                >
                  {skill.icon || skill.name[0]}
                </div>
                <p
                  className="text-sm font-medium text-center"
                  style={{
                    color: settings?.textColor,
                    fontFamily: settings?.bodyFont,
                  }}
                >
                  {skill.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {layout === "list" && (
          <div className="max-w-2xl mx-auto space-y-4">
            {displaySkills.map((skill: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-lg"
                style={{
                  backgroundColor: settings?.accentColor
                    ? `${settings.accentColor}10`
                    : "var(--card)",
                  borderRadius: settings?.borderRadius,
                }}
              >
                {skill.icon && (
                  <div
                    style={{
                      fontSize: iconSize,
                      color: settings?.primaryColor,
                    }}
                  >
                    {skill.icon}
                  </div>
                )}
                <div className="flex-1">
                  <h3
                    className="font-semibold"
                    style={{
                      color: settings?.textColor,
                      fontFamily: settings?.bodyFont,
                    }}
                  >
                    {skill.name}
                  </h3>
                  {showProgress && skill.level && (
                    <div className="w-full mt-2">
                      <div
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: `${settings?.accentColor}30` }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${skill.level}%`,
                            backgroundColor: settings?.primaryColor,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {showProgress && skill.level && (
                  <span
                    className="text-sm font-medium"
                    style={{ color: settings?.primaryColor }}
                  >
                    {skill.level}%
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
