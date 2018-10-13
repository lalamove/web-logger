import fetchMock from 'fetch-mock';
import Logger from '../src/index';

const config = {
  url: 'https://log.dev.lalamove.com/',
  key: 'DUMMY_KEY',
  release: '1.0.0',
  locale: 'en_HK',
  location: 'HK_HKG',
  environment: 'dev',
  platform: 'webapp',
};

describe('lalamove-web-logger tests', () => {
  let log;

  beforeAll(() => {
    fetchMock
      .mock((
        url,
        { headers }) => url === config.url && headers.Authorization === `Basic ${config.key}`, 200);
  });

  afterAll(() => {
    // runs after all tests in this block
  });

  beforeEach(() => {
    log = new Logger(config);
  });

  afterEach(() => {
    // runs after each test in this block
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
    expect(result).toBe(true);
    console.log.mockClear();
  });

  test('should log message as debug level', ()=> {
    console.log = jest.fn();
    const result = log.debug('debug message');
    expect(console.log).toHaveBeenCalledWith('[debug] debug message');
    expect(result).toBe(true);
    console.log.mockClear();
  });

  test('should log message as warning level', () => {
    console.warn = jest.fn();
    const result = log.warning('warning message');
    expect(global.console.warn).toHaveBeenCalledWith('[warning] warning message');
    expect(result).toBe(true);
    console.warn.mockClear();
  });

  test('should log message as error level', () => {
    console.error = jest.fn();
    const result = log.error('error message');
    expect(console.error).toHaveBeenCalledWith('[error] error message');
    expect(result).toBe(true);
    console.error.mockClear();
  });

  test('should log message as fatal level', () => {
    console.error = jest.fn();
    const result = log.fatal('fatal message');
    expect(console.error).toHaveBeenCalledWith('[fatal] fatal message');
    expect(result).toBe(true);
    console.error.mockClear();
  });
});
