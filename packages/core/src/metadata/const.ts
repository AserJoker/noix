export const classMetadata = new Map<Function, Record<string, unknown>>();

export const memberMetadata = new Map<
  Function,
  Record<string, Record<string, unknown>>
>();

export const paramMetadata = new Map<
  Function,
  Record<string, Record<string, unknown>[]>
>();
