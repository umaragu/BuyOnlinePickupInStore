const db = require("/opt/dynamo");
const Validation = require("/opt/CustomError") 

exports.handler = async(eventObject, context) => {
    console.log(eventObject);
    let associate = (eventObject.queryStringParameters) ? eventObject.queryStringParameters.associate : undefined;
    let status = (eventObject.queryStringParameters) ? eventObject.queryStringParameters.status : undefined;

    let store = eventObject.pathParameters.store;
    console.log("Pickup Job Lookup for store "+store +" associate "+associate)
    
    try {
        let items = await readJobs(store,status);
        let assigned= [];
        if(associate) {
             assigned = await assignedJobs(store,associate);
        }
        items = items.concat(assigned);
    
        return items;
    } catch(error) {
        console.error(error);
        console.log("Pickup Job Lookup failed for store "+store +" associate "+associate)

        return {
            statusCode: 500,
            body: "There has been a problem with Job Search; Please try again"
        }
    }
}

async function readJobs(store, status){
    let param = {
        TableName: process.env.TABLE_NAME,
        IndexName: 'ByStoreAndStatus',
        KeyConditionExpression: '#store = :store and jobStatus = :jobStatus',
        ExpressionAttributeValues: {
          ':store': store,
          ':jobStatus': status || 'CREATED'
        },
        ExpressionAttributeNames: { "#store": "store" }
    }
    console.debug("DB Params ", param)
    let response =  await db.query(param);
    return response.Items;
}
async function assignedJobs(store, associate){
    let param = {
        TableName: process.env.TABLE_NAME,
        IndexName: 'ByStoreAndAssociate',
        KeyConditionExpression: '#store = :store and associate = :associate',
        FilterExpression: " jobStatus = :jobStatus ",
        ExpressionAttributeValues: {
          ':store': store,
          ':associate': associate,
          ':jobStatus': 'ASSIGNED'
        },
        ExpressionAttributeNames: { "#store": "store" } 

    }

    let response =  await db.query(param);
    return response.Items; 
}