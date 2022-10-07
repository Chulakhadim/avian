import { login } from 'platform'

export default login(async ({ db, req, reply }) => {
  reply.send(req.session)
})
