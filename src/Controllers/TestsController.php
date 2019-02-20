<?php

namespace Src\Controllers;

use Slim\Views\Twig as View;

class TestsController extends Controller
{
    public function status($request, $response)
    {
        return $response->withStatus(200);
    }
}