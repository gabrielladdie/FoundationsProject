const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocumentClient.from(client);
const bcrypt = require('bcrypt');

const TABLE_TICKETS = 'Tickets';
const TABLE_EMPLOYEES = 'Employees';

// Get all tickets
async function viewAllTickets() {
    const command = new ScanCommand({
        TableName: TABLE_TICKETS
    });
    try {
        const response = await documentClient.send(command);
        return response.Items;  // Return items instead of logging
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;  // Rethrow the error
    }
}

// Update ticket status
async function updateTicket(ticketID, status) {
    const command = new PutCommand({
        TableName: TABLE_TICKETS,
        Key: { ticketID },
        UpdateExpression: "set status = :status",
        ExpressionAttributeValues: {
            ":status": status
        },
        ReturnValues: "UPDATED_NEW"
    });
    try {
        const response = await documentClient.send(command);
        return response.Attributes;  // Return updated attributes
    } catch (error) {
        console.error("Error updating ticket:", error);
        throw error;
    }
}

// Get tickets by status
async function getTicketsByStatus(status) {
    const command = new QueryCommand({
        TableName: TABLE_TICKETS,
        KeyConditionExpression: "status = :status",
        ExpressionAttributeValues: {
            ":status": status
        }
    });
    try {
        const response = await documentClient.send(command);
        return response.Items;  // Return items instead of logging
    } catch (error) {
        console.error("Error fetching tickets by status:", error);
        throw error;
    }
}

// Get tickets for a specific employee
async function viewEmployeeTickets(email) {
    const command = new QueryCommand({
        TableName: TABLE_TICKETS,
        KeyConditionExpression: "#email = :email",
        ExpressionAttributeNames: {
            "#email": "email"
        },
        ExpressionAttributeValues: {
            ":email": email
        }
    });
    try {
        const response = await documentClient.send(command);
        return response.Items;  // Return items instead of logging
    } catch (error) {
        console.error("Error fetching employee tickets:", error);
        throw error;
    }
}

// Post a new ticket
async function postTicket(item) {
    const command = new PutCommand({
        TableName: TABLE_TICKETS,
        Item: item
    });
    try {
        await documentClient.send(command);
    } catch (error) {
        console.error("Error posting ticket:", error);
        throw error;
    }
}

// Post a new user
async function postUser(employee) {
    const hashedPassword = await bcrypt.hash(employee.Password, 10); // Hash the password
    const command = new PutCommand({
        TableName: TABLE_EMPLOYEES,
        Item: {
            email: employee.email,
            Password: hashedPassword, // Store the hashed password
            Position: employee.Position
        }
    });

    try {
        const response = await documentClient.send(command);
        return response.Attributes;  // Return the updated attributes or the item if it already existed (for updating)  // Return updated attributes
    } catch (error) {
        console.error("Error creating employee:", error);
        throw error;
    }
}

// Get employee details
async function getEmployee(email) {
    const command = new GetCommand({
        TableName: TABLE_EMPLOYEES,
        Key: { 
            email// employee used to fetch employee
        }
    });

    const data = await documentClient.send(command);
    return data.Item || null;
}

module.exports = {
    viewAllTickets,
    updateTicket,
    getTicketsByStatus,
    viewEmployeeTickets,
    postTicket,
    postUser,
    getEmployee
};
