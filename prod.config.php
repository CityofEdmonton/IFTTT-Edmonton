<?php
$MYSQL_HOST = getenv('MYSQL_HOST');
$MYSQL_DB = getenv('MYSQL_DB');
$MYSQL_USER = getenv('MYSQL_USER');
$MYSQL_PASS = getenv('MYSQL_PASS');
$IFTTT_USER = getenv('IFTTT_USER');
$IFTTT_PASS = getenv('IFTTT_PASS');
return [
    'settings' => [
        'displayErrorDetails' => false, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        'system' => [
            'domain' => 'https://ifttt-edmonton.herokuapp.com/',
            'max_file_size' => (10 * 1024 * 1024) //5mb
        ],
        // Renderer settings
        'view' => [
            'template_path' => __DIR__ . '/DOC_ROOT/templates/views', // Replace DOC_ROOT with the project directory path.
            'cache_path' => __DIR__ . '/DOC_ROOT/templates/tmp', // Replace DOC_ROOT with the project directory path.
            'debug' => true,
            'cache' => false
        ],
        // Monolog settings
        'logger' => [
            'name' => 'HansWurst90',
            'path' => __DIR__ . '/doc_root/logs/app.log', // Replace doc_root with the project directory path.
            'level' => \Monolog\Logger::DEBUG,
        ],
        'ifttt' => [
            'username' => $IFTTT_USER,
            'password' => $IFTTT_PASS
        ],
        'db' => [
            'driver' => 'mysql',
            'host' => $MYSQL_HOST,
            'database' => $MYSQL_DB,
            'username' => $MYSQL_USER,
            'password' => $MYSQL_PASS,
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix' => '',
        ],
        'sendgrid' => [
            'api_key' => 'SENDGRID_API_KEY' // Your SendGrid API Key
        ],
        'twilio' => [
            'test' => [
                'keysid' => 'YOUR_KEY_SID',
                'keysecret' => 'YOU_KEY_SECRET',
                'accountsid' => 'YOUR_ACCOUNT_SID',
                'authtoken' => 'YOUR_AUTH_TOKEN',
                'number' => 'YOUR_SENDGRID_NUMBER' // No dashes, no parenthesis(ex: 5021113456)
            ],
            'live' => [
                'keysid' => 'YOUR_KEY_SID',
                'keysecret' => 'YOU_KEY_SECRET',
                'accountsid' => 'YOUR_ACCOUNT_SID',
                'authtoken' => 'YOUR_AUTH_TOKEN',
                'number' => 'YOUR_SENDGRID_NUMBER' // No dashes, no parenthesis(ex: 5021113456)
            ]
        ],
        'ifttt_vault' => [
            'airQualityURL' => 'http://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=10021&distance=25&API_KEY=25B86396-AC35-492D-8F19-631FE9E0DD6F', // Replace ZIP_CODE and YOUR_API_KEY with proper data.
            'AQHI_Url_xml' => 'http://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/CommunityAQHIs(67)',
            'getRave' => 'http://www.getrave.com/cap/YOUR_ID/YOUR_CHANNEL' // Replace YOUR_ID and YOUR_CHANNEL with proper data.
        ],
    ],
];
