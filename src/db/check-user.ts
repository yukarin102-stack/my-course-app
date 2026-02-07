import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const email = "0000@example.com";
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    console.log("Found user:", user);
    if (user) {
        console.log("Password hash:", user.password);
    }
}
main();
