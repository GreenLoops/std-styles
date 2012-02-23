/**
* @constructor
*/
jsc.DialogWidget = function(options){
    EventEmitter.apply(this);

    var self = this;

    self.elementId = options.elementId;
    self.templateString = "default content";
    self.df = document.createDocumentFragment();
    self.body = jsc.cel("div", "modal-body", {}, []);

    function cancel(){
        jsc.addClass(self.modalContainer, "hide");
        self.cancel();
    }

    self.cancelButton = jsc.cel("a", "btn", {}, [
        document.createTextNode(options.cancel || "Cancel")
    ]);

    self.doneButton = jsc.cel("a", "btn btn-primary", {}, [
        document.createTextNode(options.done || "Done")
    ])

    self.closeButton = jsc.cel("a", "close", {"data-dismiss":"modal"}, [
        document.createTextNode("x")
    ]);

    jsc.bind(self.closeButton, "click", cancel);

    self.df.appendChild(jsc.cel("div", "modal-header", {}, [
        self.closeButton,
        jsc.cel("h3", null, {}, [
            document.createTextNode(options.title || "Modal")
        ]),
    ]));

    self.df.appendChild(self.body);

    self.df.appendChild(jsc.cel("div", "modal-footer", {}, [
        self.cancelButton, self.doneButton
    ]));

    jsc.bind(self.cancelButton, "click", cancel);

    jsc.bind(self.doneButton, "click", function(){
        self.done();
        jsc.addClass(self.modalContainer, "hide");
    });
};
jsc.compose(jsc.DialogWidget, EventEmitter, jsc.DomUtils);

jsc.DialogWidget.prototype.render = function(ctx){
    var self = this;

    self.body.innerHTML = self.templateString;

    self.modalContainer = document.getElementById(self.elementId);
    jsc.addClass(self.modalContainer, "modal");

    self.modalContainer.appendChild(self.df);

    self.init(ctx, function(){

    });
};

jsc.DialogWidget.prototype.show = function(){
    var self = this;
    jsc.removeClass(self.modalContainer, "hide");
};

jsc.DialogWidget.prototype.init = function(ctx, complete){};
jsc.DialogWidget.prototype.done = function(){};
jsc.DialogWidget.prototype.cancel = function(){};

