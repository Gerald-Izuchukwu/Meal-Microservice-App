const express = require('express')
const router = express.Router()
const {register, saveUser, callSaveUser, login, resetPassword, updatePassword, getUserByID, signOut} = require('../controllers/UserContrl')

router.route('/register').post(register)
router.route('/saveuser').post(saveUser).get(callSaveUser)
router.route('/login').post(login)
router.route('/:id').get(getUserByID).put(updatePassword)
router.route('/resetpassword').post(resetPassword)
router.route('/logout').delete(signOut)

module.exports = router