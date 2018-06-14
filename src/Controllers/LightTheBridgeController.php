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
            $client = new \GuzzleHttp\Client();
            $res = $client->request('GET', 'https://twitrss.me/twitter_search_to_rss/?term=LighttheBridge+from:CityofEdmonton');
            
            if ($res->getStatusCode() == 200) {
                $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' pull - success");
                
                $body = $res->getBody()->getContents();
                $xml = simplexml_load_string($body);
                
                if (! empty($xml)) {
                    $title = $xml->channel->item[0]->title;
                    
                    //first check to see if we need to insert a new entry
                    $ltbr = $this->db->table('light_the_bridge')
                    ->orderBy('date_created', 'desc')
                    ->limit(1)
                    ->get();

                    if ($ltbr[0]->title != $title) {
                        //insert NEW event!
                        $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' Inserted new ltb - success");
                        $this->db->table('light_the_bridge')->insertGetId(array(
                            'title' => $title,
                            'date_created' => date('Y-m-d H:i:s')
                        ));
                    } else {
                        $this->logger->info("light_the_bridge '/ifttt/v1/triggers/light_the_bridge' ltb not changed - skipping DB insert");
                    }
                }
                error_log("#########################");

                //get events's
                $dbevents = $this->db->table('light_the_bridge')
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
                        'title' => $event->title,
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