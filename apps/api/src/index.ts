import { Elysia } from 'elysia'

const app = new Elysia()

app.get('/hi', () => 'Hello Flock 🐑')

app.listen('3000', ({ port }) => {
  console.log(`🐑 Flock api — counting sheep on port: http://localhost:${port}`)
})
