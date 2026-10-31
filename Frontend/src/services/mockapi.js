
import { mockData, mockCards } from "./mockData.js";

const wait = (ms = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const USERS_KEY = "kyros_mock_users";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createUserId() {
  return `demo-${Date.now()}`;
}

export async function mockRequest(
  path,
  { method = "GET", body } = {}
) {
  await wait();

  // AUTH: SIGNUP
  if (method === "POST" && path === "/auth/signup") {
    const { name, email, password, role } = body || {};

    if (!name || !email || !password || !role) {
      throw new Error("Please fill in all required fields.");
    }

    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (user) =>
        user.email === normalizedEmail && user.role === role
    );

    if (existingUser) {
      throw new Error("Account already exists. Please log in.");
    }

    const user = {
      id: createUserId(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    };

    saveUsers([...users, user]);

    return {
      token: `demo-token-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // AUTH: LOGIN
  if (method === "POST" && path === "/auth/login") {
    const { email, password, role } = body || {};

    if (!email || !password || !role) {
      throw new Error("Please enter email, password and role.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();

    let user = users.find(
      (item) =>
        item.email === normalizedEmail &&
        item.password === password &&
        item.role === role
    );

    // Create a temporary preview account if none exists.
    if (!user) {
      const emailExists = users.some(
        (item) =>
          item.email === normalizedEmail && item.role === role
      );

      if (emailExists) {
        throw new Error("Incorrect password. Please try again.");
      }

      user = {
        id: createUserId(),
        name: normalizedEmail.split("@")[0] || "Student",
        email: normalizedEmail,
        password,
        role,
      };

      saveUsers([...users, user]);
    }

    return {
      token: `demo-token-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // STUDENT: MATERIAL UPLOAD
  if (method === "POST" && path === "/student/materials") {
    const file =
      body instanceof FormData ? body.get("file") : null;

    if (!file) {
      throw new Error("Please select a file first.");
    }

    return {
      message: `${file.name} uploaded successfully (demo mode).`,
    };
  }

  // STUDENT: FLASHCARDS
  const deckMatch = path.match(
    /^\/student\/decks\/([^/]+)\/cards$/
  );

  if (method === "GET" && deckMatch) {
    return mockCards[deckMatch[1]] || [];
  }

  // STUDENT: FLASHCARD REVIEW
  if (
    method === "POST" &&
    /^\/student\/cards\/[^/]+\/review$/.test(path)
  ) {
    return {
      success: true,
      message: "Review recorded in demo mode.",
    };
  }

  // DASHBOARD GET REQUESTS
  if (
    method === "GET" &&
    Object.prototype.hasOwnProperty.call(mockData, path)
  ) {
    return mockData[path];
  }

  throw new Error(
    `No mock response configured for ${method} ${path}`
  );
}
