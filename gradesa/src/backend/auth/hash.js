import { randomBytes } from "crypto";
import { password } from "../../app/api/auth/register/route";

const salt = randomBytes(16).toString("hex");
export const hash_password = await new Promise((resolve, reject) => {
  crypto.scrypt(password, salt, 64, (err, derivedKey) => {
    if (err) reject(err);
    resolve(derivedKey.toString("hex"));
  });
});
