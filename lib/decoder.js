const stream = require('stream');
const Busboy = require('busboy');

class FormDataDecoder extends stream.Transform {
  constructor(options, request) {
    super({
      objectMode: true
    });

    const result = {};

    this.busboy = new Busboy(Object.assign({
      headers: request.headers
    }, options));

    this.busboy.on('error', (error) => {
      this.emit('error', error);
    });

    this.busboy.on('field', (name, value) => {
      result[name] = value;
    });

    this.busboy.on('file', (name, fileStream, fileName,
      encoding, mimeType) => {

      fileStream.emit('end');
      result[name] = {
        fileStream,
        fileName,
        encoding,
        mimeType
      };
    });

    this.busboy.on('finish', () => {
      this.push(result);
    });
  }

  _transform(chunk, encoding, callback) {
    this.busboy.write(chunk);
    callback();
  }
}

module.exports = FormDataDecoder;
