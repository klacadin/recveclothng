/**
 * Supabase is retired. This module is a permanent no-op stub so any leftover
 * import cannot toast, throw, or call a remote Supabase project.
 */
export const SUPABASE_URL = "";
export const SUPABASE_PUBLISHABLE_KEY = "";
/** Always null — Supabase is gone; do not surface legacy env errors. */
export const SUPABASE_CONFIG_ERROR: string | null = null;

type SoftResult = {
  data: null;
  error: null;
  count: null;
  status: number;
  statusText: string;
};

const softOk: SoftResult = {
  data: null,
  error: null,
  count: null,
  status: 200,
  statusText: "OK",
};

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

function makeBuilder(): Record<string, unknown> {
  const builder: Record<string, unknown> = {};
  for (const m of chainMethods) {
    builder[m] = () => builder;
  }
  builder.single = () => Promise.resolve(softOk);
  builder.maybeSingle = () => Promise.resolve(softOk);
  builder.throwOnError = () => builder;
  builder.then = (
    onFulfilled?: (v: SoftResult) => unknown,
    onRejected?: (e: unknown) => unknown
  ) => Promise.resolve(softOk).then(onFulfilled, onRejected);
  builder.catch = (onRejected?: (e: unknown) => unknown) =>
    Promise.resolve(softOk).catch(onRejected);
  return builder;
}

const auth = {
  getSession: () =>
    Promise.resolve({ data: { session: null }, error: null }),
  getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  signInWithPassword: () =>
    Promise.resolve({
      data: { user: null, session: null },
      error: { message: "Supabase auth is retired. Use Clerk." },
    }),
  signUp: () =>
    Promise.resolve({
      data: { user: null, session: null },
      error: { message: "Supabase auth is retired. Use Clerk." },
    }),
  signOut: () => Promise.resolve({ error: null }),
  setSession: () =>
    Promise.resolve({ data: { session: null, user: null }, error: null }),
  updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
  resetPasswordForEmail: () => Promise.resolve({ data: null, error: null }),
  onAuthStateChange: () => ({
    data: { subscription: { unsubscribe: () => undefined } },
  }),
};

const storageBucket = {
  upload: () =>
    Promise.resolve({
      data: null,
      error: { message: "Supabase storage is retired. Use /api/upload." },
    }),
  download: () => Promise.resolve(softOk),
  remove: () => Promise.resolve(softOk),
  list: () => Promise.resolve(softOk),
  createSignedUrl: () =>
    Promise.resolve({
      data: null,
      error: { message: "Supabase storage is retired." },
    }),
  getPublicUrl: () => ({ data: { publicUrl: "" } }),
};

/** @deprecated Supabase is retired — stub only. */
export const supabase = {
  from: () => makeBuilder(),
  rpc: () => makeBuilder(),
  schema: () => ({ from: () => makeBuilder() }),
  functions: {
    invoke: () => Promise.resolve(softOk),
  },
  storage: {
    from: () => ({
      ...storageBucket,
      upload: () => Promise.resolve(softOk),
      createSignedUrl: () => Promise.resolve({ data: null, error: null }),
    }),
  },
  channel: () => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => undefined }) }),
    subscribe: () => ({ unsubscribe: () => undefined }),
  }),
  auth,
};
