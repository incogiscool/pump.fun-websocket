const WebSocket = require("ws");

const websocketLink =
  "wss://frontend-api.pump.fun/socket.io/?EIO=4&transport=websocket";

const ws = new WebSocket(websocketLink, {
  perMessageDeflate: false,
});

ws.on("open", () => {
  console.log("connected");
  ws.send("40");
  console.log("initialized connection");
});

ws.on("message", (data) => {
  // convert buffer to string
  const message = data.toString();

  // Use regex to match the number (e.g., 42) and JSON separately
  const match = message.match(/^(\d+)(.*)$/);

  if (match) {
    const messageNumber = match[1]; // The number part (e.g., "42")
    const jsonString = match[2]; // The JSON part (e.g., '["tradeCreated", {...}]')

    // Parse the JSON part if it's valid
    try {
      const json = JSON.parse(jsonString);
      console.log("Message Number:", messageNumber); // Logs the number (e.g., 42)
      //   console.log("JSON Data:", json); // Logs the parsed JSON
      const data = json[1];
      console.log(data);
    } catch (err) {
      console.log("Failed to parse JSON:", message);

      try {
        const num = parseInt(messageNumber);
        console.log("Message Number:", num);

        ws.send(num + 1);
      } catch (err) {
        console.error("Failed to parse message number:", err);
      }
    }
  } else {
    console.error("Message format not recognized");
  }
});
