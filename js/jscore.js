var NONE = 0, SUCCESS = 1, FAIL = 2;

var jsc = jsc || {};

jsc.inherit = (function(){
    function F() {}
    return function(child, parent){
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
        child._super = parent.prototype;
        return child;
    };
})();

jsc.compose = (function(){
    function F() {}
    return function(child, parent, mixins){
        F.prototype = arguments[1].prototype;
        arguments[0].prototype = new F();
        arguments[0].prototype.constructor = arguments[0];
        arguments[0]._super = arguments[1].prototype;

        // attach mixin functions into the prototype
        for(var i = 2; i < arguments.length; i++){
            for(var key in arguments[i].prototype){
                arguments[0].prototype[key] = arguments[i].prototype[key];
            }
        }

        return arguments[0];
    };
})();

jsc.cel = function(tagName, className, attrs, children){

    var el = document.createElement(tagName);

    el.className = className;

    for(var key in attrs){
        el.setAttribute(key, attrs[key]);
    }

    if(children){
        for(var i = 0; i < children.length; i++){
            el.appendChild(children[i]);
        }
    }

    return el;
};

jsc.addClass = function(el, className){
    if(el.classList){
        el.classList.add(className);
    }else{
		var trimmed = el.className.replace(/^\s+|\s+$/g, "");
        var classList = trimmed.split(/\s+/);
        var classNameExists = false;
        for(var idx = 0; idx < classList.length; idx++){
            classNameExists = classList[idx] === className;
        }
        if(!classNameExists){
            classList.push(className);
            el.className = (classList.length === 1) ? className : classList.join(" ");
        }
    }
};

jsc.removeClass = function(el, className){
    if(el.classList){
        el.classList.remove(className);
    }else{
        var classNames = el.className.split(" ");
        for(var idx = 0; idx < className.length; idx++){
            if(classNames[idx] === className) classNames.splice(idx, 1);
        }
        el.className = classNames.join(" ");
    }
};

jsc.bind = function(el, eventName, fn){
    if(typeof el === "string"){
        el = document.getElementById(el);
    }
    if(el.addEventListener){
        el.addEventListener(eventName, fn, false);
    }else if(el.attachEvent){
        if("on"+eventName in el){
            el.attachEvent("on"+eventName, function(e){
                fn.call(e.srcElement, e);
            });
        }else{
            el["jsc"+eventName] = 0;
            el.attachEvent("onpropertychange", function(event) {
                if (event.propertyName == "jsc"+eventName) {
                    fn.call(el);
                }
            });
        }
    }
};

jsc.trigger = function(el, eventName){
    var evObj;

    if(document.createEvent){
        evObj = document.createEvent("Events");
        evObj.initEvent(eventName, true, false);
        el.dispatchEvent(evObj);
    }else if(document.createEventObject){
        evObj = document.createEventObject();
        if("on"+eventName in el){
            el.fireEvent("on"+eventName, evObj);
        }else{
            if(el["jsc"+eventName]>=0){
                // this should fire the onpropertychange event
                el["jsc"+eventName]++;
            }
        }
    }
};

jsc.validators = {
    email: function(field){
        var re = new RegExp("^[a-z0-9_.%+-]+@[0-9a-z.-]\\.[a-z.]{2,6}$", "i");
        return re.test(field.value);
    },
    date: function(field){
        var d = new Date(field.value);
        var ds = d.getMonth()+"/"+d.getDate()+"/"+d.getYear();
        return field.value === ds;
    }
};

/*
* Object.keys support for IE
*/
jsc.obj2keys = function(obj){
    if("keys" in Object){
        return Object.keys(obj);
    }else{
        var keys = [];
        for(var key in obj){
            keys.push(key);
        }
        return keys;
    }
};

jsc.obj2query = function(obj){
    var str = [];
    for(var p in obj) str.push(p + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
};

jsc.Logging = function(args){
    this.loggers = {};
    this.appenders = [];
};

/**
* factory method for getting a logger
*/
jsc.Logging.prototype.getLogger = function(categoryName){
    if(!this.loggers[categoryName]){
        this.loggers[categoryName] = new jsc.Logger(categoryName);
    }

    for(var i = 0; i < this.appenders.length; i++){
        this.loggers[categoryName].addListener("log", this.appenders[i]);
    }

    return this.loggers[categoryName];
};

jsc.Logging.prototype.addConsoleAppender = function(){
    function consoleAppender(loggingEvent){
        if("console" in window && "log" in console){
            // TODO: ie9 has a problem with the apply method of log
            if("apply" in console.log){
                console.log.apply(console, arguments);
            }else{
                console.log(arguments);
            }
        }
    }

    this.appenders.push(consoleAppender);
};

/**
* facilitates logging calls and emits events to be
* handled by any configured appenders
*/
jsc.Logger = function(name, level){
    EventEmitter.apply(this);
};
jsc.inherit(jsc.Logger, EventEmitter);

jsc.Logger.prototype.log = function(){
    this.emit("log", arguments);
};

jsc.logging = new jsc.Logging();
jsc.logging.addConsoleAppender();
jsc.logger = jsc.logging.getLogger("default");

/**
* @interface
*/
jsc.DomUtils = function() {};

jsc.DomUtils.prototype.eid = function(elementId){
    return document.getElementById(elementId);
};

jsc.DomUtils.prototype.qid = function(elementId){
    return $("#"+elementId);
};

jsc.DomUtils.prototype.cel = function(name, attrs){
    var el = document.createElement(name);
    for(var key in attrs){
        el.setAttribute(key, attrs[key]);
    }
    return el;
};

jsc.DomUtils.prototype.ctn = function(value){
    return document.createTextNode(value);
};

/**
* @constructor
*/
jsc.Base = function(){
};

/**
* @constructor
* @extends {EventEmitter}
* @implements {jsc.DomUtils}
*/
jsc.BaseWidget = function(elementId){
    EventEmitter.apply(this);

    this.elementId = elementId;

    this.el = null;
    this.$el = null;
};
jsc.compose(jsc.BaseWidget, EventEmitter, jsc.DomUtils);

jsc.BaseWidget.prototype.render = function(ctx){
    var self = this;
    self.el = document.getElementById(self.elementId);
    self.$el = $(self.el);
    self.$el.block();
    self.init(ctx, function(){
        self.$el.unblock();
    });
};

jsc.BaseWidget.prototype.init = function(ctx, complete){};

/**
* @constructor
* @extends {jsc.Base}
* @implements {jsc.DomUtils}
*/
jsc.BasePage = function(target, menuId, defaultData){
    jsc.Base.call(this);

    this.menuId = menuId || "main";

    // data model associated with this page
    this.defaultData = defaultData;
    this.data = defaultData;

    this.target = target;
    this.$target = $(target);

    this.el = document.createElement("div");
    this.$el = $(this.el);
    this.$el.hide();
};
jsc.compose(jsc.BasePage, jsc.Base, jsc.DomUtils);

jsc.BasePage.prototype.showMessage = function(fn, options){
    var self = this;
    var message = options.message || "Task was completed";
    var cssClass = options.success ? "success" : "fail";
    $(window).scrollTop(0);
    $("#main-message").html(message).addClass(cssClass).slideDown(400, function(){
        fn.call(self);
        $(this).delay(500).slideUp(400);
    });
};

jsc.BasePage.prototype.showSuccess = function(fn, optMessage){
    this.showMessage(fn, {
        message: optMessage || "Success",
        success: true
    });
};

jsc.BasePage.prototype.showFail = function(fn, optMessage){
    this.showMessage(fn, {
        message: optMessage || "Fail",
        success: false
    });
};

jsc.BasePage.prototype.redirect = function(path){
    var matched = path.match(/\.(\/.*)/);
    if(matched){
        window.location.hash = "/"+this.menuId+matched[1];
    }else{
        window.location.hash = path;
    }
};

jsc.BasePage.prototype.render = function(ctx){
    var self = this;
    self.$target.block();
    self.target.replaceChild(self.el, self.target.firstChild);
    $("#menu-"+self.menuId).addClass("active");
    self.init(ctx, function(){
        self.$el.fadeIn(200);
        self.$target.unblock();
    });
};

jsc.BasePage.prototype.init = function(ctx, complete){};

jsc.BasePage.prototype.attempt = function(fn, successPath){
    var self = this;
    self.$el.block();
    var done = function(action, optMessage) {
        self.$el.unblock();
        if(action === true){
            self.showSuccess(function(){
                if(successPath !== undefined) self.redirect(successPath);
            }, optMessage);
        }else if(action === false){
            self.showFail(optMessage);
        }
    };
    fn(done);
};
