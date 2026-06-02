import pg from "pg";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const envPath = resolve(root, ".env");
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, "");
  }
}

const passwords = [
  process.env.PG_PASSWORD,
  "postgres",
  "admin",
  "123456",
  "password",
  "",
].filter((p, i, a) => p !== undefined && a.indexOf(p) === i);

async function tryConnect(url) {
  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 3000 });
  await client.connect();
  return client;
}

async function main() {
  loadEnv();
  const dbName = "shaanetaj";
  const user = "shaanetaj";
  const userPass = "shaanetaj_dev";

  let adminClient = null;
  let adminUrl = "";

  for (const pw of passwords) {
    const url = `postgresql://postgres:${encodeURIComponent(pw ?? "")}@localhost:5432/postgres`;
    try {
      adminClient = await tryConnect(url);
      adminUrl = url;
      console.log("Connected as postgres");
      break;
    } catch {
      /* try next */
    }
  }

  if (!adminClient) {
    console.error(
      "Could not connect to PostgreSQL. Set PG_PASSWORD in .env to your postgres superuser password."
    );
    process.exit(1);
  }

  await adminClient.query(`CREATE DATABASE ${dbName}`).catch((e) => {
    if (e.code !== "42P04") throw e;
  });
  await adminClient.query(
    `DO $$ BEGIN CREATE USER ${user} WITH PASSWORD '${userPass}'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`
  );
  await adminClient.query(`GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${user}`);
  await adminClient.query(`ALTER DATABASE ${dbName} OWNER TO ${user}`);
  await adminClient.end();

  const appUrl = `postgresql://${user}:${userPass}@localhost:5432/${dbName}`;
  console.log("Database ready:", appUrl);
  console.log("Update .env DATABASE_URL to the line above if different.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
