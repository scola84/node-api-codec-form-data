const Decoder = require('./lib/decoder');
const type = 'multipart/form-data';

function decoder(options) {
  return {
    type,
    create: (request) => new Decoder(options, request)
  };
}

module.exports = {
  type,
  Decoder,
  decoder
};
