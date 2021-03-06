const db = require("/opt/dynamo");
const uuidv4 = require('uuid');

exports.handler = async(eventObject, context) => {
    console.log(eventObject);
    await processEvent(eventObject);

}

async function processEvent(eventObject) {
  	let eventData = eventObject.detail.eventData;
  	let eventDetail = eventObject.detail;
	let orders = eventObject.resources;
    console.log("Received Event - "+eventDetail.eventName +" for "+ orders);

	if(eventDetail.eventName === 'ORDER_CREATED') {
	    for(let order of eventData) {
	    	await createPickupJob(order)
	    }
	} else {
		console.log("Not an event of interest");
		return;
	}
    console.log("completed processing Event - "+eventDetail.eventName +" for "+ orders);

}
async function createPickupJob(eventData){
    let param = {
        TableName: process.env.TABLE_NAME,
        Item: {
            jobId: uuidv4.v4(),
            jobStatus: 'CREATED',
            ...eventData
        }
    }
    await db.put(param)
}

/*
    
    eventObject = {
      version: '0',
      id: '89697858-10d2-60bb-e28b-921e35c51a73',
      'detail-type': 'BOPPIS - Order Updates',
      source: 'org.boppis.order',
      account: '260823268436',
      time: '2020-11-13T18:50:33Z',
      region: 'us-east-1',
      resources: [ 'b41f656e-bddf-42ac-80ca-e617c24d30c6' ],
      detail: {
        eventSource: 'org.boppis.order.action',
        eventName: 'ORDER_CREATED',
        eventData: [ [Object] ]
      }
}
*/