import fs from "node:fs";
import type { User, UserPublic } from "./types";

// Load Mock Users Data
const MOCK_USERS_FILE = "MOCK_USERS.json";
let users: User[] = [];
try {
  if (fs.existsSync(MOCK_USERS_FILE)) {
    const data = fs.readFileSync(MOCK_USERS_FILE, "utf-8");
    users = JSON.parse(data);
  } else {
    users = [];
  }
} catch {
  users = [];
}

export function searchUsers(query: string, maxResults = 8): UserPublic[] {
  const normalizedQuery = query.toLowerCase();

  return users
    .filter((user) => user.username.toLowerCase().includes(normalizedQuery) || user.full_name.toLowerCase().includes(normalizedQuery))
    .slice(0, maxResults) // Limit the results
    .map(({ id, username, full_name, bio, avatar_url, followers_count, premium_user }) => ({
      id,
      username,
      full_name,
      bio,
      avatar_url,
      followers_count,
      premium_user,
    })); // Transform to UserPublic
}
