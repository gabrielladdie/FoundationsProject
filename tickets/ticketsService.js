const ticketsDAO = require('./ticketsDAO');
const uuid = require('uuid');

async function getAllTickets() {
    const tickets = await ticketsDAO.getAllTickets();
    return tickets;
}

async function createTicket(ticket) {
    const tickets = await ticketsDAO.createTicket({
        ...ticket,
        ticketID: uuid.v4()
    });
    return tickets;
}


async function getTicketByID(ID) {
    const ticket = await ticketsDAO.getTicketByID(ID);
    return ticket;
}

module.export = {
    getAllTickets,
    createTicket,
    getTicketByID
}