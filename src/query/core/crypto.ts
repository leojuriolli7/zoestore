import "server-only";
import { randomBytes, createCipheriv, createDecipheriv, scrypt } from "crypto";
import { promisify } from "util";
import { appServerConfig } from "@/config/server";

const scryptAsync = promisify(scrypt);
const ALGORITHM = "aes-256-gcm";

async function getKey(salt: Buffer): Promise<Buffer> {
  return (await scryptAsync(
    appServerConfig.auth.encryptionKey,
    salt,
    32
  )) as Buffer;
}

export async function encrypt(text: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await getKey(salt);
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return (
    salt.toString("hex") +
    ":" +
    iv.toString("hex") +
    ":" +
    authTag.toString("hex") +
    ":" +
    encrypted
  );
}

export async function decrypt(encryptedData: string): Promise<string> {
  const parts = encryptedData.split(":");

  if (parts.length !== 4) {
    throw new Error("Invalid encrypted data format");
  }

  const [saltHex, ivHex, authTagHex, encrypted] = parts;

  if (!saltHex || !ivHex || !authTagHex || !encrypted) {
    throw new Error("Invalid encrypted data format");
  }

  const salt = Buffer.from(saltHex, "hex");
  const key = await getKey(salt);
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
