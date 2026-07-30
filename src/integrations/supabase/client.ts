/**
 * Supabase is retired. This module is a permanent stub.
 * Any leftover write/auth/RPC/function call throws so bugs cannot silently no-op.
 */
export const SUPABASE_URL = "";
export const SUPABASE_PUBLISHABLE_KEY = "";
/** Always null — Supabase is gone; do not surface legacy env errors. */
export const SUPABASE_CONFIG_ERROR: string | null = null;

const RETIRED =
  "Supabase is retired. Use the Next.js /api routes (Neon + Clerk) instead.";

function retiredError(): Error {
  return new Error(RETIRED);
}

type SoftResult = {
  data: null;
  error: Error;
  count: null;
  status: number;
  statusText: string;
};

const softFail = (): SoftResult => ({
  data: null,
  error: retiredError(),
  count: null,
  status: 410,
  statusText: "Gone",
});

const writeMethods = new Set([
  "insert",
  "update",
  "upsert",
  "delete",
]);

const chainMethods = [
  "select",
  "insert",
  "update",
  "upsert",
  "delete",
  "eq",
  "neq",
  "in",
  "is",
  "order",
  "limit",
  "range",
  "match",
  "filter",
  "or",
  "ilike",
  "like",
  "gte",
  "lte",
  "gt",
  "lt",
  "not",
  "contains",
  "containedBy",
  "overlaps",
  "textSearch",
  "csv",
  "returns",
] as const;

function makeBuilder(isWrite = false): Record<string, unknown> {
  const builder: Record<string, unknown> = {};
  let write = isWrite;
  for (const m of chainMethods) {
    builder[m] = () => {
      if (writeMethods.has(m)) write = true;
      return makeBuilder(write);
    };
  }
  const fail = () => Promise.resolve(softFail());
  builder.single = fail;
  builder.maybeSingle = fail;
  builder.throwOnError = () => {
    throw retiredError();
  };
  builder.then = (
    onFulfilled?: (v: SoftResult) => unknown,
    onRejected?: (e: unknown) => unknown
  ) => Promise.resolve(softFail()).then(onFulfilled, onRejected);
  builder.catch = (onRejected?: (e: unknown) => unknown) =>
    Promise.resolve(softFail()).catch(onRejected);
  return builder;
}

const auth = {
  getSession: () =>
    Promise.resolve({ data: { session: null }, error: retiredError() }),
  getUser: () =>
    Promise.resolve({ data: { user: null }, error: retiredError() }),
  signInWithPassword: () =>
    Promise.resolve({
      data: { user: null, session: null },
      error: { message: RETIRED },
    }),
  signUp: () =>
    Promise.resolve({
      data: { user: null, session: null },
      error: { message: RETIRED },
    }),
  signOut: () => Promise.resolve({ error: retiredError() }),
  setSession: () =>
    Promise.resolve({ data: { session: null, user: null }, error: retiredError() }),
  updateUser: () => Promise.resolve({ data: { user: null }, error: retiredError() }),
  resetPasswordForEmail: () =>
    Promise.resolve({ data: null, error: retiredError() }),
  onAuthStateChange: () => ({
    data: { subscription: { unsubscribe: () => undefined } },
  }),
};

/** @deprecated Supabase is retired — stub only. Writes/auth/RPC throw errors. */
export const supabase = {
  from: () => makeBuilder(false),
  rpc: () => makeBuilder(true),
  schema: () => ({ from: () => makeBuilder(false) }),
  functions: {
    invoke: () => Promise.resolve(softFail()),
  },
  storage: {
    from: () => ({
      upload: () =>
        Promise.resolve({
          data: null,
          error: { message: RETIRED },
        }),
      download: () => Promise.resolve(softFail()),
      remove: () => Promise.resolve(softFail()),
      list: () => Promise.resolve(softFail()),
      createSignedUrl: () =>
        Promise.resolve({
          data: null,
          error: { message: RETIRED },
        }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
    }),
  },
  channel: () => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => undefined }) }),
    subscribe: () => ({ unsubscribe: () => undefined }),
  }),
  auth,
};
