import { NPSMessagePayload } from "./NPSMessagePayload.js";
import { PackedSessionKey } from "./NPSUserLoginPayload.js";
import type { INPSPayload } from "./types.js";

class UserAction {


    
}

export class NPSUserStatusPayload
  extends NPSMessagePayload
  implements INPSPayload
{
    ban: UserAction = new UserAction();
    mute: UserAction = new UserAction();
    customerId: number;
    personaId: number;
    sessionKey: PackedSessionKey;

  constructor(sessionKey: PackedSessionKey) {
    super();
    this.customerId = -1;
    this.personaId = -1;
    this.sessionKey = sessionKey;
  }

  /**
   *
   * @param {number} len
   * @param {Buffer} data
   * @returns {NPSUserStatusPayload}
   */
  static parse(data: Buffer, len: number = data.length): NPSUserStatusPayload {
    throw new Error("Method not implemented.");
  }

  size(): number {
    throw new Error("Method not implemented.");
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
    return `Customer ID: ${this.customerId}, Session key: ${this.sessionKeyString}, Banned: ${this.isUserBanned}, Muted: ${this.isUserMuted}`;
  }
}
