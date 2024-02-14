import { on_connect, on_disconnect, on_message } from "../service/websocket-service";
import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
    const {
        body,
        requestContext: { routeKey, connectionId, domainName, stage },
        queryStringParameters = {},
      } = event;
      switch (routeKey) {
        case "$connect":
          const { user_name, user_id } = queryStringParameters;
          await on_connect(connectionId, user_name, user_id);
          break;
        case "$disconnect":
          //await on_disconnect(connectionId);
          break;
        case "message":
          const callbackUrl = `https://${domainName}/${stage}`;
          await on_message(connectionId, body, callbackUrl);
          break;
        default:
          break;
      }
      console.log("RESPONSE!!!!!!!!!!!!!!!!!!!");
      const response = {
        statusCode: 200,
        body: JSON.stringify("success"),
      };
      return response;
};
