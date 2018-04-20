<?php

namespace Src\Controllers;

use \DateTime;
use Slim\Views\Twig as View;

class LightTheBridgeController extends Controller
{
    public function __construct($container)
    {
        parent::__construct($container);
        $this->container = $container;
    }
    
    public function index($request, $response)
    {
        $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' route - success");
        $error_msgs = array();
        
        $request_data = json_decode($request->getBody()->getContents(), true);
        
        if (!isset($request_data['triggerFields'])) {
            $error_msgs[] = array(
                'message' => 'TriggerFields is not set'
            );
        }
        
        $limit = isset($request_data['limit']) && !empty($request_data['limit']) ? $request_data['limit'] : (isset($request_data['limit']) && $request_data['limit'] === 0 ? 0 : null);
        
        if (empty($error_msgs)) {
            $json = @file_get_contents('https://api.airtable.com/v0/app0dFPJqRfpdQJxi/Light_the_Bridge?api_key=keyI2vnvKqG5hA8OY');
            if ($json !== FALSE) {
                $obj         = json_decode($json, true);
                $events      = $obj["records"];
                $datetimenow = new DateTime();
                $unixtimenow = $datetimenow->getTimestamp();

                foreach ($events as $event) {
                    // todo: check for null values. Empty table rows will create events with empty values
                    $datetimestart = DateTime::createFromFormat('Y-m-d\TH:i:s+', $event["fields"]["Start Time"]);
                    $datetimeend   = DateTime::createFromFormat('Y-m-d\TH:i:s+', $event["fields"]["End Time"]);
                    $unixtimestart = $datetimestart->getTimestamp();
                    $unixtimeend   = $datetimeend->getTimestamp();
                    $currentEvent = false;
                    
                    if ($unixtimenow > $unixtimestart && $unixtimenow < $unixtimeend)
                    {
                        $found = true;
                        error_log("##### CURRENT EVENT #####");
                        error_log("Start Time: " . $event["fields"]["Start Time"]);
                        error_log("End Time: " . $event["fields"]["End Time"]);
                        error_log("Title: " . $event["fields"]["Title"]);
                        error_log("Description: " . $event["fields"]["Description"]);
                        error_log("Color Description: " . $event["fields"]["Color Description"]);
                        error_log("color1: " . $event["fields"]["color1"]);
                        error_log("color2: " . $event["fields"]["color2"]);
                        error_log("color3: " . $event["fields"]["color3"]);
                        error_log("color4: " . $event["fields"]["color4"]);
                        $currentEvent = $event;
                        break;
                    }
                }
                if (!$currentEvent) {
                    error_log("No Event found.");
                    $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' ltb not changed - skipping DB insert");
                } else {
                //first check to see if we need to insert a new entry
                $ltbr = $this->db->table('light_the_bridge_event')
                ->orderBy('date_created', 'desc')
                ->limit(1)
                ->get();
                error_log("current:");
                error_log(print_r($currentEvent,1));
                error_log("DB:");
                error_log(print_r($ltbr[0],1));
                error_log(print_r($currentEvent["fields"]["Start Time"],1));

                if ($ltbr[0]->title != $currentEvent["fields"]["Title"]) {
                    //insert NEW event!
                    $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' Inserted new ltb - success");
                    $this->db->table('light_the_bridge_event')->insertGetId(array(
                        'start_time' => $currentEvent["fields"]["Start Time"],
                        'end_time' => $currentEvent["fields"]["End Time"],
                        'title' => $currentEvent["fields"]["Title"],
                        'description' => $currentEvent["fields"]["Description"],
                        'color_description' => $currentEvent["fields"]["Color Description"],
                        'color1' => $currentEvent["fields"]["color1"],
                        'color2' => $currentEvent["fields"]["color2"],
                        'color3' => $currentEvent["fields"]["color3"],
                        'color4' => $currentEvent["fields"]["color4"],
                        'date_created' => date('Y-m-d H:i:s')
                    ));
                } else {
                    $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' ltb not changed - skipping DB insert");
                }
                }
                error_log("#########################");

                //get events's
                $dbevents = $this->db->table('light_the_bridge_event')
                    ->orderBy('date_created', 'desc')
                    ->limit($limit)
                    ->get();

                error_log("events from DB:");
                error_log(print_r($dbevents,1));

                $newarr['data'] = array();

                foreach ($dbevents as $event) {
                    $time = datetimeformat(false, false, 'c');

                    $newarr['data'][] = array(
                        'id' => $event->id,
                        'start_time' => $event->start_time,
                        'end_time' => $event->end_time,
                        'title' => $event->title,
                        'description' => $event->description,
                        'color_description' => $event->color_description,
                        'color1' => $event->color1,
                        'color2' => $event->color2,
                        'color3' => $event->color3,
                        'color4' => $event->color4,
                        'created_at' => $time,
                        'meta' => array(
                            'id' => $event->id,
                            'timestamp' => strtotime($event->date_created)
                        )
                    );
                }
                error_log("newarr:");
                error_log(print_r($newarr,1));
                $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' API request - success");
                return $response->withStatus(200)
                    ->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->write(json_encode($newarr));
            } else {
                $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' Properties need to be set - fail");
                $error_msgs[] = array('status'=> 'SKIP', 'message' => 'Properties need to be set');
            }
        } else {
            $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' Response is empty - fail");
            $error_msgs[] = array('status'=> 'SKIP', 'message' => 'Air quality (ltb) API pull failed');
        }
        $error = array('errors' => $error_msgs);
        $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' errors - fail");
        return $response->withStatus(400)
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->write(json_encode($error));
    }
}