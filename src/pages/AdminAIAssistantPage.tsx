import { useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

type ChangePlan = {
  type: string
  summary: string
  target: string
  changes: { field: string; value: string }[]
  requires_code: boolean
  warnings: string[]
}

type Attachment = {
  name: string
  mimeType: string
  data: string
  size: number
}

const MAX_FILES = 3
const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_TOTAL_SIZE = 15 * 1024 * 1024

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/plain',
]

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Could not read ' + file.name))
    }
    reader.onerror = () => reject(new Error('Could not read ' + file.name))
    reader.readAsDataURL(file)
  })
}

function splitHeading(value: string): { headlineLine1: string; headlineLine2: string } {
  const clean = value.trim()
  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((part) => part.trim()).filter(Boolean) || []

  if (sentences.length >= 2) {
    return {
      headlineLine1: sentences.slice(0, -1).join(' '),
      headlineLine2: sentences[sentences.length - 1],
    }
  }

  const words = clean.split(/\s+/)
  if (words.length <= 2) {
    return { headlineLine1: clean, headlineLine2: '' }
  }

  const midpoint = Math.ceil(words.length / 2)
  return {
    headlineLine1: words.slice(0, midpoint).join(' '),
    headlineLine2: words.slice(midpoint).join(' '),
  }
}

function mapHeroChanges(changes: ChangePlan['changes']): Record<string, string> {
  const mapped: Record<string, string> = {}

  for (const change of changes) {
    const field = String(change.field || '').trim().toLowerCase().replace(/[\s_-]+/g, '')
    const value = String(change.value ?? '').trim()
    if (!value) continue

    if (['heading', 'title', 'headline', 'heroheading'].includes(field)) {
      Object.assign(mapped, splitHeading(value))
    } else if (['subtitle', 'description', 'herodescription'].includes(field)) {
      mapped.description = value
    } else if (field === 'headlineline1') {
      mapped.headlineLine1 = value
    } else if (field === 'headlineline2') {
      mapped.headlineLine2 = value
    } else if (field === 'eyebrow') {
      mapped.eyebrow = value
    }
  }

  return mapped
}

export default function AdminAIAssistantPage() {
  const [prompt, setPrompt] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [plan, setPlan] = useState<ChangePlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return

    setError('')
    setSuccess('')
    const selected = Array.from(fileList)

    if (attachments.length + selected.length > MAX_FILES) {
      setError('Maximum ' + MAX_FILES + ' attachments allowed.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const currentSize = attachments.reduce((sum, file) => sum + file.size, 0)
    const incomingSize = selected.reduce((sum, file) => sum + file.size, 0)

    if (currentSize + incomingSize > MAX_TOTAL_SIZE) {
      setError('Total attachment size cannot exceed 15 MB.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    for (const file of selected) {
      if (!allowedTypes.includes(file.type)) {
        setError(file.name + ': Only JPG, PNG, WEBP, PDF and TXT files are supported.')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(file.name + ' is larger than 10 MB.')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
    }

    try {
      const converted = await Promise.all(
        selected.map(async (file) => ({
          name: file.name,
          mimeType: file.type,
          data: await readFileAsDataUrl(file),
          size: file.size,
        }))
      )
      setAttachments((current) => [...current, ...converted])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read attachment.')
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAttachment = (name: string) => {
    setAttachments((current) => current.filter((file) => file.name !== name))
  }

  const generatePreview = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError('')
    setSuccess('')
    setPlan(null)

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke('ai-website-assistant', {
          body: {
            prompt: prompt.trim(),
            attachments: attachments.map(({ name, mimeType, data }) => ({
              name,
              mimeType,
              data,
            })),
          },
        })

      if (functionError) {
        let message = functionError.message
        try {
          const context = (functionError as { context?: Response }).context
          if (context) {
            const responseData = await context.clone().json()
            if (responseData?.error) message = responseData.error
          }
        } catch {
          // Keep the original function error message.
        }
        throw new Error(message)
      }

      if (!data?.success) {
        throw new Error(data?.error || 'AI request failed')
      }

      setPlan(data.plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const applyAndPublish = async () => {
    if (!plan) return

    if (plan.requires_code || plan.type !== 'content_update') {
      setError('This preview is not a supported CMS content update. Please use the Website CMS or request a code change separately.')
      return
    }

    const target = String(plan.target || '').toLowerCase()
    const isHomepageHero = target.includes('homepage') && target.includes('hero')
    if (!isHomepageHero) {
      setError('Abhi AI Assistant se direct publishing sirf Homepage Hero section ke liye enabled hai. Baaki sections Website CMS se publish kijiye.')
      return
    }

    const updates = mapHeroChanges(plan.changes)
    if (Object.keys(updates).length === 0) {
      setError('Preview ke fields Homepage Hero CMS fields se match nahi hue. Please edit this section from Website CMS.')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to publish these changes to the live Homepage Hero? This will update the live website content.'
    )
    if (!confirmed) return

    setPublishing(true)
    setError('')
    setSuccess('')

    try {
      const { data: existing, error: readError } = await supabase
        .from('site_content')
        .select('content')
        .eq('page_key', 'homepage')
        .eq('section_key', 'hero')
        .maybeSingle()

      if (readError) throw readError

      const existingContent =
        existing?.content && typeof existing.content === 'object'
          ? existing.content as Record<string, unknown>
          : {}

      const mergedContent = { ...existingContent, ...updates }

      const { error: saveError } = await supabase
        .from('site_content')
        .upsert(
          {
            page_key: 'homepage',
            section_key: 'hero',
            content: mergedContent,
            is_published: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'page_key,section_key' }
        )

      if (saveError) throw saveError

      setSuccess('Homepage Hero successfully published. Live website content has been updated.')
      setPlan(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish changes.')
    } finally {
      setPublishing(false)
    }
  }

  const canPublishHero =
    !!plan &&
    plan.type === 'content_update' &&
    !plan.requires_code &&
    String(plan.target || '').toLowerCase().includes('homepage') &&
    String(plan.target || '').toLowerCase().includes('hero') &&
    Object.keys(mapHeroChanges(plan.changes)).length > 0

  return (
    <div className="min-h-screen bg-[#111111] text-white p-5 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/admin" className="text-[#c6a15b] text-sm">
          ← Back to Dashboard
        </a>

        <div className="mt-8 mb-8">
          <p className="text-[#c6a15b] text-sm tracking-widest uppercase">
            Mediazz Hub
          </p>
          <h1 className="text-3xl md:text-4xl font-serif mt-2">
            AI Website Assistant
          </h1>
          <p className="text-gray-400 mt-3">
            Describe the website update you want in simple language.
          </p>
        </div>

        <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-5">
          <label className="block text-sm mb-3">
            What would you like to change?
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Homepage ka hero heading premium aur impactful bana do..."
            rows={5}
            maxLength={3000}
            className="w-full bg-[#111] border border-white/15 rounded-lg p-4 text-white outline-none focus:border-[#c6a15b] resize-y"
          />

          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,image/jpeg,image/png,image/webp,application/pdf,text/plain"
              onChange={(e) => addFiles(e.target.files)}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || publishing || attachments.length >= MAX_FILES}
              className="border border-[#c6a15b]/60 text-[#e5c47e] px-4 py-2 rounded-lg text-sm disabled:opacity-40"
            >
              + Attach Images / Files
            </button>

            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG, WEBP, PDF, TXT · Max 3 files · 10 MB per file · 15 MB total
            </p>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between gap-3 bg-[#111] border border-white/10 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-gray-300 truncate">
                      {file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file.name)}
                      disabled={loading || publishing}
                      className="text-red-300 text-xs shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-4 gap-3">
            <span className="text-xs text-gray-500">
              {prompt.length}/3000 characters
            </span>

            <button
              onClick={generatePreview}
              disabled={loading || publishing || !prompt.trim()}
              className="bg-[#c6a15b] text-black font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Preparing Preview...' : 'Generate Preview'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-5 bg-red-950/40 border border-red-500/30 text-red-300 rounded-lg p-4">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-lg p-4">
            {success}
          </div>
        )}

        {plan && (
          <div className="mt-6 bg-[#1b1b1b] border border-[#c6a15b]/40 rounded-xl p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <h2 className="text-xl font-semibold">AI Change Preview</h2>
              <span className="text-xs bg-[#c6a15b]/15 text-[#e5c47e] px-3 py-2 rounded-full">
                Preview Only
              </span>
            </div>

            <p className="text-gray-300 mt-4">{plan.summary}</p>

            <p className="text-sm text-gray-400 mt-3">
              Target: {plan.target}
            </p>

            {plan.changes.length > 0 && (
              <div className="mt-5 space-y-3">
                <h3 className="font-semibold">Proposed Changes</h3>
                {plan.changes.map((change, index) => (
                  <div
                    key={index}
                    className="bg-[#111] rounded-lg p-4"
                  >
                    <p className="text-[#c6a15b] text-sm">
                      {change.field}
                    </p>
                    <p className="text-gray-200 mt-1 break-words">
                      {change.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {plan.requires_code && (
              <p className="mt-5 text-amber-300 text-sm">
                This request requires a code update. It cannot be published through the content editor.
              </p>
            )}

            {plan.warnings.length > 0 && (
              <div className="mt-5 text-amber-300 text-sm space-y-2">
                {plan.warnings.map((warning, index) => (
                  <p key={index}>{warning}</p>
                ))}
              </div>
            )}

            {canPublishHero && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="mb-3 text-xs text-gray-400">
                  Publishing will immediately update the live Homepage Hero content.
                </p>
                <button
                  type="button"
                  onClick={applyAndPublish}
                  disabled={publishing || loading}
                  className="rounded-lg bg-[#c6a15b] px-6 py-3 font-semibold text-black disabled:opacity-50"
                >
                  {publishing ? 'Publishing...' : 'Apply & Publish to Website'}
                </button>
              </div>
            )}

            {!canPublishHero && (
              <p className="mt-6 text-xs text-gray-500">
                Direct publishing is currently available for supported Homepage Hero content updates only. Use Website CMS for other sections.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
