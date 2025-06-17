import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'

export class TaskApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const pingLambda = new lambda.Function(this, 'PingFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'ping.handler',
      code: lambda.Code.fromAsset('src/handlers'),
    })

    const registerLambda = new lambda.Function(this, 'RegisterFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'register.handler',
      code: lambda.Code.fromAsset('src/handlers/auth'),
    })

    const api = new apigateway.RestApi(this, 'TaskApi', {
      restApiName: 'Task Service',
      deployOptions: {
        stageName: 'dev',
      },
    })

    const ping = api.root.addResource('ping')
    ping.addMethod('GET', new apigateway.LambdaIntegration(pingLambda), {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Headers': true,
          },
        },
      ],
    })
    ping.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: ['*'],
    })

    const auth = api.root.addResource('auth')
    const register = auth.addResource('register')
    register.addMethod(
      'GET',
      new apigateway.LambdaIntegration(registerLambda),
      {
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Credentials': true,
              'method.response.header.Access-Control-Allow-Headers': true,
            },
          },
        ],
      }
    )

    register.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: ['*'],
    })
  }
}
