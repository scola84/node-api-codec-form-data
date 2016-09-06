import { Transform } from 'stream';
import Busboy from 'busboy';

export default class FormDataDecoder extends Transform {
  constructor(options, request) {
    super({
      objectMode: true
    });

    const result = {};

    this._decoder = new Busboy(Object.assign({
      headers: request.headers()
    }, options));

    this._decoder.once('error', (error) => {
      this._decoder.removeAllListeners();
      this.emit('error', error);
    });

    this._decoder.addListener('field', (name, value) => {
      result[name] = value;
    });

    this._decoder.addListener('file', (name, fileStream, fileName,
      encoding, mimeType) => {

      fileStream.emit('end');
      result[name] = {
        fileStream,
        fileName,
        encoding,
        mimeType
      };
    });

    this._decoder.once('finish', () => {
      this._decoder.removeAllListeners();
      this.push(result);
    });
  }

  _transform(chunk, encoding, callback) {
    this._decoder.write(chunk);
    callback();
  }
}
