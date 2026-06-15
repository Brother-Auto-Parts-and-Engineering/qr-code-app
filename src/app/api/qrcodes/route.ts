import { NextRequest, NextResponse } from 'next/server'
import { getAllQRCodes } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') ?? undefined
  const category = searchParams.get('category') ?? undefined
  const data = await getAllQRCodes(search, category)
  return NextResponse.json(data)
}
