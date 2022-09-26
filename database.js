require('dotenv').config();
var AWS = require('aws-sdk');
const { DocumentClient } = require('aws-sdk/clients/dynamodb');

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
const items = await dynamoClient.scan(params).promise();
return items;
};


const addItem = async (listItem) => {
    if (!listItem.id){
        throw Error("no id on listItem")
    }

    const params = {
        TableName: TABLE_NAME,
        Item: listItem
    }
   const res =  await dynamoClient.put(params).promise();

   if (!res) {
    throw Error (`There was an error inserting ID of ${listItem.id} `);
   }

   return listItem;
};


const updateItem = async (id) => {

    const params = {
        TableName: TABLE_NAME,
        Key: {
            id
        },
        UpdateExpression: `set ${input} = :inputValue`

    }

   const updatedItem = await dynamoClient.update(params).promise();
   return updatedItem;
}

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
    addItem,
    deleteItem,
    updateItem
 };