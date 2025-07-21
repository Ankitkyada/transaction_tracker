const jwt = require('jsonwebtoken');
const db = require('../../config/db'); // adjust path as needed
const commonResponse = require('../../config/CommonResponse'); // adjust path as needed


class TransactionController {

    static addTransaction(req, res) {
        const { paid_user_id, participant_user_id, amount, transaction_date, category, description } = req.body;

        if (!paid_user_id || !participant_user_id || !amount || !transaction_date || !category) {
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
                    return res.status(500).json({ message: err.message });
                }
                if (participantResults.length === 0) {
                    return res.status(404).json({ message: 'Participant user not found' });
                }
                const participant_name = participantResults[0].name;

                const insertQuery = `INSERT INTO transaction_history 
                (paid_user_id, paid_user_name, participants, participant_user_id, amount, transaction_date, description , category,created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?,?, ?)`;

                db.query(insertQuery, [
                    paid_user_id,
                    paid_user_name,
                    participant_name,
                    participant_user_id,
                    amount,
                    transaction_date,
                    description || '',
                    category,
                    req.cookies.user_id
                ], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }
                    if (req.cookies.user_id !== paid_user_id) {
                        return res.redirect(`/transaction-list/${paid_user_id}`);
                    } else {
                        return res.redirect(`/transaction-list/${participant_user_id}`);
                    }
                });
            });
        });
    }

    // static getTransactionList(req, res) {
    //     const userId = req.params.id;
    //     const loggedInUserId = req.cookies.user_id;
    //     res.cookie('participant_user_id', userId, { httpOnly: true })

    //     const query = `SELECT 
    //                     th.*,
    //                     u.name AS created_by_name 
    //                 FROM transaction_history th
    //                 LEFT JOIN users u ON th.created_by = u.id
    //                 WHERE th.paid_user_id = ? OR th.participant_user_id = ?
    //                 ORDER BY th.created_at DESC
    //                 `;
    //     db.query(query, [userId, userId], (err, results) => {
    //         if (err) {
    //             return res.status(500).json({ message: err });
    //         }
    //         if (results.length === 0) {
    //             res.render('transaction-list.ejs', { transactions: [], userId: userId });
    //         }
    //         res.render('transaction-list.ejs', { transactions: results ?? [], userId: userId, authUserId: loggedInUserId });
    //     });
    // }

    static getTransactionList(req, res) {
        const participant_user_id = req.params.id;

        const loggedInUserId = req.cookies.user_id;

        res.cookie('participant_user_id', participant_user_id, { httpOnly: true });


        const query = `
                    SELECT 
                        th.*,
                        u.name AS created_by_name 
                    FROM transaction_history th
                    LEFT JOIN users u ON th.created_by = u.id
                    WHERE 
                        (th.paid_user_id = ? AND th.participant_user_id = ?)
                        OR
                        (th.paid_user_id = ? AND th.participant_user_id = ?)
                    ORDER BY th.created_at DESC`;

        db.query(query, [participant_user_id, loggedInUserId, loggedInUserId, participant_user_id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err });
            }

            let paidTotal = 0;
            let participatedTotal = 0;
            let paidUserName = "";
            let participantUserName = "";

            // Calculate totals
            results.forEach(row => {

                if (row.paid_user_id == loggedInUserId) {
                    paidTotal += parseFloat(row.amount);
                } else {
                    participatedTotal += parseFloat(row.amount);
                }


                if (row.paid_user_id == loggedInUserId) {
                    paidUserName = row.paid_user_name;
                    participantUserName = row.participants;
                } else {
                    paidUserName = row.participants;
                    participantUserName = row.paid_user_name;
                }
            });

            const balance = paidTotal - participatedTotal;



            res.render('transaction-list.ejs', {
                transactions: results ?? [],
                userId: participant_user_id,
                authUserId: loggedInUserId,
                paidTotal: paidTotal,
                participatedTotal: participatedTotal,
                balance: balance,
                paidUserName: paidUserName,
                participantUserName: participantUserName,
                error: null
            });
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
                return res.status(500).json({ message: err.message });
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

    static getById(req, res) {
        const transactionId = req.params.id;

        const transactionQuery = 'SELECT * FROM transaction_history WHERE id = ?';
        const usersQuery = 'SELECT id, name FROM users';

        db.query(transactionQuery, [transactionId], (err, transactionResults) => {
            if (err) {
                console.error('Error fetching transaction:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (transactionResults.length === 0) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            const transaction = transactionResults[0];

            db.query(usersQuery, (userErr, userResults) => {
                if (userErr) {
                    console.error('Error fetching users:', userErr);
                    return res.status(500).json({ message: 'User query failed' });
                }

                res.render('edit-transaction.ejs', {
                    transaction,
                    users: userResults,
                    error: null,
                    success: null
                });
            });
        });
    }

    static updateTransaction(req, res) {
        const transactionId = req.params.id;
        const { paid_user_id, participant_user_id, amount, transaction_date, description, category } = req.body;

        if (!paid_user_id || !participant_user_id || !amount || !transaction_date || !category) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updateQuery = `UPDATE transaction_history 
            SET paid_user_id = ?, participant_user_id = ?, amount = ?, transaction_date = ?, description = ? , category = ? , created_by = ?
            WHERE id = ?`;

        db.query(updateQuery, [
            paid_user_id,
            participant_user_id,
            amount,
            transaction_date,
            description || '',
            category,
            req.cookies.user_id,
            transactionId
        ], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            if (req.cookies.user_id !== paid_user_id) {
                return res.redirect(`/transaction-list/${paid_user_id}`);
            } else {
                return res.redirect(`/transaction-list/${participant_user_id}`);
            }

        });
    }

    static deleteTransaction(req, res) {
        const transactionId = req.params.id;

        const deleteQuery = 'DELETE FROM transaction_history WHERE id = ?';

        db.query(deleteQuery, [transactionId], (err, result) => {
            if (err) {
                res.render('transaction-list.ejs', { error: 'Error deleting transaction' });
            }
            if (result.affectedRows === 0) {
                res.render('transaction-list.ejs', { error: 'Transaction not found' });
            }
            res.render('transaction-list.ejs', { message: 'Transaction deleted successfully' });
        });
    }
}


module.exports = TransactionController;