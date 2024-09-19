const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, 
    ScanCommand,
    PutCommand
    } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBClient.from(client);
const TableName = 'Tickets';


// get tickets for employee
async function getAllTickets(){
    const command = new ScanCommand({
        TableName
    });
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

// create ticket
async function createTicket(ticket){
    const command = new PutCommand({
        TableName,
        ticket
    });
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllTickets, 
    createTicket
};