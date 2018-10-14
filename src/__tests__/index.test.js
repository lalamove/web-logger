import fetchMock from 'fetch-mock';
import Logger from '../index';

const config = {
  url: 'https://log.dev.lalamove.com/',
  key: 'DUMMY_KEY',
  release: '1.0.0',
  locale: 'en_HK',
  location: 'HK_HKG',
  environment: 'dev',
  platform: 'webapp'
};

describe('lalamove-web-logger tests', () => {
  let log;

  describe('initialized Logger with config', () => {
    beforeAll(() => {
      fetchMock.mock(
        (url, { headers }) =>
          url === config.url && headers.Authorization === `Basic ${config.key}`,
        200
      );
    });

    beforeEach(() => {
      log = new Logger(config);
    });

    test('should init default config', () => {
      expect(log._config).toBe(config);
    });

    test('should change the location to TW_TPE', () => {
      log.changeLocation('TW_TPE');
      expect(log._config.location).toBe('TW_TPE');
    });

    test('should change the locale to zh_TW', () => {
      log.changeLocale('zh_TW');
      expect(log._config.locale).toBe('zh_TW');
    });

    test('should log message as info level', () => {
      console.log = jest.fn();
      const result = log.info('testing message');
      expect(console.log).toHaveBeenCalledWith('[info] testing message');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      console.log.mockClear();
    });

    test('should log message as info level with custom context', () => {
      console.log = jest.fn();
      const result = log.info('testing message', { testing: 'testing' });
      expect(console.log).toHaveBeenCalledWith('[info] testing message');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      console.log.mockClear();
    });

    test('should log message as debug level', () => {
      console.log = jest.fn();
      const result = log.debug('debug message');
      expect(console.log).toHaveBeenCalledWith('[debug] debug message');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      console.log.mockClear();
    });

    test('should log message as warning level', () => {
      console.warn = jest.fn();
      const result = log.warning('warning message');
      expect(console.warn).toHaveBeenCalledWith('[warning] warning message');
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      console.warn.mockClear();
    });

    test('should log message as error level', () => {
      console.error = jest.fn();
      const result = log.error('error message');
      expect(console.error).toHaveBeenCalledWith('[error] error message');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      console.error.mockClear();
    });

    test('should log message as error level with backtrace', () => {
      console.error = jest.fn();
      const errorStack =
        'Error: error message↵    at Home._this.render' +
        ' (https://web.lalamove.com/static/js/bundle.js:1:1)';
      const result = log.error('error message', null, errorStack);
      expect(console.error).toHaveBeenCalledWith('[error] error message');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      console.error.mockClear();
    });

    test('should log message as fatal level', () => {
      console.error = jest.fn();
      const result = log.fatal('fatal message');
      expect(console.error).toHaveBeenCalledWith('[fatal] fatal message');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      console.error.mockClear();
    });

    test('should log message as fatal level with backtrace', () => {
      console.error = jest.fn();
      const errorStack =
        'Error: error message↵    at Home._this.render' +
        ' (https://web.lalamove.com/static/js/bundle.js:1:1)';
      const result = log.fatal('fatal message', null, errorStack);
      expect(console.error).toHaveBeenCalledWith('[fatal] fatal message');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      console.error.mockClear();
    });

    test('should call window.onerror', () => {
      console.error = jest.fn();
      const result = window.onerror('error message', 'index.js', 1, 1, {
        stack: 'track stack'
      });
      expect(console.error).toHaveBeenCalledWith('[error] error message');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      console.error.mockClear();
    });

    test('should return false if no message defined', () => {
      console.log = jest.fn();
      const result = log.info();
      expect(console.log).toHaveBeenCalledTimes(0);
      expect(result).toBe(false);
      console.log.mockClear();
    });
  });

  describe('initialized Logger with config and wrong key', () => {
    beforeAll(() => {
      fetchMock
        .mock(
          (url, { headers }) =>
            url === config.url &&
            headers.Authorization === `Basic ${config.key}`,
          200
        )
        .mock('*', 401);
    });

    test('should fail to post data request', async () => {
      const { key: _, ...omitedConfig } = config;
      omitedConfig.key = 'WRONG_KEY';
      log = new Logger(omitedConfig);

      try {
        await log._post();
      } catch (e) {
        expect(e).toEqual('Unhandled error');
      }
    });
  });

  describe('initialized Logger without config', () => {
    test('expected error to be throw', () => {
      expect(() => {
        log = new Logger();
      }).toThrow(
        '[lalamove-web-logger] Missing configuration. Please check documentation for' +
          ' the usage.'
      );
    });
  });
});
