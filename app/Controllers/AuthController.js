const jwt = require('jsonwebtoken');
const commonResponse = require('../../config/CommonResponse');

class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
             const secret = process.env.JWT_SECRET;
                const options = {
                    expiresIn: '1h',     // Equivalent to Laravel config (e.g., `ttl` => 60)
                    algorithm: 'HS256'   // Default in both Node and Laravel
                };

            const token = jwt.sign({ email }, secret, options);

          return commonResponse(200, true, 'Login successful', { token }, null, res);
        } catch (error) {

            return commonResponse(500, false, 'Internal server error', null, null, res);
        }
    }
}

module.exports = AuthController;
