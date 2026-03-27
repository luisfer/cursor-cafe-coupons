import type { CouponConfig } from './types'

const todayFormatted = () =>
  new Date()
    .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '.')

export const PRESET_CLASSIC: CouponConfig = {
  venue: {
    name: 'Venue Name',
    logo: '',
    logoHeight: 42,
    wifi: '',
  },
  event: {
    date: todayFormatted(),
  },
  menu: [
    { name: 'Espresso', temps: ['hot'] },
    { name: 'Americano', temps: ['hot', 'iced'] },
    { name: 'Latte', temps: ['hot', 'iced'] },
    { name: 'Cappuccino', temps: ['hot', 'iced'] },
    { name: 'Cold Brew', temps: ['iced'] },
  ],
  options: {
    beanChoices: [],
    milkChoices: ['Regular milk', 'Oat milk'],
    footerNote: 'Valid for 1 complimentary drink',
    motto: 'Happy building!',
    showCouponNumber: true,
  },
  print: {
    couponsPerPage: 'auto',
    orientation: 'landscape',
  },
  theme: {
    headerBg: '#14120b',
    headerText: '#edecec',
  },
}

export const PRESET_MINIMAL: CouponConfig = {
  venue: {
    name: 'Venue Name',
    logo: '',
    logoHeight: 42,
    wifi: '',
  },
  event: {
    date: todayFormatted(),
  },
  menu: [
    { name: 'Espresso', temps: ['hot'] },
    { name: 'Americano', temps: ['hot', 'iced'] },
    { name: 'Latte', temps: ['hot', 'iced'] },
  ],
  options: {
    beanChoices: [],
    milkChoices: [],
    footerNote: 'Valid for 1 complimentary drink',
    motto: '',
    showCouponNumber: false,
  },
  print: {
    couponsPerPage: 'auto',
    orientation: 'landscape',
  },
  theme: {
    headerBg: '#14120b',
    headerText: '#edecec',
  },
}

export const PRESET_FULL: CouponConfig = {
  venue: {
    name: 'Venue Name',
    logo: '',
    logoHeight: 42,
    wifi: 'Free Venue Wifi',
  },
  event: {
    date: todayFormatted(),
  },
  menu: [
    { name: 'Coffee', kind: 'section', temps: [] },
    { name: 'Espresso', temps: ['hot'] },
    { name: 'Americano', temps: ['hot', 'iced'] },
    { name: 'Latte', temps: ['hot', 'iced'] },
    { name: 'Cappuccino', temps: ['hot', 'iced'] },
    { name: 'Mocha', temps: ['hot', 'iced'] },
    { name: 'Cold Brew', temps: ['iced'] },
    { name: 'Non-Coffee', kind: 'section', temps: [] },
    { name: 'Chocolate', temps: ['hot', 'iced'] },
    { name: 'Iced Tea', temps: ['iced'] },
  ],
  options: {
    beanChoices: ['House Blend', 'Decaf'],
    milkChoices: ['Regular', 'Oat'],
    footerNote: '1st drink complimentary. Additional drinks at a discount.',
    motto: 'Happy building!',
    menuTitle: 'Cursor Menu',
    showCouponNumber: true,
  },
  print: {
    couponsPerPage: 'auto',
    orientation: 'landscape',
  },
  theme: {
    headerBg: '#14120b',
    headerText: '#edecec',
  },
}

export const PRESETS = {
  classic: { label: 'Classic', config: PRESET_CLASSIC },
  minimal: { label: 'Minimal', config: PRESET_MINIMAL },
  full: { label: 'Full Menu', config: PRESET_FULL },
} as const

export type PresetKey = keyof typeof PRESETS
