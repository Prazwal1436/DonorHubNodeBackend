const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData' },
  bloodGroup: { type: String, required: false },
  reason: { type: String, required: false },
  date: { type: Date, required: false },
  urgent: { type: Boolean, required: false },
  location:{ 
    type: {
    type: String,
    enum: ['Point'], // Only allow "Point" type
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }},
  status: { type: String, enum: ["ongoing", "found", "notneeded","notfound"] },
  radius:{type:Number}
},
{
  timestamps: true,
}
);

userLocationSchema.index( { location : "2dsphere" } )

const NeedBlood = mongoose.model('NeedBlood', userLocationSchema);

module.exports = NeedBlood;
