'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { QRCodeRecord } from '@/lib/db'
import { getCategoryByValue, CATEGORIES } from '@/lib/categories'
import { getImageUrl } from '@/lib/supabase'

export default function AdminPage() {
  const [items, setItems] = useState<QRCodeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'all') params.set('category', category)
    const res = await fetch(`/api/qrcodes?${params}`)
    setItems(await res.json())
    setLoading(false)
  }, [search, category])

  useEffect(() => {
    const t = setTimeout(fetchItems, 300)
    return () => clearTimeout(t)
  }, [fetchItems])

  const handleDelete = async (id: number) => {
    if (!confirm('ต้องการลบ QR Code นี้ใช่ไหม?')) return
    setDeletingId(id)
    await fetch(`/api/qrcodes/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== id))
    setDeletingId(null)
  }

  // Stats from all items (not filtered)
  const [allItems, setAllItems] = useState<QRCodeRecord[]>([])
  useEffect(() => {
    fetch('/api/qrcodes').then(r => r.json()).then(setAllItems)
  }, [items])

  const statByCategory = CATEGORIES.map(cat => ({
    ...cat,
    count: allItems.filter(i => i.category === cat.value).length,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin — จัดการ QR Code</h1>
        <span className="text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
          ทั้งหมด {allItems.length} รายการ
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statByCategory.map(cat => (
          <div key={cat.value} className={`rounded-xl border p-3 text-center ${cat.bg} ${cat.border}`}>
            <p className={`text-2xl font-bold ${cat.color}`}>{cat.count}</p>
            <p className={`text-xs mt-0.5 ${cat.color}`}>{cat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">ทุกหมวดหมู่</option>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">ไม่พบข้อมูล</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">QR Code</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">ชื่อ</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">หมวดหมู่</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">วันที่อัพโหลด</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => {
                const cat = getCategoryByValue(item.category)
                const date = new Date(item.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={getImageUrl(item.filename)}
                          alt={item.name}
                          fill
                          className="object-contain p-0.5"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${cat.color} ${cat.bg} ${cat.border}`}>
                        {cat.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{date}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        {deletingId === item.id ? '...' : 'ลบ'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
