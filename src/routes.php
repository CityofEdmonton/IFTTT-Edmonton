<?php
use Src\Controllers\ESRTInventoryController;

// Home (index Controllers)
$app->get('/', 'HomeController:index');

// Test cases
$app->get('/ifttt/v1/status', 'TestsController:status');
$app->post('/ifttt/v1/test/setup', 'TestsController:setup');

// Air Quality Health Index
$app->post('/ifttt/v1/triggers/air_quality_health_index', 'AirQualityHealthIndexController:index');

// Light The Bridge
$app->post('/ifttt/v1/triggers/light_the_bridge', 'LightTheBridgeController:index');

// ESRT Inventory
$app->post('/ifttt/v1/triggers/esrt_inventory', 'ESRTInventoryController:index');