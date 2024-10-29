/**
 * To be used as a base class for NPS message payloads.
 *
 * @implements {INPSPayload}
 * @class
 * @property {Buffer} data
 *
 * @example
 * class MyPayload extends NPSMessagePayload {
 *  constructor() {
 *      super();
 *      this.myProperty = 0;
 *  }
 *
 *  static parse(data) {
 *      this.myProperty = data.readUInt32LE(0);
 *  }
 *
 *  toBuffer() {
 *      const buffer = Buffer.alloc(4);
 *      buffer.writeUInt32LE(this.myProperty, 0);
 *      return buffer;
 *  }
 *
 *  toString() {
 *      return `MyPayload: ${this.myProperty}`;
 *  }
 * }
 */

export class NPSMessagePayload {
  data: Buffer;
  constructor() {
    this.data = Buffer.alloc(0);
  }

  /**
   *
   * @param {Buffer} data
   * @returns NPSMessagePayload
   */
  static parse(data: Buffer, len = data.length) {
    if (data.length !== len) {
      throw new Error(
        `Invalid payload length: ${data.length}, expected: ${len}`,
      );
    }
    const self = new NPSMessagePayload();
    self.data = data;
    return self;
  }

  /**
   * @returns Buffer
   */
  toBuffer() {
    return this.data;
  }

  /**
   * @returns string
   */
  toString() {
    return this.data.toString("hex");
  }
}
