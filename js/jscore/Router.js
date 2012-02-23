/**
* placeholder for the future router implementation to replace
* sammy and other routing frameworks
*/
jsc.Router = function(routes, notHash ) /* do not listen to hash */
{
    var self = this;

    self.PATH_NAME_PARAM   = /:\w+/g;
    self.PATH_NAME_MATCHER = /:([\w\d]+)/g;
    self.QUERY_STRING_MATCHER = /\?([^#]*)?$/;

    self.routes = [];
    self.globalHandler = null;

    for(var path in routes)
    {
        self.add(path, routes[path]);
    }

    if(!notHash){
        window.onhashchange = function(event)
        {
            self.run(window.location.hash);
        };
    }
};

jsc.Router.prototype.add = function(path, fn)
{
    var paramNames   = path.match(this.PATH_NAME_MATCHER) || [];
    var paramMatcher = new RegExp("^" + path.replace(this.PATH_NAME_PARAM, "([^\/]*)") + "$");
    
    var route = {
        matcher: paramMatcher,
        paramNames: paramNames,
        handler: fn
    };

    this.routes.push(route);
};

jsc.Router.prototype.onChange = function(handler)
{
    this.globalHandler = handler;
};

jsc.Router.prototype.run = function(rawPath)
{
    var self = this;

    var routeStripper = /^[#\/]/;
    var pathParts = rawPath.replace(routeStripper, "").split("?");
    var path = pathParts[0];
    var queryString = pathParts[1];

    if(self.globalHandler) self.globalHandler(context);

    for(var i = 0; i < self.routes.length; i++)
    {
        var route = self.routes[i];
        var matcher = route.matcher;
        var matched = path.match(matcher);

        if(matched)
        {
            var params = self.parsePathParams(path, route, matcher);

            if(queryString)
            {
                var queryParams = self.parseQueryParams(queryString);

                for(var attrname in queryParams)
                {
                    params[attrname] = queryParams[attrname];
                }
            }

            var context = {
                params: params
            };

            route.handler(context);
            break;
        }
    }
};

jsc.Router.prototype.parsePathParams = function(path, route, matcher)
{
    var params = {};
    var paramNames = route.paramNames;
    var paramValues = matcher.exec(path).slice(1);

    for(var x = 0; x < paramNames.length; x++)
    {
        params[paramNames[x].substring(1)] = paramValues[x];
    }

    return params;
};

jsc.Router.prototype.parseQueryParams = function(queryString)
{
    var self = this;
    var params = {}; 

    function decode(str)
    {
        return decodeURIComponent(str || "");
    }

    var pairs = queryString.split('&');

    for (var i = 0; i < pairs.length; i++)
    {
        var pair  = pairs[i].split('=');
        var key   = decode(pair[0]);
        var value = decode(pair[1]);
        
        if (typeof params[key] !== 'undefined')
        {
            if (_isArray(params[key]))
            {
                params[key].push(value);
            } 
            else
            {
                params[key] = [params[key], value];
            }
        }
        else
        {
            params[key] = value;
        }
    }

    return params;
};

jsc.Router.prototype.start = function()
{
    this.run(window.location.hash);
};

jsc.Router.prototype.disable = function()
{
    window.onhashchange = null;
};

jsc.Router.prototype.render = function(view)
{
    view.render();
};
