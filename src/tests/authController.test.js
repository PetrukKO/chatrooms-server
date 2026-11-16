const jwt = require("jsonwebtoken");
const auth = require("../services/auth");
const users = require("../services/user");

describe("comparePassword", () => {
  const hash = "$2b$10$3tKIq4UVYH2BVv91hROF6OQ/YeGs1/gcL6DDBSDQORXDPKdHvscwG";

  test("correct password", async () => {
    await expect(auth.comparePassword("111", hash)).resolves.toBe(true);
  });

  test("wrong password", async () => {
    await expect(auth.comparePassword("112", hash)).resolves.toBe(false);
  });
});

describe("hashPassword", () => {
  test("same password gets a different salt every time", async () => {
    const a = await users.hashPassword("secret");
    const b = await users.hashPassword("secret");
    expect(a).not.toEqual(b);
    await expect(auth.comparePassword("secret", a)).resolves.toBe(true);
    await expect(auth.comparePassword("secret", b)).resolves.toBe(true);
  });
});

describe("decodeToken", () => {
  test("returns payload", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InVzZXIiLCJjb2xvciI6IiMwMDAwMDAiLCJpYXQiOjE3MjY0Nzg2NzksImV4cCI6MTcyNjQ3ODk3OX0.cxV581wBJbR0PmGgXdejRO1bjH-5uEYSWyvTg-NetCI";
    expect(auth.decodeToken(token)).toEqual({
      color: "#000000",
      exp: 1726478979,
      iat: 1726478679,
      login: "user",
    });
  });

  test("works with a freshly signed token", () => {
    const token = jwt.sign({ login: "korech", color: "#ff0000" }, "test");
    expect(auth.decodeToken(token)).toMatchObject({
      login: "korech",
      color: "#ff0000",
    });
  });

  test("returns null for garbage", () => {
    expect(auth.decodeToken("not-a-token")).toBeNull();
    expect(auth.decodeToken(undefined)).toBeNull();
  });
});
