const LEVEL_INFO = 'info';
const LEVEL_DEBUG = 'debug';
const LEVEL_WARNING = 'warning';
const LEVEL_ERROR = 'error';
const LEVEL_FATAL = 'fatal';

const defaultConfig = {
  url: null,
  key: null,
  release: null,
  locale: null,
  location: null,
  environment: null,
  platform: null,
};

function traceError(e = new Error()) {
  if (!e.stack) try {
    // IE requires the Error to actually be throw or else the Error's 'stack' property is undefined.
    throw e;
  } catch (e) {
    if (!e.stack) {
      // IE < 10
      return {
        filename: undefined,
        line: undefined,
        column: undefined,
        backtrace: undefined,
      };
    }
  }

  const backtrace = e.stack.toString();
  const stack = backtrace.split(/\r\n|\n/);
  const regex = /(http.*):(\d+):(\d+)/;
  const frame = stack.find(msg => regex.test(msg));
  if (!frame) return {
    filename: undefined,
    line: undefined,
    column: undefined,
    backtrace: undefined,
  };
  const [_, file, line, column] = regex.exec(frame);
  return {
    file,
    line,
    column,
    backtrace,
  };
}

class Logger {
  constructor(config = defaultConfig) {
    if (!config.url || !config.key || !config.release || !config.locale ||
      !config.location || !config.environment || !config.platform) {
      throw new Error('[lalamove-web-logger] Missing configuration. Please check documentation' +
        ' for the usage.');
    }
    this._config = config;
    if (window) {
      window.onerror = this._handleOnError;
    }
  }

  async _post(data) {
    try {
      const response = await fetch(this._config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Basic ${this._config.key}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Unhandled error');
      }

      return response;
    } catch (e) {
      console.error(e);
    }
  }

  _logger = (level) => (message, file, line, col, err, context) => {
    let [sourceFile, sourceLine] = [file, line];
    let backtrace = err && err.stack;

    if (!sourceFile && !sourceLine) {
      const stack = traceError();
      sourceFile = stack.file || 'unknown';
      sourceLine = stack.line || 0;
      if (!backtrace) {
        backtrace = stack.backtrace || 'unknown';
      }
    }

    if (!message) {
      return false;
    }

    switch (level) {
      case LEVEL_WARNING:
        console.warn(`[${level}] ${message}`);
        break;
      case LEVEL_ERROR:
      case LEVEL_FATAL:
        console.error(`[${level}] ${message}`);
        break;
      default:
        console.log(`[${level}] ${message}`);
    }

    const data = {
      level,
      message,
      time: new Date().toISOString(),
      src_file: sourceFile,
      src_line: sourceLine.toString(),
      context: {
        ...context,
        release: this._config.release,
        locale: this._config.locale,
        location: this._config.location,
        environment: this._config.environment,
        platform: this._config.platform,
        agent: navigator && navigator.userAgent,
      },
      backtrace,
    };

    this._post(data);
    return true;
  };

  _handleOnError = (message, file, line, col, err) =>
    this._logger(LEVEL_ERROR)(message, file, line, col, err);

  changeLocation(location) {
    this._config.location = location;
  }

  changeLocale(locale) {
    this._config.locale = locale;
  }

  info = (message, context) =>
    this._logger(LEVEL_INFO)(message, null, null, null, null, context);

  debug = (message, context) =>
    this._logger(LEVEL_DEBUG)(message, null, null, null, null, context);

  warning = (message, context) =>
    this._logger(LEVEL_WARNING)(message, null, null, null, null, context);

  error = (message, context, errStack) =>
    this._logger(LEVEL_ERROR)(message, null, null, null, { stack: errStack }, context);

  fatal = (message, context, errStack) =>
    this._logger(LEVEL_FATAL)(message, null, null, null, { stack: errStack }, context);
}

export { Logger as default, traceError };
