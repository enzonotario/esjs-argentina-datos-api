import { handle } from 'hono/vercel'
import { app } from '../dist/app.esjs'

export const config = {
  runtime: 'edge',
}

export default handle(app)
