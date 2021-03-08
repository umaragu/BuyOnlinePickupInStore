var AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
var eventbridge = new AWS.EventBridge();

async function fireEvent(eventData, eventName, source) {
    
    const mapping = eventMapping[source];
    let resources = [];
    let data = (Array.isArray(eventData)) ? eventData :[eventData]
    for(let d of data) {
      if(!resources[d.orderId])
        resources.push(d.orderId)
    }
    const params = {
      Entries: [ /* required */
        {
          Detail: JSON.stringify({
              eventSource: mapping.eventSource,
              eventName: eventName,
              eventData: data
              }),
          Resources:resources,
          DetailType: mapping.DetailType,
          EventBusName: process.env.ORDER_EVENT_BUS_NAME,
          Source: mapping.Source,
          Time: new Date()
        },
        /* more items */
      ]
    };
    await eventbridge.putEvents(params).promise();
    console.log("Event fired for ", resources);

}
module.exports.fireEvent = fireEvent;
const eventMapping = {
    order: {
        DetailType:  'BOPPIS - Order Updates',
        Source: 'org.boppis.order',
        eventSource: "org.boppis.order.action"
    },
    pickup: {
        DetailType:  'BOPPIS - Pickup Updates',
        Source: 'org.boppis.pickup',
        eventSource: "org.boppis.pickup.action"
    }

}