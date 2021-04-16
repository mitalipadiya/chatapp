const User = require('../models').User
const sequelize = require('sequelize')


exports.update = async (req, res) => {
    const { email } = req.body

    if (req.file) {
        req.body.avatar = req.file.filename
    }

    if (typeof req.body.avatar !== 'undefined' && req.body.avatar.length === 0) delete req.body.avatar

    try {

        const [rows, result] = await User.update(req.body,
            {
                where: {
                    id: req.user.id
                },
                returning: true
            }
        )

        if(result){
            const user = await User.findOne({
                where: {
                    email
                }
            })
            delete user.password

            return res.json(user)
        }else{
            return res.status(500).json({ error: 'Profile pic not updated' })
        }

    } catch (e) {
        return res.status(500).json({ error: e.message })
    }
}

exports.search = async (req, res) => {

    try {

        const users = await User.findAll({
            where: {
                username: {
                    [sequelize.Op.like]: `%${req.query.term}%`
                },
                id: {
                    [sequelize.Op.not] : `${req.user.id}`
                }
            },
            limit: 10
        })

        return res.json(users)

    } catch (e) {
        return res.status(500).json({ error: e.message })
    }
}