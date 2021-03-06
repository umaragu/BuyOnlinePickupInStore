const db = require("/opt/dynamo");
exports.handler = async(eventObject, context) => {
    console.log(eventObject);
	let product = JSON.parse(eventObject.body);

    await createProduct(product)
    return "created";
}

async function createProduct(product){
    let param = {
        TableName: process.env.TABLE_NAME,
        Item: {
            sku: product.upc+"-"+Math.floor(Math.random() * 10000)+ "-"+product.store,
            ...product            
        }
    }
    await db.put(param);
}