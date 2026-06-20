import type { CaseStudy } from './cases'
import type { Service } from './services'

export type DynamicContent = {
  services: Service[]
  cases: CaseStudy[]
}

const EMPTY_CONTENT: DynamicContent = {
  services: [],
  cases: [],
}

let dynamicContentPromise: Promise<DynamicContent> | null = null

async function fetchDynamicContent(): Promise<DynamicContent> {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_DYNAMIC_CONTENT !== 'true') {
    return EMPTY_CONTENT
  }

  const paths = import.meta.env.DEV ? ['/api/content'] : ['/api/content', '/contact/api/content']
  try {
    for (const path of paths) {
      const response = await fetch(path, {
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) continue
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) continue

      const data = (await response.json()) as Partial<DynamicContent>

      return {
        services: Array.isArray(data.services) ? data.services : [],
        cases: Array.isArray(data.cases) ? data.cases : [],
      }
    }
  } catch {
    return EMPTY_CONTENT
  }

  return EMPTY_CONTENT
}

export function loadDynamicContent(): Promise<DynamicContent> {
  dynamicContentPromise ??= fetchDynamicContent()
  return dynamicContentPromise
}
