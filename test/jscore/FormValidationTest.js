buster.testCase("Form Validation", {

    setUp: function(){
        var self = this;

        self.frm = document.createElement("form");
        document.body.appendChild(self.frm);
    },

    tearDown: function(){
        var self = this;
        document.body.removeChild(self.frm);
    },

    "should style the control-group, when validating the form with invalid fields": function(){
        var self = this;

        self.frm.innerHTML = 
        '<div id=aControl class=control-group>\
            <label for=aField class=control-label>label</label>\
            <div class=controls>\
                <input id=aField type=text required />\
                <span class=help-inline>help</span>\
            </div>\
        </div>';

        setTimeout(function(){}, 500);

        var formValidation = new jsc.FormValidation();
        formValidation.initValidation(self.frm);

        var rst = formValidation.validate();

        var aControl = document.getElementById("aControl");
        assert.equals(rst, false);
        assert(aControl.className.match("error"));
        assert(aControl.querySelectorAll("span.error").length, 1);
    },

    "should confirm that all fields are valid": function(){
        var self = this;

        self.frm.innerHTML =
        '<div id=aControl class=control-group>\
            <label for=aField class=control-label>label</label>\
            <div class=controls>\
                <input id=aField type=text required value="hasvalue" />\
                <span class=help-inline>help</span>\
            </div>\
        </div>';

        var formValidation = new jsc.FormValidation();
        formValidation.initValidation(self.frm);
        var rst = formValidation.validate();

        assert(rst);
    },

    "should support custom validators": function(){
        var self = this;
        var validatorSpy = sinon.spy();

        self.frm.innerHTML =
        '<div id=aControl class=control-group>\
            <label for=aField class=control-label>label</label>\
            <div class=controls>\
                <input id=aField type=name />\
                <span class=help-inline>help</span>\
            </div>\
        </div>';

        var formValidation = new jsc.FormValidation();
        formValidation.addValidator("name", validatorSpy);
        formValidation.initValidation(self.frm);
        formValidation.validate();

        assert(validatorSpy.called);
    },

    "should clear a fields previous validation error if validity state changes": function(){
        var self = this;

        self.frm.innerHTML =
        '<div id=aControl class=control-group>\
            <label for=aField class=control-label>label</label>\
            <div class=controls>\
                <input id=aField type=text required />\
                <span class=help-inline>help</span>\
            </div>\
        </div>';

        var formValidation = new jsc.FormValidation();
        formValidation.initValidation(self.frm);
        formValidation.validate();

        var aControl = document.getElementById("aControl");
        assert(aControl.className.match("error"));

        var aField = aControl.querySelector("#aField");

        aField.value = "foo";

        jsc.trigger(aField, "change");

        assert.equals(aControl.querySelectorAll("span.error").length, 0);
    },

    "should only show primary validation error": function(){
        var self = this;

        self.frm.innerHTML =
        '<div id=aControl class=control-group>\
            <input id=aField type=name required />\
        </div>';

        var formValidation = new jsc.FormValidation();

        formValidation.addValidator("name", function(fld){
            return fld.value === "foo";
        });
        formValidation.initValidation(self.frm);
        formValidation.validate();

        var errorSpans = self.frm.querySelectorAll("span");
        assert(errorSpans.length, 1);
    },

    "should hide any existing help-inline": function(){
        var self = this;

        self.frm.innerHTML =
        '<div id=aControl class=control-group>\
            <input id=aField type=text required />\
            <span class=help-inline>whatup</span>\
        </div>';

        var formValidation = new jsc.FormValidation();

        formValidation.initValidation(self.frm);
        formValidation.validate();

        var helpSpan = self.frm.querySelector("span");
        assert(helpSpan.style.display === "none");
    }
});
