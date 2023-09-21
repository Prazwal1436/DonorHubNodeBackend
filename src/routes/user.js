const express = require('express')
const router = express.Router()

const { signup, login, getUser,changePassword, updateUser } = require("../controller/userController")
const { validateAccessToken } = require('../middlewere/auth')

router.post("/signup", signup)
router.post("/login", login)
router.post("/password",validateAccessToken, changePassword)
router.post("/update-user",validateAccessToken, updateUser)
router.get("/get-user",validateAccessToken, getUser)

module.exports = router