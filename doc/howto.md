cd resources
sam deploy --stack-name boppis-vpc --capabilities CAPABILITY_IAM --region <<REGION>>
cd ..
cd orders
sam deploy --stack-name boppis-orders-db --capabilities CAPABILITY_IAM --region us-east-1 --template-file db.yml --parameter-overrides \
"DatabaseName=\"boppis\" ParentVPCStack=\"/boppis/dev/base-stack\" Environment=\"dev\" LogLevel=\"INFO\" RetentionInDays=\"7\" DatabaseInstanceType=\"db.t2.small\" DatabaseUsername=\"boppis\""

sam deploy --s3-bucket aws-sam-cli-managed-default-samclisourcebucket-qsdzmjzgr93z --stack-name boppis-order-app --capabilities CAPABILITY_IAM --region us-east-1 --template-file app.yml --parameter-overrides \

"Environment=\"dev\" LogLevel=\"INFO\" RetentionInDays=\"7\" ParentVPCStack=\"/boppis/dev/base-stack\" DBProxyEndpoint=\"/boppis/dev/order/dbproxyEndpoint\" DBUser=\"/boppis/dev/order/dbuser\" DBProxyARN=\"/boppis/dev/order/dbproxyArn\" DBName=\"/boppis/dev/order/db\" CUSTOMERUSERPOOL=\"/boppis/dev/customer-pool/id\" EMPLOYEEUSERPOOL=\"/boppis/dev/employee-pool/id\" CUSTOMERPOOLCLIENTID=\"/boppis/dev/customer-pool/client\" EMPLOYEEPOOLCLIENTID=\"/boppis/dev/employee-pool/client\" SENDEREMAIL=\"who@gmail.com\""

cd ..
cd product
sam deploy --s3-bucket aws-sam-cli-managed-default-samclisourcebucket-qsdzmjzgr93z --stack-name boppis-product --capabilities CAPABILITY_IAM --region us-east-1 --template-file template.yml --parameter-overrides \
"Environment=\"dev\" LogLevel=\"INFO\" RetentionInDays=\"7\" EventBusName=\"/boppis/dev/eventBusName\" EMPLOYEEUSERPOOL=\"/boppis/dev/employee-pool/id\" EMPLOYEEPOOLCLIENTID=\"/boppis/dev/employee-pool/client\""
cd ../pickup
sam deploy --s3-bucket aws-sam-cli-managed-default-samclisourcebucket-qsdzmjzgr93z --stack-name boppis-pickup --capabilities CAPABILITY_IAM --region us-east-1 --template-file template.yml --parameter-overrides \
"Environment=\"dev\" LogLevel=\"INFO\" RetentionInDays=\"7\" OrderEventBusName=\"/boppis/dev/eventBusName\" UtilityLayerName=\"UtilLayer\" UtilityLayerVersion=\"3\" EMPLOYEEUSERPOOL=\"/boppis/dev/employee-pool/id\" EMPLOYEEPOOLCLIENTID=\"/boppis/dev/employee-pool/client\""

npm install -g @aws-amplify/cli
cd retail-ui
amplify init
amplify import auth
Choose Cognito User pool Only

Choose CustomerUserPool-xxxxx
amplify push

You will see aws-exports.js under src folder

create a env.dev file

REACT_APP_ORDER_API = "https://ORDER.execute-api.us-east-1.amazonaws.com/Prod"
REACT_APP_PRODUCT_API = "https://PRODUCT.execute-api.us-east-1.amazonaws.com/Prod"
REACT_APP_API_RETRY = "2"


cd ..
cd pickup-ui
amplify init
amplify import auth
Choose Cognito User pool Only

Choose EmployeeUserPool_xxxxxxxxx
Choose employee3pool_app_clientWeb_xxxxx
amplify push

create a env.dev file
REACT_APP_ORDER_API = "https://ORDER.execute-api.us-east-1.amazonaws.com/Prod"
REACT_APP_PICKUP_API = "https://PICKUP.execute-api.us-east-1.amazonaws.com/Prod"
REACT_APP_API_RETRY = "2"


