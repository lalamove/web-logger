# llm-web-logger
v0.1.1 (Work in progress)

A logger Javascript SDK to log client side errors / logs to custom logging services, based on Lalamove's logging format.

## Install
```
yarn add llm-web-logger
```

## Usage
### Modules
```
import WebLogger from 'llm-web-logger';

// Init config
const Logger = WebLogger({
    url: '', // Logging services URL, required
    credential: 'API_KEY', // Credential key, required
    release: '2.0.0', // Product version, required
    locale: 'zh_HK', // required
    location: 'HK_HKG', // required
    environment: 'test', // Server environment, required
    platform: 'webapp' // required
});

// Will auto catch error to logging services after init

// Log debug/info/warning/error/fatal
Logger.info('message');
Logger.info('message', { data: 'custom data' });
```
### React error boundaries
```
```

### Old-school way
```
<script src="./llm-web-logger.js"></script>
<script>
// Init config
var Logger = logger({
    url: '', // Logging services URL, required
    credential: 'API_KEY', // Credential key, required
    release: '2.0.0', // Product version, required
    locale: 'zh_HK', // required
    location: 'HK_HKG', // required
    environment: 'test', // Server environment, required
    platform: 'webapp' // required
})

// Will auto catch error to logging services after init

// Log debug/info/warning/error/fatal
Logger.info('message');
Logger.info('message', { data: 'custom data' });
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
* Files minify
* Usage / Examples
* .....

## License
- [MIT License](LICENSE.md)

## Report issues / Support
- andrew.mok@lalamove.com
- alpha.wong@lalamove.com
