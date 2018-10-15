# lalamove-web-logger [![Build Status](https://travis-ci.org/andrewmmc/lalamove-web-logger.svg?branch=master)](https://travis-ci.org/andrewmmc/lalamove-web-logger) [![Coverage Status](https://coveralls.io/repos/github/andrewmmc/lalamove-web-logger/badge.svg?branch=master&service=github)](https://coveralls.io/github/andrewmmc/lalamove-web-logger?branch=master)

v0.4.2

A logger Javascript SDK to send client side errors or logs to custom logging services, based on Lalamove's log format.

## Install
```bash
yarn add lalamove-web-logger
```

## Usage
### Modules
Create a file to init the logger:
```javascript
import Logger from 'lalamove-web-logger';

// Init config
// Will auto catch window.onerror to logging services after init
const log = new Logger({
    url: 'https://log.dev.lalamove.com', // Logging services URL, required
    key: 'API_KEY', // Credential key, required
    release: '2.0.0', // Product version, required
    locale: 'zh_HK', // required
    location: 'HK_HKG', // required
    environment: 'test', // Environment, required
    platform: 'webapp' // required
});

export default log;
```
Then you can use it with import:
```javascript
import log from './log';

// Custom log message
log.info('testing message');
```
### React Error Boundaries
[Read here](https://reactjs.org/docs/error-boundaries.html) for more details of Error Boundaries in React.

Create a component called `ErrorBoundary`:
```jsx
import { Component } from 'react';
import log from './log';

export default class ErrorBoundary extends Component {
  static componentDidCatch(error, info) {
    const errorMessage = error.toString();
    log.error(errorMessage, null, info.componentStack);
  }

  render() {
    return this.props.children;
  }
}
```
Then you can use it as a regular component:
```jsx
<ErrorBoundary>
  <BlahBlahBlah />
</ErrorBoundary>
```

### Old-school way
Your application should get the build from `node_modules/lalamove-web-logger/index.iife.js` (after `yarn`), and add it in the `<head>`.
```html
<script src="node_modules/lalamove-web-logger/index.iife.js"></script>
<script>
// Init config
// Will auto catch window.onerror to logging services after init
var log = new Logger({
    url: 'https://log.dev.lalamove.com', // Logging services URL, required
    key: 'API_KEY', // Credential key, required
    release: '2.0.0', // Product version, required
    locale: 'zh_HK', // required
    location: 'HK_HKG', // required
    environment: 'test', // Environment, required
    platform: 'webapp' // required
});

// Custom log message
log.info('testing message');
</script>
```

## API
#### changeLocation()
Change location in config.
```javascript
log.changeLocation('TW_TPE');
```
#### changeLocale()
Change locale in config.
```javascript
log.changeLocale('zh_TW');
```
#### info()
Custom info log.
```javascript
log.info('blahblahblah');

// Destructuring the object in second argument to context when sending data to logging services
log.info('blahblahblah', { customKey: 'message' });
```
#### debug()
Custom debug log.
```javascript
log.debug('blahblahblah');

// Destructuring the object in second argument to context when sending data to logging services
log.debug('blahblahblah', { customKey: 'message' });
```
#### warning()
Custom warning log.
```javascript
log.warning('blahblahblah');

// Destructuring the object in second argument to context when sending data to logging services
log.warning('blahblahblah', { customKey: 'message' });
```
#### error()
Custom error log.
```javascript
log.error('blahblahblah');

// Destructuring the object in second argument to context when sending data to logging services
log.error('blahblahblah', { customKey: 'message' });

// Custom error stack trace string
log.error('blahblahblah', { customKey: 'message' }, 'Error: error message↵ at Home._this.render(https://blah.com/index.js:1:1)');
```
#### fatal()
Custom fatal log.
```javascript
log.fatal('blahblahblah');

// Destructuring the object in second argument to context when sending data to logging services
log.fatal('blahblahblah', { customKey: 'message' });

// Custom error stack trace string
log.fatal('blahblahblah', { customKey: 'message' }, 'Error: error message↵ at Home._this.render(https://blah.com/index.js:1:1)');
```

## Features
### Log format

The output of the log will be posted to the logging services in the JSON format below:
```
{
    "message": "", // Describing what happened
    "src_file": "", // File path
    "src_line": "", // Line number
    "context": {
        "agent": "", // navigator.userAgent
        "environment": "",
        "locale": "",
        "location": "",
        "platform": "",
        "release": ""
        // Destructuring custom context here
    },
    "level": "", // Log level: debug/info/warning/error/fatal
    "time": "", // ISO8601.nanoseconds+TZ
    "backtrace": "" // Error stack
}
```

## Run Tests
```bash
yarn test
```

## Browsers Support
We use `window.fetch` to send out network request to custom logging services. If you would like to support [older browsers](https://caniuse.com/#search=fetch), you need to import [github/fetch](https://github.com/github/fetch) and [taylorhakes/promise-polyfill](https://github.com/taylorhakes/promise-polyfill).
* Chrome
* Firefox
* Safari
* Edge

## License
- [MIT License](LICENSE.md)

## Report issues / Support
- andrew.mok@lalamove.com
- alpha.wong@lalamove.com
