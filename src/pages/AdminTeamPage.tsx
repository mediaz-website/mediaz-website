
import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type TeamMember = {
  user_id: string
  email: string
  role: string
  created_at: string
  email_confirmed_at: string | null
  last_sign_in_at: string | null
  full_name?: string
  phone?: string | null
  profile_photo_url?: string | null
  designation?: string | null
  department?: string | null
  city?: string | null
  profile_completed?: boolean
}

type ProfileForm = {
  full_name: string
  phone: string
  designation: string
  department: string
  city: string
  profile_photo_url: string
}

const emptyProfile: ProfileForm = {
  full_name: '',
  phone: '',
  designation: '',
  department: '',
  city: '',
  profile_photo_url: '',
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const error = err as {
      message?: string
      details?: string
      hint?: string
      code?: string
    }

    return [
      error.message,
      error.details,
      error.hint ? `Hint: ${error.hint}` : '',
      error.code ? `Code: ${error.code}` : '',
    ].filter(Boolean).join(' | ')
  }

  return String(err)
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('editor')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [authorized, setAuthorized] = useState(false)

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile)

  const callFunction = async (payload: Record<string, string>) => {
    const { data, error } = await supabase.functions.invoke('admin-team', {
      body: payload,
    })

    if (error) throw error
    if (data?.error) throw new Error(data.error)

    return data
  }

  const loadTeam = async () => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/admin/login'
        return
      }

      const { data: member, error: memberError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      if (memberError) throw memberError

      if (member?.role !== 'owner') {
        setAuthorized(false)
        setError('Only the Owner can access Team Management.')
        return
      }

      setAuthorized(true)

      const result = await callFunction({ action: 'list' })
      const members = (result.team || []) as TeamMember[]

      if (members.length === 0) {
        setTeam([])
        return
      }

      const userIds = members.map((item) => item.user_id)

      const { data: profiles, error: profileError } = await supabase
        .from('team_profiles')
        .select('user_id, full_name, phone, profile_photo_url, designation, department, city, profile_completed')
        .in('user_id', userIds)

      if (profileError) throw profileError

      const profileMap = new Map(
        (profiles || []).map((item) => [item.user_id, item])
      )

      setTeam(
        members.map((item) => ({
          ...item,
          ...(profileMap.get(item.user_id) || {}),
        }))
      )
    } catch (err) {
      setError(`Unable to load team: ${getErrorMessage(err)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeam()
  }, [])

  const inviteMember = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setSending(true)

    try {
      const result = await callFunction({
        action: 'invite',
        email,
        role,
      })

      setMessage(result.message || 'Invitation sent successfully.')
      setEmail('')
      await loadTeam()
    } catch (err) {
      setError(`Invitation failed: ${getErrorMessage(err)}`)
    } finally {
      setSending(false)
    }
  }

  const updateRole = async (userId: string, newRole: string) => {
    setMessage('')
    setError('')

    try {
      const result = await callFunction({
        action: 'update_role',
        user_id: userId,
        role: newRole,
      })

      setMessage(result.message || 'Role updated.')
      await loadTeam()
    } catch (err) {
      setError(`Role update failed: ${getErrorMessage(err)}`)
    }
  }

  const removeMember = async (member: TeamMember) => {
    const confirmed = window.confirm(
      `Revoke admin access for ${member.email}? Their Supabase Auth account will not be deleted.`
    )

    if (!confirmed) return

    setMessage('')
    setError('')

    try {
      const result = await callFunction({
        action: 'remove',
        user_id: member.user_id,
      })

      setMessage(result.message || 'Access revoked.')
      await loadTeam()
    } catch (err) {
      setError(`Unable to revoke access: ${getErrorMessage(err)}`)
    }
  }

  const openProfileEditor = (member: TeamMember) => {
    setEditingMember(member)

    setProfile({
      full_name: member.full_name || '',
      phone: member.phone || '',
      designation: member.designation || '',
      department: member.department || '',
      city: member.city || '',
      profile_photo_url: member.profile_photo_url || '',
    })

    setMessage('')
    setError('')
  }

  const uploadProfilePhoto = async (file?: File) => {
    if (!file || !editingMember) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG and WEBP images are allowed.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10 MB.')
      return
    }

    setUploading(true)
    setError('')
    setMessage('')

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filePath = `team/${editingMember.user_id}/profile-${Date.now()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from('media-library')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath)

      setProfile((previous) => ({
        ...previous,
        profile_photo_url: data.publicUrl,
      }))

      setMessage('Photo uploaded. Click Save Profile to apply it.')
    } catch (err) {
      setError(`Photo upload failed: ${getErrorMessage(err)}`)
    } finally {
      setUploading(false)
    }
  }

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()

    if (!editingMember) return

    setSaving(true)
    setMessage('')
    setError('')

    try {
      const profileData = {
        user_id: editingMember.user_id,
        full_name: profile.full_name.trim(),
        phone: profile.phone.trim() || null,
        designation: profile.designation.trim() || null,
        department: profile.department.trim() || null,
        city: profile.city.trim() || null,
        profile_photo_url: profile.profile_photo_url || null,
        profile_completed: editingMember.profile_completed ?? false,
        updated_at: new Date().toISOString(),
      }

      const { error: saveError } = await supabase
        .from('team_profiles')
        .upsert(profileData, {
          onConflict: 'user_id',
        })

      if (saveError) {
        throw saveError
      }

      setEditingMember(null)
      setMessage('Team member profile updated successfully.')
      await loadTeam()
    } catch (err) {
      console.error('Team profile save error:', err)
      setError(`Profile save failed: ${getErrorMessage(err)}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] p-8 text-white">
        Loading team...
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#111] p-8 text-white">
        <h1 className="text-2xl font-semibold mb-3">Team Management</h1>
        <p className="text-red-400">{error || 'Access denied.'}</p>
        <a href="/admin" className="inline-block mt-6 text-amber-400">
          Back to Dashboard
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-5 md:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-amber-400 text-sm tracking-widest uppercase">
              Mediazz Hub
            </p>
            <h1 className="text-3xl font-semibold mt-2">Team & Users</h1>
            <p className="text-gray-400 mt-2">
              Invite and manage your admin team.
            </p>
          </div>

          <a
            href="/admin"
            className="border border-gray-700 rounded-lg px-4 py-2 hover:border-amber-400"
          >
            Back to Dashboard
          </a>
        </div>

        {message && (
          <div className="bg-green-900/30 border border-green-700 text-green-300 rounded-lg p-3 mb-5">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-3 mb-5 break-words">
            {error}
          </div>
        )}

        <section className="bg-[#1b1b1b] border border-gray-800 rounded-xl p-5 md:p-6 mb-8">
          <h2 className="text-xl font-semibold mb-5">Invite New Member</h2>

          <form onSubmit={inviteMember} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Team member email"
              className="bg-[#111] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-[#111] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="producer">Producer</option>
            </select>

            <button
              type="submit"
              disabled={sending}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold rounded-lg px-5 py-3"
            >
              {sending ? 'Sending...' : 'Send Invitation'}
            </button>
          </form>
        </section>

        <section className="bg-[#1b1b1b] border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <button
              onClick={loadTeam}
              className="text-amber-400 text-sm hover:underline"
            >
              Refresh
            </button>
          </div>

          {team.length === 0 ? (
            <p className="text-gray-400 p-6">No team members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[950px]">
                <thead className="bg-[#151515] text-gray-400 text-sm">
                  <tr>
                    <th className="p-4">Team Member</th>
                    <th className="p-4">Contact & Details</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4">Last Sign In</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {team.map((member) => (
                    <tr key={member.user_id} className="border-t border-gray-800">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {member.profile_photo_url ? (
                            <img
                              src={member.profile_photo_url}
                              alt={member.full_name || 'Team member'}
                              className="w-12 h-12 rounded-full object-cover border border-gray-700"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#333] flex items-center justify-center text-amber-400 font-semibold">
                              {(member.full_name || member.email || '?').charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-medium">
                              {member.full_name || 'Profile not completed'}
                            </p>
                            <p className="text-gray-400 text-sm">{member.email}</p>
                            {member.designation && (
                              <p className="text-amber-400 text-xs mt-1">
                                {member.designation}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-sm text-gray-300">
                        <p>{member.phone || 'Phone not added'}</p>
                        <p className="text-gray-500 mt-1">
                          {[member.department, member.city].filter(Boolean).join(' • ') || 'Details not added'}
                        </p>
                      </td>

                      <td className="p-4">
                        {member.role === 'owner' ? (
                          <span className="text-amber-400 font-semibold">Owner</span>
                        ) : (
                          <select
                            value={member.role}
                            onChange={(e) => updateRole(member.user_id, e.target.value)}
                            className="bg-[#111] border border-gray-700 rounded px-3 py-2"
                          >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="producer">Producer</option>
                          </select>
                        )}
                      </td>

                      <td className="p-4">
                        {member.email_confirmed_at ? (
                          <span className="text-green-400">Verified</span>
                        ) : (
                          <span className="text-yellow-400">Invitation Pending</span>
                        )}

                        <p className="text-xs text-gray-500 mt-1">
                          {member.profile_completed ? 'Profile complete' : 'Profile incomplete'}
                        </p>
                      </td>

                      <td className="p-4 text-gray-400">
                        {member.last_sign_in_at
                          ? new Date(member.last_sign_in_at).toLocaleDateString()
                          : 'Not signed in'}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => openProfileEditor(member)}
                            className="text-amber-400 hover:text-amber-300 text-left"
                          >
                            Edit Profile
                          </button>

                          {member.role !== 'owner' && (
                            <button
                              onClick={() => removeMember(member)}
                              className="text-red-400 hover:text-red-300 text-left"
                            >
                              Revoke Access
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {editingMember && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#1b1b1b] border border-gray-700 rounded-xl p-6 w-full max-w-xl my-8">

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Edit Team Profile</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {editingMember.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={saveProfile} className="space-y-4">

                <div className="flex items-center gap-4">
                  {profile.profile_photo_url ? (
                    <img
                      src={profile.profile_photo_url}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover border border-gray-600"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#333] flex items-center justify-center text-amber-400 text-2xl">
                      {(profile.full_name || editingMember.email).charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Profile Photo
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploading}
                      onChange={(e) => uploadProfilePhoto(e.target.files?.[0])}
                      className="block w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-2 file:text-black"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or WEBP. Maximum 10 MB.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                  <input
                    required
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Designation</label>
                  <input
                    value={profile.designation}
                    onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
                    placeholder="e.g. Video Editor"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Department</label>
                  <input
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
                    placeholder="e.g. Production"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">City</label>
                  <input
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
                    placeholder="City"
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="border border-gray-600 rounded-lg px-5 py-3"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold rounded-lg px-5 py-3"
                  >
                    {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save Profile'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
