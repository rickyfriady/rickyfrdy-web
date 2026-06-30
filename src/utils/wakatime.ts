import type { WakaTimeBestDay, WakaTimeEditor, WakaTimeLang, WakaTimeStats } from '@/models'

const WAKATIME_API_BASE = 'https://wakatime.com/api/v1'

interface WakaTimeApiResponse {
  data: {
    human_readable_total: string
    human_readable_daily_average: string
    total_seconds: number
    daily_average: number
    best_day: {
      date: string
      total_seconds: number
      text: string
    } | null
    languages: Array<{
      name: string
      total_seconds: number
      percent: number
      text: string
    }>
    editors: Array<{
      name: string
      total_seconds: number
      percent: number
      text: string
    }>
    start: string
    end: string
  }
}

export async function fetchBuildTimeWakaTime(
  apiKey: string | undefined
): Promise<WakaTimeStats | null> {
  if (!apiKey) return null

  try {
    const url = `${WAKATIME_API_BASE}/users/current/stats/last_7_days`
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`
      }
    })
    if (!res.ok) {
      return null
    }

    const json = (await res.json()) as WakaTimeApiResponse
    const d = json.data

    const languages: WakaTimeLang[] = d.languages.slice(0, 8).map((l) => ({
      name: l.name,
      totalSeconds: l.total_seconds,
      percent: l.percent,
      text: l.text
    }))

    const editors: WakaTimeEditor[] = d.editors.map((e) => ({
      name: e.name,
      totalSeconds: e.total_seconds,
      percent: e.percent,
      text: e.text
    }))

    const bestDay: WakaTimeBestDay | null = d.best_day
      ? {
          date: d.best_day.date,
          totalSeconds: d.best_day.total_seconds,
          text: d.best_day.text
        }
      : null

    return {
      humanReadableTotal: d.human_readable_total,
      humanReadableDailyAverage: d.human_readable_daily_average,
      totalSeconds: d.total_seconds,
      dailyAverageSeconds: d.daily_average,
      bestDay,
      languages,
      editors,
      startDate: d.start,
      endDate: d.end
    }
  } catch (_err) {
    return null
  }
}
