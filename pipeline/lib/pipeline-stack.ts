import * as cdk from '@aws-cdk/core';
import s3 = require('@aws-cdk/aws-s3');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
const iam = require("@aws-cdk/aws-iam");
import {IRole, Role} from '@aws-cdk/aws-iam';
import codebuild = require('@aws-cdk/aws-codebuild');

import * as pipelines from '@aws-cdk/pipelines';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { ImagePullPrincipalType } from '@aws-cdk/aws-codebuild';

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket", {versioned:true});
    const secret = SecretValue.secretsManager(this.node.tryGetContext('sm-key-github-token'));
    new codebuild.GitHubSourceCredentials(this, 'GithubCredentials', {
      accessToken: secret,
    })




    // role.addToPolicy(new iam.PolicyStatement({
    //   resources: ['*'],
    //   actions: ['cloudformation:DescribeStacks', 'cloudformation:createStack', 'cloudformation:updateStack', 'cloudformation:deleteStack', 'cloudformation:createUpdateBucket'],
    // }));
    const cbRole = this.createCodeBuildRole(artifactsBucket);
    const cfRole = this.createCloudFormationRole(artifactsBucket);
    const cpRole = this.createCodePipelineRole(artifactsBucket, cfRole.roleArn);
    //const eventRole = iam.Role.fromRoleArn(this, "service", cpRole);

    this.createCodeBuild(artifactsBucket, "boppis-base-project", "resources", cbRole.roleArn );
    this.createCodeBuild(artifactsBucket, "boppis-product-project", "product", cbRole.roleArn );
    this.createCodeBuild(artifactsBucket, "boppis-orders-project", "orders", cbRole.roleArn );
    this.createCodeBuild(artifactsBucket, "boppis-pickup-project", "pickup", cbRole.roleArn );

    this.createPipeline(scope, artifactsBucket, "resources", ["packaged.yml"], ["boppis-base"],cpRole.roleArn, cfRole.roleArn);

    this.createPipeline(scope, artifactsBucket, "orders", ["db-packaged.yml", "app-packaged.yml"],["boppis-order-db", "boppis-order-app"], cpRole.roleArn, cfRole.roleArn);
    // //Create pipeline for orderservice
    this.createPipeline(scope, artifactsBucket, "product", ["packaged.yml"], ["boppis-product"], cpRole.roleArn, cfRole.roleArn);

    this.createPipeline(scope, artifactsBucket, "pickup", ["packaged.yml"], ["boppis-pickup"], cpRole.roleArn, cfRole.roleArn);


  }

  createCodeBuild(artifactsBucket: s3.Bucket, projectname:string, service: string, roleArn: string){
    const eventRole = iam.Role.fromRoleArn(this, "eventbuild"+service, roleArn);

    return new codebuild.Project(this, projectname , {
      source: this.createSource("codebuild"+service),
      environmentVariables: {
        'ENV': { type: codebuild.BuildEnvironmentVariableType.PLAINTEXT, value: this.node.tryGetContext('Environment') },
        'PACKAGE_BUCKET': {
          value: artifactsBucket.bucketName
        },
      }, 
      buildSpec: codebuild.BuildSpec.fromSourceFilename(service+"/buildspec.yml"),
      role: eventRole,
      artifacts: codebuild.Artifacts.s3({
        bucket: artifactsBucket,
        includeBuildId: false,
        packageZip: true,
        path: "codebuild/source/",
        identifier: 'Artifact1',
        name: service+".zip"
      }),
      

      // remaining Project parameters here...
    });
  }
  createCodePipelineRole(artifactsBucket: s3.Bucket, cfRole: string) {

    const passRole = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "sts:AssumeRole",
        "iam:PassRole"
      ],
      resources: [cfRole]
    });
    const cfPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "cloudformation:Describe*",
        "cloudformation:create*",
        "cloudformation:update*",
        "cloudformation:delete*",
        "cloudformation:createUpdateBucket",
        "cloudformation:ExecuteChangeSet"

      ],
      resources: ['*']
    });

    const codeDeployscfPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "codedeploy:CreateDeployment",
        "codedeploy:GetApplicationRevision",
        "codedeploy:GetDeployment",
        "codedeploy:GetDeploymentConfig",
        "codedeploy:RegisterApplicationRevision",

      ],
      resources: ['*']
    });
    const s3cfPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "s3:Get*",
        "s3:GetObjectVersion",
        "s3:GetBucketVersioning",
        "s3:Put*",
        "s3:Delete*"

      ],
      resources: ['*']
    });

    const cpRole = new iam.Role(this, 'cp-role', {
      assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
      inlinePolicies: {
        codebuild: new iam.PolicyDocument({
          statements: [cfPolicy, passRole, codeDeployscfPolicy,s3cfPolicy]
        }
        ),
      }

    });
    return cpRole;

  }
  createCloudFormationRole(artifactsBucket: s3.Bucket) {
    const iamaccesspolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:PutRolePolicy",
        "iam:PassRole",
        "iam:DetachRolePolicy",
        "iam:ListRolePolicies",
        "iam:GetRole*",
        "iam:DeleteRolePolicy",
        "iam:UpdateRoleDescription",
        "iam:ListRoles",
        "iam:DeleteRole",
        "iam:CreateInstanceProfile",
        "iam:AddRoleToInstanceProfile",
        "iam:DeleteInstanceProfile",
        "iam:GetInstanceProfile",
        "iam:ListInstanceProfiles",
        "iam:ListInstanceProfilesForRole",
        "iam:RemoveRoleFromInstanceProfile"
      ],
      resources: ['*']
    });
    const cfRolePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "ssm:GetParameter*",
        "ssm:PutParameter*",
        "ssm:DeleteParameter*",
        "codedeploy:*",
        "lambda:*",
        "ec2:*",
        "rds:*",
        "cognito-idp:*",
        "SecretsManager:*",
        "sns:*",
        "events:*",
        "logs:*",
        "dynamodb:*",
        "s3:*"
      ],
      resources: ['*']
    });

    const cfRole = new iam.Role(this, 'cf-pass-role', {
      assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
      inlinePolicies: {
        coloudformation_assume_policy: new iam.PolicyDocument({
          statements: [iamaccesspolicy, cfRolePolicy]
        }
        ),
      }
    });

    return cfRole;

  }

  createCodeBuildRole(artifactsBucket: s3.Bucket) {
    const codeBuildPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "codebuild:BatchGetReports",
        "codebuild:DescribeTestCases",
        "codebuild:ListReportGroups",
        "codebuild:CreateReportGroup",
        "codebuild:CreateReport",
        "codebuild:BatchPutTestCases",
        "codebuild:UpdateReport",
      ],
      resources: ['*']
    });
    const codeBuilds3Policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "s3:PutObject",
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketAcl",
        "s3:GetBucketLocation"
      ],
      resources: [artifactsBucket.bucketArn]
    });
    const codeBuildslogPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ec2:*",
        "s3:*"
      ],
      resources: ['*']
    });

    const role = new iam.Role(this, 'codebuild-role', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      inlinePolicies: {
        codebuild: new iam.PolicyDocument({
          statements: [codeBuildPolicy, codeBuildslogPolicy, codeBuilds3Policy]
        }
        ),
      }

    });
    return role;

  }
  createSource(modulePath: string): codebuild.Source {
    const repo = this.node.tryGetContext('git-repo');
    const owner = this.node.tryGetContext('github-owner');
    const source = codebuild.Source.gitHub({
      owner: owner,
      repo: repo,
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('master').andFilePathIs(modulePath),

      ]
    });

    return source;
  }

  createPipeline(scope: cdk.Construct, artifactsBucket: s3.Bucket, service: string, packageFiles: Array<string>, stacks: Array<string>, cpRole: string, cfRole: string) {

    console.log(cfRole)
    console.log(cpRole)

    const eventRole = iam.Role.fromRoleArn(this, service, cpRole);

    const pipeline = new codepipeline.Pipeline(this, service + "-pipeline", {
      artifactBucket: artifactsBucket
      //role:  eventRole
    });

    const sourceOutput = new codepipeline.Artifact();


    const sourceAction = new codepipeline_actions.S3SourceAction({
      actionName: 'S3Source',
      bucket: artifactsBucket,
      bucketKey: 'codebuild/source/'+service+".zip",
      output: sourceOutput,
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [
        sourceAction,
      ],
    });
    const role = iam.Role.fromRoleArn(this, service + "-cf-role", cfRole)

    let i = 0;
    for (let s of packageFiles) {
      const stackName = stacks[i]+"-" +this.node.tryGetContext('Environment');
      let config = stacks[i] + ".json";
      pipeline.addStage({
        stageName: stacks[i] + '-Deploy',
        actions: [
          new codepipeline_actions.CloudFormationCreateReplaceChangeSetAction({
            actionName: 'CreateChangeSet',
            templatePath: sourceOutput.atPath(s),
            stackName: stackName,
            adminPermissions: true,
            changeSetName: stackName + "-changeset",
            templateConfiguration:  sourceOutput.atPath(config),
            runOrder: 1
          }),
          new codepipeline_actions.CloudFormationExecuteChangeSetAction({
            actionName: 'Deploy',
            stackName:stackName,
            changeSetName: stackName + "-changeset",
            runOrder: 2
          }),
        ],

      });
      i++;
    }

    // The code that defines your stack goes here

  }
}
    // Declare a new CodeBuild project
    // const buildProject = new codebuild.PipelineProject(this, service + "-build", {
    //   environment: { buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2 },
    //   environmentVariables: {
    //     'PACKAGE_BUCKET': {
    //       value: artifactsBucket.bucketName
    //     },
    //     'ENV':this.node.tryGetContext('Environment')
    //   },
    //   buildSpec: codebuild.BuildSpec.fromSourceFilename(service + "/buildspec.yml")
    // });

    // // Add the build stage to our pipeline
    // pipeline.addStage({
    //   stageName: 'Build',
    //   actions: [
    //     new codepipeline_actions.CodeBuildAction({
    //       actionName: 'Build',
    //       project: buildProject,
    //       input: sourceOutput,
    //       outputs: [buildOutput],
    //     }),
    //   ],
    // });
