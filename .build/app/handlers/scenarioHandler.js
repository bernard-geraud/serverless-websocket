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
exports.handler = void 0;
const websocket_service_1 = require("../service/websocket-service");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, requestContext: { routeKey, connectionId, domainName, stage }, queryStringParameters = {}, } = event;
    switch (routeKey) {
        case "$connect":
            const { user_name, user_id } = queryStringParameters;
            yield (0, websocket_service_1.on_connect)(connectionId, user_name, user_id);
            break;
        case "$disconnect":
            //await on_disconnect(connectionId);
            break;
        case "message":
            const callbackUrl = `https://${domainName}/${stage}`;
            yield (0, websocket_service_1.on_message)(connectionId, body, callbackUrl);
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
});
exports.handler = handler;
//# sourceMappingURL=scenarioHandler.js.map