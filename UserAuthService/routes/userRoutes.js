const express = require('express')
const router = express.Router()
const {register, login, getUserByID} = require('../controllers/UserContrl')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/:id').get(getUserByID)

module.exports = router