import { atom } from 'jotai'

export interface Card {
  _id: string
  modelId: string
  title: string
  content: string
  body?: string
  meta?: Record<string, any>
  createdAt: string
  updatedAt: string
  model?: {
    _id: string
    name: string
    fields: {
      _inherit_from: string
      fields: {
        name: string
        type: string
        required?: boolean
        default?: any
      }[]
    }[]
  }
  createdBy?: {
    username: string
  }
}

// 存储所有卡片的 atom
export const cardsAtom = atom<Card[]>([])

// 排序后的卡片 atom
export const sortedCardsAtom = atom((get) => {
  const cards = get(cardsAtom)
  return [...cards].sort((a, b) =>
    new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  )
})