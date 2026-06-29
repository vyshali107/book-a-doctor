const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Appointment = require('../models/Appointment');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/documents';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF, image, and document files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// @desc    Upload document to appointment
// @route   POST /api/documents/:appointmentId
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    appointment.documents.push({
      filename: req.file.originalname,
      path: req.file.path,
    });
    await appointment.save();

    res.json({ message: 'Document uploaded successfully', file: req.file });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get documents for appointment
// @route   GET /api/documents/:appointmentId
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment.documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { upload, uploadDocument, getDocuments };
