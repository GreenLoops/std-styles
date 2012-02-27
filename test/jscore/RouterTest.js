buster.testCase("Router", {

    "a default router":
    {
        setUp: function(done)
        {
            this.router = new jsc.Router();
            done();
        },

        tearDown: function(done)
        {
            this.router.disable();
            window.location.hash = "";
            done();
        },

        "should support static routes": function(done)
        {
            this.router.add("/foo", function(context) {
                assert.equals({params: {}}, context);
                done();
            });

            window.location.hash = "/foo";
        },

        "should support path parameters": function(done)
        {
            var router = this.router;

            router.add("/foo/:a", function(context) {
                assert.equals({params: { a: "bar" }}, context);
                done();
            });

            window.location.hash = "/foo/bar";
        },

        "should support query parameters": function(done)
        {
            var router = this.router;

            router.add("/foo", function(context) {
                assert.equals(context, {params: { a: "1", b: "2" }});
                done();
            });

            window.location.hash = "/foo?a=1&b=2";
        },

        "should support an onchange handler": function(done)
        {
            var router = this.router;

            router.add("/foo", function() {
                assert(false);
                done();
            });

            router.onChange(function(ctx) {
                assert(true);
                done();
            });

            window.location.hash = "/nothing";
        },

        "should handle multiple matching routes": function(done)
        {
            var router = this.router;

            router.add("/", function(context) {
                assert(false);
                done();
            });

            router.add("/foo", function(context) {
                assert(true);
                done();
            });

            window.location.hash = "/foo";
        },

        "should handle paths with empty query string": function(done)
        {
            var router = this.router;

            router.add("/foo", function(context) {
                assert(context, {});
                done();
            });

            window.location.hash = "/foo?";
        }
    },

    "routes can be configured via constructor": function(done)
    {
        var router;

        var routes = {
            "/foo": function() {
                assert(false);
                router.disable();
                done(); 
            },
            "/bar": function() { assert(true);  done(); }
        };

        router = new jsc.Router(routes);

        window.location.hash = "/bar";
    },

    "when starting the router": 
    {
        setUp: function(done)
        {
            window.location.hash = "/foo";
            done();
        },
        
        tearDown: function(done)
        {
            window.location.hash = "";
            done();
        },

        "run the current hash route": function(done)
        {
            var router = new jsc.Router({
                "/foo": function() {
                    assert(true);
                    router.disable();
                    done(); 
                },
                "/bar": function() {
                    assert(false);
                    router.disable();
                    done();
                }
            });

            router.start();
        }
    }
});
