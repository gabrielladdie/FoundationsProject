const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const employeeService = require('./employeeService');
const employeeDAO = require('./employeeDAO');


// Route to handle POST requests for registration
router.post("/register", async (req, res) => {
    const user = req.body;
    const result = await employeeService.registerUser(user);

    if (result.success) {
        res.status(201).json({
            message: "User registered successfully"
        });
    } else {
        res.status(400).json({
            message: result.message
        });
    }
});

// Route to handle user login
// router.post("/login", async (req, res) => {
//     const {email, Password} = req.body;
//     const result = await employeeService.loginUser(req, email, Password);

//     if (result.success) {
//         res.status(200).json({ message: result.message });
//     } else {
//         res.status(400).json({ message: result.message });
//     }
// });

async function authenticateUser(email, Password) {
    try {
        // Fetch the user from the database
        const user = await employeeDAO.getEmployee(email);

        // If no user found, return an error
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const decryptedPassword = await employeeService.decryptPassword(Password);

        if (decryptedPassword !== Password) {
            return { success: false, message: "Invalid password" };
        }

        // If password is valid, create a JWT token
        const token = jwt.sign(
            { 
                email: user.email, 
                Position: user.Position 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Return success with the token and user info (excluding the password)
        const { Password, ...userWithoutPassword } = user;
        return {
            success: true,
            message: "Authentication successful",
            token,
            user: userWithoutPassword
        };

    } catch (error) {
        console.error("Error in authenticateUser:", error);
        return { success: false, message: "An error occurred during authentication" };
    }
}
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Assume you have a function to verify user credentials
    console.log("inside login");
    const user = await authenticateUser(email, password); 
    
    if (user) {
        // Set user information in session
        req.session.user = {
            email: user.email,
            Position: user.Position // Store Position in session
        };
        console.log(req.session);
        res.status(200).send({ message: 'Login successful' });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
});

// Route to handle user login
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     const result = await employeeService.authenticateUser(email, password);

//     if (result.success) {
//         res.status(200).json({
//             message: result.message,
//             token: result.token,
//             user: result.user
//         });
//     } else {
//         res.status(401).json({ message: result.message });
//     }
// });


// Route to handle logout
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Could not log out" });
        }
        res.status(200).json({ message: "Logged out successfully" });
    });
});

module.exports = router;