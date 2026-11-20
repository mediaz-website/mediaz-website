import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useHomepageSection<T extends Record<string, string>>(sectionKey: string, defaults: T): T {
  const [content, setContent] = useState<T>(defaults)
  useEffect(() => {
    let active = true
    async function load() {
      const { data } = await supabase.from('site_content').select('content')
        .eq('page_key', 'homepage').eq('section_key', sectionKey).eq('is_published', true).maybeSingle()
      if (active && data?.content && typeof data.content === 'object') {
        setContent({ ...defaults, ...(data.content as Partial<T>) })
      }
    }
    load()
    return () => { active = false }
  }, [sectionKey])
  return content
}
