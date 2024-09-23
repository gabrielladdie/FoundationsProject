const managerDAO = require('./managerDAO');
const uuid = require('uuid');

async function viewAllTickets() {
    const tickets = await managerDAO.viewAllTickets();
    return tickets;
};

async function updateTicket(ticketID, status) {
    return await managerDAO.updateTicket(ticketID, {status:status.status});
};

async function filterByStatus(status) {
    return await managerDAO.filterByStatus(status);
};

module.exports = {
    viewAllTickets,
    updateTicket,
    filterByStatus
};