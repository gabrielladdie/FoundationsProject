const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, 
    QueryCommand
    } = require("@aws-sdk/lib-dynamodb");
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);
const TableName = 'Tickets';

// get tickets for employee
async function viewEmployeeTickets(){
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "employeeID = :employeeID",
        ExpressionAttributeNames: {
            "#ID": "employeeID"
        },
        ExpressionAttributeValues: {
            ":employeeID": employeeID
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
        TableName,
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
    viewEmployeeTickets
};