const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllDoctors,
  approveDoctorProfile,
  deleteUser,
  getStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', approveDoctorProfile);

module.exports = router;
