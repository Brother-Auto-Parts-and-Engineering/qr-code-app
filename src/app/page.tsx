'use client'
import { useState, useEffect, useCallback } from 'react'
import QRCard from '@/components/QRCard'
import { QRCodeRecord } from '@/lib/db'
import { CATEGORIES } from '@/lib/categories'

export default function GalleryPage() {
  const [items, setItems] = useState<QRCodeRecord[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'all') params.set('category', category)
    const res = await fetch(`/api/qrcodes?${params}`)
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }, [search, category])

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300)
    return () => clearTimeout(timer)
  }, [fetchItems])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            category === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
          }`}
        >
          ทั้งหมด
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat.value
                ? `${cat.bg} ${cat.color} ${cat.border}`
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p>ยังไม่มี QR Code</p>
          {search || category !== 'all' ? (
            <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
          ) : (
            <a href="/upload" className="text-indigo-500 text-sm mt-1 inline-block hover:underline">
              อัพโหลด QR Code แรกเลย →
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => (
            <QRCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
