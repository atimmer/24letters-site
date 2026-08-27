# Convex deployment

The blog uses Convex to freeze one canonical slug for each Leaflet record key.
Slug reads are public, but mapping creation requires the same strong
`POST_SLUG_SECRET` in both the Next.js server environment and the target Convex
deployment.

Local development requires these values in `.env.local`:

- `CONVEX_DEPLOYMENT`: written by `npx convex dev`; used only by the Convex CLI.
- `NEXT_PUBLIC_CONVEX_URL`: the development deployment URL written by Convex.
- `POST_SLUG_SECRET`: a strong random server-only secret. Never use a
  `NEXT_PUBLIC_` prefix for this value.

Set the secret on development after creating it:

```sh
npx convex env set POST_SLUG_SECRET '<same-secret-value>'
```

For production, deploy the functions and set that identical secret:

```sh
npx convex deploy -y
npx convex env set --prod POST_SLUG_SECRET '<same-secret-value>'
```

The Vercel project needs exactly these application variables for this feature:

- `NEXT_PUBLIC_CONVEX_URL`:
  `https://watchful-curlew-44.eu-west-1.convex.cloud`.
- `POST_SLUG_SECRET`: copy the value from local `.env.local` or the team password
  manager; it must equal the Convex production environment value.

Do not add `CONVEX_DEPLOYMENT` or `NEXT_PUBLIC_CONVEX_SITE_URL` to Vercel for
this feature. Preview builds need their own reachable Convex URL and a matching
secret if Leaflet posts should be included; otherwise the loader deliberately
falls back to MDX-only content.

# Welcome to your Convex functions directory!

Write your Convex functions here.
See https://docs.convex.dev/functions for more.

A query function that takes two arguments looks like:

```ts
// convex/myFunctions.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
```

Using this query function in a React component looks like:

```ts
const data = useQuery(api.myFunctions.myQueryFunction, {
  first: 10,
  second: "hello",
});
```

A mutation function looks like:

```ts
// convex/myFunctions.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get("messages", id);
  },
});
```

Using this mutation function in a React component looks like:

```ts
const mutation = useMutation(api.myFunctions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result),
  );
}
```

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running `npx convex -h` in your project root
directory. To learn more, launch the docs with `npx convex docs`.
