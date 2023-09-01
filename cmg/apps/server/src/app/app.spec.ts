import Fastify, { FastifyInstance } from 'fastify'
import { app } from './app'

describe('GET /', () => {
  let server: FastifyInstance

  beforeEach(() => {
    server = Fastify()
    server.register(app)
  })

  it('should respond with a message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    })

    expect(response.json()).toEqual({ message: 'Hello CMG' })
  })
})

describe('GET /evaluate/sensors', () => {
  let server: FastifyInstance

  beforeEach(() => {
    server = Fastify()
    server.register(app)
  })

  it('should response with sample response', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/evaluate/sensors',
    })

    expect(response.json()).toEqual({
      'temp-1': 'precise',
      'temp-2': 'ultra precise',
      'hum-1': 'keep',
      'hum-2': 'discard',
      'mon-1': 'keep',
      'mon-2': 'discard',
    })
  })
})
