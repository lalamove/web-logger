import traceError from './traceError';

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
  clientId: null,
  appType: null
};

class Logger {
  constructor(config = defaultConfig) {
    if (
      !config.url ||
      !config.key ||
      !config.release ||
      !config.locale ||
      !config.location ||
      !config.environment ||
      !config.platform ||
      !config.appType
    ) {
      throw new Error(
        '[lalamove-web-logger] Missing configuration. Please check documentation' +
          ' for the usage.'
      );
    }
    this._config = config;
    window.onerror = this._handleOnError;
  }

  async _post(data) {
    try {
      const response = await fetch(this._config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Basic ${this._config.key}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Unhandled error');
      }

      return response;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  _logger = (level, { message, file, line, backtrace, context }) => {
    let [sourceFile, sourceLine] = [file, line];

    if (!sourceFile && !sourceLine) {
      const stack = traceError();
      sourceFile = stack.file || 'unknown';
      sourceLine = stack.line || 0;
      if (!backtrace) {
        backtrace = stack.backtrace || 'unknown'; // eslint-disable-line no-param-reassign
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
        app_type: this._config.appType,
        agent: navigator && navigator.userAgent,
        url: window.location && window.location.href,
        ...(this._config.clientId && { client_id: this._config.clientId })
      },
      backtrace
    };

    // non-blocking call
    this._post(data);
    return true;
  };

  _handleOnError = (message, file, line, col, err) =>
    this._logger(LEVEL_ERROR, {
      message,
      file,
      line,
      backtrace: err && err.stack
    });

  changeLocation(location) {
    this._config.location = location;
  }

  changeLocale(locale) {
    this._config.locale = locale;
  }

  changeClientId(id) {
    this._config.clientId = id;
  }

  info = (message, context) => this._logger(LEVEL_INFO, { message, context });

  debug = (message, context) => this._logger(LEVEL_DEBUG, { message, context });

  warning = (message, context) =>
    this._logger(LEVEL_WARNING, { message, context });

  error = (message, context, backtrace) =>
    this._logger(LEVEL_ERROR, { message, backtrace, context });

  fatal = (message, context, backtrace) =>
    this._logger(LEVEL_FATAL, { message, backtrace, context });
}

export default Logger;
