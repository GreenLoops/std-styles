buster.testCase("DOM Utilities", {

    setUp: function(){
        var self = this;
        self.container = document.createElement("div");
        document.body.appendChild(self.container);
    },

    tearDown: function(){
        var self = this;
        document.body.removeChild(self.container);
    },

    "given an empty class list, can add class": function(){
        var el = document.createElement("div");
        jsc.addClass(el, "foo");
        assert.equals("foo", el.className);
    },

    "given a non-empty class list, can add a class": function(){
        var el = document.createElement("div");
        el.className = "foo";
        jsc.addClass(el, "bar");
        assert.equals("foo bar", el.className);
    },

    "given a non-empty class list, do not duplicate class names": function(){
        var el = document.createElement("div");
        el.className = "foo";
        jsc.addClass(el, "foo");
        assert.equals("foo", el.className);
    },

    "when removing last class, then remove the class attribute": function(){
        var el = document.createElement("div");
        el.className = "foo";
        jsc.removeClass(el, "foo");
        assert.equals(el.getAttribute("class"), "");
    }

});
