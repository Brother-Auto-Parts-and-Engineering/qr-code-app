import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { addQRCode } from '@/lib/db'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const name = (formData.get('name') as string | null)?.trim()
    const category = (formData.get('category') as string | null) ?? 'other'

    if (!file || !name) {
      return NextResponse.json({ error: 'กรุณาใส่ชื่อและเลือกไฟล์รูปภาพ' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น (jpg, png, gif, webp)' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'ไฟล์มีขนาดใหญ่เกิน 5MB' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('qr-images')
      .upload(filename, Buffer.from(bytes), { contentType: file.type })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'อัพโหลดไฟล์ไม่สำเร็จ' }, { status: 500 })
    }

    const record = await addQRCode(name, category, filename)
    return NextResponse.json(record)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, { status: 500 })
  }
}
