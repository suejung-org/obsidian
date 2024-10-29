import * as crypto from "crypto";

type UserCredentials = Array<{
  username: string;
  password: string;
  customerId: number;
}>;

const userCredentials: UserCredentials = [
  { username: "admin", password: "admin", customerId: 1 },
];
const authTokens: Map<string, number> = new Map();

export class AuthenticationService {
  /**
   * Checks if the provided username and password match a user in the system.
   * @param {string} username - The username to check.
   * @param {string} password - The password to check.
   * @returns {number} - The customer ID of the user if found, otherwise -1.
   */
  authenticateUser(username: string, password: string): number {
    const user = userCredentials.find(
      (user) => user.username === username && user.password === password,
    );

    return user ? user.customerId : -1;
  }

  /**
   * Generates a unique token for the given customer ID and stores it in the tokens map.
   * @param customerId - The ID of the customer.
   * @returns The generated token.
   */
  generateToken(customerId: number): string {
    if (customerId < 0) {
      throw new Error(`Invalid customer ID: ${customerId}`);
    }

    const token = crypto.randomUUID();
    authTokens.set(token, customerId);
    return token;
  }

  /**
   * Checks the validity of a token and returns the associated customer ID.
   * @param token - The token to be checked.
   * @returns The customer ID associated with the token, or -1 if the token is invalid.
   */
  getCustomerIdFromToken(token: string): number {
    const customerId = authTokens.get(token);
    return customerId ?? -1;
  }

  /**
   * Deletes a token from the collection.
   * @param {string} token - The token to be deleted.
   */
  removeToken(token: string): void {
    authTokens.delete(token);
  }

  /**
   * Deletes all tokens.
   * @returns A promise that resolves when all tokens are deleted.
   */
  async clearAllTokens(): Promise<void> {
    return new Promise((resolve) => {
      authTokens.clear();
      console.log("All tokens deleted");
      resolve();
    });
  }
}
