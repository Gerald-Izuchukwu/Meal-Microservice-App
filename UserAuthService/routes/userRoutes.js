const express = require('express')
const router = express.Router()
const {register, login, resetPassword, updatePassword, getUserByID} = require('../controllers/UserContrl')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/:id').get(getUserByID).put(updatePassword)
router.route('/resetpassword').post(resetPassword)

module.exports = router