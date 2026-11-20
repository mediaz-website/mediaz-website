
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminResetPasswordPage() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [checking, setChecking] = useState(true)
  const [sessionReady, setSessionReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    async function checkRecoverySession() {
      const { data, error: sessionError } = await supabase.auth.getSession()

      if (!active) return

      if (sessionError) {
        setError(sessionError.message)
        setChecking(false)
        return
      }

      setSessionReady(Boolean(data.session))
      setChecking(false)
    }

    checkRecoverySession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return

      if (event === 'PASSWORD_RECOVERY' && session) {
        setSessionReady(true)
        setChecking(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleUpdatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error('Your reset session has expired. Please request a new link.')
      }

      const user = userData.user

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) throw updateError

      // Remember that this user has already created/reset their password.
      const { error: profileError } = await supabase
        .from('team_profiles')
        .upsert(
          {
            user_id: user.id,
            password_set: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )

      if (profileError) throw profileError

      await supabase.auth.signOut()

      setMessage('Password updated successfully. You can now sign in.')
      setPassword('')
      setConfirmPassword('')

      window.setTimeout(() => {
        navigate('/admin/login', { replace: true })
      }, 1800)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171512] text-sm text-white/60">
        Verifying password reset link...
      </main>
    )
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

          <h1 className="font-serif text-4xl text-white">Reset Password</h1>

          <p className="mt-3 text-sm text-white/50">
            Create a new password for your admin account.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-white/10 bg-[#211e19] p-7 shadow-2xl sm:p-9">
          {!sessionReady ? (
            <>
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error ||
                  'This password reset link is invalid or expired. Please request a new link.'}
              </p>

              <Link
                to="/admin/login"
                className="block text-center text-sm font-semibold text-[#c5a46d] hover:text-[#e0bd7e]"
              >
                Back to Admin Login
              </Link>
            </>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                  New Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter new password"
                  minLength={8}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                />
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
                className="w-full rounded-lg bg-[#c5a46d] px-5 py-3.5 text-sm font-bold text-[#171512] transition hover:bg-[#e0bd7e] disabled:opacity-60"
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
