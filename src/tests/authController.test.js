const userControllers = require("../controllers/userControllers");
const authControllers = require("../controllers/authControllers");

describe("comparePassword", () => {
  test("true", () => {
    return userControllers
      .comparePassword(
        "111",
        "$2b$10$3tKIq4UVYH2BVv91hROF6OQ/YeGs1/gcL6DDBSDQORXDPKdHvscwG"
      )
      .then((res) => {
        expect(res).toBe(true);
      });
  });

  test("false", () => {
    return userControllers
      .comparePassword(
        "112",
        "$2b$10$3tKIq4UVYH2BVv91hROF6OQ/YeGs1/gcL6DDBSDQORXDPKdHvscwG"
      )
      .then((res) => {
        expect(res).toBe(false);
      });
  });
});

describe("Decode token payload", () => {
  test("user", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InVzZXIiLCJjb2xvciI6IiMwMDAwMDAiLCJpYXQiOjE3MjY0Nzg2NzksImV4cCI6MTcyNjQ3ODk3OX0.cxV581wBJbR0PmGgXdejRO1bjH-5uEYSWyvTg-NetCI";
    expect(authControllers.decodeToken(token)).toEqual({
      color: "#000000",
      exp: 1726478979,
      iat: 1726478679,
      login: "user",
    });
  });
});

/* describe("Join & exit rooms", () => {
  test("join", () => {
    expect(
      userControllers.joinRoom("user", "66e96b2d7bd8ce418d2b3abd")
    ).toEqual({
      login: "user",
      color: "#000000",
      room: "room",
    });
  });
}); */
