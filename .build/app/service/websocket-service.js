"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.on_message = exports.on_disconnect = exports.on_connect = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const client_apigatewaymanagementapi_1 = require("@aws-sdk/client-apigatewaymanagementapi");
const client = new client_dynamodb_1.DynamoDBClient({});
const on_connect = (connectionId, user_name, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!connectionId)
            return;
        console.log(user_name, user_id);
        const command = new client_dynamodb_1.PutItemCommand({
            TableName: "Customers",
            Item: {
                Id: { S: connectionId },
                Uid: { S: user_id },
                Name: { S: user_name },
            },
        });
        //const res = await client.send(command);
        const res = true;
    }
    catch (e) {
        console.log("Error in on_connect", e.message);
    }
});
exports.on_connect = on_connect;
const on_disconnect = (connectionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!connectionId)
            return;
        const command = new client_dynamodb_1.DeleteItemCommand({
            TableName: "Customers",
            Key: {
                Uid: { S: connectionId },
            },
        });
        const res = yield client.send(command);
    }
    catch (e) {
        console.log("Error in on_disconnect", e.message);
    }
});
exports.on_disconnect = on_disconnect;
const on_message = (connectionId, body, callbackUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!connectionId)
            return;
        if (typeof body) {
            body = JSON.parse(body);
            console.log(body);
        }
        const { sender_id, sender_name, msg } = body;
        const command = new client_dynamodb_1.ScanCommand({
            TableName: "Customers",
        });
        const res = yield client.send(command);
        if (res && res.Items && res.Items.length) {
            yield Promise.all(res.Items.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const clientApi = new client_apigatewaymanagementapi_1.ApiGatewayManagementApiClient({
                        endpoint: callbackUrl,
                    });
                    const requestParams = {
                        ConnectionId: obj.Id.S,
                        Data: `{"sender_name":"${sender_name}","sender_id":"${sender_id}","msg":"${msg}"}`,
                    };
                    const command = new client_apigatewaymanagementapi_1.PostToConnectionCommand(requestParams);
                    const resApi = yield clientApi.send(command);
                }
                catch (e) {
                    console.log(e);
                }
            })));
        }
    }
    catch (e) {
        console.log("Error in on_message", e.message);
    }
});
exports.on_message = on_message;
//# sourceMappingURL=websocket-service.js.map