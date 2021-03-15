export class NoixObject {
  private static __metadata: {
    name: string;
    meta: Record<string, Record<string, unknown>>;
  } = { name: NoixObject.name, meta: {} };

  public static Metadata = (name: string, value?: unknown) => <
    T extends NoixObject
  >(
    target: T,
    fieldName: string
  ) => {
    const classObject = <typeof NoixObject>target.constructor;
    const metadata = classObject.__metadata;
    if (metadata.name === classObject.name) {
      if (!metadata.meta[fieldName]) {
        metadata.meta[fieldName] = {};
      }
      metadata.meta[fieldName][name] = value || true;
    } else {
      classObject.__metadata = {
        name: classObject.name,
        meta: { ...metadata.meta, fieldName: { name: value || true } }
      };
    }
  };

  public static GetMetadata<T extends typeof NoixObject>(
    classObject: T,
    fieldName: string,
    name: string
  ) {
    const metadata = classObject.__metadata.meta[fieldName];
    if (metadata) {
      return metadata[name];
    }
  }
}
