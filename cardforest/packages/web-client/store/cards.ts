import { atom } from 'jotai'

export interface Card {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

// 存储所有卡片的 atom
export const cardsAtom = atom<Card[]>([])

// 排序后的卡片 atom
export const sortedCardsAtom = atom((get) => {
  const cards = get(cardsAtom)
  return [...cards].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
})