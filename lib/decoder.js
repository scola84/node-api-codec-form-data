const stream = require('stream');
const Busboy = require('busboy');

class FormDataDecoder extends stream.Transform {
  constructor(options, request) {
    super({
      objectMode: true
    });

    const result = {};

    this.decoder = new Busboy(Object.assign({
      headers: request.headers
    }, options));

    this.decoder.once('error', (error) => {
      this.decoder.removeAllListeners();
      this.emit('error', error);
    });

    this.decoder.on('field', (name, value) => {
      result[name] = value;
    });

    this.decoder.on('file', (name, fileStream, fileName,
      encoding, mimeType) => {

      fileStream.emit('end');
      result[name] = {
        fileStream,
        fileName,
        encoding,
        mimeType
      };
    });

    this.decoder.once('finish', () => {
      this.decoder.removeAllListeners();
      this.push(result);
    });
  }

  _transform(chunk, encoding, callback) {
    this.decoder.write(chunk);
    callback();
  }
}

module.exports = FormDataDecoder;
