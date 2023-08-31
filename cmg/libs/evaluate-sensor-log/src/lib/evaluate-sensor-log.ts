import { parentPort } from 'worker_threads'
import { createWorkers } from './create-workers'
import { processLog } from './process-log'

export function evaluateSensorLogWithWorkers(
  logFilePath: string,
): Promise<string> {
  return new Promise((resolve) => {
    createWorkers(logFilePath)
    parentPort?.on('message', (results) => resolve(results))
  })
}

export async function evaluateSensorLog(
  log: string,
): Promise<Record<string, string>> {
  return await processLog(log)
}
