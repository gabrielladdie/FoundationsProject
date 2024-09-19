const express = require('express');
const router = express.Router();

const ticketsService = require('./ticketsService');

// route handler for GET requests
router.get('/', async (req, res) => {
    // get information from a URL query
    // req.query checks for any query parameters
    const ticketIdQuery = req.query.ticketID;

    // if ticketIdQuery is requested, return that ticket
    if(ticketIdQuery){
        const ticket = await ticketsService.getTicket(ticketIdQuery);
        res.send(ticket);
    } else { // if no ticket is specified, return all tickets
        const tickets = await ticketsService.getAllTickets();
        res.send(tickets);
    }
});

// route handler for GET requests to a path that includes a ticketID
router.get('/:ticketID', async (req, res) => {
    // extracts the value of the ticketID parameter from the URL
    const ticketID = req.params.ticketID;
    const ticket = await ticketsService.getTicketByID(ticketID);

    // response is the retrieved ticket
    res.send(ticket);
});

// route handler for POST requests
router.post('/', async (req, res) => {
    // extracts the data sent in the request body
    const ticket = req.body;
    const newTicket = await ticketsService.createTicket(ticket);
    res.status(201).send(newTicket);
});

module.exports = router;