const mongoose = require('mongoose');

const lastDonationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData' },
  donationDate: {type:Date, required: true },
}, {
  timestamps: true,
}
);

const LastDonation = mongoose.model('LastDonation', lastDonationSchema);

module.exports = LastDonation;
