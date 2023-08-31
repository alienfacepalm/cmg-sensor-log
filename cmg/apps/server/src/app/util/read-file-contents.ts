import * as fs from 'fs'
import * as readline from 'readline'
import { Writable } from 'stream'

export function readFileContents(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const contents: string[] = []
    const input: fs.ReadStream = fs.createReadStream(filePath, 'utf-8')
    const reader: readline.Interface = readline.createInterface({ input })

    const writer = new Writable({
      write(chunk, _, callback) {
        contents.push(chunk.toString())
        callback()
      },
    })

    reader.on('line', (line) => {
      writer.write(`${line}\n`)
    })

    reader.on('close', () => {
      writer.end()
    })

    writer.on('finish', () => {
      const completeContents = contents.join('')
      if (completeContents.length > 0) {
        resolve(completeContents)
      } else {
        reject('File contents are empty')
      }
    })

    reader.on('error', (error) => {
      reject(error)
    })

    input.pipe(writer)
  })
}
