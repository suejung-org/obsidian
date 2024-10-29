/**
 * Represents a user session.
 */
export type UserSession = {
  customerId: number;
  sessionKey: string;
};

const  sessions: Map<number, UserSession> = new Map();

/**
 * Service for managing user sessions.
 */
export class SessionService {

  /**
   *
   * @param {number} customerId
   * @param {string} sessionKey
   */
/**
 * Creates a new session for the specified customer.
 * @param customerId - The ID of the customer.
 * @param sessionKey - The session key.
 */
  public createSession(customerId: number, sessionKey: string): void {
    sessions.set(customerId, { customerId, sessionKey });

    console.log(`Session created for customer ${customerId}`);
  }

/**
 * Retrieves the user session for the specified customer ID.
 * @param customerId - The ID of the customer.
 * @returns The user session for the specified customer ID.
 * @throws Error if the session is not found for the customer ID.
 */
  public getSession(customerId: number): UserSession {
    console.log(`Session retrieved for customer ${customerId}`);
    const session = sessions.get(customerId);

    if (!session) {
      throw new Error(`Session not found for customer ${customerId}`);
    }

    return session;
  }


/**
 * Deletes a session for the specified customer.
 * @param customerId - The ID of the customer whose session needs to be deleted.
 */
  public deleteSession(customerId: number): void {
    sessions.delete(customerId);
    console.log(`Session deleted for customer ${customerId}`);
  }

/**
 * Clears all sessions.
 */
  public clearSessions(): void {
    sessions.clear();
  }
}
