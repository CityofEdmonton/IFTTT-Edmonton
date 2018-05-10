<?php

namespace Src\Controllers;

use Slim\Views\Twig as View;

class ESRTInventoryController extends Controller
{
    public function __construct($container)
    {
        parent::__construct($container);
        $this->container=$container;
    }

    public function index($request, $response)
    {
        $this->logger->info("esrt_inventory '/ifttt/v1/triggers/esrt_inventory' route - success");
        $error_msgs = array();
        
        $request_data = json_decode($request->getBody()->getContents(), true);
        
        if (!isset($request_data['triggerFields'])) {
            $error_msgs[] = array(
                'message' => 'TriggerFields is not set'
            );
        }
        
        $limit = isset($request_data['limit']) && !empty($request_data['limit']) ? $request_data['limit'] : (isset($request_data['limit']) && $request_data['limit'] === 0 ? 0 : null);
        
        if (empty($error_msgs)) {
            $json = @file_get_contents('http://52.151.12.139/api/v1/ReceptionCentre');
            if ($json !== FALSE) {
                $obj         = json_decode($json, true);
                $centres     = $obj["list"];
                $currentCentre = false;
                                
                // TODO: change to handle multiple reception centres with cot quantities below tolerance, no higher priority?
                foreach ($centres as $centre) {
                    $toleranceQty = $centre["toleranceLevel"];
                    $cotsQty = $centre["cotsAvailable"];
                                        
                    if ($cotsQty < $toleranceQty)
                    {
                        $found = true;
                        error_log("##### LOW INVENTORY #####");
                        error_log("Reception Centre: " . $centre["name"]);
                        $currentCentre = $centre;
                        break;
                    }
                }
                if (!$currentCentre) {
                    error_log("Inventory levels above tolerance.");
                    $this->logger->info("esrt_inventory '/ifttt/v1/triggers/esrt_inventory' levels above tolerance - skipping DB insert");
                    $light_colour = "#009933"; // green
                } else {
                    $light_colour = "#FF0000"; // red
                    //first check to see if we need to insert a new entry
                    $esrtr = $this->db->table('esrt_inventory_record')
                    ->orderBy('date_created', 'desc')
                    ->limit(1)
                    ->get();
                    error_log("Reception Centre:");
                    error_log(print_r($currentCentre["name"], 1));
                    error_log("DB:");
                    error_log(print_r($esrtr[0],1));
                    error_log(print_r($currentCentre["fields"][],1));
                    
                    // TODO: Future implementation: different items for inventory
                    if ($esrtr[0]->title != $currentCentre["name"] && esrtr[0]->description != "Cot quantity levels are low.") {
                        //insert NEW event!
                        $this->logger->info("esrt_inventory '/ifttt/v1/triggers/esrt_inventory' Inserted new event - success");
                        $this->db->table('esrt_inventory_record')->insertGetId(array(
                            'title' => $currentCentre["name"],
                            'description' => "Cot quantity levels are low.",
                            'date_created' => date('Y-m-d H:i:s')
                        ));
                    } else {
                        $this->logger->info("esrt_inventory '/ifttt/v1/triggers/esrt_inventory' levels above tolerance - skipping DB insert");
                    }
                }
                error_log("#########################");
                
                //get events
                $dbevents = $this->db->table('esrt_inventory_record')
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
                        'description' => $event->description,
                        'created_at' => $time,
                        'meta' => array(
                            'id' => $event->id,
                            'timestamp' => strtotime($event->date_created)
                        )
                    );
                }
                error_log("newarr:");
                error_log(print_r($newarr,1));
                $this->logger->info("esrt_inventory '/ifttt/v1/triggers/esrt_inventory' API request - success");
                return $response->withStatus(200)
                ->withHeader('Content-Type', 'application/json; charset=utf-8')
                ->write(json_encode($newarr));
            } else {
                $this->logger->info("esrt_inventory '/ifttt/v1/triggers/esrt_inventory' Properties need to be set - fail");
                $error_msgs[] = array('status'=> 'SKIP', 'message' => 'Properties need to be set');
            }
        } else {
            $this->logger->info("esrt_inventory '/ifttt/v1/triggers/esrt_inventory' Response is empty - fail");
            $error_msgs[] = array('status'=> 'SKIP', 'message' => 'ESRT Inventory API pull failed');
        }
        $error = array('errors' => $error_msgs);
        $this->logger->info("esrt_inventory '/ifttt/v1/triggers/esrt_inventory' errors - fail");
        return $response->withStatus(400)
        ->withHeader('Content-Type', 'application/json; charset=utf-8')
        ->write(json_encode($error));
    }
}
