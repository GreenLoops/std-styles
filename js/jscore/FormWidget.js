/**
* @constructor
*/
jsc.FormWidget = function(appContext, elementId){
    var self = this;

    jsc.DomUtils.call(self);

    self.binding = appContext.binding;
    self.elementId = elementId;

    self.el = null;
    self.$el = null;
};

jsc.compose(jsc.FormWidget, jsc.DomUtils);

jsc.FormWidget.prototype.render = function(ctx){
    var self = this;

    // store element and jquery element for convienance
    self.el = document.getElementById(self.elementId);
    self.$el = $(self.el);

    self.$el.block();
    self.init(ctx, function(){
        self.$el.unblock();
    });
};

jsc.FormWidget.prototype.renderActions = function(actions){
    var self = this;

    var $ul = $("<ul class=actions></ul>");

    _.each(actions, function(action, index){
        var b = $("<button id=actions-"+action.name+">"+action.text+"</button>");
        b.prop("disabled", !!action.disabled);
        b.toggleClass("default", !!action.highlight);
        b.on("click", function(event){
            if(action.name === "next" || action.name === "add" || action.name === "save"){
                self.done(action.name);
            }else if(action.name === "cancel" || action.name === "skip"){
                self.cancel(action.name);
            }
        });
        var l = $("<li></li>");
        $ul.append(l.append(b));
    });

    self.$el.append($ul);
};

jsc.FormWidget.prototype.enableAction = function(action){
    $("#actions-"+action).removeProp("disabled");
};

jsc.FormWidget.prototype.init = function(ctx, complete){};
jsc.FormWidget.prototype.validate = function(action){};
jsc.FormWidget.prototype.cancel = function(action){};
jsc.FormWidget.prototype.done = function(action){};

