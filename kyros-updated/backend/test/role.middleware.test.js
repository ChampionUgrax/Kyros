const test = require("node:test");
const assert = require("node:assert/strict");

const authorizeRoles = require("../src/middleware/role.middleware");
const firebaseModulePath = require.resolve("../src/config/firebase");

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

const mockFirebaseUser = (userData) => {
  require.cache[firebaseModulePath] = {
    id: firebaseModulePath,
    filename: firebaseModulePath,
    loaded: true,
    exports: {
      db: {
        collection: () => ({
          doc: () => ({
            get: async () => ({
              exists: true,
              data: () => userData,
            }),
          }),
        }),
      },
    },
  };
};

test.after(() => {
  delete require.cache[firebaseModulePath];
});

test("denies a parent access to student-only endpoints", async () => {
  mockFirebaseUser({ isActive: true, role: "parent" });

  const request = { user: { uid: "parent-uid" } };
  const response = createResponse();
  let nextCalled = false;

  await authorizeRoles("student")(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(response.statusCode, 403);
  assert.deepEqual(response.body, {
    success: false,
    message: "You do not have permission to access this resource",
  });
});

test("allows an active student through student-only authorization", async () => {
  mockFirebaseUser({ isActive: true, role: "student" });

  const request = { user: { uid: "student-uid" } };
  const response = createResponse();
  let nextCalled = false;

  await authorizeRoles("student")(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(request.user.role, "student");
  assert.equal(response.statusCode, null);
});
