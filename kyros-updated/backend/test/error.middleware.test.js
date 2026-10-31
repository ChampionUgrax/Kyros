const test = require("node:test");
const assert = require("node:assert/strict");

const errorHandler = require("../src/middleware/error.middleware");
const ApiError = require("../src/utils/ApiError");

const createResponse = () => ({
  statusCode: null,
  body: null,
  headersSent: false,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

test("returns the supplied status and message for expected errors", () => {
  const response = createResponse();
  const error = new ApiError(
    403,
    "You are not authorized to access this student"
  );

  errorHandler(error, {}, response, assert.fail);

  assert.equal(response.statusCode, 403);
  assert.deepEqual(response.body, {
    success: false,
    message: "You are not authorized to access this student",
  });
});

test("does not expose unexpected error details", () => {
  const response = createResponse();

  errorHandler(new Error("Firestore connection details"), {}, response, assert.fail);

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.body, {
    success: false,
    message: "Internal server error",
  });
});
