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

## Contributing
If you're interested in running this on your machine, follow this guide!

### Technology
| Slim  | PHP | MySQL |
| ------------- | ------------- | ------------ |
| <img src="https://i.imgur.com/pYqFkCS.png" height="150"/>  | <img src="https://i.imgur.com/mUipxhX.png" height="150"/>  | <img src="https://i.imgur.com/cD32cDt.png" height="150"/> |

### Basic dependencies
This IFTTT applet makes use of PHP. The currently recommended version to develop with is PHP v7.1.23, so ensure you have that installed.

### Running it locally
1. Install your dependencies by running `php composer.phar install`.
1. Run `php -S localhost:8080 -t public public/index.php` to run the API on port 8080.

### Debugging
We recommend using XDebug.
