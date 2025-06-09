import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "pong!",
      user: event.requestContext.authorizer,
    }),
  };
};
