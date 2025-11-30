const crypto = require("crypto");

/**
 * Password hashing and verification utilities using Node's `crypto.scrypt`.
 *
 * These helpers produce a per-user random salt and a hex-encoded hash. The
 * project stores `salt` and `password_hash` in the `users` table and verifies
 * logins by recomputing the scrypt hash with the stored salt.
 */

/**
 * Hashes a plaintext password with scrypt and a salt.
 *
 * @param {string} password - Plaintext password to hash.
 * @param {string} [salt] - Optional salt; generates a random 16-byte hex salt when omitted.
 * @returns {Promise<{ salt: string, hashedPassword: string }>} Resolves with the salt and hex-encoded hash.
 */
export async function hashPassword(
  password,
  salt = crypto.randomBytes(16).toString("hex")
) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      const hashedPassword = derivedKey.toString("hex");
      resolve({ salt, hashedPassword });
    });
  });
}

/**
 * Verifies a plaintext password against a stored salt and hash.
 *
 * @param {string} password - Plaintext password provided by the user.
 * @param {string} salt - The user's stored salt.
 * @param {string} hashedPasswordFromDB - The user's stored hex-encoded hash.
 * @returns {Promise<boolean>} Resolves `true` when the recomputed hash matches, else `false`.
 */
export async function verifyPassword(password, salt, hashedPasswordFromDB) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      const hashedPassword = derivedKey.toString("hex");
      if (hashedPassword === hashedPasswordFromDB) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
