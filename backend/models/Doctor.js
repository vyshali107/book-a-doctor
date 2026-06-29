const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please add a specialization'],
    },
    experience: {
      type: Number,
      required: [true, 'Please add years of experience'],
    },
    qualifications: [{ type: String }],
    consultationFee: {
      type: Number,
      required: [true, 'Please add consultation fee'],
    },
    availableSlots: [slotSchema],
    hospital: {
      type: String,
    },
    address: {
      city: String,
      state: String,
      country: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
