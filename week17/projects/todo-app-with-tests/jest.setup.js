import "@testing-library/jest-dom/extend-expect";

if (!global.crypto) {
  // @ts-expect-error - jsdom fallback
  global.crypto = {};
}

if (!global.crypto.randomUUID) {
  Object.defineProperty(global.crypto, "randomUUID", {
    value: () => Math.random().toString(16).slice(2, 10),
  });
}
