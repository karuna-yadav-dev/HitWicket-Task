const WebSocket = require("ws");

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws, req) => {
  ws.on("message", async (message) => {
    ws.send("Reload");
  });
});

module.exports = wss;
