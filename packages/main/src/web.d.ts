/// <reference types="node" resolution-mode="require"/>
import { IncomingMessage, ServerResponse } from "node:http";
/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
declare function onWebRequest(req: IncomingMessage, res: ServerResponse): void;
export { onWebRequest };
