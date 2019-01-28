import fetchMock from 'fetch-mock';
import Logger from '../index';

const config = {
  url: 'https://log.dev.lalamove.com/',
  key: 'DUMMY_KEY',
  release: '1.0.0',
  locale: 'en_HK',
  location: 'HK_HKG',
  environment: 'dev',
  platform: 'webapp',
  clientId: null
};

describe('lalamove-web-logger tests', () => {
  beforeAll(() => {
    fetchMock
      .mock(
        (url, { headers }) =>
          url === config.url && headers.Authorization === `Basic ${config.key}`,
        200
      )
      .mock('*', 401);
  });

  describe('change config', () => {
    test('should init default config', () => {
      const log = new Logger(config);
      expect(log._config).toBe(config);
    });

    test('should change the location to TW_TPE', () => {
      const log = new Logger(config);
      log.changeLocation('TW_TPE');
      expect(log._config.location).toBe('TW_TPE');
    });

    test('should change the locale to zh_TW', () => {
      const log = new Logger(config);
      log.changeLocale('zh_TW');
      expect(log._config.locale).toBe('zh_TW');
    });

    test('login as clientId 20', () => {
      const log = new Logger(config);
      log.changeClientId(20);
      expect(log._config.clientId).toBe(20);
    });

    test('logout', () => {
      const log = new Logger(config);
      log.changeClientId(null);
      expect(log._config.clientId).toBe(null);
    });
  });

  describe('log errors', () => {
    beforeEach(() => {
      console.log = jest.fn();
      console.warn = jest.fn();
      console.error = jest.fn();
    });

    test('info', () => {
      const log = new Logger(config);
      const result = log.info('testing message');
      expect(console.log).toHaveBeenCalledWith('[info] testing message');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    test('info with custom field', () => {
      const log = new Logger(config);
      const result = log.info('testing message', { testing: 'testing' });
      expect(console.log).toHaveBeenCalledWith('[info] testing message');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    test('debug', () => {
      const log = new Logger(config);
      const result = log.debug('debug message');
      expect(console.log).toHaveBeenCalledWith('[debug] debug message');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    test('warning', () => {
      const log = new Logger(config);
      const result = log.warning('warning message');
      expect(console.warn).toHaveBeenCalledWith('[warning] warning message');
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    test('error', () => {
      const log = new Logger(config);
      const result = log.error('error message');
      expect(console.error).toHaveBeenCalledWith('[error] error message');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    test('error with backtrace', () => {
      const log = new Logger(config);
      const errorStack =
        'Error: error message↵    at Home._this.render' +
        ' (https://web.lalamove.com/static/js/bundle.js:1:1)';
      const result = log.error('error message', null, errorStack);
      expect(console.error).toHaveBeenCalledWith('[error] error message');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    test('fatal', () => {
      const log = new Logger(config);
      const result = log.fatal('fatal message');
      expect(console.error).toHaveBeenCalledWith('[fatal] fatal message');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    test('fatal with backtrace', () => {
      const log = new Logger(config);
      const errorStack =
        'Error: error message↵    at Home._this.render' +
        ' (https://web.lalamove.com/static/js/bundle.js:1:1)';
      const result = log.fatal('fatal message', null, errorStack);
      expect(console.error).toHaveBeenCalledWith('[fatal] fatal message');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    test('trigger when window.onerror happens', () => {
      const log = new Logger(config); // eslint-disable-line no-unused-vars
      const result = window.onerror('error message', 'index.js', 1, 1, {
        stack: 'track stack'
      });
      expect(console.error).toHaveBeenCalledWith('[error] error message');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    test('should return false', () => {
      const log = new Logger(config);
      const result = log.info();
      expect(console.log).toHaveBeenCalledTimes(0);
      expect(result).toBe(false);
    });

    afterEach(() => {
      console.log.mockClear();
      console.warn.mockClear();
      console.error.mockClear();
    });
  });

  describe('post to logging services', () => {
    test('should return 200', async () => {
      const log = new Logger({
        ...config,
        clientId: 20
      });
      const { status } = await log._post();
      expect(status).toEqual(200);
    });

    test('should fail to post', async () => {
      const log = new Logger({
        ...config,
        key: 'WRONG_KEY'
      });

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
        const log = new Logger(); // eslint-disable-line no-unused-vars
      }).toThrow(
        '[lalamove-web-logger] Missing configuration. Please check documentation for' +
          ' the usage.'
      );
    });
  });
});
