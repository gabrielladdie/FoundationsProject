const {getAllTickets, createTicket} = require('./ticketsDAO');

async function getTickets(req, res) {
    try {
        const tickets = await getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function createTicketService(req, res) {
    try {
        const ticket = await createTicket(req.body);
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}