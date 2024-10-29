import { NPSMessageHeader } from "./NPSMessageHeader.js";
import { NPSMessagePayload } from "./NPSMessagePayload.js";

/**
 * Class representing an NPS message.
 *
 * @property {NPSMessageHeader} _header
 * @property {NPSMessagePayload} data
 */
export class NPSMessage {
  _header: NPSMessageHeader;
  data: NPSMessagePayload;
  constructor() {
    this._header = new NPSMessageHeader();
    this.data = new NPSMessagePayload();
  }
  /**
   *
   * @param {Buffer} data
   * @returns {NPSMessage}
   */
  static parse(data: Buffer) {
    const self = new NPSMessage();
    if (data.length < 8) {
      throw new Error(`Invalid message length: ${data.length}`);
    }

    self._header = NPSMessageHeader.parse(data);

    const expectedLength = self._header.messageLength - self._header.dataOffset;

    self.data = NPSMessagePayload.parse(
      data.subarray(self._header.dataOffset),
      expectedLength,
    );

    return self;
  }

  /**
   * Sets the message ID of the NPSMessage.
   * @param messageId - The ID to set for the message.
   */
  setMessageId(messageId: number) {
    this._header.messageId = messageId;
  }

  /**
   * Sets the message version.
   * @param version - The version number to set.
   */
  setMessageVersion(version: number) {
    this._header.version = version;
    this._header._dataStart = version === 257 ? 12 : 6;
  }

  /**
   * @returns Buffer
   */
  toBuffer() {
    this._header.messageLength = this._header.dataOffset + this.data.toBuffer().length;
    return Buffer.concat([this._header.toBuffer(), this.data.toBuffer()]);
  }

  /**
   * @returns string
   */
  toString() {
    return `${this._header.toString()}, Data: ${this.data.toString()}`;
  }
}
