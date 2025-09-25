const express = require('express');
const RetellWebhookController = require('../controllers/retellWebhookController');

const router = express.Router();

// Retell AI webhook endpoint
router.post('/', RetellWebhookController.handleWebhook);

module.exports = router;