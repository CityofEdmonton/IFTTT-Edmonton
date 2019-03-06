# Edmonton IFTTT Triggers and Applets

| City of Edmonton  | IFTTT |
| ------------- | ------------- |
| <img src="https://i.imgur.com/DQtFLdv.png" height="150"/>  | <img src="https://i.imgur.com/kVKOYiQ.png" height="150"/>  |

## Triggers
IFTTT triggers cause IFTTT actions to occur. Sometimes, a value changing somewhere is a trigger. Other times, someone making changes to a Google Document triggers an action.

### Light the Bridge
This triggers when the color on the High-level bridge changes.

### AQH Index
Pulled from [here](http://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/CommunityAQHIs(67)). When the air index changes, IFTTT actions can be triggered.

### AQH Risk
Also pulled from [here](http://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/CommunityAQHIs(67)). When the air quality risk changes, IFTTT actions are triggered.

## Deployment
These are deployed using Heroku.

### Environment Variables
These variables configure the application.

| Variable | Default value |
| ------------- | ------------- | ------------ |
| REDIS_PORT | 6379 |
| REDIS_HOST | localhost |
| REDIS_PASSWORD | myPassword |
| AIR_QUALITY_URL | https://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/CommunityAQHIs |

## Contributing
If you're interested in running this on your machine, follow this guide!

### Technology
| Node.js  | Express | Redis |
| ------------- | ------------- | ------------ |
| <img src="https://i.imgur.com/yw49mjp.png" height="150"/>  | <img src="https://i.imgur.com/CucU5nR.png" height="150"/>  | <img src="https://i.imgur.com/FCLDdj6.png" height="150"/> |

### Basic dependencies
This IFTTT applet makes use of Node.js. The currently recommended version to develop with is Node v9.11.1, so ensure you have that installed. We also recommend Docker for running Redis easily.

### Running it locally
1. Install your dependencies by running `npm install`.
1. Run `docker-compose up` to start Redis.
1. Run `npm run start` to run the API on port 3000.

### Debugging
We recommend using VS Code's autoattach functionality.
