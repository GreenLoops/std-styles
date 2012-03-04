buster.testCase("Actionable", {

    setUp: function(){
        var self = this;

        self.frm = document.createElement("form");
        self.frm.onsubmit = function(){ return false; };
        document.body.appendChild(self.frm);
    },

    tearDown: function(){
        var self = this;
        document.body.removeChild(self.frm);
    },

    "should bind an element to an action": function(){
        var self = this;
        var doneSpy = sinon.spy();

        jsc.Actionable.prototype.done = doneSpy;
        var actionable = new jsc.Actionable();

        self.frm.innerHTML =
        '<div class=actions>\
            <button class=btn data-action=done>Done</button>\
            <a href="#" class=btn data-action=cancel>Cancel</button>\
        </div>';

        actionable.initActions(self.frm);
        jsc.trigger(self.frm.querySelector("button"), "click");
        assert(doneSpy.called);
    }
});
