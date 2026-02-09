import { db } from "../lib/db";
import { users } from "../db/schema";
import { count } from "drizzle-orm";

async function main() {
    try {
        const userList = await db.select().from(users).all();
        console.log("Found", userList.length, "users.");
        for (const user of userList) {
            console.log(`User ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
        }
    } catch (error) {
        console.error("Error listing users:", error);
    }
}

main();
