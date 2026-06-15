'use client'
import { useState } from 'react'
import Image from 'next/image'
import { QRCodeRecord } from '@/lib/db'
import { getCategoryByValue } from '@/lib/categories'
import { getImageUrl } from '@/lib/supabase'

interface Props {
  item: QRCodeRecord
  onDelete?: (id: number) => void
}

export default function QRCard({ item, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const cat = getCategoryByValue(item.category)
  const date = new Date(item.createdAt).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  const imageUrl = getImageUrl(item.filename)

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = `${item.name}-qr.${item.filename.split('.').pop()}`
    a.click()
  }

  return (
    <>
      {/* Card */}
      <div
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="relative bg-gray-50" style={{ height: 300 }}>
          <Image
            src={imageUrl}
            alt={`QR Code ของ ${item.name}`}
            fill
            className="object-contain p-1"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        <div className="px-3 py-2.5 border-t border-gray-100">
          <p className="font-semibold text-gray-800 text-sm truncate text-center" title={item.name}>
            {item.name}
          </p>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative bg-gray-50" style={{ height: 440 }}>
              <Image
                src={imageUrl}
                alt={`QR Code ของ ${item.name}`}
                fill
                className="object-contain p-1"
                sizes="400px"
              />
            </div>

            <div className="p-4 flex flex-col gap-3">
              <p className="font-bold text-gray-800 text-xl text-center">{item.name}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cat.color} ${cat.bg} ${cat.border}`}>
                  {cat.label}
                </span>
                <span>{date}</span>
              </div>

              <div className={`flex border-t border-gray-100 pt-3 ${onDelete ? 'gap-2' : ''}`}>
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                >
                  ⬇ ดาวน์โหลด
                </button>
                {onDelete && (
                  <button
                    onClick={() => { onDelete(item.id); setOpen(false) }}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium py-2.5 rounded-xl transition-colors"
                  >
                    🗑 ลบ
                  </button>
                )}
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-sm text-gray-400 hover:text-gray-600 text-center transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
