import type { AppContext } from "site/apps/deco/records.ts";
import { toDos } from "site/db/schema.ts";

type TodosInsert = typeof toDos.$inferInsert;

export interface Props {
    toDos: TodosInsert[]
}

async function loader(
    _props: Props,
    _req: Request,
    { invoke }: AppContext,
) {
    const drizzle = await invoke.records.loaders.drizzle();
    const toDosData = await drizzle.select({
        id: toDos.id,
        description: toDos.description,
        done: toDos.done,
    }).from(toDos);

    return { toDos: toDosData };
}

export default loader;