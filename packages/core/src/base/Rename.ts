export const Rename = (newName: string) => {
  return <T extends Object>(target: T, name: string) => {
    const t = target as Record<string, unknown>;
    t[newName] = t[name];
  };
};
