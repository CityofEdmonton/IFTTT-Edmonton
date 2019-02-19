<?php
$MYSQL_HOST = getenv('MYSQL_HOST');
$MYSQL_DB = getenv('MYSQL_DB');
$MYSQL_USER = getenv('MYSQL_USER');
$MYSQL_PASS = getenv('MYSQL_PASS');
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
            'name' => 'logger',
            'path' => __DIR__ . '/doc_root/logs/app.log', // Replace doc_root with the project directory path.
            'level' => \Monolog\Logger::DEBUG,
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
        'ifttt_vault' => [
            'AQHI_Url_xml' => 'http://data.environment.alberta.ca/Services/AirQualityV2/AQHIsource.svc/CommunityAQHIs(67)'
        ],
    ],
];
