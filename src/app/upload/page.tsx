'use client'
import { useState, useRef, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/categories'

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('other')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith('image/')) {
      setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
      return
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('ไฟล์มีขนาดใหญ่เกิน 5MB')
      return
    }
    setError('')
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) { setError('กรุณาเลือกไฟล์รูปภาพ'); return }
    if (!name.trim()) { setError('กรุณาใส่ชื่อ'); return }

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name.trim())
    formData.append('category', category)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'เกิดข้อผิดพลาด')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/'), 1500)
  }

  const reset = () => {
    setName('')
    setCategory('other')
    setFile(null)
    setPreview(null)
    setError('')
    setSuccess(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-6xl mb-4">✅</p>
        <p className="text-xl font-semibold text-gray-700">อัพโหลดสำเร็จ!</p>
        <p className="text-gray-500 text-sm mt-1">กำลังพาไปหน้าแรก...</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">อัพโหลด QR Code</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-5">
        {/* File upload area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รูป QR Code <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors min-h-[180px]"
          >
            {preview ? (
              <div className="relative w-40 h-40">
                <Image src={preview} alt="Preview" fill className="object-contain rounded-lg" />
              </div>
            ) : (
              <>
                <p className="text-4xl mb-2">📷</p>
                <p className="text-sm text-gray-500">คลิกเพื่อเลือกรูป QR Code</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WEBP — สูงสุด 5MB</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview && (
            <button type="button" onClick={reset} className="mt-1 text-xs text-red-400 hover:text-red-600">
              ล้างรูป
            </button>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ชื่อเจ้าของ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="เช่น สมชาย ใจดี"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            maxLength={100}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors text-left ${
                  category === cat.value
                    ? `${cat.bg} ${cat.color} ${cat.border} font-medium`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-3 rounded-xl transition-colors"
        >
          {loading ? 'กำลังอัพโหลด...' : 'อัพโหลด QR Code'}
        </button>
      </form>
    </div>
  )
}
