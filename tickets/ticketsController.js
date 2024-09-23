const express = require('express');
const router = express.Router();

const ticketService = require('./ticketService');

// route handler for GET requests
router.get('/', async (req, res) => {
    try {
        // get information from a URL query
        // req.query checks for any query parameters
        const ticketIdQuery = req.query.ticketID;

        // if ticketIdQuery is requested, return that ticket
        if (ticketIdQuery) {
            const ticket = await ticketService.getTicket(ticketIdQuery);
            res.send(ticket);
        } else { // if no ticket is specified, return all tickets
            const tickets = await ticketService.getAllTickets();
            res.send(tickets);
        }
    } catch (error) {
        res.status(500).send({ message: error.message }); // Handle errors
    }
});


// route handler for POST requests
router.post('/tickets', async (req, res) => {
    const { amount, description } = req.body;
    const employeeEmail = req.session.user.email; // Assuming email is stored in session

    if (!amount || !description) {
        return res.status(400).send({ message: 'Amount and description are required.' });
    }

    try {
        const ticket = await ticketService.createTicket(employeeEmail, amount, description);
        res.status(201).send(ticket);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// get all tickets for an employee
router.get('/employeeTickets', async (req, res) => {
    const employeeEmail = req.session.user.email;

    try {
        const tickets = await ticketService.getEmployeeTickets(employeeEmail);
        res.status(200).send(tickets);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// get pending tickets
router.get('/pending', async (req, res) => {
    try {
        const tickets = await ticketService.getPendingTickets();
        res.status(200).send(tickets);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Approve or Deny a ticket
router.patch('/tickets/:ticketID', async (req, res) => {
    const { status } = req.body; // status should be 'Approved' or 'Denied'
    const ticketID = req.params.ticketID;

    try {
        const updatedTicket = await ticketService.updateTicketStatus(ticketID, status);
        res.status(200).send(updatedTicket);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
module.exports = router;