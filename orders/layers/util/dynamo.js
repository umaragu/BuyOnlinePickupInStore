var AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const documentClient = new AWS.DynamoDB.DocumentClient();
module.exports.get = async function get(params){
    return await documentClient.get(params).promise();
}
module.exports.query = async function query(params){
    return await documentClient.query(params).promise();
} 
module.exports.put = async function put(params){
    return await documentClient.put(params).promise();
} 
module.exports.update = async function update(params){
    return await documentClient.update(params).promise();
} 
module.exports.transactWrite = async function transactWrite(params){
    return await documentClient.transactWrite(params).promise();
} 
