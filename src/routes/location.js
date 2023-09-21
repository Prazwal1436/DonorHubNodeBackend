const express = require('express')
const router = express.Router()

const {createLocation,getUserLocationByID,updateLocation,updateDonationStatus} = require("../controller//userLocationController")
const { validateAccessToken } = require('../middlewere/auth')


router.post("/create-location",validateAccessToken, createLocation)
router.post("/update-location",validateAccessToken, updateLocation)
router.get("/get-location",validateAccessToken, getUserLocationByID)
router.post("/update-donation-status",validateAccessToken, updateDonationStatus)


module.exports = router