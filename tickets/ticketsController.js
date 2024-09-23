const express = require('express');
const router = express.Router();

const ticketsService = require('./ticketsDAO');

// route handler for GET requests
router.get('/', async (req, res) => {
    try {
        // get information from a URL query
        // req.query checks for any query parameters
        const ticketIdQuery = req.query.ticketID;

        // if ticketIdQuery is requested, return that ticket
        if (ticketIdQuery) {
            const ticket = await ticketsService.getTicket(ticketIdQuery);
            res.send(ticket);
        } else { // if no ticket is specified, return all tickets
            const tickets = await ticketsService.getAllTickets();
            res.send(tickets);
        }
    } catch (error) {
        res.status(500).send({ message: error.message }); // Handle errors
    }
});

// route handler for GET requests to a path that includes a ticketID
router.get('/:ticketID', async (req, res) => {
    // extracts the value of the ticketID parameter from the URL
    const ticketID = req.params.ticketID;
    try {
        const ticket = await ticketsService.getTicketByID(ticketID);
        if (ticket) {
            return res.send(ticket); // Send the found ticket
        } else {
            return res.status(404).send({ message: "Ticket not found" }); // Ticket not found
        }
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return res.status(500).send({ message: error.message }); // Handle errors
    }
});

// route handler for POST requests
router.post('/', async (req, res) => {
    try {
        // get information from the request body
        const ticket = req.body;
        const newTicket = await ticketsService.createTicket(ticket);
        res.status(201).send(newTicket);
    } catch (error) {
        res.status(500).send({ message: error.message }); // Handle errors
    }
});

module.exports = router;