/**
* @constructor
* @extends {jsc.Base}
* @implements {jsc.DomUtils}
*/
jsc.Page = function(appContext, menuId, defaultData){

    jsc.Base.call(this);

    this.menuId = menuId || "main";

    this.dataStore = appContext.dataStore;
    this.binding = appContext.binding;
    this.identity = appContext.identity;
    this.poster = appContext.poster;

    // data model associated with this page
    this.defaultData = defaultData;
    this.data = defaultData;

    this.target = appContext.pageContainer;
    this.$target = $(appContext.pageContainer);

    this.el = document.createElement("div");
    this.$el = $(this.el);
    this.$el.hide();
};
jsc.compose(jsc.Page, EventEmitter, jsc.DomUtils);

jsc.Page.prototype.showMessage = function(fn, options){
    var self = this;
    var message = options.message || "Task was completed";
    var cssClass = options.success ? "success" : "fail";
    $(window).scrollTop(0);
    $("#main-message").html(message).addClass(cssClass).slideDown(400, function(){
        fn.call(self);
        $(this).delay(500).slideUp(400);
    });
};

jsc.Page.prototype.showSuccess = function(fn, optMessage){
    this.showMessage(fn, {
        message: optMessage || "Success",
        success: true
    });
};

jsc.Page.prototype.showFail = function(fn, optMessage){
    this.showMessage(fn, {
        message: optMessage || "Fail",
        success: false
    });
};

jsc.Page.prototype.redirect = function(path){
    var matched = path.match(/\.(\/.*)/);
    if(matched){
        window.location.hash = "/"+this.menuId+matched[1];
    }else{
        window.location.hash = path;
    }
};

jsc.Page.prototype.render = function(ctx){
    var self = this;
    self.$target.block();
    self.target.replaceChild(self.el, self.target.firstChild);
    $("#menu-"+self.menuId).addClass("active");
    self.init(ctx, function(){
        self.$el.fadeIn(200);
        self.$target.unblock();
    });
};

jsc.Page.prototype.init = function(ctx, complete){};

jsc.Page.prototype.attempt = function(fn, successPath){
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

