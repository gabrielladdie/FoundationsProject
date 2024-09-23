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
    } catch (error) {
        console.error("Error filtering tickets by status:", error);
        throw new Error('Failed to filter tickets by status');  // Consider including error context
    }
}

async function registerUser(user) {
    const validation = validateUser(user);
    if (validation.isValid) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        try {
            await employeeDAO.postUser({
                ...user,
                password: hashedPassword,
                employeeID: uuid.v4()
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

async function loginUser(email, password) {
    try {
        // Fetch the user details from the database
        const employee = await employeeDAO.getEmployee(email);

        if (!employee) {
            return { success: false, message: "User not found" };
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, employee.password);

        if (!isPasswordValid) {
            return { success: false, message: "Invalid password" };
        }

        // Store user info in session
        session.user = {
            email: employee.email,
            employeeID: employee.employeeID
        };

        return { success: true, message: "Login successful" };

    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, message: "Login failed" };
    }
}

function validateUser(user) {
    const errors = [];

    if (!user.username) errors.push("Username is required");
    if (!user.password) errors.push("Password is required");

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
