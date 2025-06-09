import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-lambda";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }
}

export class TaskApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 Define Lambda function
    const pingLambda = new lambda.Function(this, "PingFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "ping.handler",
      code: lambda.Code.fromAsset("src/handlers"),
    });

    // 👇 Define API Gateway
    const api = new apigateway.RestApi(this, "TaskApi", {
      restApiName: "Task Service",
    });

    // ✅ Connect the endpoint to the Lambda
    const ping = api.root.addResource("ping");
    ping.addMethod("GET", new apigateway.LambdaIntegration(pingLambda));
  }
}
