import * as fs from 'fs'
import * as readline from 'readline'

export function readFileContents(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let contents = ''
    const input: fs.ReadStream = fs.createReadStream(filePath, 'utf-8')
    const reader: readline.Interface = readline.createInterface({ input })

    reader.on('line', (line) => {
      contents += `${line}\n`
    })

    reader.on('close', async () => {
      if (contents.length > 0) {
        resolve(contents)
      } else {
        reject('File contents are empty')
      }
    })
  })
}
