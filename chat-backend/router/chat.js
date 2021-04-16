const router = require('express').Router()
const { index, messages, create } = require('../controllers/chatController')
const { auth } = require('../middleware/auth')

router.get('/', [auth], index)
router.get('/messages', [auth], messages)
router.post('/create', [auth], create)

module.exports = router