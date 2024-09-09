
import { SectionProps } from "deco/types.ts";
import type { AppContext } from "site/apps/site.ts";
import { users as usersSchema } from "site/db/schema.ts";
import { useSection } from "deco/hooks/useSection.ts";
import { redirect } from "deco/mod.ts"

type UserInsert = typeof usersSchema.$inferInsert;
type UserKeys = keyof UserInsert;
type UserValue<K extends keyof UserInsert> = UserInsert[K];

const userProps: Record<UserKeys, UserInsert[UserKeys][]> = {
  userName: ["", undefined, null],
  email: ["", undefined, null],
  password: ["", undefined, null],
  id: [0],
};

const isUserPropKey = (
    key: string,
): key is UserKeys => key in userProps;
const isUserPropType = (
    key: UserKeys,
    value: unknown,
): value is UserValue<typeof key> =>
    userProps[key]?.some((v) => typeof v === typeof value);

interface Props {
  mode?: "signin";
  message?: string;
}

interface resultSignIn {
    id: string
}

export async function loader(
  props: Props,
  req: Request,
  ctx: AppContext,
) {
  if (props.mode === "signin" && req.body) {
    const data: Partial<UserInsert> = {};
    (await req.formData()).forEach((value, key) => {
        isUserPropKey(key) && isUserPropType(key, value) && (data[key] = value as any)
    })
    const result = await ctx.invoke("site/actions/signIn.ts", data)
    if (typeof result === "string") {
        return { message: result }
    } else {
        const url = new URL(req.url);
        url.pathname = "/";
        url.search = "?id=" + (result as resultSignIn).id;
        redirect(url.toString(), 301);
    }
  }

  return props;
}

export default function ToDoList(
  { message }: SectionProps<typeof loader>,
) {
  return (
    <div class="flex justify-center w-full relative">
        <div class="max-w-[456px] w-full px-10 py-10">
            <h1 class="text-3xl text-center w-full uppercase pt-10 pb-5">Sign In</h1>
            <div class="w-full absolute top-0 left-0 bg-gray-300 h-[185px] z-[-1]"></div>
            <div class="w-full border border-gray-300">
                <form
                    hx-post={useSection<Props>({
                        props: { mode: "signin" },
                    })}
                    hx-trigger="click"
                    hx-target="closest section"
                    hx-swap="outerHTML"
                    class="flex flex-col gap-1 bg-white p-5 rounded"
                >
                    <div class="">
                        <label for="email">
                            Email
                        </label>
                        <input
                            name="email"
                            id="email"
                            type="email"
                            required
                            class="border border-gray-300 rounded w-full p-1 outline-none invalid:border-red-500 valid:border-green-500"
                        />
                    </div>
                    <div class="">
                        <label for="password">
                            Password
                        </label>
                        <input
                            name="password"
                            id="password"
                            type="password"
                            required
                            class="border border-gray-300 rounded w-full p-1 outline-none invalid:border-red-500 valid:border-green-500"
                        />
                    </div>
                    <div class="w-full">
                        <button class="rounded bg-purple-500 text-white w-full mt-5 py-2" type="submit">Sign in</button>
                    </div>
                    {
                        message && 
                        <p class="text-red-500 text-xs">{message}</p>
                    }
                </form>
                <div class="p-5">
                    <p class="text-sm">
                        Don't have an account? <a href={"/sign-up"} class="text-purple-500">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
