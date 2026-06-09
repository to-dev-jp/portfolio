import { createClient } from "microcms-js-sdk";

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;

// API取得用のクライアントを作成
export const client = createClient({
  serviceDomain: serviceDomain,
  apiKey: process.env.MICROCMS_API_KEY,
});
