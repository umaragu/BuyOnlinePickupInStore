
const mysql = require('/opt/mysql')
const eb = require("/opt/events") 
// The A handler
exports.handler = async(eventObject, context) => {
	console.log(eventObject);
	await processEvent(eventObject);
}

async function processEvent(eventObject){
	
	let eventDetail = eventObject.detail;
	console.log(eventDetail)
	let orderId = eventObject.resources[0];
	let status = 'CREATED'
	if(eventDetail.eventName == 'PICKUP_JOB_COMPLETED') {
		status = 'READY_FOR_PICKUP'
	} else if (eventDetail.eventName == 'ORDER_COMPLETED'){
		status = 'COMPLETED'
	} else if (eventDetail.eventName == 'PICKUP_JOB_ASSIGNED'){
		status = 'IN_PROGRESS'
	} else {
		console.log("Not an event of interest");
		return;
	}
	const [results, data] = await updateOrder(orderId, status);
	console.log(results);
	if(results.affectedRows === 0) {
		console.log("Invalid Order ", orderId);
	} else {
		const orders = await lookupOrderByOrder(orderId);
		await eb.fireEvent(orders[0], 'ORDER_UPDATED', 'order')

	}

}
async function lookupOrderByOrder(orderId) {
    	   
	const connection = await mysql.getConnection();
	const statement = `SELECT * FROM orders where orderId=?`;
	let [rows, fields] = await connection.query(statement, [orderId]);
	await mysql.closeConnection(connection);
	return rows;
}
async function updateOrder(orderId, status) {
    	   
	const connection = await mysql.getConnection();
	let statement = `UPDATE orders set status=?, order_updated_date=?` ;
	let date = new Date();
	let values = [status, date]
	if(status === 'COMPLETED') {
		statement = statement + `, order_completed_date=?`;
		values.push(date);
	}
	statement = statement + ` where orderId = ?`;
	values.push(orderId);
	let orders = await connection.execute(statement, values);
	await mysql.closeConnection(connection);
	return orders;
}

