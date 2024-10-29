import { NPSMessagePayload } from "./NPSMessagePayload.js";
import type { INPSPayload } from "./types.js";

export class PackedSessionKey {
  key: string;
  timestamp: number;

  constructor(bytes: Buffer) {
    this.key = bytes.toString("hex", 0, 16);
    this.timestamp = bytes.readUInt32BE(16);
  }
}

/**
 * @implements {INPSPayload}
 * @extends {NPSMessagePayload}
 * Payload for the NPSUserLogin message.
 */
export class NPSUserLoginPayload
  extends NPSMessagePayload
  implements INPSPayload
{
  ticket: string;
  sessionKey: Buffer;
  gameId: string;

  constructor() {
    super();
    this.data = Buffer.alloc(0);
    this.ticket = "";
    this.sessionKey = Buffer.alloc(0);
    this.gameId = "";
  }

  /**
   *
   * @param {number} len
   * @param {Buffer} data
   * @returns {NPSUserLoginPayload}
   */
  static parse(data: Buffer, len: number = data.length): NPSUserLoginPayload {
    if (data.length !== len) {
      throw new Error(
        `Invalid payload length: ${data.length}, expected: ${len}`,
      );
    }

    const self = new NPSUserLoginPayload();
    try {
      let offset = 0;
      let nextLen = data.readUInt16BE(0);
      self.ticket = data.toString("utf8", 2, nextLen + 2);
      offset = nextLen + 2;
      offset += 2; // Skip one empty word
      nextLen = data.readUInt16BE(offset);
      self.sessionKey = data.subarray(offset + 2, offset + 2 + nextLen);
      offset += nextLen + 2;
      nextLen = data.readUInt16BE(offset);
      self.gameId = data
        .subarray(offset + 2, offset + 2 + nextLen)
        .toString("utf8");
    } catch (error) {
      if (!(error instanceof Error)) {
        throw new Error(`Error parsing payload: ${error}`);
      }
      console.error(`Error parsing payload: ${error.message}`);
      throw new Error(`Error parsing payload: ${error.message}`);
    }

    return self;
  }

  /**
   * @returns {Buffer}
   */
  toBuffer(): Buffer {
    throw new Error("Method not implemented.");
  }

  /**
   * @returns {string}
   */
  toString(): string {
    return `Ticket: ${this.ticket}, SessionKey: ${this.sessionKey}, GameId: ${this.gameId}`;
  }
}
