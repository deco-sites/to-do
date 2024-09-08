
import { SectionProps } from "deco/types.ts";
import type { AppContext } from "site/apps/site.ts";
import { toDos as toDosSchema } from "site/db/schema.ts";
import type { Props as ToDosProps } from "site/loaders/todos.ts";
import { useSection } from "deco/hooks/useSection.ts";
import Icon from "site/components/ui/Icon.tsx";

type TodosInsert = typeof toDosSchema.$inferInsert;
type TodosKeys = keyof TodosInsert;
type TodosValue<K extends keyof TodosInsert> = TodosInsert[K];

const todosProps: Record<TodosKeys, TodosInsert[TodosKeys][]> = {
  done: [false],
  description: ["", undefined, null],
  id: [0],
};

const isToDosPropKey = (
    key: string,
): key is TodosKeys => key in todosProps;
const isToDosPropType = (
    key: TodosKeys,
    value: unknown,
): value is TodosValue<typeof key> =>
    todosProps[key]?.some((v) => typeof v === typeof value);

interface Props {
  mode?: "add" | "check" | "delete";
  todo?: TodosInsert;
}

export async function loader(
  { mode, todo }: Props,
  req: Request,
  ctx: AppContext,
) {
  if (mode === "add" && req.body) {
    const newData: Partial<TodosInsert> = {};
    (await req.formData()).forEach((value, key) => {
        isToDosPropKey(key) && isToDosPropType(key, value) && (newData[key] = value as any)
    })
    await ctx.invoke("site/actions/addTodo.ts", newData)
  }

  if (mode === "check" && todo) {
    await ctx.invoke("site/actions/checkTodo.ts", todo)
  }

  if (mode === "delete" && todo?.id) {
    await ctx.invoke("site/actions/removeTodo.ts", todo)
  }

  const toDos = await ctx.invoke("site/loaders/todos.ts");
  return toDos as unknown as Promise<ToDosProps>;
}

export default function ToDoList(
  { toDos = [] }: SectionProps<typeof loader>,
) {
  return (
    <div class="flex justify-center w-full relative">
        <div class="max-w-[768px] w-full px-10 py-10">
            <h1 class="text-3xl text-center w-full uppercase py-10">To Do List</h1>
            <div class="w-full absolute top-0 left-0 bg-gray-300 h-[185px] z-[-1]"></div>
            <form
                hx-post={useSection<Props>({
                    props: { mode: "add" },
                })}
                hx-trigger="click"
                hx-target="closest section"
                hx-swap="outerHTML"
                class="flex gap-1"
            >
                <input
                    name="description"
                    id="description"
                    placeholder="Add a new task"
                    required
                    class="border border-gray-300 rounded w-full p-3 outline-none"
                />
                <div>
                    <button class="rounded bg-purple-500 w-[100px] text-white h-full" type="submit">Add +</button>
                </div>
            </form>
            <div class="mt-5 flex flex-col gap-5">
                <div class="w-full lg:h-[20px] lg:flex justify-between">
                    <div>Tasks Created <div className="badge badge-purple-500 badge-lg">{toDos.length}</div></div>
                    <div>Tasks Done <div className="badge badge-info badge-lg">{toDos.filter(todo => todo.done).length}</div></div>
                </div>
                {
                    toDos.map(todo => {
                        return (
                            <div class="flex justify-between items-center gap-2 w-full h-[50px] border border-gray-300 rounded bg-gray-300">
                                <form
                                    hx-post={useSection<Props>({
                                        props: { mode: "check", todo },
                                    })}
                                    hx-trigger="click"
                                    hx-target="closest section"
                                    hx-swap="outerHTML"
                                    class="form-control"
                                >
                                    <button type="submit" class="pl-5">
                                        <label class="cursor-pointer label">
                                            <input id="done" name="done" type="checkbox" checked={todo.done as boolean} class="checkbox checkbox-info bg-white" />
                                        </label>
                                    </button>
                                </form>
                                <p class="w-3/4" style={{ textDecoration: todo.done === true ? 'line-through' : '' }}>{todo.description}</p>
                                <form
                                    hx-post={useSection<Props>({
                                        props: { mode: "delete", todo },
                                    })}
                                    hx-trigger="click"
                                    hx-target="closest section"
                                    hx-swap="outerHTML"
                                    class="h-full w-[10%]"
                                >
                                    <button type="submit" class="w-full h-full flex justify-center items-center">
                                        <Icon id="Trash" size={16} />
                                    </button>
                                </form>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
  );
}
