
import { defineConfig } from "drizzle-kit";

// Code from deno std/fmt that can't be improted https://deno.land/std@0.224.0/fmt/colors.ts?source
interface Code {
  open: string;
  close: string;
  regexp: RegExp;
}
/**
 * Builds color code
 * @param open
 * @param close
 */
function code(open: number[], close: number): Code {
  return {
    open: `\x1b[${open.join(";")}m`,
    close: `\x1b[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
  };
}

/**
 * Applies color and background based on color code and its associated text
 * @param str text to apply color settings to
 * @param code color code to apply
 */
function run(str: string, code: Code): string {
  return `${code.open}${str.replace(code.regexp, code.open)}${code.close}`;
}
/**
 * Set text color to bright green.
 * @param str text to make bright-green
 */
function brightGreen(str: string): string {
  return run(str, code([92], 39));
}
// end of std

const authToken = Deno.env.get("DATABASE_AUTH_TOKEN");

if (!authToken) {
  const link = brightGreen(
    `https://admin.deco.cx/sites/${
      Deno.env.get("DECO_SITE_NAME")
    }/spaces/Settings`,
  );

  console.log(
    `Token not setted up. Open ${link} to get database credentials.`,
  );
}

const dbCredentials = {
  url: Deno.env.get("DATABASE_URL") ?? "",
  authToken,
};

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials,
  migrations: {
    schema: "public",
  },
});
