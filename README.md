## CMG Audition

The library is publishable to an NPM registry if necessary and is in `libs/evaluate-sensor-log`

For this I went with a basic implementation given the time constraints. It uses async readable stream to read the file, and unblock the event loop. However if this were to grow as most log systems would, I would explore using Worker threads to conduct the parsing and evaluation steps. This would work by chunking out the payload and allocating chunks to workers, process in parallel and then reassembling the data on the main thread once all worker threads have resolved. It all depends on a number of factors including resource budgets such as memory, storage and the size of the payloads being processed and how often.

I added a Fastify web server so you can view the output in the browser since it's a GET request that utilizes the assigned `evaluateLogFile(logContentsStr)` function from the imported `@cmg/evaluate-sensor-log` library.

#### Run the following from project root

1. `cd cmg`
2. `npm i`
3. `npm run start:all`
4. Navigate browser or Postman to `http://localhost:2641/evaluate/sensors`
