<?php
/****************************************
 * @param bool $datetime
 * @param bool $unix_format
 * @param string $format
 * @return false|string
 *
 * date time function to return date how you like
 */
function datetimeFormat($datetime = false, $unix_format = false, $format = 'Y-m-d H:i:s')
{
    $date = ( $datetime ? $datetime : date($format) );
    $time = ( $unix_format ? $date : strtotime($date) );
    return date($format, $time);
}

/**
 * Gets the color for a given air quality health index.
 * @param Integer $index The air quality index.
 * @return String The color for this index.
 */
function getColor($index)
{
    $colorMap = array(
        0 => '#A9A9A9',
        1 => '#00CCFF',
        2 => '#0099CC',
        3 => '#006699',
        4 => '#FFFF00',
        5 => '#FFCC00',
        6 => '#FF9933',
        7 => '#FF6666',
        8 => '#FF0000',
        9 => '#CC0000',
        10 => '#990000'
    );

    if (isset($colorMap[$index])) {
        return $colorMap[$index];
    } else {
        return '#660000';
    }
}

/**
 * Gets the light color for a given air quality health index.
 * @param Integer $index The air quality index.
 * @return String The light color for this index.
 */
function getLightColor($index)
{
    $colorMap = array(
        0 => '#A9A9A9',
        1 => '#00CCFF',
        2 => '#0099CC',
        3 => '#3F5FBF',
        4 => '#FFE900',
        5 => '#FFCC00',
        6 => '#FFAA00',
        7 => '#FF6666',
        8 => '#FF0000',
        9 => '#CC0000',
        10 => '#990000'
    );

    if (isset($colorMap[$index])) {
        return $colorMap[$index];
    } else {
        return '#660000';
    }
}

/**
 * Return an associative array mapping from the xml t
 */
function parseAirQuality($xml)
{
    return array(
        'community_id' => $xml->content->children('m', true)->children('d', true)->Id,
        'community_name' => $xml->content->children('m', true)->children('d', true)->CommunityName,
        'aqhi_current' => $xml->content->children('m', true)->children('d', true)->AQHI,
        'aqhi_forecast_today' => $xml->content->children('m', true)->children('d', true)->ForecastToday,
        'aqhi_forecast_tonight' => $xml->content->children('m', true)->children('d', true)->ForecastTonight,
        'aqhi_forecast_tomorrow' => $xml->content->children('m', true)->children('d', true)->ForecastTomorrow,
        'health_risk' => $xml->content->children('m', true)->children('d', true)->HealthRisk,
        'general_population_message' => $xml->content->children('m', true)->children('d', true)->GeneralPopulationMessage,
        'at_risk_message' => $xml->content->children('m', true)->children('d', true)->AtRiskMessage
    );
}