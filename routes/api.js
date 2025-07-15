const express = require('express');
const router = express.Router();

// Import controller
const AuthController = require('../app/Controllers/AuthController');
const UserController = require('../app/Controllers/UserController');
const AuditLogsController = require('../app/Controllers/AuditLogsController');
const authMiddleware = require('../app/Middleware/Auth');

// Public routes
router.post('/login', AuthController.login);


router.get('/get-users-list', UserController.getUsers);
router.get('/get-user/:id', authMiddleware, UserController.getUserById);
router.post('/add-user', authMiddleware, UserController.addUser);


router.get('/audit_logs', AuditLogsController.getAuditLogs);

module.exports = router;
