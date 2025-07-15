// UserController.js
const db = require('../../config/db'); // adjust path as needed
const commonResponse = require('../../config/CommonResponse'); // adjust path as needed


class UserController {
    
    static getUsers(req, res) {
        const query = 'SELECT * FROM cloud_hisaab';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
            return commonResponse(200, true, 'Users fetched successfully', results, results.length, res);
        });
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
    const { role, first_name, last_name, email, password, phone = null} = req.body;
    if (!role || !first_name || !last_name  || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const username = `${first_name}${last_name}`;
    const query = 'INSERT INTO users (role,first_name,last_name,username,email,password, phone) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [role, first_name, last_name, username, email, password, phone], (err, results) => {
        if (err) {
            console.error('Error adding user:', err);
            return res.status(500).json({ message: 'Database error',error: err });
        }
        return commonResponse(201, true, 'User added successfully', { id: results.insertId }, null, res);
    });
    }
}

  
module.exports = UserController;