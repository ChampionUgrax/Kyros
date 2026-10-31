const test = require("node:test");
const assert = require("node:assert/strict");

const validateBody = require("../src/middleware/validate.middleware");
const {
  startFocusSessionSchema,
  endFocusSessionParamsSchema,
} = require("../src/modules/focus/focus.validation");
const {
  createActivitySchema,
} = require("../src/modules/activity/activity.validation");
const {
  updateUserProfileSchema,
} = require("../src/modules/users/user.validation");
const {
  redeemParentInviteSchema,
} = require("../src/modules/parent/parent.validation");
const {
  studentUidParamsSchema,
} = require("../src/modules/school/school.validation");

const createResponse = () => ({
  statusCode: null,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const validate = (schema, value, location = "body") => {
  const request = { body: {}, params: {} };
  request[location] = value;
  const response = createResponse();
  let nextCalled = false;

  validateBody(schema, location)(request, response, () => {
    nextCalled = true;
  });

  return { request, response, nextCalled };
};

test("accepts and normalizes a focus-session payload", () => {
  const result = validate(startFocusSessionSchema, {
    subject: "  Mathematics  ",
    goal: "  Complete chapter 5  ",
    ignoredField: "not persisted",
  });

  assert.equal(result.nextCalled, true);
  assert.deepEqual(result.request.body, {
    subject: "Mathematics",
    goal: "Complete chapter 5",
  });
});

test("rejects browser activity with an invalid duration", () => {
  const result = validate(createActivitySchema, {
    domain: "youtube.com",
    durationSeconds: -1,
  });

  assert.equal(result.nextCalled, false);
  assert.equal(result.response.statusCode, 400);
  assert.equal(result.response.body.success, false);
  assert.equal(result.response.body.message, "Invalid request data");
  assert.equal(result.response.body.errors[0].field, "durationSeconds");
});

test("requires a domain when recording browser activity", () => {
  const result = validate(createActivitySchema, {
    durationSeconds: 30,
  });

  assert.equal(result.nextCalled, false);
  assert.equal(result.response.statusCode, 400);
  assert.equal(result.response.body.errors[0].field, "domain");
});

test("normalizes the profile name before it is persisted", () => {
  const result = validate(updateUserProfileSchema, {
    name: "  KYROS Student  ",
  });

  assert.equal(result.nextCalled, true);
  assert.deepEqual(result.request.body, { name: "KYROS Student" });
});

test("rejects focus-session IDs that are invalid Firestore document paths", () => {
  const result = validate(
    endFocusSessionParamsSchema,
    { sessionId: "session/other" },
    "params"
  );

  assert.equal(result.nextCalled, false);
  assert.equal(result.response.statusCode, 400);
  assert.equal(result.response.body.errors[0].field, "sessionId");
});

test("requires a well-formed parent invite code before redemption", () => {
  const result = validate(redeemParentInviteSchema, { code: "not-a-code" });

  assert.equal(result.nextCalled, false);
  assert.equal(result.response.statusCode, 400);
  assert.equal(result.response.body.errors[0].field, "code");
});

test("rejects unsafe student UID document paths for school assignment", () => {
  const result = validate(
    studentUidParamsSchema,
    { studentUid: "student/other" },
    "params"
  );

  assert.equal(result.nextCalled, false);
  assert.equal(result.response.statusCode, 400);
  assert.equal(result.response.body.errors[0].field, "studentUid");
});
