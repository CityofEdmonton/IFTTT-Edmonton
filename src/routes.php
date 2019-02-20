<?php

// Home (index Controllers)
$app->get('/', 'HomeController:index');

// Test cases
$app->get('/ifttt/v1/status', 'TestsController:status');

// Air Quality Health Index
$app->post('/ifttt/v1/triggers/air_quality_health_index', 'AirQualityHealthIndexController:index');

// Air Quality Health Index
$app->post('/ifttt/v1/triggers/air_quality_health_risk', 'AirQualityHealthRiskController:index');

// Light The Bridge
$app->post('/ifttt/v1/triggers/light_the_bridge', 'LightTheBridgeController:index');