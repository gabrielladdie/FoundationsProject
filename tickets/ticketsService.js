const ticketsDAO = require('./ticketsDAO');
const uuid = require('uuid');

async function getAllTickets() {
    const tickets = await ticketsDAO.getAllTickets();
}

async function createTicket(ticket) {
    const ticket = await ticketsDAO.createTicket({
        ...ticket,
        ticketID: uuid.v4()
    });
}

async function getTicketByID(ID) {
    const ticket = await ticketsDAO.getTicketByID(ID);
}