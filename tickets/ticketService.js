const ticketsDAO = require('./ticketsDAO');
const { v4: uuidv4 } = require('uuid'); // Import uuid correctly

async function getAllTickets() {
    try {
        const tickets = await ticketsDAO.getAllTickets();
        return tickets;
    } catch (error) {
        console.error("Error fetching all tickets:", error);
        throw new Error('Could not retrieve tickets'); // Propagate error
    }
}

async function createTicket(ticket) {
    try {
        const newTicket = {
            ticketID: uuidv4(),
            employeeEmail: ticket.employeeEmail,
            amount: ticket.amount,
            description: ticket.description,
            status: ticket.status,
            createdAt: new Date().toISOString()
        };
        const result = await ticketsDAO.createTicket(newTicket);
        return result; // Return the created ticket or response
    } catch (error) {
        console.error("Error creating ticket:", error);
        throw new Error('Could not create ticket'); // Propagate error
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
        throw new Error('Could not retrieve ticket'); // Propagate error
    }
}

module.exports = {
    getAllTickets,
    createTicket,
    getTicketByID
};
