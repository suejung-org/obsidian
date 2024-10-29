import { NPSMessage } from "./NPSMessage.js";
import { getPayloadHandler, getPayloadParser } from "./payloadMap.js";
import type { TClientCallback } from "./types.js";

/**
 * @param {number} port
 * @param {Buffer} data
 * @param {(data: Buffer) => void} sendToClient
 */
function onNPSData(port: number, data: Buffer, sendToClient: TClientCallback) {
  const message = NPSMessage.parse(data);
  console.log(`Received message on port ${port}: ${message.toString()}`);

  const messageType = getPayloadParser(message._header.messageId);

  if (!messageType) {
    console.error(`Unknown message type: ${message._header.messageId}`);
    return;
  }

  const payload = messageType(
    message.data.data,
    message._header.messageLength - message._header.dataOffset,
  );

  const handler = getPayloadHandler(message._header.messageId);

  if (!handler) {
    console.error(`Unknown message type: ${message._header.messageId}`);
    return;
  }

  handler(payload, sendToClient);
}

export { onNPSData };
