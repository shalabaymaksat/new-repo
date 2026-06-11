import 'dotenv/config'
import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const PORT = process.env.PORT || 3001
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8'

const client = new Anthropic() // ключ берётся из ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `Ты — наставник-CMO в карьерном симуляторе для маркетологов. Ведёшь игрока от джуна до CMO.
Говоришь по-русски (термины и примеры можно на казахском), прямо и по делу, без воды и лести.

Твоя методика (сквозной тезис): дешёвый верх воронки врёт — узкое горлышко съезжает вниз,
в дозвон, прогрев и отдел продаж. Учи игрока видеть это.

Порядок диагностики, которому учишь:
1) Зарабатывает ли воронка → LTV/CAC ≥ 3.
2) Не дорог ли клиент по факту → CPL и эффективный CPL (с учётом дозвона/доходимости/конверсии ОП).
3) Если дорого — причина: креатив (CTR < 1%) или оффер (конверсия лендинга < 30%).
4) Если экономика в норме — слабое звено это точка роста, а не блокер. Не мчись чинить CTR при дешёвом лиде.
Правило масштабирования связки: ROAS > 500% И LTV/CAC ≥ 3.

Знай две физики маркетинга: транзакционная (готовый спрос: стоматология SEO/контекст,
товарка и БАДы → WhatsApp, король метрик ROAS) и доверительная (IELTS/ЕНТ/саморазвитие:
полная воронка, прогрев, контент-двигатель, метрики CTR + конверсия лендинга + LTV/CAC).

Оцениваешь работу игрока по рубрике (0–5): Стратегия и позиционирование, Воронка продаж,
Трафик и каналы, Контент и упаковка, Оффер и продукт, Отдел продаж, Аналитика, Конкуренты.
Повышаешь только когда подтянуты обе оси: ремесло (кастдев → специализация → стратегия)
и ответственность («что я могу дать компании», а не «что мне дадут»; сам находит и решает проблемы).

Награждай доведённое и релевантное действие, а не объём идей. Если игрок сыплет идеями без
привязки к болям продукта и кастдеву — мягко возвращай к фундаменту (продукт → сегменты → боли → оффер).
Будь кратким. В конце ответа, когда уместно, давай одно конкретное следующее действие.`

const app = express()
app.use(express.json({ limit: '256kb' }))

app.post('/api/chat', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY не задан — добавь его в .env и перезапусти прокси' })
  }
  const { messages, playerContext } = req.body ?? {}

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages: обязательный непустой массив' })
  }
  const valid = messages.every(
    (m) =>
      m &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.length > 0,
  )
  if (!valid) {
    return res.status(400).json({ error: 'messages: каждый элемент — {role: user|assistant, content: string}' })
  }
  // история начинается с приветствия наставника — API требует первый ход от user
  const trimmed = [...messages]
  while (trimmed.length && trimmed[0].role !== 'user') trimmed.shift()
  if (!trimmed.length) {
    return res.status(400).json({ error: 'messages: нужен хотя бы один ход игрока' })
  }

  try {
    const system = [
      // стабильный промпт первым — кэшируется между запросами
      { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
    ]
    if (typeof playerContext === 'string' && playerContext.trim()) {
      system.push({
        type: 'text',
        text: `Текущее состояние игрока (отвечай предметно):\n${playerContext.slice(0, 2000)}`,
      })
    }

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: trimmed.map(({ role, content }) => ({ role, content })),
    })

    if (response.stop_reason === 'refusal') {
      return res.json({
        reply: 'Не могу ответить на это. Давай вернёмся к твоей миссии — что по кастдеву?',
      })
    }

    const reply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')

    res.json({ reply })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(500).json({ error: 'Неверный ANTHROPIC_API_KEY — проверь .env' })
    }
    if (err instanceof Anthropic.NotFoundError) {
      return res.status(500).json({ error: `Модель «${MODEL}» не найдена — проверь ANTHROPIC_MODEL в .env` })
    }
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: 'Лимит запросов к API — подожди минуту' })
    }
    if (err instanceof Anthropic.APIError) {
      return res.status(502).json({ error: `Ошибка Anthropic API (${err.status}): ${err.message}` })
    }
    console.error(err)
    res.status(500).json({ error: 'Внутренняя ошибка прокси' })
  }
})

app.listen(PORT, () => {
  console.log(`AI-прокси запущен: http://localhost:${PORT} (модель: ${MODEL})`)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠ ANTHROPIC_API_KEY не задан — чат с наставником работать не будет')
  }
})
