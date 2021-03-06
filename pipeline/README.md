# CICD pipeline for BOPIS!

The pipeline is created using [CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html). 

[Pipeline Architecture](./docs/images/pipeline.png)


- Follow the instruction to get CDK installed
- The pipeline scripts are in lib/pipeline-stack.ts. Configuration are in cdk.json
``` 
create a CDK.json
{
  "app": "npx ts-node --prefer-ts-exts bin/pipeline.ts",
  "context": {
    "@aws-cdk/core:enableStackNameDuplicates": "true",
    "aws-cdk:enableDiffNoFail": "true",
    "@aws-cdk/core:stackRelativeExports": "true",
    "@aws-cdk/aws-ecr-assets:dockerIgnoreSupport": true,
    "Environment": "dev",
     "sm-key-github-token": "github-token",
     "github-owner": "{OWNER}",
     "git-repo": "{github-repo}"

  }
}

```

- Create secret manager entry for git-token.
```
aws secretsmanager create-secret --name github-token --description "github webtoken" --secret-string "SECRET"

```
- Run the pipeline
```
npm install
npm run build
cdk deploy
```
