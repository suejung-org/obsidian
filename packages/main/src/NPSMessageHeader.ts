/**
 * Class representing an NPS message header.
 */
export class NPSMessageHeader {
  _dataStart: number;
  messageId: number;
  messageLength: number;
  version: number;
  constructor() {
    this._dataStart = 6;
    this.messageId = -1;
    this.messageLength = 6;
    this.version = 0;
  }

  /**
   *
   * @param {Buffer} data
   * @returns NPSMessageHeader
   */
  static parse(data: Buffer) {
    const self = new NPSMessageHeader();
    if (data.length < 6) {
      throw new Error("Invalid header length");
    }
    self.messageId = data.readUInt16BE(0);
    self.messageLength = data.readUInt16BE(2);

    self.version = data.readUInt16BE(4);

    if (self.version === 257) {
      self._dataStart = 12;
    } else {
      self._dataStart = 6;
    }

    return self;
  }

  get dataOffset() {
    return this._dataStart;
  }

  /**
   * @private
   * @returns Buffer
   */
  _writeExtraData() {
    const buffer = Buffer.alloc(6);
    buffer.writeUInt16BE(0, 0);
    buffer.writeUInt32BE(this.messageLength, 2);
    return buffer;
  }

  /**
   * @returns Buffer
   */
  toBuffer() {

    if (this.messageId === -1 || this.messageLength === -1 || this.version === -1) {
      throw new Error("Invalid header");
    }

    const buffer = Buffer.alloc(6);
    buffer.writeUInt16BE(this.messageId, 0);
    buffer.writeUInt16BE(this.messageLength, 2);
    buffer.writeUInt16BE(this.version, 4);

    if (this.version === 257) {
      return Buffer.concat([buffer, this._writeExtraData()]);
    }
    return buffer;
  }

  /**
   * @returns string
   */
  toString() {
    return `ID: ${this.messageId}, Length: ${this.messageLength}, Version: ${this.version}`;
  }
}
