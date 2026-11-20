
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminRegistrationPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [passwordSet, setPasswordSet] = useState(false)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [designation, setDesignation] = useState('')
  const [department, setDepartment] = useState('')
  const [city, setCity] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    async function checkInvitation() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session?.user) {
          throw new Error(
            'Session not found. Please sign in or open your latest invitation link.'
          )
        }

        const user = session.user
        setEmail(user.email || '')
        setUserId(user.id)

        const { data: admin, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle()

        if (adminError || !admin) {
          throw new Error('This account is not authorised for team access.')
        }

        const { data: profile, error: profileError } = await supabase
          .from('team_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (profileError) throw profileError

        if (profile?.profile_completed) {
          navigate('/admin', { replace: true })
          return
        }

        setPasswordSet(Boolean(profile?.password_set))

        if (profile) {
          setFullName(profile.full_name || '')
          setPhone(profile.phone || '')
          setDesignation(profile.designation || '')
          setDepartment(profile.department || '')
          setCity(profile.city || '')
          setPhotoUrl(profile.profile_photo_url || '')
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to verify your account.'
        )
      } finally {
        setLoading(false)
      }
    }

    checkInvitation()
  }, [navigate])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!passwordSet) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setSaving(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user || user.id !== userId) {
        throw new Error('Your session has expired. Please sign in again.')
      }

      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      if (adminError || !admin) {
        throw new Error('You are not authorised to join the team.')
      }

      if (!passwordSet) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password,
        })

        if (passwordError) throw passwordError
      }

      const { error: profileError } = await supabase
        .from('team_profiles')
        .upsert(
          {
            user_id: user.id,
            full_name: fullName.trim(),
            phone: phone.trim(),
            designation: designation.trim(),
            department: department.trim() || null,
            city: city.trim() || null,
            profile_photo_url: photoUrl.trim() || null,
            password_set: true,
            profile_completed: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )

      if (profileError) throw profileError

      navigate('/admin', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save your profile. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171512] text-sm text-white/60">
        Verifying your account...
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171512] px-5 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <img
            src="/mediazz-logo.png"
            alt="Mediazz Hub"
            className="mx-auto mb-6 h-16 w-auto object-contain"
          />

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#c5a46d]">
            Mediazz Hub Team
          </p>

          <h1 className="font-serif text-3xl text-white sm:text-4xl">
            Complete Your Profile
          </h1>

          <p className="mt-3 text-sm text-white/50">
            Welcome to the team. Please complete your details to continue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-[#211e19] p-6 shadow-2xl sm:p-9"
        >
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white/50 outline-none"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your mobile number"
                required
                className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                Designation *
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Video Editor"
                required
                className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Production"
                className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Your city"
                className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                Profile Photo URL
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
              />
            </div>
          </div>

          {!passwordSet && (
            <div className="border-t border-white/10 pt-5">
              <h2 className="mb-4 text-sm font-bold text-white">
                Create Your Password
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    minLength={8}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-[#c5a46d] px-5 py-3.5 text-sm font-bold text-[#171512] transition hover:bg-[#e0bd7e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving Your Profile...' : 'Complete Registration'}
          </button>

          <p className="text-center text-xs text-white/35">
            Your account is managed by Mediazz Hub.
          </p>
        </form>
      </div>
    </main>
  )
}
