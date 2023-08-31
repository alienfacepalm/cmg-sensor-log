import { processLog } from './process-log'

export async function evaluateSensorLog(
  log: string,
): Promise<Record<string, string>> {
  return await processLog(log)
}
