// UserController.js
const db = require('../../config/db'); // adjust path as needed
const commonResponse = require('../../config/CommonResponse'); // adjust path as needed


class UserController {

    static getUsers(req, res) {
        try {
            const token = req.cookies.auth_token;
            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret);
            const loggedInName = decoded.name;

            const query = 'SELECT * FROM users WHERE name != ?';
            db.query(query, [loggedInName], (err, results) => {
                if (err) {
                    console.error('Error fetching users:', err);
                    return res.status(500).json({ message: 'Something went wrong' });
                }

               res.render('dashboard.ejs', { users: results, user: { name: loggedInName } });

            });
        } catch (error) {
            console.error('Token decode error:', error);
            return res.status(401).json({ message: 'Unauthorized access' });
        }
    }

    static getUserById(req, res) {
        const userId = req.params.id;
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching user:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            return commonResponse(200, true, 'Users fetched successfully', results, results.length, res);
        });
    }

    static addUser(req, res) {
        const { role, first_name, last_name, email, password, phone = null } = req.body;
        if (!role || !first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const username = `${first_name}${last_name}`;
        const query = 'INSERT INTO users (role,first_name,last_name,username,email,password, phone) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [role, first_name, last_name, username, email, password, phone], (err, results) => {
            if (err) {
                console.error('Error adding user:', err);
                return res.status(500).json({ message: 'Database error', error: err });
            }
            return commonResponse(201, true, 'User added successfully', { id: results.insertId }, null, res);
        });
    }

    static getTransactionById(req, res) {
        const userId = req.params.id;   
        const query = 'SELECT * FROM tranction_history WHERE user_id = ?';
        db.query(query, [userId], (err, results) => {
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
}


module.exports = UserController;