/**
* @constructor
*/
jsc.BaseFormWidget = function(elementId){
    jsc.DomUtils.call(this);

    var self = this;

    self.elementId = elementId;

    self.el = null;
    self.$el = null;
};

jsc.compose(jsc.BaseFormWidget, jsc.DomUtils);

jsc.BaseFormWidget.prototype.render = function(ctx){
    var self = this;

    // store element and jquery element for convienance
    self.el = document.getElementById(self.elementId);
    self.$el = $(self.el);

    self.$el.block();
    self.init(ctx, function(){
        self.$el.unblock();
    });
};

jsc.BaseFormWidget.prototype.renderActions = function(actions){
    var self = this;

    var $ul = $("<ul class=actions></ul>");

    _.each(actions, function(action, index){
        var b = $("<button id=actions-"+action.name+">"+action.text+"</button>");
        b.prop("disabled", !!action.disabled);
        b.toggleClass("default", !!action.highlight);
        // allow classes to be added on the fly
        if(action.classes){ b.addClass(action.classes); }
        b.on("click", function(event){
            if(action.name === "next" || action.name === "add" || action.name === "save"){
                self.done(action.name);
            }else if(action.name === "cancel" || action.name === "skip"){
                self.cancel(action.name);
            }else if(self[action.name]){
                // support buttons that call into anything -- so we can support as many buttons as we want.
                self[action.name](action.name);
            }
        });
        var l = $("<li></li>");
        $ul.append(l.append(b));
    });

    self.$el.append($ul);
};

jsc.BaseFormWidget.prototype.enableAction = function(action){
    $("#actions-"+action).removeProp("disabled");
};

jsc.BaseFormWidget.prototype.init = function(ctx, complete){};
jsc.BaseFormWidget.prototype.validate = function(action){};
jsc.BaseFormWidget.prototype.cancel = function(action){};
jsc.BaseFormWidget.prototype.done = function(action){};

