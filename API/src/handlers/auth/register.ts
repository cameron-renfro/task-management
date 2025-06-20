import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' })

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Env Client ID:', process.env.USER_POOL_CLIENT_ID)
  console.log('Received event 1:', event)
  try {
    const body = JSON.parse(event.body || '{}')
    const { email, password } = body

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password are required' }),
      }
    }

    const command = new SignUpCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID, // Ensure this is set in your environment
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    })

    await cognito.send(command)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User registered successfully' }),
    }
  } catch (error: unknown) {
    console.error('Error processing request:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }
  }
}
