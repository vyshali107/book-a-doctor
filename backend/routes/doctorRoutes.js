const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
  getMyProfile,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getDoctors);
router.get('/me', protect, authorize('doctor'), getMyProfile);
router.get('/:id', getDoctorById);
router.post('/', protect, authorize('doctor'), createDoctorProfile);
router.put('/:id', protect, authorize('doctor'), updateDoctorProfile);

module.exports = router;
