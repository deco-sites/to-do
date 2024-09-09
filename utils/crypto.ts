import * as bcrypt from "bcrypt";

export const cipherText = Deno.env.get("DECO_PASSWORD_ENCODER")

export const encrypt = async (password: string) => {
    return await bcrypt.hash(password + cipherText);
}

export const compare = async (passwordEncoded: string, password: string) => {
    return await bcrypt.compare(password + cipherText, passwordEncoded)
}
