const { body } = require('express-validator')

exports.rules = (() => {
    return [
        body('username').notEmpty(),
        body('email').isEmail(),
        body('password').optional().isLength({ min: 5 })
    ]
})()