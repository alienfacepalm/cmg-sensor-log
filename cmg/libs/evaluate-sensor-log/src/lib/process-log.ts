import { evaluateSensor } from './evaluate-sensor'
import { IEvaluationResult, IReference, ISensor } from './types'
import sensorProducts from './sensors-products'

interface IParsedLog {
  reference: IReference
  sensors: ISensor[]
}

async function parseLog(log: string): Promise<IParsedLog> {
  const lines = log.split('\n').filter((line) => line.trim() !== '')

  const sensors: ISensor[] = []
  let reference: IReference
  let sensor: ISensor

  for (const line of lines) {
    const cols = line.split(' ')

    if (cols[0] === 'reference') {
      reference = {
        temperature: Number(cols[1]),
        humidity: Number(cols[2]),
        carbonMonoxide: Number(cols[3]),
      }
    } else if (sensorProducts.includes(cols[0])) {
      sensor = { variant: cols[0], name: cols[1], data: [] }
      sensors.push(sensor)
    } else if (sensor) {
      sensor.data.push({ time: cols[0], value: Number(cols[1]) })
    }
  }

  return { sensors, reference }
}

export async function processLog(log: string): Promise<Record<string, string>> {
  const results: IEvaluationResult[] = []
  const output: { [name: string]: string } = {}

  const { sensors, reference } = await parseLog(log)

  for (const sensor of sensors) {
    results.push(evaluateSensor({ sensor, reference }))
  }

  for (const r of results) {
    output[r.name] = r.evaluation
  }

  return output
}
