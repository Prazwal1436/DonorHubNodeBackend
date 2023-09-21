const express = require('express')
const router = express.Router()

const {createNeedBlood, getNeedBloodByID,getNeedBloodByUserID,updateNeedBlood} = require("../controller/needBloodController")
const { validateAccessToken } = require('../middlewere/auth')


router.post("/create-needblood",validateAccessToken, createNeedBlood)
router.post("/update-needblood",validateAccessToken, updateNeedBlood)
router.get("/get-needblooduser",validateAccessToken, getNeedBloodByUserID)
router.get("/get-needblood:id",validateAccessToken, getNeedBloodByID)

module.exports = router