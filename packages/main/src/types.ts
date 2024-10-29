export interface INPSPayload {
  toBuffer(): Buffer;
  toString(): string;
}

export type TClientCallback = (data: Buffer) => void;

export type TErrorHandler = (error: Error) => void;

export interface KeypressEvent {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}

export type TTask = () => Promise<void> | void;

export interface IShardEntry {
  formatForWeb(): string;
}
