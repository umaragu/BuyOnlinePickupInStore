// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

exports.handler = async (eventObject, context) => {
	// Create sendTemplatedEmail params 
	//  eventObject = { detail: {
	// 	eventName: "PICKUP_JOB_COMPLETED",
	// 	eventData: {
	// 		orderId: "ddsfdsfsd",
	// 		customer_name: "Uma Ramadoss",
	// 		store_address: "asdasd asdasdasda",
	// 		customer_id: "ramadu@amazon.com"

	// 	}
	// }


	let eventDetail = eventObject.detail;
	console.log(eventDetail)
	let data = eventDetail.eventData[0];
	let templateData = {
		order_id: data.orderId,
		customer_name: data.customer_name,
		store_address: data.store_address


	}
	let noaction = false;
	switch (eventDetail.eventName) {
		case "PICKUP_JOB_COMPLETED":
			templateData.pickup = true;
			break;
		case "ORDER_CREATED":
			templateData.created = true;
			break;
		case "ORDER_COMPLETED":
			templateData.completed = true;
			break;
		case "PICKUP_JOB_ASSIGNED":
		default:
			noaction = true
	}
	if (!noaction) {
		var params = {
			Destination: { /* required */
				ToAddresses: [
					data.customer_id
					/* more To email addresses */
				]
			},

			Source: process.env.SENDER, /* required */
			Template: process.env.EMAIL_TEMPLATE, /* required */
			TemplateData: JSON.stringify(templateData)
		};

		console.log(params)
		// Create the promise and SES service object
		const ses = new AWS.SES({ apiVersion: '2010-12-01' });
		try {
			var sendPromise = await ses.sendTemplatedEmail(params).promise();
			console.log("sent")
		} catch (e) {
			console.log("error")
			console.log(e);
		}

	}
}