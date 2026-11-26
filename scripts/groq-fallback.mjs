const endpoint = 'https://api.groq.com/openai/v1/chat/completions'

export async function requestGroqFallback({
  apiKey,
  prompt,
  webSearch = false,
  maxCompletionTokens = 6000,
  timeoutMs = 120000,
}) {
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured.')

  const body = {
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    max_completion_tokens: maxCompletionTokens,
    temperature: 0.2,
    stream: false,
    ...(webSearch ? {
      tool_choice: 'required',
      tools: [{ type: 'browser_search' }],
      reasoning_effort: 'low',
    } : {}),
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          authorization: 'Bearer ' + apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      })
      const responseText = await response.text()
      let data
      try { data = JSON.parse(responseText) }
      catch { throw new Error('Groq returned non-JSON response (HTTP ' + response.status + ').') }

      if (response.ok) {
        const message = data.choices?.[0]?.message || {}
        const report = message.content?.trim()
        if (!report) throw new Error('Groq returned an empty response.')
        const executedTools = [
          ...(Array.isArray(message.executed_tools) ? message.executed_tools : []),
          ...(Array.isArray(data.executed_tools) ? data.executed_tools : []),
        ]
        const browserTools = executedTools.filter(tool => /browser_search/i.test([tool.type, tool.name].filter(Boolean).join(' ')))
        const sourceMap = new Map()
        for (const tool of browserTools) {
          const results = [
            ...(Array.isArray(tool.browser_results) ? tool.browser_results : []),
            ...(Array.isArray(tool.search_results?.results) ? tool.search_results.results : []),
            ...(Array.isArray(tool.search_results) ? tool.search_results : []),
          ]
          for (const item of results) {
            const uri = item.url || item.uri || ''
            if (uri && /^https?:\/\//i.test(uri)) {
              sourceMap.set(uri, { title: item.title || uri, uri })
            }
          }
        }
        const queries = []
        for (const tool of browserTools) {
          try {
            const args = typeof tool.arguments === 'string' ? JSON.parse(tool.arguments) : tool.arguments
            const query = args?.query || args?.q || args?.search_query
            if (query) queries.push(String(query))
          } catch {}
        }
        return {
          model: body.model,
          report,
          sources: [...sourceMap.values()],
          queries: [...new Set(queries)],
          searchPerformed: browserTools.length > 0,
          searchToolExecutions: browserTools.length,
          searchEvidenceCount: sourceMap.size,
        }
      }

      const message = data.error?.message || response.statusText || 'HTTP ' + response.status
      const retryable = response.status === 429 || response.status >= 500
      if (!retryable || attempt === 3) throw new Error('Groq HTTP ' + response.status + ': ' + message)
      const retryAfter = Number(response.headers.get('retry-after') || 0) * 1000
      const delay = Math.min(30000, Math.max(5000 * (2 ** (attempt - 1)), retryAfter))
      console.warn('Groq returned HTTP ' + response.status + '; retrying in ' + Math.round(delay / 1000) + 's.')
      await new Promise(resolve => setTimeout(resolve, delay))
    } catch (error) {
      const retryable = error.name === 'TimeoutError' || error.name === 'AbortError' ||
        error.cause?.code?.startsWith?.('UND_ERR_') || error.message === 'fetch failed'
      if (!retryable || attempt === 3) throw error
      const delay = 5000 * (2 ** (attempt - 1))
      console.warn('Groq request failed; retrying in ' + Math.round(delay / 1000) + 's: ' + error.message)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Groq fallback exhausted its retry attempts.')
}
