import type { AppContext } from "site/apps/deco/records.ts";
import { users } from "site/db/schema.ts";
import { eq } from "drizzle-orm";
import { encrypt } from "site/utils/crypto.ts";

type UsersInsert = typeof users.$inferInsert;

async function loader(
    props: UsersInsert,
    _req: Request,
    { invoke }: AppContext,
) {
    const drizzle = await invoke.records.loaders.drizzle();
    const hasUser = (await drizzle.select({ email: users.email }).from(users).where(eq(users.email, props.email ?? ""))).length > 0

    if (!hasUser) {
        props.password = await encrypt(props.password ?? "")
        await drizzle.insert(users).values(props)
        return true
    }

    return "Email already registered!";
}

export default loader;