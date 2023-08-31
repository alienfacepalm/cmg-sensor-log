import { IEvaluationResult, IReference, ISensor } from './types'

interface IParsedLog {
  reference: IReference
  sensors: ISensor[]
}

function parseLog(log: string): IParsedLog {
  const lines = log.split('\n').filter((line) => line.trim() !== '')

  const sensors: ISensor[] = []
  let reference: IReference
  let sensor: ISensor

  for (const line of lines) {
    const cols = line.split(' ')

    if (cols[0] === 'reference') {
      // get the reference data from line 1
      reference = {
        temperature: Number(cols[1]),
        humidity: Number(cols[2]),
        carbonMonoxide: Number(cols[3]),
      }
    } else if (['thermometer', 'humidity', 'monoxide'].includes(cols[0])) {
      // get the sensor data  for the rest
      sensor = { variant: cols[0], name: cols[1], data: [] }
      sensors.push(sensor)
    } else if (sensor) {
      sensor.data.push({ time: cols[0], value: Number(cols[1]) })
    }
  }

  return { sensors, reference }
}

export function processLog(log: string): any {
  // const results: IEvaluationResult[] = []

  const parsedLog: any = parseLog(log)

  return parsedLog
}
