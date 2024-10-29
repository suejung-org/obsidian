// probable-spoon is a game server
// Copyright (C) 2024 Molly Crendraven

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { MainLoop } from "./MainLoop.js";
import { ShardService } from "./ShardService.js";
import { TCPServer } from "./TCPServer.js";
import { AuthenticationService } from "./AuthenticationService.js";
import { WebServer } from "./WebServer.js";
import { onNPSData } from "./nps.js";
import { onWebRequest } from "./web.js";
import * as crypto from "node:crypto";
import * as Sentry from "@sentry/node";
import * as net from "node:net";
import * as http from "node:http";
import { verifyLegacyCipherSupport } from "./encryption.js";

type TOnDataHandler = (
  port: number,
  data: Buffer,
  sendToClient: (data: Buffer) => void
) => void;

/**
 * @param {import("node:net").Socket} socket
 * @param {TOnDataHandler} onData
 */
function onSocketConnection(socket: net.Socket, onData: TOnDataHandler) {
  console.log("Connection established");

  const connectionId = crypto.randomUUID();

  Sentry.setTag("connection_id", connectionId);

  /**
   * Callback for sending data to the client.
   * @param {Buffer} data
   */
  const sendToClient = (data: Buffer) => {
    socket.write(data);
  };

  socket.on("data", (data) => {
    onData(socket.localPort ?? -1, data, sendToClient);
  });
}

/**
 *
 * @param {Error} err
 */
function onServerError(err: Error) {
  console.error(`Server error: ${err.message}`);
}

/**
 *
 * @param {Error | undefined} err
 */
function onClose(err?: Error) {
  if (err) {
    console.error(`Server close error: ${err.message}`);
  }
  console.log("Server closed");
}

/**
 *
 * @param {import("net").Server} s
 * @returns string
 */
function getPort(s: net.Server) {
  const address = s.address();
  if (address === null || typeof address === "string") {
    return String(address);
  }
  return String(address.port);
}

/**
 * @param {import("node:http").Server} s
 */
function onWebListening(s: http.Server) {
  const port = getPort(s);
  console.log(`Web server listening on port ${port}`);
  s.on("close", () => {
    console.log(`Server on port ${port} closed`);
  });
}

/**
 * @param {import("net").Server} s
 */
function onSocketListening(s: net.Server) {
  const port = getPort(s);

  console.log(`Server listening on port ${port}`);
  s.on("close", () => {
    console.log(`Server on port ${port} closed`);
  });
  s.on("error", (err: Error) => {
    console.error(`Server on port ${port} errored: ${err.message}`);
  });
}

/**
 *
 * @param {number} exitCode
 */
async function _atExit(exitCode = 0) {
  console.log("Goodbye, world!");
  process.exit(exitCode);
}

// === MAIN ===

function main() {
  process.on("exit", (code: number) => {
    console.log(`Server exited with code ${code}`);
  });

  console.log("Verifying legacy crypto support...");

  verifyLegacyCipherSupport();

  console.log("Starting obsidian...");
  const authServer = new WebServer(
    3000,
    onWebListening,
    onWebRequest,
    onServerError
  );
  const loginServer = new TCPServer(
    8226,
    onSocketListening,
    (socket: net.Socket) => onSocketConnection(socket, onNPSData),
    onServerError
  );
  const personaServer = new TCPServer(
    8228,
    onSocketListening,
    (socket: net.Socket) => onSocketConnection(socket, onNPSData),
    onServerError
  );

  const shardService = new ShardService();
  shardService.addShard(
    1,
    "Rusty Motors",
    "A test shard",
    "10.10.5.20",
    "Group - 1"
  );

  const userLoginService = new AuthenticationService();

  const mainLoop = new MainLoop();
  mainLoop.addTask("start", authServer.listen.bind(authServer));
  mainLoop.addTask("start", loginServer.listen.bind(loginServer));
  mainLoop.addTask("start", personaServer.listen.bind(personaServer));
  mainLoop.addTask("stop", authServer.close.bind(authServer, onClose));
  mainLoop.addTask("stop", loginServer.close.bind(loginServer, onServerError));
  mainLoop.addTask(
    "stop",
    personaServer.close.bind(personaServer, onServerError)
  );
  mainLoop.addTask(
    "stop",
    userLoginService.clearAllTokens.bind(userLoginService)
  );

  mainLoop.start();
}

export { main, _atExit, onServerError };
