const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, 
    ScanCommand,
    PutCommand
    } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBClient.from(client);
const TableName = 'Manager';


// get tickets for employee
async function viewAllTickets(){
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

// update ticket
async function updateTicket(ticketID, status){
    const command = new PutCommand({
        TableName,
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