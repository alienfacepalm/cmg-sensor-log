export interface ISensor {
  name: string
  variant: string
  data: {
    time: string
    value: number
  }[]
}

export interface IReference {
  temperature: number
  humidity: number
  carbonMonoxide: number
}

export interface IEvaluationResult {
  sensorName: string
  evaluation: string
}
