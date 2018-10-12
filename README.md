# lalamove-web-logger
v0.3.0

A logger Javascript SDK to log client side errors / logs to custom logging services, based on Lalamove's logging format.

## Install
```

```

## Usage
### Modules
```
import Logger from 'lalamove-web-logger';

// Init config
const log = new Logger({
    url: 'https://log.dev.lalamove.com', // Logging services URL, required
    key: 'API_KEY', // Credential key, required
    release: '2.0.0', // Product version, required
    locale: 'zh_HK', // required
    location: 'HK_HKG', // required
    environment: 'test', // Environment, required
    platform: 'webapp' // required
});

// Will auto catch error (window.onerror) to logging services after init

// Custom log, debug/info/warning/error/fatal
log.debug('message');
log.info('message');
log.info('message', { data: 'custom data' });
```
### React error boundaries
```
```

### Old-school way
```
<script src="(use iife version, will be provided later)"></script>
<script>
// Init config
var log = Logger({
    url: 'https://log.dev.lalamove.com', // Logging services URL, required
    key: 'API_KEY', // Credential key, required
    release: '2.0.0', // Product version, required
    locale: 'zh_HK', // required
    location: 'HK_HKG', // required
    environment: 'test', // Environment, required
    platform: 'webapp' // required
})

// Will auto catch error (window.onerror) to logging services after init

// Custom log, debug/info/warning/error/fatal
log.debug('message');
log.info('message');
log.info('message', { data: 'custom data' });
</script>
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
        "agent": "", // Navigator userAgent
        "environment": "",
        "locale": "",
        "location": "",
        "platform": "",
        "release": "",
        // Custom data here
    },
    "level": "", // Log level: debug/info/warning/error/fatal
    "time": "", // ISO8601.nanoseconds+TZ
    "backtrace": "" // Error stack
}
```
## Todo
* Tests and test coverage
* Usage / Examples
* .....

## License
- [MIT License](LICENSE.md)

## Report issues / Support
- andrew.mok@lalamove.com
- alpha.wong@lalamove.com
