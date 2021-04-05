import { DeepCopy } from './DeepCopy';

export const DeepPatch = (
  dist: Record<string, unknown>,
  src: Record<string, unknown>
) => {
  const distKeys = Object.keys(dist);
  const srcKeys = Object.keys(src);
  distKeys.forEach((key) => {
    if (!srcKeys.includes(key)) {
      delete dist[key];
    }
  });
  srcKeys.forEach((key) => {
    if (!dist[key]) {
      dist[key] = DeepCopy(src[key]);
    } else {
      if (typeof src[key] === 'object' && src[key] && dist[key]) {
        if (src[key] !== dist[key]) {
          DeepPatch(
            dist[key] as Record<string, unknown>,
            src[key] as Record<string, unknown>
          );
        }
      } else {
        dist[key] = DeepCopy(src[key]);
      }
    }
  });
};
