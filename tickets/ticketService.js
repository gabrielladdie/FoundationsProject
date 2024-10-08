const ticketsDAO = require('./ticketsDAO');
const { v4: uuidv4 } = require('uuid'); 


async function getAllEmployeeTickets() {
    try {
        const tickets = await ticketsDAO.getAllTickets();
        return tickets;
    } catch (error) {
        console.error("Error fetching all tickets:", error);
        throw new Error('Could not retrieve tickets'); // Propagate error
    }
}


async function createTicket(req) {
    try {
        // Extract amount and description from the request body
        const { amount, description } = req;

        // Get email from session
        const employeeEmail = req.employeeEmail;
        const result = await ticketsDAO.createTicket({
            ticketID: uuidv4(),
            amount: amount,
            dateCreated: new Date().toISOString(),
            description: description,
            status: 'Pending', // Default status to 'Pending'
            email: employeeEmail
        });
        return result; // Return the created ticket or response
    } catch (error) {
        console.error("Error creating ticket:", error);
        throw new Error('Could not create ticket');
    }
}


async function getTicketByID(ID) {
    try {
        const ticket = await ticketsDAO.getTicketByID(ID);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        return ticket; // Return the found ticket
    } catch (error) {
        console.error("Error fetching ticket by ID:", error);
        throw new Error('Could not retrieve ticket');
    }
}

async function getPendingTickets() {
    try {
        const pendingTickets = await ticketsDAO.getPendingTickets();
        return pendingTickets; // Return the retrieved tickets
    } catch (error) {
        console.error("Error in service layer fetching pending tickets:", error);
        throw new Error('Could not fetch pending tickets'); // Propagate error
    }
}

async function updateTicketStatus(ticketID, status) {
    try {
        const result = await ticketsDAO.updateTicketStatus(ticketID, status);
        console.log(result);
        return result; // Return the result from the DAO
    } catch (error) {
        console.error("Error in service layer updating ticket status:", error);
        throw new Error('Could not update ticket status'); 
    }
}
module.exports = {
    getAllEmployeeTickets,
    createTicket,
    getTicketByID,
    getPendingTickets,
    updateTicketStatus
};
