# We Lost 4 Hours to a Missing .env Variable — So I Built a Schema-First Fix

Every developer has a war story about environment variables. Ours went like this: production deployment at 2 AM, the app starts throwing `undefined is not a valid database URL`, and the team spends 4 hours hunting down a missing `DATABASE_HOST` that was present in every environment *except* the one that mattered.

The fix? We wrote a tool called **dotenv-schema** that flips the problem upside down. Instead of validating what you *have*, you define what you *need* first.

## The Problem with .env Files

Here's the thing about `.env` files — they're documentation, configuration, and secrets all rolled into one unstructured text file. No types. No required/optional flags. No validation until runtime (if you're lucky).

Most teams handle it like this:

```bash
# .env
DATABASE_URL=postgres://localhost:5432/mydb
NODE_ENV=production
PORT=3000
API_KEY=
```

Spot the problem? `API_KEY` is empty. In production. At runtime, something explodes.

Existing tools like `dotenv`, `envalid`, or `zod` validate *after the fact*. You write your validation code, you remember to call it, and hopefully you covered every variable. It's reactive.

## Schema-First: Define Before You Validate

The idea behind dotenv-schema is simple: **define the schema first, then generate everything from it.**

```bash
npx dotenv-schema init --env=.env --output=schema.json
```

This reads your existing `.env` and generates a schema with inferred types:

```json
{
  "DATABASE_URL": {
    "type": "string",
    "required": true,
    "format": "uri",
    "description": "Database connection string"
  },
  "NODE_ENV": {
    "type": "enum",
    "values": ["development", "production", "test"],
    "required": true,
    "description": "Application environment"
  },
  "PORT": {
    "type": "number",
    "required": false,
    "default": 3000,
    "min": 1024,
    "max": 65535,
    "description": "Server port number"
  },
  "API_KEY": {
    "type": "string",
    "required": true,
    "description": "External API authentication key"
  }
}
```

Now you have a **single source of truth** for what your app needs. From this schema, you can generate:

1. **`.env.example`** — for onboarding new developers
2. **TypeScript types** — so `process.env` is typed
3. **Validation code** — runtime checks before your app starts
4. **Documentation** — a markdown table for your README

## The Real Technique: Generating a Validation Gate

Here's the part that actually saved us. Run:

```bash
dotenv-schema generate --validator --types --env-example
```

You get a generated `env.validator.ts` that looks like this:

```typescript
import { EnvValidator } from "dotenv-schema/validator";

const schema = {
  DATABASE_URL: { type: "string", required: true, format: "uri" },
  NODE_ENV: { type: "enum", values: ["development", "production", "test"], required: true },
  PORT: { type: "number", required: false, default: 3000 },
  API_KEY: { type: "string", required: true }
};

const validator = new EnvValidator(schema);

export function validateEnv(env: Record<string, string>) {
  const result = validator.validate(env);
  if (!result.valid) {
    console.error("❌ Environment validation failed:");
    result.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
  return result.data;
}
```

Then in your app entry point:

```typescript
import { validateEnv } from "./env.validator";
import * as dotenv from "dotenv";

dotenv.config();
const env = validateEnv(process.env);
// ^ Fully typed, fully validated. App never starts with bad config.
```

If `API_KEY` is missing or empty, the app refuses to start with a clear error. No more 2 AM detective work.

## CI/CD Integration: Catch It Before Deploy

The schema file is JSON — commit it to your repo. Now CI can validate too:

```yaml
# .github/workflows/ci.yml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 20
  - run: npm install -g dotenv-schema
  - run: dotenv-schema validate --env=.env.example --schema=schema.json
```

If someone adds a new required variable to the schema but forgets to update `.env.example`, CI fails. The schema becomes a contract between developers and the deployment pipeline.

## What About zod/envalid?

Good question. Here's when to use what:

- **zod**: Great for API validation, complex runtime schemas. Overkill for env vars if you just need type checking.
- **envalid**: Solid runtime validation, but no schema-first approach. You write validation inline in your code.
- **dotenv-schema**: Schema is a separate artifact. You generate `.env.example`, types, docs, and validators from one definition. It's about the *workflow*, not just validation.

If you have 3 environment variables, any of these work fine. If you have 30+ across microservices, having a committed schema file that generates everything is a different level of maintainability.

## The Type System

dotenv-schema supports these types out of the box:

- `string` — with optional `format` (uri, email), `pattern` (regex), `min`/`max` length
- `number` — with optional `min`/`max` range
- `boolean` — `true` or `false` (handles string "true"/"false" from .env)
- `enum` — one of predefined values, great for `NODE_ENV`
- `json` — validates that the value parses as valid JSON

Each variable can be `required` or `optional` with a `default` value and a human-readable `description`.

## Practical Tips

**1. Start from your existing .env:**
```bash
npx dotenv-schema init --env=.env --interactive
```
The interactive mode prompts you for types and descriptions instead of guessing.

**2. Add variables over time:**
```bash
dotenv-schema add --schema=schema.json
```
Prompts for name, type, required, default, description. No manual JSON editing.

**3. Generate docs for your README:**
```bash
dotenv-schema generate --docs
```
Outputs a clean markdown table you can paste into your project documentation.

**4. Check schema health:**
```bash
dotenv-schema check --schema=schema.json
```
Validates the schema itself — catches circular refs, invalid types, missing descriptions.

## Installation

```bash
npm install -g dotenv-schema
```

Or use without installing:
```bash
npx dotenv-schema init --env=.env
```

Works with Node.js >= 18. MIT licensed.

GitHub: [sulthonzh/dotenv-schema](https://github.com/sulthonzh/dotenv-schema)

---

The takeaway isn't about this specific tool — it's the **schema-first mindset**. Define what you need *before* you need it. Generate the boilerplate. Let the schema be the contract. Your future self (especially at 2 AM) will thank you.

*Built by [sulthonzh](https://github.com/sulthonzh) — because losing 4 hours to a missing env var is 4 hours too many.*
