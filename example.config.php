<?php
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
        //Database Info
        'db' => [
            'driver' => 'mysql',
            'host' => 'us-cdbr-iron-east-05.cleardb.net',
            'database' => 'heroku_44aa3f48a6e9e55',
            'username' => 'b0420e1388c018',
            'password' => 'bed6d627',
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
            'getRave' => 'http://www.getrave.com/cap/YOUR_ID/YOUR_CHANNEL' // Replace YOUR_ID and YOUR_CHANNEL with proper data.
        ],
    ],
];
