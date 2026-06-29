export interface WakaTimeLang {
  name: string
  totalSeconds: number
  percent: number
  text: string
}

export interface WakaTimeEditor {
  name: string
  totalSeconds: number
  percent: number
  text: string
}

export interface WakaTimeBestDay {
  date: string
  totalSeconds: number
  text: string
}

export interface WakaTimeStats {
  humanReadableTotal: string
  humanReadableDailyAverage: string
  totalSeconds: number
  dailyAverageSeconds: number
  bestDay: WakaTimeBestDay | null
  languages: WakaTimeLang[]
  editors: WakaTimeEditor[]
  startDate: string
  endDate: string
}
