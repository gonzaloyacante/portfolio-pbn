import useSWR from 'swr'
import { projectService } from '@/lib/services/projects'
import type Project from '@/models/Project'

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<Project[]>(
    ['projects:list'],
    () => projectService.list()
  )
  return { projects: data ?? [], isLoading, error, mutate }
}
