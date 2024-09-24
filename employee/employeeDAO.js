const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require('bcrypt');

const client = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocumentClient.from(client);

const TABLE_TICKETS = 'Tickets';
const TABLE_EMPLOYEES = 'Employees';

// Get all tickets
async function viewAllTickets() {
    const command = new ScanCommand({
        TableName: TABLE_TICKETS
    });
    try {
        const response = await documentClient.send(command);
        return response.Items;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;
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
        return response.Attributes;
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
        return response.Items;
    } catch (error) {
        console.error("Error fetching tickets by status:", error);
        throw error;
    }
}

// Post a new user
async function postUser(employee) {
    const command = new PutCommand({
        TableName: TABLE_EMPLOYEES,
        Item: {
            email: employee.email,
            Password: employee.Password, // Store the hashed password
            Position: employee.Position
        }
    });
    try {
        await documentClient.send(command);
    } catch (error) {
        console.error("Error creating employee:", error);
        throw error;
    }
}

// Get employee details
async function getEmployee(email) {
    const command = new GetCommand({
        TableName: TABLE_EMPLOYEES,
        Key: { email }
    });
    const data = await documentClient.send(command);
    return data.Item || null;
}

module.exports = {
    viewAllTickets,
    updateTicket,
    getTicketsByStatus,
    postUser,
    getEmployee
};
