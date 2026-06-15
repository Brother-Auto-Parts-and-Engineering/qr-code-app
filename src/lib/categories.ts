export interface Category {
  value: string
  label: string
  color: string
  bg: string
  border: string
}

export const CATEGORIES: Category[] = [
  { value: 'promptpay', label: 'พร้อมเพย์/ชำระเงิน', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300' },
  { value: 'contact',   label: 'ข้อมูลติดต่อ',       color: 'text-blue-700',  bg: 'bg-blue-100',  border: 'border-blue-300' },
  { value: 'social',    label: 'โซเชียลมีเดีย',       color: 'text-purple-700',bg: 'bg-purple-100',border: 'border-purple-300' },
  { value: 'website',   label: 'เว็บไซต์/ลิงก์',      color: 'text-orange-700',bg: 'bg-orange-100',border: 'border-orange-300' },
  { value: 'other',     label: 'อื่นๆ',               color: 'text-gray-700',  bg: 'bg-gray-100',  border: 'border-gray-300' },
]

export function getCategoryByValue(value: string): Category {
  return CATEGORIES.find(c => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1]
}
