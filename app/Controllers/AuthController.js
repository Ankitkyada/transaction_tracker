const jwt = require('jsonwebtoken');
const commonResponse = require('../../config/CommonResponse');
const db = require('../../config/db'); // adjust path as needed

class AuthController {
    static async login(req, res) {
        try {
            const { name, pin } = req.body;
            if (!name || !pin) {
                return res.status(400).json({ message: 'name and pin are required' });
            }

            const verify = "SELECT * FROM users WHERE name = ? AND pin = ?";
            db.query(verify, [name, pin], (err, result) => {
                if (err) {
                    console.error('DB Query Error:', err);
                    return res.status(500).json({ message: 'Database error' });
                }

                if (result.length === 0) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                try {
                    const secret = process.env.JWT_SECRET;
                    if (!secret) {
                        throw new Error("JWT_SECRET is not defined");
                    }

                    const options = { expiresIn: '1h', algorithm: 'HS256' };
                    const token = jwt.sign({ name }, secret, options);

                    res.cookie('auth_token', token, {
                        httpOnly: true,
                        maxAge: 3600000 // 1 hour
                    });
                    const query = 'SELECT * FROM users WHERE name != ?';
                    
                    db.query(query, [name], (err, results) => {
                        if (err) {
                            console.error('Error fetching users:', err);
                            return res.status(500).json({ message: 'Something went wrong' });
                        }

                        res.render('dashboard.ejs', { token: token, user: result[0], users: results });
                    });
                
                } catch (jwtError) {
                    console.error('JWT Signing Error:', jwtError);
                    return res.status(500).json({ message: 'Token generation failed' });
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
module.exports = AuthController;
