const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, 
    ScanCommand,
    PutCommand,
    QueryCommand
    } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);
const TableName = 'Tickets';

// get tickets for employee
async function getAllTickets(){
    const command = new ScanCommand({
        TableName
    });
    try {
        const response = await documentClient.send(command);
        console.log(response);
        return response.Items;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error; // Rethrow error for handling in the service
    }
}

// create ticket
async function createTicket(ticket){
    const command = new PutCommand({
        TableName,
        Item: ticket
    });
    try {
        const response = await documentClient.send(command);
        console.log(response);
        return  response;
    } catch (error) {
        console.log(error);
    }
}

async function getTicketByID(ticketID){
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "#ID = :ticketID",
        ExpressionAttributeNames: {
            "#ID": "ticketID"
        },
        ExpressionAttributeValues: {
            ":ticketID": ticketID
        }
    });
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

async function getPendingTickets() {
    const command = new QueryCommand({
        TableName: 'Tickets', // Ensure you have a GSI for status if needed
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
    getAllTickets, 
    createTicket,
    getTicketByID,
    getPendingTickets,
    updateTicketStatus
};