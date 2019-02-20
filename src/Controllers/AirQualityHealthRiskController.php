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
        $request_data = json_decode($request->getBody()->getContents(), true);

        if (!isset($request_data['triggerFields'])) {
            $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' errors - fail");
            return $response->withStatus(400)
                ->withHeader('Content-Type', 'application/json; charset=utf-8')
                ->write(json_encode(array('message' => 'TriggerFields is not set')));
        }

        $limit = isset($request_data['limit']) && ! empty($request_data['limit']) ? $request_data['limit'] : (isset($request_data['limit']) && $request_data['limit'] === 0 ? 0 : null);
        $client = new \GuzzleHttp\Client();
        $res = $client->request('GET', $this->container['settings']['ifttt_vault']['AQHI_Url_xml']);

        if ($res->getStatusCode() != 200) {
            $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' Response is empty - fail");
            return $response->withStatus(400)
                ->withHeader('Content-Type', 'application/json; charset=utf-8')
                ->write(json_encode(array('status'=> 'SKIP', 'message' => 'Air quality (AQHI) API pull failed')));
        }
        $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' pull - success");

        $body = $res->getBody()->getContents();
        $xml = simplexml_load_string($body);

        if (empty($xml)) {
            $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' Properties need to be set - fail");
            return $response->withStatus(400)
                ->withHeader('Content-Type', 'application/json; charset=utf-8')
                ->write(json_encode(array('status'=> 'SKIP', 'message' => 'XML Properties need to be set')));
        }

        $parsedData = parseAirQuality($xml);
        $color = getColor($parsedData['aqhi_current']);
        $light_color = getLightColor($parsedData['aqhi_current']);

        // log Data
        error_log("#####     DATA     #####");
        error_log("community_id: " . $parsedData['community_id']);
        error_log("community_name: " . $parsedData['community_name']);
        error_log("aqhi_current: " . $parsedData['aqhi_current']);
        error_log("color: " . $color);
        error_log("light_color: " . $light_color);
        error_log("aqhi_forecast_today: " . $parsedData['aqhi_forecast_today']);
        error_log("aqhi_forecast_tonight: " . $parsedData['aqhi_forecast_tonight']);
        error_log("aqhi_forecast_tomorrow: " . $parsedData['aqhi_forecast_tomorrow']);
        error_log("health_risk: " . $parsedData['health_risk']);
        error_log("general_population_message: " . $parsedData['general_population_message']);
        error_log("at_risk_message: " . $parsedData['at_risk_message']);
        error_log("########################");

        //first check to see if we need to insert a new entry
        $aqhir = $this->db->table('air_quality_health_risk_record')
            ->orderBy('date_created', 'desc')
            ->limit(1)
            ->get();

        if ($aqhir[0]->health_risk != $parsedData['health_risk']) {
            //insert NEW RECORD!
            $parsedData['color'] = $color;
            $parsedData['light_color'] = $light_color;
            $parsedData['date_created'] = date('Y-m-d H:i:s');
            $this->logger->info("air_quality_health_index '/ifttt/v1/triggers/air_quality_health_index' Inserted new AQHI - success");
            $this->db->table('air_quality_health_risk_record')->insertGetId($parsedData);
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
    }
}
