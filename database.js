require('dotenv').config();
var AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.aws_default_region,
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "ChecklistUK";

const getItems = async () => {
    const params = {
        TableName: TABLE_NAME,
    };
 return await dynamoClient.scan(params).promise();
};


const addOrUpdateItem = async (item) => {
    const params = {
        TableName: TABLE_NAME,
        Item: item
    }
    return await dynamoClient.put(params).promise();
};


const getItemByID = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id
        }
    };
    const ItemByID = await dynamoClient.get(params).promise();
    return ItemByID;
 };

 const deleteItem = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id
        }
    };
    return await dynamoClient.delete(params).promise();
 };


 module.exports = {
    dynamoClient,
    getItems,
    getItemByID,
    addOrUpdateItem,
    deleteItem
 };