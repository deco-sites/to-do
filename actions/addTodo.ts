import type { AppContext } from "site/apps/deco/records.ts";
import { toDos } from "site/db/schema.ts";

type TodosInsert = typeof toDos.$inferInsert;

async function loader(
    props: TodosInsert,
    _req: Request,
    { invoke }: AppContext,
) {
    const drizzle = await invoke.records.loaders.drizzle();
    await drizzle.insert(toDos).values({ description: props.description, done: false })

    return null;
}

export default loader;