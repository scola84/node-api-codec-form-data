const type = 'multipart/form-data';

import { default as Decoder } from './src/decoder';

export const codec = {
  Decoder,
  type
};

export function decoder(options) {
  return {
    type,
    create: (request) => new Decoder(options, request)
  };
}
