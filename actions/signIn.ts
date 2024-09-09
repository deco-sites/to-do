import type { AppContext } from "site/apps/deco/records.ts";
import { users } from "site/db/schema.ts";
import { eq } from "drizzle-orm";
import { compare } from "site/utils/crypto.ts";
import { create } from "djwt";

type UsersInsert = typeof users.$inferInsert;

async function loader(
    props: UsersInsert,
    _req: Request,
    { invoke }: AppContext,
) {
    const drizzle = await invoke.records.loaders.drizzle();
    const user = await drizzle.select({ id: users.id, email: users.email, password: users.password }).from(users).where(eq(users.email, props.email ?? ""))

    if (user.length === 0) {
        return "Email not registered!"
    }

    const isSamePassword = await compare(user[0].password ?? "", props.password ?? "")

    if (!isSamePassword) {
        return "Wrong password!"
    }

    return { id: user[0].id}
}

export default loader;