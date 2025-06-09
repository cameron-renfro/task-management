import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'

export class TaskApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Lambda function
    const pingLambda = new lambda.Function(this, 'PingFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'ping.handler', // file: ping.ts, function: handler
      code: lambda.Code.fromAsset('src/handlers'), // path to folder
    })

    // REST API
    const api = new apigateway.RestApi(this, 'TaskApi', {
      restApiName: 'Task Service',
      deployOptions: {
        stageName: 'dev',
      },
    })

    // /ping endpoint
    const ping = api.root.addResource('ping')
    ping.addMethod('GET', new apigateway.LambdaIntegration(pingLambda))
    ping.addCorsPreflight({
      allowOrigins: ['http://localhost:5173'],
      allowMethods: apigateway.Cors.ALL_METHODS, // Only the methods your frontend uses
      allowHeaders: ['Content-Type'], // Or ['*'] if you're using custom headers
    })
  }
}
