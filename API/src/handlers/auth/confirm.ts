import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' })

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Received event 1:', event)
  try {
    const body = JSON.parse(event.body || '{}')
    console.log('🏃 Parsed body:', body)
    const { username, confirmationCode } = body

    if (!username || !confirmationCode) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Username and confirmation code are required',
        }),
      }
    }

    const command = new ConfirmSignUpCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID, // Ensure this is set in your environment
      Username: username,
      ConfirmationCode: confirmationCode,
    })

    await cognito.send(command)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User confirmed successfully' }),
    }
  } catch (error: unknown) {
    console.error('Error processing request:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }
  }
}
