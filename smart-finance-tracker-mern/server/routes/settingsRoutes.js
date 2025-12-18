const express = require('express');
const router = express.Router();

// Link to the controller implemented in server/controllers/settingsController.js
const settingsController = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.use(protect);

// Define routes for settings
router.get('/', settingsController.getSettings);       // GET    /api/settings
router.put('/', settingsController.updateSettings);    // PUT    /api/settings
router.post('/reset', settingsController.resetSettings); // POST   /api/settings/reset

module.exports = router;