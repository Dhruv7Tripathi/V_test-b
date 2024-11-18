import WebSocketServer from "ws";
const wss = new WebSocketServer.Server({ port: 8080 });
let senderSocket: WebSocketServer | null = null;
let receiverSocket: WebSocketServer | null = null;
wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  ws.on("message", function (data: any) {
    const message = JSON.parse(data);
    if (message.type === "sender") {
      console.log("Sender connected");
      senderSocket = ws;
    } else if (message.type === "receiver") {
      console.log("Receiver connected");
      receiverSocket = ws;
    }
    else if (message.type === "createOffer") {
      if (ws !== senderSocket) {
        return;
      }
      console.log("Creating offer");
      receiverSocket?.send(JSON.stringify({ type: "createOffer", sdp: message.sdp }));
    }
    else if (message.type === "createAnswer") {
      if (ws !== receiverSocket) {
        return;
      }
      console.log("Creating answer");
      senderSocket?.send(JSON.stringify({ type: "createAnswer", sdp: message.sdp }));
    }
    else if (message.type === "iceCandidate") {
      if (ws === senderSocket) {
        receiverSocket?.send(JSON.stringify({ type: "iceCandidate", candidate: message.candidate }));
      } else if (ws === receiverSocket) {
        senderSocket?.send(JSON.stringify({ type: "iceCandidate", candidate: message.candidate }));
      }
    }
  });
  ws.send("Something");
});