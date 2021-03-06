# BOPPIS-BackEnd

npm install -g aws-cdk
cdk init --language typescript
npm install --save @aws-cdk/aws-codedeploy @aws-cdk/aws-codebuild
npm install --save @aws-cdk/aws-codedeploy @aws-cdk/aws-codebuild
npm install --save @aws-cdk/aws-codecommit @aws-cdk/aws-codepipeline-actions
npm install --save @aws-cdk/aws-s3


aws cloudformation create-stack --stack-name boppis-base  --template-body file://template.yml 
aws cloudformation create-change-set --stack-name boppis-base --template-body file://template.yml --change-set-name changeset-1