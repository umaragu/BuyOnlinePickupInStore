const db = require("/opt/dynamo");
exports.handler = async(eventObject, context) => {
    console.debug(eventObject);
	let detail = eventObject.detail;
    let orderId = eventObject.resources[0];
    console.log("Received Event "+detail.eventName+" for "+orderId);
    await processEvent(detail.eventData[0].products, detail.eventName)
    console.log("completed processing for Event "+detail.eventName+" for "+orderId);
}
async function processEvent(products, eventName) {
	if(eventName === "ORDER_CREATED") {
        for(let product of products){
            if(product.sku && product.quantity)
                await updateOnHoldInventory(product.sku, product.quantity)
        }
	} else 	if(eventName === 'ORDER_COMPLETED') {
        for(let product of products){
            if(product.sku && product.quantity)
                await updateInventory(product.sku, product.quantity)
        }
    } else {
		console.log("Not an event of interest");
		return;
    }

}
async function updateOnHoldInventory(sku, quantity){
    let toAdd = parseInt(quantity);
    let toSubtract = (-toAdd);
    console.log(toSubtract);
    let update = "ADD on_hold :toAdd , in_stock :toSubtract";
    let values = {
        ":toSubtract": toSubtract,
        ":toAdd": toAdd
    }
    let param = {
        TransactItems: [{
            Update:{
        TableName: process.env.TABLE_NAME,
        Key: {sku: sku},
        UpdateExpression: update,
        ExpressionAttributeValues: values
        }}]
    }
    console.debug("DB Params ", JSON.stringify(param));
    await db.transactWrite(param);
}
async function updateInventory(sku, quantity){
    
    let update = "ADD on_hold :quantity ";
    let values = {
        ":quantity": parseInt(quantity)
    }
    let param = {
        TransactItems: [{
            Update:{
        TableName: process.env.TABLE_NAME,
        Key: {sku: sku},
        UpdateExpression: update,
        ExpressionAttributeValues: values
        }}]
    }
    console.debug("DB Params ", param);

    await db.transactWrite(param);
}