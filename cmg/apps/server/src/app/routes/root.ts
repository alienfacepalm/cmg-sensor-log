import * as fs from 'fs'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

import { evaluateSensorLog } from '@cmg/evaluate-sensor-log'

import { readFileContents } from '../util/read-file-contents'

interface IRequestParams {
  Params: {
    logFileName: string
    useWorkers?: boolean
  }
}

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return { message: 'Hello CMG' }
  })

  fastify.get(
    '/evaluate/:logFileName',
    async function (
      request: FastifyRequest<IRequestParams>,
      reply: FastifyReply,
    ) {
      const logFileName: string = request.params.logFileName

      let logFilePath = `${process.cwd()}/data/${logFileName}`
      if (!logFilePath.endsWith('.log')) logFilePath = `${logFilePath}.log`

      try {
        fs.accessSync(logFilePath)
        const logContentsStr = await readFileContents(logFilePath)
        reply.header('Content-Type', 'application/json')
        reply.send(await evaluateSensorLog(logContentsStr))
      } catch (error) {
        reply
          .status(404)
          .send({ error: { code: 404, message: 'log file not found' } })
      }
    },
  )
}
