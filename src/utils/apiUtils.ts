export const getApiKeyList = (start: number, end: number) => {
  let apiKeys: string[] = [];

  for (let i = start; i <= end; i++) {
    const key = process.env[`NEXT_PUBLIC_FINNHUB_KEY_${i}`];
    if (typeof key === "string") {
      apiKeys.push(key);
    }
  }
  return apiKeys;
};
