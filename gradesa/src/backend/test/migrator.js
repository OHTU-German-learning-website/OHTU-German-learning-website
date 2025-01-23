import * as fs from "fs/promises";
import * as path from "path";
import { createHash } from "crypto";
import { exec as execCB } from "child_process";
import util from "util";

// Tuns execCB into a promise
const exec = util.promisify(execCB);

export async function runMigrations() {
  const config = await Config.get();
  const conf = config.db;

  const migrator = new Migrator();
  await migrator.migrate(conf, true);
  await migrator.verify(conf, true);
}

export class Migrator {
  async hash() {
    const hash = createHash("md5");
    hash.update("TableName=pgmigrate_migrations");

    const files = await fs.readdir(this.migrationsDir);
    for (const file of files) {
      if (path.extname(file) === ".sql") {
        const fpath = path.join(this.migrationsDir, file);
        const contents = await fs.readFile(fpath);
        hash.update(contents);
      }
    }

    return hash.digest("hex");
  }

  async migrate(conf, verbose = false) {
    await this.checkPgMigrate();

    const databaseURL = dbURL(conf);
    const cmd = `pgmigrate migrate -d ${databaseURL} -m ${this.migrationsDir}`;
    await this.exec(cmd, verbose);
  }

  async verify(conf, verbose = false) {
    const databaseURL = dbURL(conf);
    const cmd = `pgmigrate verify -d ${databaseURL} -m ${this.migrationsDir}`;
    await this.exec(cmd, verbose);
  }

  async checkPgMigrate() {
    try {
      await exec("which pgmigrate");
    } catch {
      throw new Error("pgmigrate not found");
    }
  }

  async exec(cmd, verbose) {
    try {
      const out = await exec(cmd);
      if (verbose) this.writeOutput(out);
    } catch (e) {
      let msg = (e.stdout ?? e.stderr).trim().split("\n").pop();
      if (e.stdout?.indexOf("failed to") > -1) {
        msg = e.stdout.slice(e.stdout.indexOf("failed to"));
      } else if (e.stderr?.indexOf("failed to") > -1) {
        msg = e.stderr.slice(e.stderr.indexOf("failed to"));
      }
      console.error(msg);
      captureSentryException(new Error(msg));
    }
  }

  writeOutput(out) {
    if (out.stdout) process.stdout.write(out.stdout);
    if (out.stderr) process.stderr.write(out.stderr);
  }

  get migrationsDir() {
    return path.join(__dirname, "../../..", "migrations").replace("dist/", "");
  }
}
