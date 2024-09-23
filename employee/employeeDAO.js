const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, 
    ScanCommand,
    PutCommand
    } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);


// get tickets for employee
async function viewAllTickets(){
    const command = new ScanCommand({
        TableName: 'Tickets'
    });
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

// update ticket
async function updateTicket(ticketID, status){
    const command = new PutCommand({
        TableName: 'Tickets',
        Key: {
            ticketID: ticketID
        },
        UpdateExpression: "set status = :status",
        ExpressionAttributeValues: {
            ":status": status
        },
        ReturnValues: "UPDATED_NEW"
    });
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

// filter by status
async function filterByStatus(status){
    const command = new GetCommand({
        TableName: 'Tickets',
        Key: {
            status: status
        }
    });
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

// get tickets for employee
async function viewEmployeeTickets(){
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "email = :email",
        ExpressionAttributeNames: {
            "#email": "email"
        },
        ExpressionAttributeValues: {
            ":email": email
        }
    });
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

async function postTicket(ticket){
    const command = new PutCommand({
        TableName: 'Tickets',
        Item
    });
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    viewAllTickets,
    updateTicket,
    filterByStatus,
    viewEmployeeTickets,
    postTicket
};