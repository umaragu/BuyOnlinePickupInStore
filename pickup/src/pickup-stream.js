const events = require('/opt/events');
const AWS = require("aws-sdk"); 

exports.handler = async(eventObject, context) => {

    let records = eventObject.Records;
                console.log(JSON.stringify(records))

    for(let record of records) {

        console.log("Pickup Job Stream for " + record.eventName)
        let newImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
        console.log(newImage);
        if(record.eventName === 'INSERT'){
            await events.fireEvent(newImage, "PICKUP_JOB_CREATED", "pickup");

        } else if(record.eventName === 'MODIFY') {
            let jobStatus = newImage.jobStatus;
            if(record.dynamodb.OldImage.jobStatus && jobStatus != record.dynamodb.OldImage.jobStatus.S) {
                if(jobStatus === 'ASSIGNED')
                    await events.fireEvent(newImage, "PICKUP_JOB_ASSIGNED", "pickup");
                else if(jobStatus === 'COMPLETED')
                   await events.fireEvent(newImage, "PICKUP_JOB_COMPLETED", "pickup");
            }
        }
    }
}