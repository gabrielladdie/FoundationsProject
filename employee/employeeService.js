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
        const hashedPassword = await bcrypt.hash(user.Password, 10);
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
        // Fetch the user details from the database
        const employee = await employeeDAO.getEmployee(email);
        console.log(email, Password);
        console.log(employee);
        console.log(await bcrypt.compare(Password, employee.Password))


        if (!employee || !(await bcrypt.compare(Password, employee.Password))) {
            return { success: false, message: "User not found" };
        }
            req.session.user = employee.email;
            return {
                success: true, message: "Login successful"
            };

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
