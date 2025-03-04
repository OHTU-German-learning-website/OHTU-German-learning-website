const crypto = require("crypto");

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      const hashedPassword = derivedKey.toString("hex");
      resolve({ salt, hashedPassword });
    });
  });
}

export async function verifyPassWord(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      const hashedPassword = derivedKey.toString("hex");
      resolve(hashedPassword);
    });
  });
}
