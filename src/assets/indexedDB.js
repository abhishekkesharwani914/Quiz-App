import { openDB } from "idb";

const history = "quizHistoryDB";
const saveAttempts = "attempts";

export async function initDB() {
  return openDB(history, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(saveAttempts)) {
        db.createObjectStore(saveAttempts, { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

async function saveAttempt(attempt) {
  const db = await initDB();
  return db.add(saveAttempts, attempt);
}

async function getAttempts() {
  const db = await initDB();
  return db.getAll(saveAttempts);
}

export { saveAttempt, getAttempts };
