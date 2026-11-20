
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password })

      if (loginError || !data.user) {
        throw new Error('Invalid email or password.')
      }

      const { data: admin, error: roleError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (roleError || !admin) {
        await supabase.auth.signOut()
        throw new Error('You are not authorised to access the admin panel.')
      }

      const { data: profile, error: profileError } = await supabase
        .from('team_profiles')
        .select('profile_completed')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (profileError) throw profileError

      if (!profile?.profile_completed) {
        navigate('/admin/register', { replace: true })
      } else {
        navigate('/admin', { replace: true })
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    setError('')
    setMessage('')

    if (!email.trim()) {
      setError('Please enter your email address first.')
      return
    }

    setResetLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        }
      )

      if (resetError) throw resetError

      setMessage(
        'If an account exists for this email, a password reset link has been sent. Please check your inbox and spam folder.'
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to send reset email. Please try again.'
      )
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171512] px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <img
            src="/mediazz-logo.png"
            alt="Mediazz Hub"
            className="mx-auto mb-8 h-16 w-auto object-contain"
          />

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#c5a46d]">
            Mediazz Hub
          </p>

          <h1 className="font-serif text-4xl text-white">Admin Portal</h1>

          <p className="mt-3 text-sm text-white/50">
            Sign in to manage your production house.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6 rounded-2xl border border-white/10 bg-[#211e19] p-7 shadow-2xl sm:p-9"
        >
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your admin email"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-[#c5a46d]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-[#c5a46d]"
            />

            <div className="mt-3 text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-xs font-semibold text-[#c5a46d] transition hover:text-[#e0bd7e] disabled:opacity-60"
              >
                {resetLoading ? 'Sending reset link...' : 'Forgot Password?'}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#c5a46d] px-5 py-3.5 text-sm font-bold text-[#171512] transition hover:bg-[#e0bd7e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In to Admin'}
          </button>

          <p className="text-center text-xs text-white/35">
            Restricted access · Authorised personnel only
          </p>
        </form>

        <p className="mt-8 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Mediazz Hub
        </p>
      </div>
    </main>
  )
}
