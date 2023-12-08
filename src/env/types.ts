export type EnvType<T extends readonly string[]> = Record<T[number], string>;
