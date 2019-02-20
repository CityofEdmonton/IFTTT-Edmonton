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
