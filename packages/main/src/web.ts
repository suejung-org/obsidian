import { IncomingMessage, ServerResponse } from "node:http";
import { ShardService } from "./ShardService.js";
import { AuthenticationService } from "./AuthenticationService.js";
import { readFile } from "node:fs/promises";

/**
 *
 * @param {import("node:http").ServerResponse} res
 * @param {string} ticket
 */
function sendTicket(res: ServerResponse, ticket: string) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(`Valid=TRUE\nTicket=${ticket}`);
}

/**
 *
 * @param {import("node:http").ServerResponse} res
 * @param {number} statusCode
 * @param {string} message
 */

function sendError(res: ServerResponse, statusCode: number, message: string) {
  console.error(message);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain");
  res.end(
    `reasoncode=INV-200\nreasontext=${message}\nreasonurl=https://rusty-motors.com`
  );
}

/**
 * Sends a Castanet response.
 *
 * @param res - The server response object.
 */
function sendCastanetResponse(res: ServerResponse) {
  res.setHeader("Content-Type", "application/octet-stream");
  res.end(
    Buffer.from([
      0xca, 0xfe, 0xbe, 0xef, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,
    ])
  );
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
function homePage(req: IncomingMessage, res: ServerResponse) {
  res.end("Hello, world!");
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 * @param {string} username
 * @param {string} password
 */
function authLogin(
  req: IncomingMessage,
  res: ServerResponse,
  username: string,
  password: string
) {
  const userLoginService = new AuthenticationService();
  const customerId = userLoginService.authenticateUser(username, password);

  if (customerId === -1) {
    return sendError(res, 401, "Invalid username or password");
  }

  try {
    const token = userLoginService.generateToken(customerId);
    return sendTicket(res, token);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return sendError(res, 500, error.message);
    }
  }
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
function getShardList(req: IncomingMessage, res: ServerResponse) {
  const shardService = new ShardService();

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");

  res.end(shardService.getShardList());
}

/**
 * Retrieves the setup files based on the provided path and sends them as a response.
 * If the path is "/certificate", it sends the certificate file.
 * If the path is "/key", it sends the key file.
 * If the path is not recognized, it sends a 404 error.
 *
 * @param path - The path to determine which setup file to retrieve.
 * @param res - The ServerResponse object to send the setup file as a response.
 */
async function getSetupupFiles(path: string, res: ServerResponse) {
  if (path === "/certificate") {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.crt"
    );

    const certificate = await readFile("data/mcouniverse.crt");

    return res.end(certificate.toString().replace(/\n/g, "\r\n"));
  }

  if (path === "/key") {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", "attachment; filename=pub.key");

    const key = await readFile("data/pub.key");

    return res.end(key);
  }

  sendError(res, 404, "File not found");
}

/**
 * Logs the details of an incoming request.
 * @param req - The incoming request object.
 */
function logRequest(req: IncomingMessage) {
  console.log(`${req.method} ${req.url} from ${req.socket.remoteAddress}`);
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
function onWebRequest(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(`http://${process.env.HOST ?? "localhost"}${req.url}`);

  if (url.pathname === "/") {
    return homePage(req, res);
  }

  if (url.pathname.startsWith("/games/EA_Seattle/MotorCity/")) {
    logRequest(req);
    return sendCastanetResponse(res);
  }

  if (url.pathname.startsWith("/setup/")) {
    logRequest(req);
    return getSetupupFiles(url.pathname.substring(6), res);
  }

  if (url.pathname === "/AuthLogin") {
    logRequest(req);
    const username = url.searchParams.get("username") ?? "";
    const password = url.searchParams.get("password") ?? "";

    return authLogin(req, res, username, password);
  }

  if (url.pathname === "/ShardList/") {
    return getShardList(req, res);
  }
}

export { onWebRequest };
