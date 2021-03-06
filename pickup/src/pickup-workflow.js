const db = require("/opt/dynamo");
const Validation = require("/opt/CustomError")

exports.handler = async (eventObject, context) => {
    console.log(eventObject)
    let jobId = eventObject.pathParameters.jobId;
    let action = eventObject.pathParameters.action;
    try {
        return await processWorkflow(jobId, action, JSON.parse(eventObject.body))

    } catch (error) {
        console.error(error);
        const response = {
            statusCode: 500,
            body: "We have a problem searching order at this time; Please try again"

        }
        if (error instanceof Validation) {
            response.statusCode = error.code;
            response.body = error.message;

        }

        return response;
    }

}
async function processWorkflow(jobId, action, body) {
    let job = await lookupJob(jobId)
    if (job.length == 0) {
        throw new Validation("404", "Job is not found")
    }
    if (body.associate && action === 'assign') {
        await updateStatus('ASSIGNED', jobId, body.associate)
        return "Job assigned";

    } else if (action === 'complete') {
        await updateStatus('COMPLETED', jobId)
        return "Job completed";
    } else {
        throw new Validation("400", "Action is invalid or associate is missing")
    }

}
async function lookupJob(jobId) {
    let param = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: '#jobId = :jobId',
        ExpressionAttributeValues: {
            ':jobId': jobId,
        },
        ExpressionAttributeNames: { "#jobId": "jobId" }
    }
    let response = await db.query(param);
    return response.Items;


}
async function updateStatus(status, jobId, associate) {
    let update = "set jobStatus = :status";
    let values = {
        ":status": status
    }
    if (associate) {
        update = update + " , associate = :associate"
        values[":associate"] = associate
    }

    let param = {
        TableName: process.env.TABLE_NAME,
        Key: { jobId: jobId },
        UpdateExpression: update,
        ExpressionAttributeValues: values
    }
    console.debug("db param ", param)
    await db.update(param);
}