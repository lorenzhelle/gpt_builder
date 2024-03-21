export const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
    ...init,
  }).then((res) => res.json());
