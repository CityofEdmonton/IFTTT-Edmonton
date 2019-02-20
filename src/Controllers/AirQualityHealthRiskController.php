<?php

namespace Src\Controllers;

use Slim\Views\Twig as View;

class AirQualityHealthRiskController extends Controller
{
    public function __construct($container)
    {
        parent::__construct($container);
        $this->container = $container;
    }

    public function index($request, $response)
    {
        $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' route - success");
        $error_msgs = array();

        $request_data = json_decode($request->getBody()->getContents(), true);

        if (! isset($request_data['triggerFields'])) {
            $error_msgs[] = array('message' => 'TriggerFields is not set');
        }

        $limit = isset($request_data['limit']) && ! empty($request_data['limit']) ? $request_data['limit'] : (isset($request_data['limit']) && $request_data['limit'] === 0 ? 0 : null);

        if (empty($error_msgs)) {
            $client = new \GuzzleHttp\Client();
            $res = $client->request('GET', $this->container['settings']['ifttt_vault']['AQHI_Url_xml']);

            if ($res->getStatusCode() == 200) {
                $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' pull - success");

                $body = $res->getBody()->getContents();
                $xml = simplexml_load_string($body);

                if (! empty($xml)) {
                    $test_case = false;
                    // get all Data
                    if (!$test_case) {
                        $community_id = $xml->content->children('m', true)->children('d', true)->Id;
                        $community_name = $xml->content->children('m', true)->children('d', true)->CommunityName;
                        $aqhi_current = $xml->content->children('m', true)->children('d', true)->AQHI;
                        $aqhi_forecast_today = $xml->content->children('m', true)->children('d', true)->ForecastToday;
                        $aqhi_forecast_tonight = $xml->content->children('m', true)->children('d', true)->ForecastTonight;
                        $aqhi_forecast_tomorrow = $xml->content->children('m', true)->children('d', true)->ForecastTomorrow;
                        $health_risk = $xml->content->children('m', true)->children('d', true)->HealthRisk;
                        $general_population_message = $xml->content->children('m', true)->children('d', true)->GeneralPopulationMessage;
                        $at_risk_message = $xml->content->children('m', true)->children('d', true)->AtRiskMessage;
                    } else {
                        $community_id = 67;
                        $community_name = "Edmonton_Test";
                        $aqhi_current = 6;
                        $aqhi_forecast_today = 1;
                        $aqhi_forecast_tonight = 1;
                        $aqhi_forecast_tomorrow = 1;
                        $health_risk = "low";
                        $general_population_message = "Test Message 1";
                        $at_risk_message = "Test Message 2";
                    }
                    $color = '#A9A9A9';
                    $light_color = '#A9A9A9';

                    switch ($aqhi_current) {
                      case ($aqhi_current == 1):
                          $color = '#00CCFF';
                          $light_color = '#00CCFF';
                          break;
                      case ($aqhi_current == 2):
                          $color = '#0099CC';
                          $light_color = '#0099CC';
                          break;
                      case ($aqhi_current == 3):
                          $color = '#006699';
                          $light_color = '#3F5FBF';
                          break;
                      case ($aqhi_current == 4):
                          $color = '#FFFF00';
                          $light_color = '#FFE900';
                          break;
                      case ($aqhi_current == 5):
                          $color = '#FFCC00';
                          $light_color = '#FFCC00';
                          break;
                      case ($aqhi_current == 6):
                          $color = '#FF9933';
                          $light_color = '#FFAA00';
                          break;
                      case ($aqhi_current == 7):
                          $color = '#FF6666';
                          $light_color = '#FF6666';
                          break;
                      case ($aqhi_current == 8):
                          $color = '#FF0000';
                          $light_color = '#FF0000';
                          break;
                      case ($aqhi_current == 9):
                          $color = '#CC0000';
                          $light_color = '#CC0000';
                          break;
                      case ($aqhi_current == 10):
                          $color = '#990000';
                          $light_color = '#990000';
                          break;
                      case ($aqhi_current > 10):
                          $color = '#660000';
                          $light_color = '#660000';
                          break;
                    }

                    // log Data
                    error_log("#####     DATA     #####");
                    error_log("community_id: " . $community_id);
                    error_log("community_name: " . $community_name);
                    error_log("aqhi_current: " . $aqhi_current);
                    error_log("color: " . $color);
                    error_log("light_color: " . $light_color);
                    error_log("aqhi_forecast_today: " . $aqhi_forecast_today);
                    error_log("aqhi_forecast_tonight: " . $aqhi_forecast_tonight);
                    error_log("aqhi_forecast_tomorrow: " . $aqhi_forecast_tomorrow);
                    error_log("health_risk: " . $health_risk);
                    error_log("general_population_message: " . $general_population_message);
                    error_log("at_risk_message: " . $at_risk_message);
                    error_log("########################");

                    //first check to see if we need to insert a new entry
                    $aqhir = $this->db->table('air_quality_health_risk_record')
                        ->orderBy('date_created', 'desc')
                        ->limit(1)
                        ->get();


                    if ($aqhir[0]->health_risk != $health_risk) {
                        //insert NEW RECORD!
                        $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' Inserted new AQHI - success");
                        $this->db->table('air_quality_health_risk_record')->insertGetId(array(
                            'community_id' => $community_id,
                            'community_name' => $community_name,
                            'aqhi_current' => $aqhi_current,
                            'aqhi_forecast_today' => $aqhi_forecast_today,
                            'aqhi_forecast_tonight' => $aqhi_forecast_tonight,
                            'aqhi_forecast_tomorrow' => $aqhi_forecast_tomorrow,
                            'color' => $color,
                            'light_color' => $light_color,
                            'health_risk' => $health_risk,
                            'general_population_message' => $general_population_message,
                            'at_risk_message' => $at_risk_message,
                            'date_created' => date('Y-m-d H:i:s')
                        ));
                    } else {
                        $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' AQHI not changed - skipping DB insert");
                    }



                    //get air qulity's
                    $records = $this->db->table('air_quality_health_risk_record')
                        ->orderBy('date_created', 'desc')
                        ->limit($limit)
                        ->get();

                    $newarr['data'] = array();

                    foreach ($records as $record) {
                        $time = datetimeFormat(false, false, 'c');

                        $newarr['data'][] = array(
                            'id' => $record->id,
                            'community_id' => $record->community_id,
                            'community_name' => $record->community_name,
                            'aqhi_current' => $record->aqhi_current,
                            'aqhi_forecast_today' => $record->aqhi_forecast_today,
                            'aqhi_forecast_tonight' => $record->aqhi_forecast_tonight,
                            'aqhi_forecast_tomorrow' => $record->aqhi_forecast_tomorrow,
                            'color' => $record->color,
                            'light_color' => $record->light_color,
                            'health_risk' => $record->health_risk,
                            'general_population_message' => $record->general_population_message,
                            'at_risk_message' => $record->at_risk_message,
                            'created_at' => $time,
                            'meta' => array(
                                'id' => $record->id,
                                'timestamp' => strtotime($record->date_created)
                            )
                        );
                    }
                    $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' API request - success");
                    return $response->withStatus(200)
                        ->withHeader('Content-Type', 'application/json; charset=utf-8')
                        ->write(json_encode($newarr));
                } else {
                    $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' Properties need to be set - fail");
                    $error_msgs[] = array('status'=> 'SKIP', 'message' => 'Properties need to be set');
                }
            } else {
                $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' Response is empty - fail");
                $error_msgs[] = array('status'=> 'SKIP', 'message' => 'Air quality (AQHI) API pull failed');
            }
        }
        $error = array('errors' => $error_msgs);
        $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' errors - fail");
        return $response->withStatus(400)
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->write(json_encode($error));
    }
}
