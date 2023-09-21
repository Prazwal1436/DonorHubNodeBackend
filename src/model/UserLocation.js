const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData' },
  location:{type:String,coordinates:{type:[Number]} },
  donation_status:{type:Boolean},
},

{
  timestamps: true,
}
);

userLocationSchema.index( { location : "2dsphere" } )
const UserLocation = mongoose.model('UserLocation', userLocationSchema);

module.exports = UserLocation;
