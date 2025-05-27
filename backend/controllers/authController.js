const User = require('../models/user');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const register = async (req, res) => {
    const { username, password } = req.body;
    
    console.log("Registration attempt for:", username); // Add this line
    
    try {
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            console.log("Username already exists:", username);
            return res.status(400).json({ message: 'Username already exists' });
        }

        const userId = await User.create(username, password);
        console.log("User created with ID:", userId); // Add this line
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration error:", error); // Detailed error logging
        res.status(500).json({ 
            message: 'Server error',
            error: error.message // Send error details to frontend
        });
    }
};

module.exports = { login, register };