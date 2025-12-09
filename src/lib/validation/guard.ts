export function isString(v: unknown): v is string {
  return typeof v === "string";
}

export function isNumber(v: unknown): v is number {
  return typeof v === "number" && !Number.isNaN(v);
}

export function isRegExpMatch(match: RegExpExecArray | null | undefined, index = 0): boolean {
  return !!(match && match.length > index && typeof match[index] === "string");
}

export function safeGet<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  fallback?: T[K]
): T[K] | undefined {
  if (!obj) return fallback;
  return obj[key] ?? fallback;
}
