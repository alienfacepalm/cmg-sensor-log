import * as fs from 'fs'
import * as readline from 'readline'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

import {
  evaluateSensorLog,
  evaluateSensorLogWithWorkers,
} from '@cmg/evaluate-sensor-log'

interface IRequestParams {
  Params: {
    logFileName: string
    useWorkers?: boolean
  }
}

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return 'Hello CMG'
  })

  // Workerized version that takes a logFilePath
  fastify.get(
    '/evaluate/:logFileName/:useWorkers?',
    async function (
      request: FastifyRequest<IRequestParams>,
      reply: FastifyReply,
    ) {
      const logFileName: string = request.params.logFileName
      const useWorkers: boolean = request.params.useWorkers

      let logFilePath = `${process.cwd()}/apps/server/src/data/${logFileName}`
      if (!logFilePath.endsWith('.log')) logFilePath = `${logFilePath}.log`

      if (useWorkers) {
        // workerized version that takes a path
        try {
          await fs.accessSync(logFilePath)
          reply.send(evaluateSensorLogWithWorkers(logFilePath))
        } catch (error) {
          reply.status(404).send('File not found')
        }
      } else {
        // Non workerized version reads text and passes to parser
        let log = ''
        const input: fs.ReadStream = fs.createReadStream(logFilePath, 'utf-8')
        try {
          await fs.accessSync(logFilePath)
          const reader: readline.Interface = readline.createInterface({ input })

          reader.on('line', (line) => {
            log += `${line}\n`
          })

          reader.on('close', async () => {
            console.log('--------------------------------------')

            reply.send(JSON.stringify(log, null, 2))
            // reply.send(await evaluateSensorLog(log))
          })
        } catch (error) {
          reply.status(404).send('File not found')
        }
      }
    },
  )
}
