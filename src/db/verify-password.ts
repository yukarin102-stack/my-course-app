import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
    const email = "0000@example.com";
    const password = "2136";

    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user || !user.password) {
        console.log("User or password not found");
        return;
    }

    const match = await bcrypt.compare(password, user.password);
    console.log(`Password '2136' matches hash: ${match}`);

    // Also try checking the other way
    const newHash = await bcrypt.hash(password, 10);
    console.log(`New hash for 2136: ${newHash}`);
}
main();
