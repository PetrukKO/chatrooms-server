const { validationResult } = require("express-validator");
const {
  validateMessage,
  MAX_MESSAGE_LENGTH,
} = require("../middlewares/validators");

// runs validator chains against a fake request
async function validate(body) {
  const req = { body };
  for (const chain of validateMessage()) {
    await chain.run(req);
  }
  return { errors: validationResult(req), req };
}

describe("validateMessage", () => {
  test("accepts a normal message and trims it", async () => {
    const { errors, req } = await validate({ message: "  привіт  " });
    expect(errors.isEmpty()).toBe(true);
    expect(req.body.message).toBe("привіт");
  });

  test.each([
    ["missing", {}],
    ["empty", { message: "" }],
    ["only spaces", { message: "    " }],
    ["not a string", { message: { $gt: "" } }],
    ["too long", { message: "a".repeat(MAX_MESSAGE_LENGTH + 1) }],
  ])("rejects %s", async (_, body) => {
    const { errors } = await validate(body);
    expect(errors.isEmpty()).toBe(false);
  });
});
