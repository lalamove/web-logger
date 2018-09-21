'use strict';

(function () {
  // constant
  var LEVEL_INFO = 'info';
  var LEVEL_DEBUG = 'debug';
  var LEVEL_WARNING = 'warning';
  var LEVEL_ERROR = 'error';
  var LEVEL_FATAL = 'fatal';

  // private config
  var config = {
    url: null,
    credential: null, // required
    release: null, // required
    locale: null, // required
    location: null, // required
    environment: null, // required
    platform: 'webapp' // required
  };

  // private methods
  var setConfig = function (object) {
    if (!object || (!object.url || !object.credential || !object.release || !object.locale || !object.location || !object.environment || !object.platform)) {
      throw new Error('[web-logger] Missing configuration. Please check documentation for the' +
        ' usage.')
    }
    config.url = object.url;
    config.credential = object.credential;
    config.release = object.release;
    config.locale = object.locale;
    config.location = object.location;
    config.environment = object.environment;
    config.platform = object.platform;
  };

  var sendLogRequest = function (data) {
    try {
      var request = new XMLHttpRequest();
      request.open('POST', config.url, true);
      request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
      request.send(JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  var getLogger = function (level) {
    return function (message, source, line, col, err, context) {
      var data = {
        level: level,
        message: message,
        time: (new Date()).toISOString(),
        src_file: source,
        src_line: line,
        context: {
          release: config.release,
          locale: config.locale,
          location: config.location,
          environment: config.environment,
          platform: config.platform,
          agent: (navigator && navigator.userAgent) ? navigator.userAgent : ''
        },
        backtrace: (err && err.stack) ? err.stack : undefined
      };

      if (context) {
        for (var key in context){
          if(context.hasOwnProperty(key)) {
            data['context'][key] = context[key];
          }
        }
      }

      switch (level) {
        case LEVEL_WARNING:
          console.warn('[' + level + '] ' + message);
          break;
        case LEVEL_ERROR:
        case LEVEL_FATAL:
          console.error('[' + level + '] ' + message);
          break;
        default:
          console.log('[' + level + '] ' + message);
      }

      sendLogRequest(data);
    };
  };

  // public methods
  var handleCustomLog = function (level) {
    return function (message, context) {
      // TODO: following values
      return getLogger(level)(message, '', '', '', '', context);
    }
  };

  var handleOnError = function (message, source, line, col, err) {
    if (!config.url) {
      // missing url in config, fire default event handler
      return false;
    }
    getLogger('error')(message, source, line, col, err);
    return true;
  };

  var logger = function (config) {
    setConfig(config);
    return {
      info: handleCustomLog(LEVEL_INFO),
      debug: handleCustomLog(LEVEL_DEBUG),
      warning: handleCustomLog(LEVEL_WARNING),
      error: handleCustomLog(LEVEL_ERROR),
      fatal: handleCustomLog(LEVEL_FATAL)
    };
  };

  window.onerror = handleOnError;
  if (typeof module === 'object' && module.exports) {
    module.exports = logger;
    // window.logger = logger;
  } else {
    window.logger = logger;
  }
})();
