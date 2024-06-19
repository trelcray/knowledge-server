export function existsOrError(value: unknown, msg: string) {
  if (!value) throw msg;
  if (Array.isArray(value) && value.length === 0) throw msg;
  if (typeof value === "string" && !value.trim()) throw msg;
}

export function notExistsOrError(value: unknown, msg: string) {
  try {
    existsOrError(value, msg);
  } catch (msg) {
    return;
  }
  throw msg;
}

export function equalsOrError(valueA: string, valueB: string, msg: string) {
  if (valueA !== valueB) throw msg;
}
