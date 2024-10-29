import { beforeEach, describe, expect, it } from "vitest";
import {
  SessionService,
  UserSession,
} from "../packages/main/src/SessionService.js";

describe("SessionService", () => {
  let sessionService: SessionService;

  beforeEach(() => {
    sessionService = new SessionService();
    sessionService.clearSessions();
  });

  it("should create a new session for the specified customer", () => {
    const customerId = 1;
    const sessionKey = "sessionKey123";

    sessionService.createSession(customerId, sessionKey);

    const session: UserSession = sessionService.getSession(customerId);
    expect(session.customerId).toBe(customerId);
    expect(session.sessionKey).toBe(sessionKey);
  });
  it("should retrieve the user session for the specified customer ID", () => {
    const customerId = 1;
    const sessionKey = "sessionKey123";
    const session: UserSession = { customerId, sessionKey };
    sessionService.createSession(customerId, sessionKey);

    const retrievedSession: UserSession = sessionService.getSession(customerId);

    expect(retrievedSession).toEqual(session);
  });

  it("should throw an error if the session is not found for the customer ID", () => {
    const customerId = 1;

    expect(() => sessionService.getSession(customerId)).toThrowError(
      `Session not found for customer ${customerId}`
    );
  });

  it("should delete the user session for the specified customer ID", () => {
    const customerId = 1;
    const sessionKey = "sessionKey123";
    sessionService.createSession(customerId, sessionKey);

    sessionService.deleteSession(customerId);

    expect(() => sessionService.getSession(customerId)).toThrowError(
      `Session not found for customer ${customerId}`
    );
  });
});
