import "server-only";
import { randomBytes, createCipheriv, createDecipheriv, scrypt } from "crypto";
import { promisify } from "util";
import { appServerConfig } from "@/config/server";

const scryptAsync = promisify(scrypt);
const ALGORITHM = "aes-256-gcm";

async function getKey(): Promise<Buffer> {
  return (await scryptAsync(
    appServerConfig.auth.encryptionKey,
    "salt",
    32
  )) as Buffer;
}

export async function encrypt(text: string): Promise<string> {
  const key = await getKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
}

export async function decrypt(encryptedData: string): Promise<string> {
  const key = await getKey();
  const [ivHex, authTagHex, encrypted] = encryptedData.split(":");

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
