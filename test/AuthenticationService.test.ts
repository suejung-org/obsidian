import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticationService } from "../packages/main/src/AuthenticationService.js";

describe("UserLoginService", () => {
  let userLoginService: AuthenticationService;

  beforeEach(() => {
    userLoginService = new AuthenticationService();
  });

  it("should authenticate a user with valid credentials", () => {
    const customerId = userLoginService.authenticateUser("admin", "admin");
    expect(customerId).toBe(1);
  });

  it("should not authenticate a user with invalid credentials", () => {
    const customerId = userLoginService.authenticateUser(
      "admin",
      "wrongpassword"
    );
    expect(customerId).toBe(-1);
  });

  it("should generate a token for a valid customer ID", () => {
    const token = userLoginService.generateToken(1);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should throw an error when generating a token with an invalid customer ID", () => {
    expect(() => {
      userLoginService.generateToken(-1);
    }).toThrowError("Invalid customer ID: -1");
  });

  it("should return the customer ID associated with a valid token", () => {
    const token = userLoginService.generateToken(1);
    const customerId = userLoginService.getCustomerIdFromToken(token);
    expect(customerId).toBe(1);
  });

  it("should return -1 for an invalid token", () => {
    const customerId = userLoginService.getCustomerIdFromToken("invalidtoken");
    expect(customerId).toBe(-1);
  });

  it("should remove a token from the collection", () => {
    const token = userLoginService.generateToken(1);
    userLoginService.removeToken(token);
    const customerId = userLoginService.getCustomerIdFromToken(token);
    expect(customerId).toBe(-1);
  });

  it("should clear all tokens", async () => {
    const token1 = userLoginService.generateToken(1);
    const token2 = userLoginService.generateToken(2);
    await userLoginService.clearAllTokens();
    const customerId1 = userLoginService.getCustomerIdFromToken(token1);
    const customerId2 = userLoginService.getCustomerIdFromToken(token2);
    expect(customerId1).toBe(-1);
    expect(customerId2).toBe(-1);
  });
});
