import traceError from '../traceError';

describe('traceError tests', () => {
  test('expected to return file, line, column and backtrace', () => {
    const error = {
      message: 'error message',
      stack:
        'Error: error message↵    at Home._this.render' +
        ' (https://web.lalamove.com/static/js/bundle.js:1:1)'
    };
    const result = traceError(error);
    expect(result).toEqual({
      file: 'https://web.lalamove.com/static/js/bundle.js',
      line: '1',
      column: '1',
      backtrace: error.stack
    });
  });

  test('expected to return undefined file, line, column and backtrace for IE', () => {
    const error = {
      message: 'error message'
    };
    const result = traceError(error);
    expect(result).toEqual({
      file: undefined,
      line: undefined,
      column: undefined,
      backtrace: undefined
    });
  });
});
