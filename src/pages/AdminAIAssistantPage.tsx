import { useCallback, useEffect, useRef, useState } from 'react'
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

type Conversation = {
  id: string
  title: string | null
  updated_at: string
}

type ChatMessage = {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  attachments?: Array<{ name?: string; mimeType?: string }> | null
  created_at: string
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
  if (words.length <= 2) return { headlineLine1: clean, headlineLine2: '' }

  const midpoint = Math.ceil(words.length / 2)
  return {
    headlineLine1: words.slice(0, midpoint).join(' '),
    headlineLine2: words.slice(midpoint).join(' '),
  }
}

function mapHeroChanges(changes: ChangePlan['changes'] = []): Record<string, string> {
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

function extractPlan(content: string): ChangePlan | null {
  try {
    const parsed = JSON.parse(content)
    const candidate = parsed?.plan ?? parsed
    if (
      candidate &&
      typeof candidate === 'object' &&
      typeof candidate.summary === 'string' &&
      Array.isArray(candidate.changes)
    ) {
      return {
        type: String(candidate.type || 'general'),
        summary: candidate.summary,
        target: String(candidate.target || ''),
        changes: candidate.changes.map((item: { field?: unknown; value?: unknown }) => ({
          field: String(item?.field ?? 'Change'),
          value: String(item?.value ?? ''),
        })),
        requires_code: Boolean(candidate.requires_code),
        warnings: Array.isArray(candidate.warnings) ? candidate.warnings.map(String) : [],
      }
    }
  } catch {
    return null
  }
  return null
}

function formatTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

function PreviewCard({
  plan,
  onPublish,
  publishing,
}: {
  plan: ChangePlan
  onPublish?: () => void
  publishing?: boolean
}) {
  const canPublishHero =
    plan.type === 'content_update' &&
    !plan.requires_code &&
    String(plan.target || '').toLowerCase().includes('homepage') &&
    String(plan.target || '').toLowerCase().includes('hero') &&
    Object.keys(mapHeroChanges(plan.changes)).length > 0

  return (
    <div className="mt-4 rounded-xl border border-[#c6a15b]/35 bg-[#111] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-white">AI Change Preview</h3>
        <span className="rounded-full bg-[#c6a15b]/15 px-3 py-1.5 text-xs text-[#e5c47e]">
          Preview Only
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-200">{plan.summary}</p>
      {plan.target && <p className="mt-2 text-xs text-gray-400">Target: {plan.target}</p>}

      {plan.changes.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-gray-200">Proposed Changes</p>
          {plan.changes.map((change, index) => (
            <div key={index} className="rounded-lg bg-[#1b1b1b] p-3">
              <p className="text-xs font-medium text-[#c6a15b]">{change.field}</p>
              <p className="mt-1 break-words text-sm text-gray-200">{change.value}</p>
            </div>
          ))}
        </div>
      )}

      {plan.requires_code && (
        <p className="mt-3 text-sm text-amber-300">
          This request requires a code update. It cannot be published through the content editor.
        </p>
      )}
      {plan.warnings.length > 0 && (
        <div className="mt-3 space-y-1 text-sm text-amber-300">
          {plan.warnings.map((warning, index) => <p key={index}>{warning}</p>)}
        </div>
      )}

      {canPublishHero && onPublish ? (
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="mb-3 text-xs text-gray-400">
            Publishing immediately updates the live Homepage Hero content.
          </p>
          <button
            type="button"
            onClick={onPublish}
            disabled={publishing}
            className="rounded-lg bg-[#c6a15b] px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
          >
            {publishing ? 'Publishing...' : 'Apply & Publish to Website'}
          </button>
        </div>
      ) : (
        <p className="mt-4 text-xs text-gray-500">
          Direct publishing is currently available for supported Homepage Hero content updates only.
        </p>
      )}
    </div>
  )
}

export default function AdminAIAssistantPage() {
  const [prompt, setPrompt] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [plan, setPlan] = useState<ChangePlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadConversations = useCallback(async () => {
    const { data, error: queryError } = await supabase
      .from('ai_conversations')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(50)

    if (queryError) throw queryError
    setConversations((data || []) as Conversation[])
  }, [])

  const loadMessages = useCallback(async (conversationId: string) => {
    const { data, error: queryError } = await supabase
      .from('ai_messages')
      .select('id, role, content, attachments, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(200)

    if (queryError) throw queryError
    const loaded = (data || []) as ChatMessage[]
    setMessages(loaded)
    const lastAssistant = [...loaded].reverse().find((item) => item.role === 'assistant')
    setPlan(lastAssistant ? extractPlan(lastAssistant.content) : null)
  }, [])

  useEffect(() => {
    let cancelled = false
    const initialize = async () => {
      setLoadingHistory(true)
      setError('')
      try {
        const { data, error: queryError } = await supabase
          .from('ai_conversations')
          .select('id, title, updated_at')
          .order('updated_at', { ascending: false })
          .limit(50)
        if (queryError) throw queryError
        if (cancelled) return
        const rows = (data || []) as Conversation[]
        setConversations(rows)
        if (rows.length > 0) {
          setActiveConversationId(rows[0].id)
          const { data: messageRows, error: messageError } = await supabase
            .from('ai_messages')
            .select('id, role, content, attachments, created_at')
            .eq('conversation_id', rows[0].id)
            .order('created_at', { ascending: true })
            .limit(200)
          if (messageError) throw messageError
          if (cancelled) return
          const loaded = (messageRows || []) as ChatMessage[]
          setMessages(loaded)
          const lastAssistant = [...loaded].reverse().find((item) => item.role === 'assistant')
          setPlan(lastAssistant ? extractPlan(lastAssistant.content) : null)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load chat history.')
      } finally {
        if (!cancelled) setLoadingHistory(false)
      }
    }
    initialize()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  const openConversation = async (conversationId: string) => {
    if (loading) return
    setActiveConversationId(conversationId)
    setMessages([])
    setPlan(null)
    setError('')
    setSuccess('')
    try {
      await loadMessages(conversationId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open this conversation.')
    }
  }

  const startNewChat = () => {
    if (loading) return
    setActiveConversationId(null)
    setMessages([])
    setPlan(null)
    setPrompt('')
    setAttachments([])
    setError('')
    setSuccess('')
  }

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
      const converted = await Promise.all(selected.map(async (file) => ({
        name: file.name,
        mimeType: file.type,
        data: await readFileAsDataUrl(file),
        size: file.size,
      })))
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
    if (!prompt.trim() || loading) return
    const submittedPrompt = prompt.trim()
    setLoading(true)
    setError('')
    setSuccess('')
    setPlan(null)

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-website-assistant', {
        body: {
          prompt: submittedPrompt,
          conversation_id: activeConversationId,
          attachments: attachments.map(({ name, mimeType, data }) => ({ name, mimeType, data })),
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
      if (!data?.success) throw new Error(data?.error || 'AI request failed')
      if (!data?.conversation_id) throw new Error('AI response did not include a conversation ID.')

      setActiveConversationId(data.conversation_id)
      setPrompt('')
      setAttachments([])
      setPlan(data.plan as ChangePlan)
      await Promise.all([
        loadMessages(data.conversation_id),
        loadConversations(),
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      if (activeConversationId) {
        try { await loadMessages(activeConversationId) } catch { /* Preserve the original request error. */ }
      }
    } finally {
      setLoading(false)
    }
  }

  const applyAndPublish = async (selectedPlan: ChangePlan) => {
    if (selectedPlan.requires_code || selectedPlan.type !== 'content_update') {
      setError('This preview is not a supported CMS content update. Please use the Website CMS or request a code change separately.')
      return
    }

    const target = String(selectedPlan.target || '').toLowerCase()
    const isHomepageHero = target.includes('homepage') && target.includes('hero')
    if (!isHomepageHero) {
      setError('Abhi AI Assistant se direct publishing sirf Homepage Hero section ke liye enabled hai. Baaki sections Website CMS se publish kijiye.')
      return
    }

    const updates = mapHeroChanges(selectedPlan.changes)
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
        .upsert({
          page_key: 'homepage',
          section_key: 'hero',
          content: mergedContent,
          is_published: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'page_key,section_key' })
      if (saveError) throw saveError

      setSuccess('Homepage Hero successfully published. Live website content has been updated.')
      setPlan(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish changes.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-5 md:px-8 md:py-8">
        <a href="/admin" className="text-sm text-[#c6a15b]">← Back to Dashboard</a>

        <div className="mb-6 mt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">Mediazz Hub · Owner Workspace</p>
          <h1 className="mt-2 text-3xl font-serif md:text-4xl">Expert AI Website Manager</h1>
          <p className="mt-2 text-sm text-gray-400">
            Website planning, content assistance and project conversations in one workspace.
          </p>
        </div>

        <div className="grid min-h-[680px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-white/10 bg-[#1b1b1b] p-3">
            <button
              type="button"
              onClick={startNewChat}
              disabled={loading}
              className="w-full rounded-lg bg-[#c6a15b] px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
            >
              + New Conversation
            </button>
            <div className="mt-5 flex items-center justify-between px-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Chat History</h2>
              <button
                type="button"
                onClick={() => loadConversations().catch((err) => setError(err.message))}
                className="text-xs text-[#e5c47e]"
              >
                Refresh
              </button>
            </div>
            <div className="mt-3 max-h-[560px] space-y-1 overflow-y-auto">
              {loadingHistory && <p className="px-3 py-4 text-xs text-gray-500">Loading conversations...</p>}
              {!loadingHistory && conversations.length === 0 && (
                <p className="px-3 py-4 text-xs leading-5 text-gray-500">Your saved conversations will appear here.</p>
              )}
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => openConversation(conversation.id)}
                  disabled={loading}
                  className={'w-full rounded-lg px-3 py-3 text-left transition ' + (
                    activeConversationId === conversation.id ? 'bg-[#c6a15b]/15 ring-1 ring-[#c6a15b]/30' : 'hover:bg-white/5'
                  )}
                >
                  <span className="block truncate text-sm text-gray-200">
                    {conversation.title?.trim() || 'Saved conversation'}
                  </span>
                  <span className="mt-1 block text-[11px] text-gray-500">{formatTime(conversation.updated_at)}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="flex min-h-[680px] min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1b1b1b]">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="font-semibold">AI Workspace</h2>
              <p className="mt-1 text-xs text-gray-500">
                {activeConversationId ? 'Continuing saved conversation' : 'New conversation'} · Preview-first mode
              </p>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 md:px-6">
              {messages.length === 0 && !loading && (
                <div className="mx-auto mt-12 max-w-xl text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c6a15b]/40 text-xl text-[#e5c47e]">✦</div>
                  <h3 className="mt-4 text-xl font-semibold">How can I help manage your website?</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Ask about Mediazz Hub, website content, CMS updates, project planning or technical improvements.
                    I will prepare a preview before supported changes are published.
                  </p>
                </div>
              )}

              {messages.filter((message) => message.role === 'user' || message.role === 'assistant').map((message) => {
                const messagePlan = message.role === 'assistant' ? extractPlan(message.content) : null
                return (
                  <div key={message.id} className={message.role === 'user' ? 'ml-auto max-w-[90%] md:max-w-[80%]' : 'mr-auto max-w-[96%]'}>
                    <div className="mb-1 flex items-center gap-2 text-[11px] text-gray-500">
                      <span>{message.role === 'user' ? 'You' : 'Expert AI Manager'}</span>
                      <span>·</span>
                      <span>{formatTime(message.created_at)}</span>
                    </div>
                    {message.role === 'user' ? (
                      <div className="whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-[#303030] px-4 py-3 text-sm leading-6 text-gray-100">
                        {message.content}
                        {!!message.attachments?.length && (
                          <div className="mt-2 border-t border-white/10 pt-2 text-xs text-gray-400">
                            {message.attachments.map((file, index) => <p key={index}>📎 {file.name || 'Attachment'}</p>)}
                          </div>
                        )}
                      </div>
                    ) : messagePlan ? (
                      <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-[#151515] p-4">
                        <p className="text-sm leading-6 text-gray-200">{messagePlan.summary}</p>
                        <p className="mt-2 text-xs text-gray-500">Target: {messagePlan.target || 'Not specified'}</p>
                        {messagePlan.changes.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {messagePlan.changes.map((change, index) => (
                              <div key={index} className="rounded-lg bg-[#202020] p-3">
                                <p className="text-xs text-[#c6a15b]">{change.field}</p>
                                <p className="mt-1 break-words text-sm text-gray-200">{change.value}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {messagePlan.warnings.length > 0 && (
                          <div className="mt-3 space-y-1 text-xs text-amber-300">
                            {messagePlan.warnings.map((warning, index) => <p key={index}>{warning}</p>)}
                          </div>
                        )}
                        {messagePlan.requires_code && (
                          <p className="mt-3 text-xs text-amber-300">This request requires a code update.</p>
                        )}
                        {messagePlan.type === 'content_update' &&
                          !messagePlan.requires_code &&
                          messagePlan.target.toLowerCase().includes('homepage') &&
                          messagePlan.target.toLowerCase().includes('hero') &&
                          Object.keys(mapHeroChanges(messagePlan.changes)).length > 0 && (
                            <button
                              type="button"
                              onClick={() => applyAndPublish(messagePlan)}
                              disabled={publishing}
                              className="mt-4 rounded-lg bg-[#c6a15b] px-4 py-2 text-xs font-semibold text-black disabled:opacity-50"
                            >
                              {publishing ? 'Publishing...' : 'Apply & Publish to Website'}
                            </button>
                          )}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm border border-white/10 bg-[#151515] px-4 py-3 text-sm leading-6 text-gray-200">
                        {message.content}
                      </div>
                    )}
                  </div>
                )
              })}
              {loading && (
                <div className="mr-auto rounded-xl border border-white/10 bg-[#151515] px-4 py-3 text-sm text-gray-400">
                  AI is preparing your response...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {plan && (
              <div className="border-t border-white/10 px-4 pt-3 md:px-6">
                <PreviewCard plan={plan} onPublish={() => applyAndPublish(plan)} publishing={publishing} />
              </div>
            )}

            {error && (
              <div className="mx-4 mt-3 rounded-lg border border-red-500/30 bg-red-950/30 p-3 text-sm text-red-300 md:mx-6">
                {error}
              </div>
            )}
            {success && (
              <div className="mx-4 mt-3 rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-sm text-emerald-300 md:mx-6">
                {success}
              </div>
            )}

            <div className="border-t border-white/10 p-4 md:p-5">
              {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachments.map((file) => (
                    <div key={file.name} className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-xs text-gray-300">
                      <span className="max-w-[180px] truncate">{file.name}</span>
                      <button type="button" onClick={() => removeAttachment(file.name)} disabled={loading} className="text-red-300">×</button>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    void generatePreview()
                  }
                }}
                placeholder="Message Expert AI Website Manager... (Enter to send, Shift + Enter for new line)"
                rows={3}
                maxLength={3000}
                disabled={loading || publishing}
                className="w-full resize-y rounded-xl border border-white/15 bg-[#111] p-4 text-sm leading-6 text-white outline-none focus:border-[#c6a15b] disabled:opacity-60"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,image/jpeg,image/png,image/webp,application/pdf,text/plain"
                    onChange={(event) => void addFiles(event.target.files)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading || publishing || attachments.length >= MAX_FILES}
                    className="rounded-lg border border-[#c6a15b]/50 px-3 py-2 text-xs text-[#e5c47e] disabled:opacity-40"
                  >
                    + Attach files
                  </button>
                  <span className="text-[11px] text-gray-500">{prompt.length}/3000 · Max 3 files</span>
                </div>
                <button
                  type="button"
                  onClick={() => void generatePreview()}
                  disabled={loading || publishing || !prompt.trim()}
                  className="rounded-lg bg-[#c6a15b] px-6 py-3 text-sm font-semibold text-black disabled:opacity-50"
                >
                  {loading ? 'Thinking...' : 'Send Message'}
                </button>
              </div>
              <p className="mt-3 text-[11px] text-gray-500">
                AI responses are saved to your chat history. Website changes are not made unless you explicitly publish a supported preview.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
