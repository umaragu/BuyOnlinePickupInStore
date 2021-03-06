
const mysql = require('/opt/mysql')
const validationErrors = require("/opt/CustomError")

// The A handler
exports.handler = async (eventObject, context) => { 
	try {

		console.log(JSON.stringify(eventObject));
		let query = eventObject.queryStringParameters;
		let orderId, customerId;
		if(query) {
			customerId = query.customer_id;
			orderId = query.orderId; 
			
		}
		let internalcall = (eventObject.rawPath.endsWith('/order/internal'))?true:false;
		if( !internalcall && !orderId) {
			customerId = eventObject.requestContext.authorizer.jwt.claims.username;
			console.log(eventObject.requestContext.authorizer.jwt.claims.username)

		}

		if (internalcall || customerId)
			return await lookupOrderByCustomer(customerId);
		else if (orderId)
			return await lookupOrderByOrder(orderId);
		else {
			throw new validationErrors(420, 'Customer ID or Order ID is required')
		}
	} catch (error) {
		console.log(error);
		const response = {
			statusCode: 500,
			body: "We have a problem searching order at this time; Please try again"

		}
		if (error instanceof validationErrors) {
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
	await mysql.closeConnection(connection);
	console.log(rows)
	return rows
}
async function lookupOrderByCustomer(customer) {

	const connection = await mysql.getConnection();
	const statement = `SELECT * FROM orders where customer_id=?`;
	let [rows, fields] = await connection.query(statement, [customer]);
	await mysql.closeConnection(connection);
	return rows;

}

