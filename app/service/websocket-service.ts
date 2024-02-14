import {
    PutItemCommand,
    DeleteItemCommand,
    ScanCommand,
    DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
  import {
    ApiGatewayManagementApiClient,
    PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

const client = new DynamoDBClient({});

export const on_connect = async (connectionId: string, user_name: string, user_id: string) => {
    try {
        if (!connectionId) return;
        console.log(user_name, user_id);
        const command = new PutItemCommand({
            TableName: "Customers",
            Item: {
                Id: { S: connectionId },
                Uid: { S: user_id },
                Name: { S: user_name },
            },
        });
        //const res = await client.send(command);
        const res = true;
    } catch (e) {
        console.log("Error in on_connect", e.message);
    }
};

export const on_disconnect = async (connectionId: string) => {
    try {
      if (!connectionId) return;
  
      const command = new DeleteItemCommand({
        TableName: "Customers",
        Key: {
          Uid: { S: connectionId },
        },
      });
      const res = await client.send(command);
    } catch (e) {
      console.log("Error in on_disconnect", e.message);
    }
};

export const on_message = async (connectionId: string, body: any, callbackUrl: string) => {
    try {
      if (!connectionId) return;
  
      if (typeof body) {
        body = JSON.parse(body);
        console.log(body);
      }
      const { sender_id, sender_name, msg } = body;
  
      const command = new ScanCommand({
        TableName: "Customers",
      });
      const res = await client.send(command);
      if (res && res.Items && res.Items.length) {
        await Promise.all(
          res.Items.map(async (obj) => {
            try {
              const clientApi = new ApiGatewayManagementApiClient({
                endpoint: callbackUrl,
              });
              const requestParams = {
                ConnectionId: obj.Id.S,
                Data: `{"sender_name":"${sender_name}","sender_id":"${sender_id}","msg":"${msg}"}`,
              };
              const command = new PostToConnectionCommand(requestParams);
              const resApi = await clientApi.send(command);
            } catch (e) {
              console.log(e);
            }
          })
        );
      }
    } catch (e) {
      console.log("Error in on_message", e.message);
    }
};
