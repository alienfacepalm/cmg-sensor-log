import fs from 'fs';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import { evaluateSensorLog } from '@cmg/evaluate-sensor-log';

interface IRequestParams {
  Params: {
    logFileName: string;
  };
}

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return 'Hello CMG';
  });

  fastify.get(
    '/evaluate/:logFileName',
    async function (
      request: FastifyRequest<IRequestParams>,
      reply: FastifyReply
    ) {
      const logFileName: string = request.params.logFileName;
      let logFilePath = `${process.cwd()}/apps/server/src/data/${logFileName}`;
      if (!logFilePath.endsWith('.log')) logFilePath = `${logFilePath}.log`;
      console.log(logFilePath);
      try {
        await fs.accessSync(logFilePath);
        reply.send(evaluateSensorLog(logFilePath));
      } catch (error) {
        reply.status(404).send('File not found');
      }
    }
  );
}
