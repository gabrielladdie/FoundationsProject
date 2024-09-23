const employeeDAO = require('./employeeDAO'); // Add this import

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
        try {
            await employeeDAO.postUser({ ...user });
            return { success: true };
        } catch (error) {
            console.error("Error posting user:", error);
            return { success: false, error: "Failed to post user" };
        }
    } else {
        return { success: false, errors: validation.errors };
    }
}

function validateUser(user) {
    const errors = [];

    if (!user.username) errors.push("Username is required");
    if (!user.password) errors.push("Password is required");
    // Add more validation as needed (e.g., email format, password strength)

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
};
