import fs from "fs";
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const wranglerDbPath = fs.readdirSync(".wrangler/state/v3/d1").find((file) => file.endsWith(".sqlite"));

export const auth = betterAuth({
	database: new Database(wranglerDbPath),
});