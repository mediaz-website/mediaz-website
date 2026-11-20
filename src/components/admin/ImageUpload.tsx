
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Upload, Image as ImageIcon, X } from 'lucide-react'

interface ImageUploadProps {
  label?: string
  value: string
  onChange: (url: string) => void
  folder?: string
}

export default function ImageUpload({
  label = 'Upload Image',
  value,
  onChange,
  folder = 'projects',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG and WEBP images are allowed.')
      event.target.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10 MB.')
      event.target.value = ''
      return
    }

    setUploading(true)

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media-library')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath)

      onChange(data.publicUrl)
    } catch (err) {
      console.error('Image upload error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Image upload failed. Please try again.'
      )
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white">
        {label}
      </label>

      {value ? (
        <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <img
            src={value}
            alt="Uploaded preview"
            className="h-48 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-3 rounded-full bg-black/80 p-2 text-white hover:bg-red-600"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex min-h-36 max-w-sm cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center transition hover:border-amber-400/60">
          {uploading ? (
            <Upload size={25} className="animate-pulse text-amber-400" />
          ) : (
            <ImageIcon size={25} className="text-white/50" />
          )}

          <span className="text-sm text-white/80">
            {uploading ? 'Uploading image...' : 'Click to upload image'}
          </span>

          <span className="text-xs text-white/40">
            JPG, PNG or WEBP · Maximum 10 MB
          </span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
