import dotenv from "dotenv";
import path from "path";

const defaultEnvFiles = [".env", ".env.local"];

export function dotenvConfig(envFiles = defaultEnvFiles): dotenv.DotenvConfigOutput[] {
    const result = [];
    for (const file of envFiles) {
        result.push(dotenv.config({ path: path.resolve(process.cwd(), file) }));
    }
    return result;
}
