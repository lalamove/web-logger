# web-logger
v0.1.1 (Work in progress)

Logging front-end errors / custom log to logging services, based on Lalamove k8s logging format.

## Install
```
yarn add web-logger
```

## Usage
### Modules
```
import WebLogger from 'llm-web-logger';

// init the config
const Logger = WebLogger({
    url: '', // Logging services URL
    credential: '', // Credential key, required
    release: '1', // Version, required
    locale: 'zh_HK', // required
    location: 'HK_HKG', // required
    environment: 'test', // Server environment, required
    platform: 'webapp' // required
});

// Will auto catch error to logging services after init

// info log
Logger.info('message', { data: 'custom data' });
```
### React error boundaries

### Old-school way
```
<script src="./llm-web-logger.min.js"></script>
<script>
var Logger = logger({
    url: '', // Logging services URL
    credential: '', // Credential key, required
    release: '1', // Version, required
    locale: 'zh_HK', // required
    location: 'HK_HKG', // required
    environment: 'test', // Server environment, required
    platform: 'webapp' // required
})

// Will auto catch error to logging services after init

// info log
Logger.info('message', { data: 'custom data' });
</script>
```

## Features
### Log format

The output of the log will be posted to the logging services in the JSON format below:
```
{
    "message": "", // string describing what happened
    "src_file": "", // file path
    "src_line": "", // line number
    "context": {
        "agent": "",
        "environment": "test",
        "locale": "zh_HK",
        "location": "HK_HKG",
        "platform": "webapp",
        "release": "1",
        // custom field here
    },
    "level": "", // debug/info/warning/error/fatal
    "time": "", // ISO8601.nanoseconds+TZ
    "backtrace": "" // eorrr stack
}
```
## Todo
* Test coverage
* Files minify
* .....

## License
- [MIT License](LICENSES.md)
