const express = require('express');
const router = express.Router();

// Import controller
const AuthController = require('../app/Controllers/AuthController');
const UserController = require('../app/Controllers/UserController');
const AuditLogsController = require('../app/Controllers/AuditLogsController');
const TransactionController = require('../app/Controllers/TransactionController');

// Login page (GET)
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login.ejs', { error: null });
});

// Login handler (POST)
router.post('/login', AuthController.login);

// Other routes
router.get('/get-users-list', UserController.getUsers);
router.get('/get-user/:id', UserController.getUserById);
router.post('/add-user', UserController.addUser);
router.get('/audit_logs', AuditLogsController.getAuditLogs);

// router.get('/transactions/add', (req, res) => {
//     res.render('add-transaction.ejs', { error: null });
// });

router.get('/transactions/add', TransactionController.getLoginUser);
router.post('/add-transaction', TransactionController.addTransaction);
router.get('/transaction-list/:id', TransactionController.getTransactionById);

module.exports = router;
