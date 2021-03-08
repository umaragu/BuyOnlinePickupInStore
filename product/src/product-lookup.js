const db = require("/opt/dynamo");
exports.handler = async(eventObject, context) => {
    try {
	let category = ( eventObject.queryStringParameters) ? eventObject.queryStringParameters.category : undefined;
    
    let store = eventObject.pathParameters.store;
    let sku = eventObject.pathParameters.sku;
    
    if(store) {
        console.log("Product Lookup for store "+store +" category "+category);
        return await lookupProduct(store, category);
    } else {
        console.log("Product Lookup for sku "+sku);

        return await lookupProductBySku(sku)
    }



    } catch(error) {
        console.error(error)
        console.log("Product Lookup failed ");

        return {
            statusCode: "500",
            message: "We have a problem right now; Please try again!"
        }
    }
}

async function lookupProductBySku(sku){
    let exp = "#sku = :sku";
    let names = { "#sku": "sku" }
    let values = {
        ":sku": sku
    }
    let param = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: exp,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: names
    }
    let response =  await db.query(param);
    return response;
}
async function lookupProduct(store, category){
    let exp = "#store = :store";
    let names = { "#store": "store" }
    let values = {
        ":store": store
    }
    if(category) {
        exp = exp + " and #category = :category"
        values[":category"] = category
        names["#category"] = "category"
    }

    let param = {
        TableName: process.env.TABLE_NAME,
        IndexName: 'ByStore',
        KeyConditionExpression: exp,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: names
    }
    let response =  await db.query(param);
    return response;
}