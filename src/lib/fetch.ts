import { createFetch } from "@better-fetch/fetch";

export const $fetch = createFetch({
  retry: {
    type: "linear",
    attempts: 2,
    delay: 1000,
  },
  credentials: "same-origin",
  throw: true,
});
