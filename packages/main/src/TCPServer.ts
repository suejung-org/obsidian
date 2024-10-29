// obsidian-spoon is a game server
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

import net from "node:net";
import type { TErrorHandler } from "./types.js";

export class TCPServer {
  port: number;
  server: net.Server;
  /**
   *
   * @param {number} port
   * @param {function(net.Server): void} onListening
   * @param {function(net.Socket): void} onConnection
   * @param {errorHandler} onServerError
   */
  constructor(
    port: number,
    onListening: (arg0: net.Server) => void,
    onConnection: (arg0: net.Socket) => void,
    onServerError: TErrorHandler
  ) {
    this.port = port;
    this.server = net.createServer(onConnection);
    this.server.on("error", onServerError);
    this.server.on("listening", () => {
      onListening(this.server);
    });
  }

  /**
   * Start the server listening on the configured port.
   */
  listen() {
    this.server.listen(this.port);
  }

  /**
   *
   * @param {errorHandler} onError
   * @returns {Promise<void>}
   */
  async close(onError: TErrorHandler): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          onError(err as Error);
          reject(err as Error);
        }
        resolve();
      });
    });
  }
}
