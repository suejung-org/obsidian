import { NPSUserLoginPayload } from "./NPSUserLoginPayload.js";
import { handleUserLogin } from "./handleUserLogin.js";

/**
 * @typedef INPSPayload
 * @type {import("./NPSMessagePayload.js").INPSPayload}
 */
/** @type {Map<number, (data: Buffer, len: number) => INPSPayload>} */
const payloadParserMap = new Map();
payloadParserMap.set(1281, NPSUserLoginPayload.parse);

/** @type {Map<number, ((payload: INPSPayload, clientCallback: (data: Buffer) => void) => void) | undefined>} */
const payloadHandlerMap = new Map();
payloadHandlerMap.set(1281, handleUserLogin);

/**
 *
 * @param {number} messageId
 * @returns {((data: Buffer, len: number) => INPSPayload) | undefined}
 */
function getPayloadParser(messageId: number) {
  const payloadParser = payloadParserMap.get(messageId);

  if (!payloadParser) {
    console.error(`Unknown message type: ${messageId}, no parser found`);
    return;
  }

  return payloadParser;
}

/**
 *
 * @param {number} messageId
 * @returns {((payload: INPSPayload, clientCallback: (data: Buffer) => void) => void) | undefined}
 */
function getPayloadHandler(messageId: number) {
  const payloadHandler = payloadHandlerMap.get(messageId);

  if (!payloadHandler) {
    console.error(`Unknown message type: ${messageId}, no handler found`);
    return;
  }

  return payloadHandler;
}

export { getPayloadParser, getPayloadHandler };
