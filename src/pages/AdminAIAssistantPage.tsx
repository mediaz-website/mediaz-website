
import { useState } from 'react'
import { supabase } from '../lib/supabase'

type ChangePlan = {
  type: string
  summary: string
  target: string
  changes: { field: string; value: string }[]
  requires_code: boolean
  warnings: string[]
}

export default function AdminAIAssistantPage() {
  const [prompt, setPrompt] = useState('')
  const [plan, setPlan] = useState<ChangePlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generatePreview = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError('')
    setPlan(null)

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke('ai-website-assistant', {
          body: { prompt: prompt.trim() },
        })

      if (functionError) throw functionError
      if (!data?.success) {
        throw new Error(data?.error || 'AI request failed')
      }

      setPlan(data.plan)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

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

          <div className="flex justify-between items-center mt-3 gap-3">
            <span className="text-xs text-gray-500">
              {prompt.length}/3000 characters
            </span>

            <button
              onClick={generatePreview}
              disabled={loading || !prompt.trim()}
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
                This request requires a code update. It cannot be
                published through the content editor.
              </p>
            )}

            {plan.warnings.length > 0 && (
              <div className="mt-5 text-amber-300 text-sm space-y-2">
                {plan.warnings.map((warning, index) => (
                  <p key={index}>{warning}</p>
                ))}
              </div>
            )}

            <p className="mt-6 text-xs text-gray-500">
              No website changes have been saved or published yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
