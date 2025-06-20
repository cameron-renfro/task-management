import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as path from 'path'

export class TaskApiStack extends Stack {
  public readonly userPool: cognito.UserPool
  public readonly userPoolClient: cognito.UserPoolClient

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'MyAppUserPool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: true,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    })

    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
      },
    })

    // 📤 3. Output values
    new CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
    })

    new CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
    })

    const pingLambda = new NodejsFunction(this, 'PingFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'ping.handler',
      code: lambda.Code.fromAsset('src/handlers'),
    })

    const registerLambda = new NodejsFunction(this, 'RegisterFunction', {
      entry: path.join(__dirname, '../src/handlers/auth/register.ts'),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      environment: {
        USER_POOL_CLIENT_ID: this.userPoolClient.userPoolClientId,
        USER_POOL_ID: this.userPool.userPoolId,
      },
    })

    const confirmLambda = new NodejsFunction(this, 'ConfirmFunction', {
      entry: path.join(__dirname, '../src/handlers/auth/confirm.ts'),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      environment: {
        USER_POOL_CLIENT_ID: this.userPoolClient.userPoolClientId,
      },
    })

    const loginLambda = new NodejsFunction(this, 'LoginFunction', {
      entry: path.join(__dirname, '../src/handlers/auth/login.ts'),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      environment: {
        USER_POOL_CLIENT_ID: this.userPoolClient.userPoolClientId,
      },
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

    register.addMethod(
      'POST',
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

    const confirm = auth.addResource('confirm')
    confirm.addMethod('POST', new apigateway.LambdaIntegration(confirmLambda), {
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

    confirm.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: ['*'],
    })

    const login = auth.addResource('login')
    login.addMethod('POST', new apigateway.LambdaIntegration(loginLambda), {
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

    login.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: ['*'],
    })
  }
}
