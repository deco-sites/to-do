import type { AppContext } from "site/apps/deco/records.ts";
import { toDos } from "site/db/schema.ts";
import { eq } from "drizzle-orm";

type TodosInsert = typeof toDos.$inferInsert;

async function loader(
    props: TodosInsert,
    _req: Request,
    { invoke }: AppContext,
) {
    const drizzle = await invoke.records.loaders.drizzle();
    await drizzle.update(toDos).set({
        ...props,
        done: !props.done
    }).where(eq(toDos.id, props.id ?? 0))

    return null;
}

export default loader;