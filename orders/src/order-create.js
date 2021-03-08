

const mysql = require('/opt/mysql')
const events = require('/opt/events');
const axios = require('axios')
const uuid = require('uuid');
const Validation = require("/opt/CustomError")

// The A handler
exports.handler = async (eventObject, context) => {
    let order;
    try {

        console.debug(eventObject);
        order = await createOrder(eventObject);
        await events.fireEvent(order, 'ORDER_CREATED', 'order');
        //console.log(order.orderId)
        return await lookupOrderByOrder(order.orderId);
    } catch (error) {
        console.log(error);
        const response = {
            statusCode: 500,
            body: "We have a problem creating order at this time; Please try again"

        }
        if (error instanceof Validation) {
            response.statusCode = error.code;
            response.body = error.message;
        }

        return response;
    }

}

async function lookupOrderByOrder(orderId) {

    const connection = await mysql.getConnection();
    const statement = "SELECT * FROM orders where orderId=?";
    let [rows, fields] = await connection.query(statement, [orderId]);
    console.log(rows)
    await mysql.closeConnection(connection);
    return rows
}

// async function createOrder(eventObject) {
//     const order = prepareOrderData(eventObject);   
// 	const connection = await mysql.getConnection();
// 	const statement = `INSERT INTO orders(orderId, sku, store, customer_id,
// 	                                  customer_name,order_created_date,order_updated_date,
// 	                                  order_completed_date,status,order_type,
// 	                                  price,quantity) values (?,?,?,?,?,null,null,?,?,?,?) `;
// 	let data = []                                  
//     for(let product of order.products) {
// 	    await connection.query(statement, [order.orderId,product.sku,order.store, order.customer_id, order.customer_name, new Date(), 'CREATED',order.order_type, product.price, product.quantity])
//     }
// 	await mysql.closeConnection(connection)
// 	return order;
// }

async function createOrder(eventObject) {
    const order = prepareOrderData(eventObject);
    const connection = await mysql.getConnection();
    const statement = `INSERT INTO orders(orderId, sku, store, customer_id,
	                                  customer_name,order_created_date,order_updated_date,
	                                  order_completed_date,status,order_type,product_name,
	                                  price,quantity,store_address,customer_phone) values(?,?,?,?,?,?,null,null,?,?,?,?,?,?,?)`;

    let promises = []
    for (let product of order.products) {

        promises.push(connection.execute(statement, [order.orderId,
        product.sku,
        order.store,
        order.customer_id,
        order.customer_name,
        new Date(),
            'CREATED',
        order.order_type,
        product.product_name,
        product.unit_price,
        product.quantity,
        order.store_address,
        order.customer_phone,
        ]));

    }
    Promise.all(promises).then(data => {
        console.log("Successful", data);

    }).catch(error => {
        console.log(error);
        throw error;
    })
    await mysql.closeConnection(connection)
    return order;
}



function prepareOrderData(eventObject) {

    const body = JSON.parse(eventObject.body);
    if (!body.store || !body.customer_name || !body.customer_id || !body.products || body.products.length == 0)
        throw new Validation(400, 'Order Data is missing required attributes')
    for (let product of body.products) {
        if (!product.sku || !product.quantity || !product.unit_price)
            throw new Validation(400, 'Order Data is missing required attributes')
    }
    return {
        ...body,
        orderId: uuid.v4()
    }

}

exports.createtable = async (event, context) => {

    try {
        const connection = await mysql.getConnection();

        if (event.RequestType == "Delete") {
            await connection.execute("drop table orders");
        } else {

            const table = `create table if not exists orders(
            orderId VARCHAR(50) NOT NULL,
            sku VARCHAR(30) NOT NULL,
            customer_id VARCHAR(40) NOT NULL,
            customer_name VARCHAR(40) NOT NULL,
            order_created_date DATETIME,
            order_updated_date DATETIME,
            order_completed_date DATETIME,
            status VARCHAR(25) NOT NULL,
            order_type VARCHAR(15) NOT NULL,
            product_name  VARCHAR(200),
            price FLOAT,
            store VARCHAR(10) NOT NULL,
            store_address VARCHAR(100),
            customer_phone BIGINT,
            quantity INT,
            PRIMARY KEY ( orderId, sku )
        );`
            await connection.execute(table);
        }
        await mysql.closeConnection(connection)
        await sendResponse(event, context, "SUCCESS");

    } catch (error) {
        await sendResponse(event, context, "FAILED");
        return;
    }

}

// Send response to the pre-signed S3 URL 
async function sendResponse(event, context, responseStatus, responseData) {
 
    var responseBody = JSON.stringify({
        Status: responseStatus,
        Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
        PhysicalResourceId: context.logStreamName,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        Data: responseData
    });
 
    console.log("RESPONSE BODY:\n", responseBody); 
    const options = {
        headers: {
            "content-type": "",
            "content-length": responseBody.length
            }
      }
  
  
    console.log(event.ResponseURL)
    let res = await axios.put(event.ResponseURL, responseBody, options);
    console.log("SENDING RESPONSE...\n", res);
}