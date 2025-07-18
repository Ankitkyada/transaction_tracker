const jwt = require('jsonwebtoken');
const db = require('../../config/db'); // adjust path as needed
const commonResponse = require('../../config/CommonResponse'); // adjust path as needed


class TransactionController {

    static addTransaction(req, res) {
        const { paid_user_id, participant_user_id, amount,transaction_date, description } = req.body;

        if (!paid_user_id || !participant_user_id || !amount || !transaction_date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (paid_user_id === participant_user_id) {
            return res.status(400).json({ message: 'Paid user and participant user cannot be the same' });
        }

        const paidUserNameQuery = 'SELECT name FROM users WHERE id = ?';

        db.query(paidUserNameQuery, [paid_user_id], (err, paidResults) => {
            if (err) {
                console.error('Error fetching paid user:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (paidResults.length === 0) {
                return res.status(404).json({ message: 'Paid user not found' });
            }

            const paid_user_name = paidResults[0].name;

            const participantNameQuery = 'SELECT name FROM users WHERE id = ?';
            db.query(participantNameQuery, [participant_user_id], (err, participantResults) => {
                if (err) {
                    console.error('Error fetching participant user:', err);
                    return res.status(500).json({ message: 'Database error' });
                }
                if (participantResults.length === 0) {
                    return res.status(404).json({ message: 'Participant user not found' });
                }
                const participant_name = participantResults[0].name;

                const insertQuery = `INSERT INTO transaction_history 
                (paid_user_id, paid_user_name, participants, participant_user_id, amount, transaction_date, description)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

                db.query(insertQuery, [
                    paid_user_id,
                    paid_user_name,
                    participant_name,
                    participant_user_id,
                    amount,
                    transaction_date,
                    description || ''
                ], (err, result) => {
                    if (err) {
                        console.error('Error inserting transaction:', err);
                        return res.status(500).json({ message: 'Somthing went wrong' });
                    }

                    res.status(201).json({
                        message: 'Transaction added successfully',
                        transactionId: result.insertId
                    });
                });
            });
        });
    }

    static getTransactionById(req, res) {
        const userId = req.params.id;
        res.cookie('participant_user_id', userId, { httpOnly: true });

        const query = 'SELECT * FROM transaction_history WHERE paid_user_id = ? OR participant_user_id = ?';
        db.query(query, [userId, userId], (err, results) => {
            if (err) {
                console.error('Error fetching transactions:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'No transactions found for this user' });
            }
            res.render('transaction-list.ejs', { transactions: results, userId: userId });
        });
    }

    static getLoginUser(req, res) {
        const user_id = req.cookies.user_id;
        const participant_user_id = req.cookies.participant_user_id;

        if (!user_id || !participant_user_id) {
            return res.status(400).json({
                message: 'User ID or Participant User ID is missing'
            });
        }

        // Fetch all users for dropdowns
        const query = 'SELECT id, name FROM users where id = ? OR id = ?';

        db.query(query, [user_id, participant_user_id], (err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
            res.render('add-transaction.ejs', {
                users: results, user_id,
                participant_user_id, error: null
            });
        });
    }
}


module.exports = TransactionController;