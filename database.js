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


const updateItemTo1 = async (id) => {

   const updatedItem = await dynamoClient.update(
    {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET #selected = :selected",
    ExpressionAttributeNames: {
      "#selected": "selected",
    },
    ExpressionAttributeValues: {
      ":selected": 1,
    }
    }
  ).promise();
   return updatedItem;
};

const updateItemTo0 = async (id) => {

  const updatedItem = await dynamoClient.update(
   {
   TableName: TABLE_NAME,
   Key: { id },
   UpdateExpression: "SET #selected = :selected",
   ExpressionAttributeNames: {
     "#selected": "selected",
   },
   ExpressionAttributeValues: {
     ":selected": 0,
   }
   }
 ).promise();
  return updatedItem;
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

//  const transaction = async (id) => {
//     await dynamoClient.transactWrite({
//         TransactItems: [
//             {
//                 Update:{
                    
//                     TableName: TABLE_NAME,
//                     Key:{
//                         id
//                     },              
//                     UpdateExpression: "SET selected = :value",
//                     ExpressionAttributeValues: {
//                         ":value" : 0
//                     }   
//                 }
//             }
//         ]
//     }).promise();
//  };





 module.exports = {
    dynamoClient,
    getItems,
    getItemByID,
    addItem,
    deleteItem,
    updateItemTo1,
    updateItemTo0
 };