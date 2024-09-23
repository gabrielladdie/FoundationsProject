const ticketsDAO = require('./ticketsDAO');
const { v4: uuidv4 } = require('uuid'); // Import uuid correctly

async function getAllEmployeeTickets() {
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

async function getPendingTickets() {
    const command = new QueryCommand({
        TableName: 'Tickets',
        IndexName: 'StatusIndex', // Ensure you have a GSI for status if needed
        KeyConditionExpression: "#status = :pending",
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":pending": "Pending"
        }
    });

    try {
        const response = await documentClient.send(command);
        return response.Items; // Return the array of pending tickets
    } catch (error) {
        console.error("Error fetching pending tickets:", error);
        throw error; // Rethrow error for handling in the controller
    }
}


async function updateTicketStatus(ticketID, status) {
    // Validate status
    if (!['Approved', 'Denied'].includes(status)) {
        throw new Error('Invalid status');
    }

    const command = new UpdateCommand({
        TableName: 'Tickets',
        Key: { ticketID },
        UpdateExpression: "SET #status = :status",
        ConditionExpression: "#status = :pending", // Ensure it's pending before updating
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":pending": "Pending",
            ":status": status
        }
    });

    try {
        await documentClient.send(command);
        return { success: true, message: `Ticket ${ticketID} has been ${status}.` };
    } catch (error) {
        console.error("Error updating ticket status:", error);
        throw error; // Rethrow error for handling in the controller
    }
}
module.exports = {
    getAllEmployeeTickets,
    createTicket,
    getTicketByID,
    getPendingTickets,
    updateTicketStatus
};
