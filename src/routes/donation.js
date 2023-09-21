const express = require('express')
const router = express.Router()

const {createDonation, getDonationListByID,getLastDonationByID,updateDonation} = require("../controller//donationController")
const { validateAccessToken } = require('../middlewere/auth')


router.post("/create-donation",validateAccessToken, createDonation)
router.post("/update-donation",validateAccessToken, updateDonation)
router.get("/get-donationlist",validateAccessToken, getDonationListByID)
router.get("/get-donation",validateAccessToken, getLastDonationByID)

module.exports = router