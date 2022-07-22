<?php

class Router {
    protected $routes   = [];
    protected $args     = [];
    protected $route;
    protected $http_method;

    public function getRoutes()
    {
        return $this->routes;
    }

    public function add($route, $http_methods, $controller)
    {
        foreach ($http_methods as $method) {
            $tmp[$method] = $controller;
        }
        $this->routes[$route] = $tmp;
    }

    public function run()
    {
        $this->parseUrl();
        $route_exists = $this->match($this->route, $this->http_method);
        if ($route_exists) {
            // Extract the controller to a handy variable
            $controller = $this->routes[$this->route][$this->http_method];
            // Send the route to the RESTful dispatcher
            $this->restDispatcher($this->http_method, $controller);
        } else {
            // That route is not allowed
            http_response_code(404);
            die();
        }
    }

    private function match($route, $http_method)
    {
        if (isset($this->routes[$route])) {
            // Check if that HTTP method is supported in the route
            if (array_key_exists($http_method, $this->routes[$route])) {
                return true;
            } else {
                // Extract list of allowed methods for the route
                $allowed_methods = array_keys($this->routes[$route]);
                // That HTTP method is not allowed
                $this->respondMethodNotAllowed(implode(', ', $allowed_methods));
                return false;
            }
        } else {
            return false;
        }
    }

    private function restDispatcher($http_method, $controller)
    {
        switch ($http_method) {
            case 'GET':
                $method = isset($this->args['id']) ? 'show' : 'index';
                break;
            case 'POST':
                $method = isset($this->args['id']) ? 'update' : 'create';
                break;
            case 'DELETE':
                $method = 'delete';
                // DELETE HTTP method needs an id!
                if (!isset($this->args['id'])) {
                    http_response_code(404);
                    die();
                }
        }
        call_user_func_array([new $controller(), $method], [$this->args]);
    }

    private function parseUrl()
    {
        $url_path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $components = explode('/', $url_path);
        // Build route incrementally
        foreach(array_slice($components, 1) as $comp) {
            if (!is_numeric($comp)) {
                $this->route .= "/{$comp}";
            } else {
                $this->args['id'] = $comp;
                break;
            }
        }
        // Set HTTP method
        $this->http_method = $_SERVER['REQUEST_METHOD'];
        // Parse query string items into an array
        if (isset($_SERVER['QUERY_STRING'])) {
            parse_str($_SERVER['QUERY_STRING'], $qs_items);
        }
        // Adding query string items to 'args' array
        foreach($qs_items as $key => $value)
            $this->args[$key] = $value;
    }

    private function respondMethodNotAllowed($allowed_methods)
    {
        http_response_code(405); // 405 Method Not Allowed
        header("Allow: $allowed_methods");
    }
}