import type { OnboardingStep, Sphere } from '../types'

// Ассистент-чат арқылы onboarding сценарийі.
// {company}, {legend}, {product}, {audience}, {budget}, {name} — алмастырылады.
const SCRIPT: OnboardingStep[] = [
  {
    assistant: [
      'Сәлем, {name}! 👋 Мен Аружан — сенің маркетинг-наставнигің. {company} командасына қош келдің!',
      'Бүгіннен бастап сен біздің junior-маркетологсың. Алдымен жобамен танысып алайық.',
    ],
    choices: ['Сәлем! Дайынмын 🚀', 'Қуаныштымын, бастайық!'],
  },
  {
    assistant: [
      'Жоба туралы қысқаша: {legend}',
      'Біздің өнім: {product}.',
      'Мақсатты аудитория: {audience}.',
    ],
    choices: ['Түсінікті, әрі қарай', 'Аудитория туралы көбірек білдім 👍'],
  },
  {
    assistant: [
      'Бюджет туралы: {budget}. Әр теңгенің қайтарымын өлшейміз — сондықтан аналитика біз үшін қасиетті нәрсе 📊',
      'Сен performance marketing және content marketing бағыттарында задачалар орындайсың.',
    ],
    choices: ['Қандай задачалар болады?'],
  },
  {
    assistant: [
      'Performance — таргет, жарнама кабинеттері, CTR/CPC/ROMI метрикалары.',
      'Content — контент-план, посттар, Reels, копирайтинг.',
      'Әр задачада «Подсказка» бөлімі бар — қиналсаң аш, қалай орындау керегін көрсетеді 💡',
    ],
    choices: ['Керемет, ал білім қайдан аламын?'],
  },
  {
    assistant: [
      '«Курс» бөлімінде FMS бағдарламасы бойынша база знаний бар: негіздерден бастап аналитикаға дейін.',
      'Задачаларды Канбанда жылжытасың, дедлайндарды Календарьдан, ал жалпы көріністі Гант чарттан көресің.',
      'Прогресің Дэшбордта: XP, деңгей, скиллдер.',
    ],
    choices: ['Бәрі түсінікті!'],
  },
  {
    assistant: [
      'Тамаша! 🎉 Алғашқы задачаң дайын: «Жобамен танысу» — Канбандағы Backlog-та тұр.',
      'Іске сәт, {name}! Сұрақ болса — мен осындамын. Жұмысқа кірісейік! 💼',
    ],
    choices: ['Жұмысты бастаймын! 🔥'],
  },
]

export function getOnboardingScript(sphere: Sphere, userName: string): OnboardingStep[] {
  const fill = (t: string) =>
    t
      .replaceAll('{company}', sphere.company)
      .replaceAll('{legend}', sphere.legend)
      .replaceAll('{product}', sphere.product)
      .replaceAll('{audience}', sphere.audience)
      .replaceAll('{budget}', sphere.budget)
      .replaceAll('{name}', userName)
  return SCRIPT.map((s) => ({
    assistant: s.assistant.map(fill),
    choices: s.choices.map(fill),
  }))
}
