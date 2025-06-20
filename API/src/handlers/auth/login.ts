import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import {
  CognitoIdentityProviderClient,
  AuthFlowType,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' })

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}')
    const { username, password } = body

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password are required' }),
      }
    }

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: process.env.USER_POOL_CLIENT_ID, // Ensure this is set in your environment
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })

    const response = await cognito.send(command)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User logged in successfully',
        accessToken: response.AuthenticationResult?.AccessToken,
        idToken: response.AuthenticationResult?.IdToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
      }),
    }
  } catch (err) {
    console.error('Login Error:', err)
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Login failed 😩',
        error: ((err as Error).message as unknown as Error) || 'Unknown Error',
      }),
    }
  }
}
