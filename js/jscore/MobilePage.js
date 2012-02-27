/**
* @constructor
*/
jsc.MobilePage = function(appContext, targetId){
    var self = this;

    self.dataStore = appContext.dataStore;
    self.binding = appContext.binding;
    self.logger = appContext.logger;

    self.model = {};
    self.targetId = targetId;
};

jsc.MobilePage.prototype.render = function(ctx){
    var self = this;

    self.page = document.getElementById(self.targetId);
    console.log(self);
    self.el = self.page.querySelector("div[data-role=content]");

    self.$page = $(self.page);
    self.$el = $(self.el);

    self.init(ctx, function(){

    });

    return self.$page;
};

jsc.MobilePage.prototype.init = function(ctx, complete){};

