const express = require('express');
const router = express.Router();
const ticketService = require('./ticketService');

// Get all tickets or a specific ticket
router.get('/', async (req, res) => {
    try {
        const ticketIdQuery = req.query.ticketID;
        const userPosition = req.session.user.Position;

        if (ticketIdQuery) {
            const ticket = await ticketService.getTicketByID(ticketIdQuery);
            return res.send(ticket);
        } else {
            // Only managers can view all tickets
            if (userPosition === 'Manager') {
                const tickets = await ticketService.getAllEmployeeTickets();
                return res.send(tickets);
            } else {
                const email = req.session.user.email;
                const tickets = await ticketService.getAllEmployeeTickets(email);
                return res.send(tickets);
            }
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Create new ticket
router.post('/newTicket', async (req, res) => {
    const { amount, description } = req.body;

    // // Check if the user is authenticated and has an email in the session
    if (!req.session?.user) {
        console.log(req.session.user);
        return res.status(401).send({ message: 'User not authenticated' });
    }

    const employeeEmail = req.session.user; // Get email from session

    if (!amount || !description) {
        return res.status(400).send({ message: 'Amount and description are required.' });
    }

    try {
        console.log(amount, description, employeeEmail);
        const ticket = await ticketService.createTicket({ amount, description, employeeEmail });
        res.status(201).send(ticket);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get pending tickets (only for managers)
router.get('/pending', async (req, res) => {
    console.log(req.session.user.Position);
    console.log(JSON.stringify(req.session.user.Position));
    if (req.session.user.Position != 'Manager') {
        return res.status(403).send({ message: 'Access denied' });
    }
    try {
        const tickets = await ticketService.getPendingTickets();
        res.status(200).send(tickets);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Approve or Deny a ticket
router.patch('/tickets/:ticketID', async (req, res) => {
    const { status } = req.body;
    const ticketID = req.params.ticketID;

    if (req.session.user.Position !== 'Manager') {
        return res.status(403).send({ message: 'Access denied' });
    }

    try {
        const updatedTicket = await ticketService.updateTicketStatus(ticketID, status);
        res.status(200).send(updatedTicket);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
