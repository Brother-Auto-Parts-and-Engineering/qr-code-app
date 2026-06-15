import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { deleteQRCode } from '@/lib/db'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = parseInt(id, 10)
  if (isNaN(numId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const filename = await deleteQRCode(numId)
  if (!filename) {
    return NextResponse.json({ error: 'ไม่พบข้อมูล' }, { status: 404 })
  }

  await supabase.storage.from('qr-images').remove([filename])

  return NextResponse.json({ success: true })
}
