import * as fs from 'fs'
import * as readline from 'readline'
import * as os from 'os'
import { Worker, isMainThread, parentPort } from 'worker_threads'

import { processLog } from './process-log'
import { processLine } from './process-line'

/**
 * Create workers for very large log files
 * @param logFilePath
 */

export function createWorkers(logFilePath: string) {
  if (isMainThread) {
    const input: fs.ReadStream = fs.createReadStream(logFilePath, 'utf-8')
    const reader: readline.Interface = readline.createInterface({ input })

    const results: any[] = []

    const coreCount: number = os.cpus().length
    const workers: Worker[] = []

    for (let i = 0; i < coreCount; i++) {
      workers.push(new Worker(__filename))
    }

    let workerIndex = 0

    // post line to worker
    reader.on('line', (line) => {
      workers[workerIndex].postMessage(line)
      workerIndex = (workerIndex + 1) % coreCount
    })

    // close and obtain results from each worker
    reader.on('close', () => {
      for (const worker of workers) {
        worker.on('message', (result) => {
          results.push(result)
          if (results.length === coreCount) {
            const workerResults = processLog(results as any)
            parentPort.postMessage(workerResults)
            console.log(JSON.stringify(workerResults, null, 2))
          }
        })
      }
    })
  } else {
    parentPort.on('message', (line) => {
      const lineResult = processLine(line)
      parentPort.postMessage(lineResult)
    })
  }
}
