import { supabase } from './supabase'

export interface QRCodeRecord {
  id: number
  name: string
  category: string
  filename: string
  createdAt: string
}

type Row = { id: number; name: string; category: string; filename: string; created_at: string }

function toRecord(row: Row): QRCodeRecord {
  return { id: row.id, name: row.name, category: row.category, filename: row.filename, createdAt: row.created_at }
}

export async function getAllQRCodes(search?: string, category?: string): Promise<QRCodeRecord[]> {
  let query = supabase.from('qrcodes').select('*').order('created_at', { ascending: false })
  if (search) query = query.ilike('name', `%${search}%`)
  if (category && category !== 'all') query = query.eq('category', category)
  const { data, error } = await query
  if (error) throw error
  return (data as Row[]).map(toRecord)
}

export async function addQRCode(name: string, category: string, filename: string): Promise<QRCodeRecord> {
  const { data, error } = await supabase
    .from('qrcodes')
    .insert({ name, category, filename })
    .select()
    .single()
  if (error) throw error
  return toRecord(data as Row)
}

export async function deleteQRCode(id: number): Promise<string | null> {
  const { data, error } = await supabase.from('qrcodes').delete().eq('id', id).select('filename').single()
  if (error) return null
  return (data as Row).filename
}
