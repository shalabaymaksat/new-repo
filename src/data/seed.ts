import type {
  Achievement,
  CareerRole,
  GameState,
  KnowledgeModule,
  Mission,
  Player,
} from '../types'

// ── Карьерная лестница (из карты экспертности, раздел 1) ──────────────────

export const ROLE_RANK: Record<CareerRole, number> = {
  junior: 0,
  content: 1,
  performance: 1,
  senior: 2,
  cmo: 3,
}

export interface LadderStep {
  role: CareerRole
  title: string
  does: string
  promotion: string
  failState: string
  branch?: boolean
}

export const LADDER: LadderStep[] = [
  {
    role: 'junior',
    title: 'Junior / стажёр',
    does: 'Кастдев, конкурентный анализ, клиентские пути, прогревы, тексты креативов',
    promotion: 'Берёт ответственность, есть структура, доводит дело',
    failState:
      'Кастдев «для галочки»; идей гора, делает мало и не в тему; срывает дедлайны',
  },
  {
    role: 'content',
    title: 'Контент-маркетолог',
    does: 'Тренды → виральность, переговоры с инфлюенсерами, storytelling, прогрев',
    promotion: 'Контент стабильно даёт лиды и продажи',
    failState: 'Виральность ради виральности без продаж; нет идей; срыв дедлайнов',
    branch: true,
  },
  {
    role: 'performance',
    title: 'Перформанс-маркетолог',
    does: 'Платный трафик, все метрики, поиск горлышка, офферы лендингов',
    promotion: 'Сам находит, где отваливаются лиды, и масштабирует связку',
    failState:
      'Не умеет считать; не видит горлышко; оптимизация на дешёвый, но мусорный лид',
    branch: true,
  },
  {
    role: 'senior',
    title: 'Senior / стратег',
    does: 'Планирует все воронки, продуктовую линейку, делегирует через ТЗ',
    promotion: 'Сам находит проблему и сам предлагает решение',
    failState:
      'Завален спонтанными задачами собственника; красивая стратегия без внедрения',
  },
  {
    role: 'cmo',
    title: 'CMO',
    does: 'Оптимизация всей системы + поиск новых путей роста прибыли собственника',
    promotion: 'Вершина карьеры',
    failState:
      'Чинил верх воронки, а деньги утекали в операционке — проглядел системную течь команды',
  },
]

// ── База знаний: 8 модулей + 2 бонуса (раздел 4 и 6) ───────────────────────

export const MODULES: KnowledgeModule[] = [
  {
    id: 1,
    title: 'Маркетингке кіріспе + Хант баспалдағы',
    summary:
      'Маркетинг как система; лестница осознанности (Хант/Schwartz); почему клиент ещё не покупает.',
    materials: ['Skill «marketing-psychology» (Cialdini, Bernays, Ogilvy, уровни осознанности)'],
    unlockRole: 'junior',
  },
  {
    id: 2,
    title: 'CustDev — исследование и инсайт',
    summary:
      'Найти реальную боль и «за что готов платить»; данные вместо догадок. Качественные + количественные кастдевы, JTBD-опросники по сегментам.',
    materials: [
      'Фрейм кастдева (Miro)',
      'Шаблон домашки — часть «кастдев»',
      'База болей ЕНТ — skill «ubt-pains»',
    ],
    unlockRole: 'junior',
  },
  {
    id: 3,
    title: 'Смыслы и УТП',
    summary:
      'Распаковка сырья → выгоды → УТП → обоснование смыслов. Формула: [Кому] + [измеримый результат] + [за счёт чего] + [почему верить].',
    materials: [
      'Шаблон распаковки/обоснования смыслов (пример GeoOnline: КИР 120+, 5–6 мес)',
      'Skill «offers-encyclopedia»',
      'Фильтр «pishi-sokrashchay» — инфостиль на всё, что пишется',
    ],
    unlockRole: 'junior',
  },
  {
    id: 4,
    title: 'Воронки и продуктовая линейка',
    summary:
      'Не одна продажа, а система: лид-магнит → трипваер → основной → апсейл. Правило масштабирования связки: ROAS > 500% и LTV/CAC ≥ 3.',
    materials: [
      'Skill «lead-magnets»',
      'Skill «pricing-strategy»',
      'Примеры связок: холодный трафик → Instagram → Telegram → YouTube',
    ],
    unlockRole: 'junior',
  },
  {
    id: 5,
    title: 'Контент-маркетинг и storytelling',
    summary:
      'Контент как система продаж (Привлечь → Прогреть → Продать). Storytelling Hook–Context–Conflict–Solution–CTA, доля продающего контента 25–35%.',
    materials: [
      'Skills «content-strategy», «fomo-hooks», «progrevy»',
      'Карусели: «fomo-carousel-ubt», «intensiv-ubt-course-carousel», «instagram-carousel-marathon»',
      'Пример: 10 FOMO-хуков «Математикадан 40+»',
    ],
    unlockRole: 'junior',
  },
  {
    id: 6,
    title: 'Запуск и вебинарная воронка',
    summary:
      'Вебинар как управляемая система: Прогрев → Вебинар → Продажа. Perfect Webinar (Brunson): Big Domino, 3 секрета, Stack. Отдельные ворота — доходимость до эфира.',
    materials: [
      'Skill «perfect-webinar-brunson» + готовый скрипт вебинара',
      'Skill «launch-strategy»',
      'Пример лендинга FM «Жазғы лагерь»',
    ],
    unlockRole: 'performance',
  },
  {
    id: 7,
    title: 'Маркетинг-инструменты (аналитика и оцифровка)',
    summary:
      'Измерять, автоматизировать, решать на данных: ROMI, CPL, CTR, CPM, CAC, LTV, ДРР; Livedune + Яндекс.Метрика; поиск, где «слив».',
    materials: [
      'РНП (FM, июнь)',
      'Движок диагностики горлышка (прототип)',
      'Аудит маркетинга — чеклист 8×(0–5)',
      'Skills «analytics-tracking», «paid-ads»',
    ],
    unlockRole: 'performance',
  },
  {
    id: 8,
    title: 'Команда и управление системой',
    summary:
      'Из хаоса в систему: роли, ТЗ, KPI, дедлайны. Notion (база знаний/контент-план) + Bitrix (задачи/контроль), стандарт «36 креативов на таргет».',
    materials: [
      'Лист «команда» (роли + проблемы)',
      'Файл-пятиминутка для отчётов руководству',
      'Шаблоны ТЗ',
      'Запуск-чеклист: сайт, креатив, воронка, таргет, аналитика, UTM, РНП',
    ],
    unlockRole: 'senior',
  },
  {
    id: 9,
    title: 'Бонус 1. Таргет-креатив',
    summary:
      'Новый дешёвый канал/угол — фирменный ход (домбыра: Instagram → +TikTok → +300% ROAS).',
    materials: [
      'Skills «tofu-creatives», «paid-ads»',
      'Шаблоны ТЗ на креативы',
      'Банк референсов',
    ],
    unlockRole: 'junior',
    bonus: true,
  },
  {
    id: 10,
    title: 'Бонус 2. Сайт / лендинг',
    summary:
      'Собрать лендинг по блокам; конверсия лендинга (бенчмарк ≥ 30%) проверяется движком.',
    materials: [
      'Skill «copywriting»',
      'Шаблон ТЗ лендинга (6 блоков)',
      'Пример FM-лендинга',
      '«frontend-slides»',
    ],
    unlockRole: 'junior',
    bonus: true,
  },
]

// ── Рубрика аудита: 8 разделов (раздел 5) ──────────────────────────────────

export const AUDIT_SECTIONS = [
  'Стратегия и позиционирование',
  'Воронка продаж',
  'Трафик и каналы',
  'Контент и упаковка',
  'Оффер и продукт',
  'Отдел продаж',
  'Аналитика',
  'Конкуренты',
] as const

// ── Ачивки ──────────────────────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-custdev',
    title: 'Первый кастдев',
    description: 'Провёл первое интервью и достал реальную боль клиента',
    earned: false,
  },
  {
    id: 'first-offer',
    title: 'Первый оффер',
    description: 'Собрал УТП по формуле — конкретика вместо «качества и сервиса»',
    earned: false,
  },
  {
    id: 'viral-hook',
    title: 'Виральный хук',
    description: 'Написал FOMO-хук, привязанный к боли из кастдева',
    earned: false,
  },
  {
    id: 'profitable-link',
    title: 'Связка в плюс',
    description: 'ROAS > 500% и LTV/CAC ≥ 3 — можно лить больше',
    earned: false,
  },
  {
    id: 'promo-performance',
    title: 'Повышение до Performance',
    description: 'Сам нашёл, где отваливаются лиды, и смасштабировал связку',
    earned: false,
  },
  {
    id: 'cmo',
    title: 'Дорос до CMO',
    description: 'Полная схема запуска, все воронки, отчётность и верные выводы в кризис',
    earned: false,
  },
]

// ── Стартовые миссии (дедлайны считаем от текущей даты) ─────────────────────

function daysFromNow(days: number): string {
  const d = new Date()
  d.setHours(18, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function seedMissions(): Mission[] {
  return [
    {
      id: 'm-custdev',
      title: 'Сделай кастдев ЦА',
      sphere: 'EdTech (ЕНТ)',
      moduleId: 2,
      deadline: daysFromNow(3),
      status: 'in_progress',
      xpReward: 120,
      brief:
        'Проведи 3 интервью с родителями 10–11 классов по фрейму кастдева. Достань: за что реально готовы платить, и топ-3 боли. Без кастдева закрыты смыслы и оффер.',
      statKey: 'Стратегия и позиционирование',
    },
    {
      id: 'm-utp',
      title: 'Собери УТП по формуле',
      sphere: 'EdTech (ЕНТ)',
      moduleId: 3,
      deadline: daysFromNow(6),
      status: 'upcoming',
      xpReward: 100,
      brief:
        'Формула: [Кому] + [измеримый результат] + [за счёт чего] + [почему верить]. AI-наставник проверит на конкретику — «качество» и «сервис» не пройдут.',
      statKey: 'Оффер и продукт',
    },
    {
      id: 'm-hooks',
      title: 'Напиши 10 FOMO-хуков',
      sphere: 'EdTech (ЕНТ)',
      moduleId: 5,
      deadline: daysFromNow(9),
      status: 'upcoming',
      xpReward: 90,
      brief:
        'По примеру «Математикадан 40+»: каждый хук привязан к боли из кастдева. Награда — за доведённое и релевантное, а не за объём идей.',
      statKey: 'Контент и упаковка',
    },
    {
      id: 'm-competitors',
      title: 'Конкурентный анализ',
      sphere: 'Товарка (корсеты)',
      moduleId: 1,
      deadline: daysFromNow(-2),
      status: 'overdue',
      xpReward: 80,
      brief:
        'Разбери 5 конкурентов: офферы, воронки (прямая продажа → WhatsApp), ценовые сегменты. Транзакционная физика: король метрик — ROAS (~1000%).',
      statKey: 'Конкуренты',
    },
    {
      id: 'm-onboarding',
      title: 'Определи уровень осознанности ЦА',
      sphere: 'Стоматология',
      moduleId: 1,
      deadline: daysFromNow(-5),
      status: 'done',
      xpReward: 60,
      brief:
        'Вводный квест: по лестнице Ханта определи, на какой ступени клиент стоматологии, и подбери тип сообщения под готовый спрос (SEO + контекст).',
      statKey: 'Трафик и каналы',
    },
    {
      id: 'm-bottleneck',
      title: 'Найди узкое горлышко в воронке',
      sphere: 'EdTech (ЕНТ)',
      moduleId: 7,
      deadline: daysFromNow(14),
      status: 'locked',
      xpReward: 200,
      brief:
        'Скоро: движок диагностики. Порядок: LTV/CAC ≥ 3 → эффективный CPL → причина (креатив CTR < 1% или оффер: конверсия лендинга < 30%).',
      statKey: 'Аналитика',
    },
  ]
}

// ── Игрок ───────────────────────────────────────────────────────────────────

export function seedPlayer(): Player {
  const stats: Record<string, number> = {}
  const base = [34, 22, 28, 31, 18, 12, 15, 26]
  AUDIT_SECTIONS.forEach((s, i) => (stats[s] = base[i]))
  return {
    name: 'Новичок',
    role: 'junior',
    level: 1,
    xp: 60,
    xpToNext: 300,
    stats,
    regalia: [],
  }
}

export function seedState(): GameState {
  const achievements = ACHIEVEMENTS.map((a) => ({ ...a }))
  return {
    player: seedPlayer(),
    missions: seedMissions(),
    achievements,
    chat: [
      {
        role: 'assistant',
        content:
          'Салем! Я твой наставник-CMO. Запомни главное: дешёвый верх воронки врёт — горлышко съезжает вниз, в дозвон, прогрев и отдел продаж. Кто научился это видеть — тот и стал стратегом.\n\nТвоя активная миссия — кастдев ЦА по ЕНТ. Без него закрыты смыслы и оффер. Вопросы по фрейму — задавай. Следующее действие: договорись о первом интервью сегодня.',
        ts: Date.now(),
      },
    ],
  }
}
