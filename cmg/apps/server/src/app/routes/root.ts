import * as fs from 'fs'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

import {
  evaluateSensorLog,
  evaluateSensorLogWithWorkers,
} from '@cmg/evaluate-sensor-log'

import { readFileContents } from '../util/read-file-contents'

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
          reply.send(evaluateSensorLogWithWorkers(logFilePath))
        } catch (error) {
          reply.status(404).send('File not found')
        }
      } else {
        // Non workerized version reads text and passes log contents to parser
        try {
          await fs.accessSync(logFilePath)
          const logContentsStr = await readFileContents(logFilePath)
          reply.send(await evaluateSensorLog(logContentsStr))
        } catch (error) {
          reply.status(404).send('File not found')
        }
      }
    },
  )
}
