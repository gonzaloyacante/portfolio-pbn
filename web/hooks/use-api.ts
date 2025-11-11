"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

// ============================================
// PROJECTS
// ============================================

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => apiClient.getProjects(),
  })
}

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => apiClient.getProjectBySlug(slug),
    enabled: !!slug,
  })
}

export function useProjectsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: ["projects", "category", categorySlug],
    queryFn: () => apiClient.getProjectsByCategory(categorySlug),
    enabled: !!categorySlug,
  })
}

// ============================================
// CATEGORIES
// ============================================

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories(),
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => apiClient.getCategory(id),
    enabled: !!id,
  })
}

// ============================================
// SKILLS
// ============================================

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => apiClient.getSkills(),
  })
}

export function useSkill(id: string) {
  return useQuery({
    queryKey: ["skill", id],
    queryFn: () => apiClient.getSkill(id),
    enabled: !!id,
  })
}

// ============================================
// SOCIAL LINKS
// ============================================

export function useSocialLinks() {
  return useQuery({
    queryKey: ["socialLinks"],
    queryFn: () => apiClient.getSocialLinks(),
  })
}

export function useSocialLink(id: string) {
  return useQuery({
    queryKey: ["socialLink", id],
    queryFn: () => apiClient.getSocialLink(id),
    enabled: !!id,
  })
}

// ============================================
// DESIGN SETTINGS
// ============================================

export function useDesignSettings() {
  return useQuery({
    queryKey: ["designSettings"],
    queryFn: () => apiClient.getDesignSettings(),
  })
}

// ============================================
// MUTATIONS (Admin)
// ============================================

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}
