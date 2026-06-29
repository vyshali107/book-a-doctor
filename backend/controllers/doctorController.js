const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all approved doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { specialization, city, search } = req.query;
    let query = { isApproved: true };

    if (specialization) query.specialization = new RegExp(specialization, 'i');
    if (city) query['address.city'] = new RegExp(city, 'i');

    let doctors = await Doctor.find(query).populate('user', 'name email profileImage phone');

    if (search) {
      doctors = doctors.filter(
        (d) =>
          d.user.name.toLowerCase().includes(search.toLowerCase()) ||
          d.specialization.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email profileImage phone');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private (doctor)
const createDoctorProfile = async (req, res) => {
  try {
    const exists = await Doctor.findOne({ user: req.user._id });
    if (exists) return res.status(400).json({ message: 'Doctor profile already exists' });

    const doctor = await Doctor.create({ ...req.body, user: req.user._id });
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private (doctor)
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor's own profile
// @route   GET /api/doctors/me
// @access  Private (doctor)
const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email phone');
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, createDoctorProfile, updateDoctorProfile, getMyProfile };
