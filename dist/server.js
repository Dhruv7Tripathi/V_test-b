"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('open', () => {
        console.log("Ws in connected...");
    });
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        if (message.type === 'videoSender') {
            console.log("sender added");
            senderSocket = ws;
        }
        else if (message.type === 'videoReceiver') {
            console.log("receiver added");
            receiverSocket = ws;
        }
        else if (message.type === 'videoCreateOffer') {
            if (ws !== senderSocket) {
                return;
            }
            console.log("sending offer");
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'videoCreateOffer', sdp: message.sdp }));
        }
        else if (message.type === 'videoCreateAnswer') {
            if (ws !== receiverSocket) {
                return;
            }
            console.log("sending answer");
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'videoCreateAnswer', sdp: message.sdp }));
        }
        else if (message.type === 'iceCandidate') {
            console.log("sending ice candidate");
            if (ws === senderSocket) {
                console.log("sender ice candidate");
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'videoIceCandidate', candidate: message.candidate }));
            }
            else if (ws === receiverSocket) {
                console.log("receiver ice candidate");
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'videoIceCandidate', candidate: message.candidate }));
            }
        }
    });
});
