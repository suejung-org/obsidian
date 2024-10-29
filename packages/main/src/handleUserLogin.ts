import { NPSUserLoginPayload } from "./NPSUserLoginPayload.js";
import fs from "node:fs";
import crypto from "node:crypto";
import type { TClientCallback } from "./types.js";
import { AuthenticationService } from "./AuthenticationService.js";
import { SessionService } from "./SessionService.js";
import { NPSMessage } from "./NPSMessage.js";

export function loadPrivateKey(path: string): string {
  const privateKey = fs.readFileSync(path);

  return privateKey.toString("utf8");
}

export function decryptSessionKey(
  encryptedSessionKey: string,
  privateKey: string
): string {
  const sessionKeyStructure = crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedSessionKey, "hex")
  );

  return sessionKeyStructure.toString("hex");
}

/**
 *
 * @param {import("./NPSUserLoginPayload.js").NPSUserLoginPayload} payload
 * @param {TClientCallback} clientCallback
 */
export function handleUserLogin(
  payload: NPSUserLoginPayload,
  clientCallback: TClientCallback
) {
  const userLoginPayload = payload;
  console.log(`User login: ${userLoginPayload.toString()}`);

  const privateKey = loadPrivateKey("data/private_key.pem");

  const sessionKey = decryptSessionKey(
    userLoginPayload.sessionKey.toString(),
    privateKey
  );

  console.log(`Session key: ${Buffer.from(sessionKey, "hex").toString("hex")}`);

  const key = sessionKey.slice(4, 4 + 64);

  console.log(`Key: ${Buffer.from(key, "hex").toString("hex")}`);

  const authenticator = new AuthenticationService();

  const customerId = authenticator.getCustomerIdFromToken(
    userLoginPayload.ticket
  );

  if (customerId === -1) {
    console.log("Invalid ticket, authentication failed");
    return;
  }

  const sessionService = new SessionService();

  sessionService.createSession(customerId, sessionKey);

  const response = new NPSMessage();
  response.setMessageId(0x601);
  response.setMessageVersion(257);

  console.log(`User ${customerId} logged in`);

  console.log(`Response: ${response.toBuffer().toString("hex")}`);

  clientCallback(response.toBuffer());
  response.setMessageId(0x601);
  clientCallback(response.toBuffer());
}
