const employeeDAO = require('./employeeDAO');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

async function viewAllTickets() {
    try {
        return await employeeDAO.viewAllTickets();
    } catch (error) {
        console.error("Error viewing all tickets:", error);
        throw new Error('Failed to view all tickets');  // Consider including error context
    }
}

async function updateTicket(ticketID, status) {
    try {
        return await employeeDAO.updateTicket(ticketID, { status });
    } catch (error) {
        console.error("Error updating ticket:", error);
        throw new Error('Failed to update ticket');  // Consider including error context
    }
}

async function filterByStatus(status) {
    try {
        return await employeeDAO.getTicketsByStatus(status);
    } catch (error) {const employeeDAO = require('./employeeDAO');
        const bcrypt = require('bcrypt');
        
        async function viewAllTickets() {
            try {
                return await employeeDAO.viewAllTickets();
            } catch (error) {
                console.error("Error viewing all tickets:", error);
                throw new Error('Failed to view all tickets');
            }
        }
        
        async function updateTicket(ticketID, status) {
            try {
                return await employeeDAO.updateTicket(ticketID, { status });
            } catch (error) {
                console.error("Error updating ticket:", error);
                throw new Error('Failed to update ticket');
            }
        }
        
        async function filterByStatus(status) {
            try {
                return await employeeDAO.getTicketsByStatus(status);
            } catch (error) {
                console.error("Error filtering tickets by status:", error);
                throw new Error('Failed to filter tickets by status');
            }
        }
        
        async function hashPassword(password) {
            if (typeof password !== 'string') {
                throw new TypeError('Password must be a string');
            }
            const saltRounds = 10;
            return await bcrypt.hash(password, saltRounds);
        }
        
        async function registerUser(user) {
            const validation = validateUser(user);
            if (validation.isValid) {
                const hashedPassword = await hashPassword(user.Password);
                try {
                    await employeeDAO.postUser({
                        ...user,
                        Password: hashedPassword,
                        Position: user.Position
                    });
                    return { success: true };
                } catch (error) {
                    console.error("Error posting user:", error);
                    return { success: false, error: "Failed to post user" };
                }
            } else {
                return { success: false, errors: validation.errors };
            }
        }
        
        async function loginUser(req, email, password) {
            try {
                const employee = await employeeDAO.getEmployee(email, req.session.user.Password);
                if (!employee) return { success: false, message: "User not found" };
        
                const isMatch = await bcrypt.compare(password, employee.Password);
                if (!isMatch) {
                    return { success: false, message: "Invalid password" };
                }
        
                req.session.user = employee.email;
                return { success: true, message: "Login successful" };
            } catch (error) {
                console.error("Error during login:", error);
                return { success: false, message: "Login failed" };
            }
        }
        
        function validateUser(user) {
            const errors = [];
            if (!user.email) errors.push("Email is required");
            if (!user.Password) errors.push("Password is required");
            return {
                isValid: errors.length === 0,
                errors
            };
        }
        
        module.exports = {
            viewAllTickets,
            updateTicket,
            filterByStatus,
            registerUser,
            validateUser,
            loginUser
        };
        
        console.error("Error filtering tickets by status:", error);
        throw new Error('Failed to filter tickets by status');  // Consider including error context
    }
}

async function hashPassword(Password) {
    let hashedPassword = "";
    for (let char of Password) {
        hashedPassword += String.fromCharCode(char.charCodeAt(0) + 1);
    }
    return hashedPassword; // Simple transformation
}


async function decryptPassword(hashedPassword) {
    let decryptedPassword = "";
    for (let char of hashedPassword) {
        decryptedPassword += String.fromCharCode(char.charCodeAt(0) - 1);
    }
    return decryptedPassword;
}


async function registerUser(user) {
    const validation = validateUser(user);

    if (validation.isValid) {
        const hashedPassword = await hashPassword(user.Password); // Await here
        try {
            await employeeDAO.postUser({
                ...user,
                Password: hashedPassword,
                Position: user.Position
            });
            return { success: true };
        } catch (error) {
            console.error("Error posting user:", error);
            return { success: false, error: "Failed to post user" };
        }
    } else {
        return { success: false, errors: validation.errors };
    }
}


async function loginUser(req, email, Password) {
    try {
        const employee = await employeeDAO.getEmployee(email);
        if (!employee) return { success: false, message: "User not found" };

        const decryptedPassword = await decryptPassword(employee.Password);

        if (decryptedPassword !== Password) {
            return { success: false, message: "Invalid password" };
        }

        req.session.user = employee.email;
        return { success: true, message: "Login successful" };
    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, message: "Login failed" };
    }
}



function validateUser(user) {
    const errors = [];

    if (!user.email) errors.push("Username is required");
    if (!user.Password) errors.push("Password is required");

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    viewAllTickets,
    updateTicket,
    filterByStatus,
    registerUser,
    validateUser,
    loginUser
};
