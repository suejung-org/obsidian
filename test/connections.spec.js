import { describe, expect, it, vi } from "vitest";

import { TCPServer } from "../packages/main/src/TCPServer.ts";

describe("TCPServer", () => {
  it("should return an error if the port is priviliged", () =>
    /** @type {Promise<void>} */ (
      new Promise((done) => {
        const onListening = vi.fn();
        const onConnection = vi.fn();
        const onServerError = vi.fn().mockImplementation((err) => {
          expect(err.message).toMatch(/EACCES/);
          done();
        });

        console.error = vi.fn();

        const server = new TCPServer(
          80,
          onListening,
          onConnection,
          onServerError,
        );
        server.listen();
      })
    ));
});
