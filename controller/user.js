const users = require('../model/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';



const signup = async(req , res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new users({
            username,
            email,
            password: hashedPassword
        });

        const userSignup = await user.save();
        if (userSignup) {
            res.json({ message: 'User Signup Successfully', success: true });
        } else {
            res.json({ message: 'User Signup Failed', success: false });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (user.admin !== true) {
            return res.status(403).json({ message: 'Only admin users can log in' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, admin: user.admin  }, secretKey, { expiresIn: '1h' });

        res.json({ message: 'Login Success', success: true, token, data: user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports={
    signup,
    login
}