const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createLinkDocumentId,
  generateInviteCode,
  hashValue,
} = require("../src/utils/link.utils");

test("generates URL-safe, high-entropy parent invite codes", () => {
  const code = generateInviteCode();

  assert.match(code, /^[A-Za-z0-9_-]{32}$/);
});

test("creates deterministic hashed IDs without exposing account UIDs", () => {
  const linkId = createLinkDocumentId("parent-uid", "student-uid");

  assert.equal(linkId, createLinkDocumentId("parent-uid", "student-uid"));
  assert.equal(linkId, hashValue(JSON.stringify(["parent-uid", "student-uid"])));
  assert.equal(linkId.includes("parent-uid"), false);
  assert.equal(linkId.includes("student-uid"), false);
});
