const express = require('express');
const router = express.Router();
const { upload, uploadDocument, getDocuments } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:appointmentId', protect, upload.single('document'), uploadDocument);
router.get('/:appointmentId', protect, getDocuments);

module.exports = router;
