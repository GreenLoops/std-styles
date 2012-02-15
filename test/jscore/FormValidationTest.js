buster.testCase("Form Validation", {

    "given a form with two input elements": {

        setUp: function(done){
            var self = this;

            self.frm = document.createElement("form");
            self.frm.innerHTML =
                '<div id=aControl class=control-group>\
                    <input id=aField type=text required />\
                </div>';

            self.formValidation = new jsc.FormValidation(self.frm);
            self.formValidation.initValidation();
            document.body.appendChild(self.frm);
            done();
        },

        tearDown: function(done){
            var self = this;
            document.body.removeChild(self.frm);
            done();
        },

        "should style the control-group, when validating the form with invalid fields": function(done){
            var self = this;

            self.formValidation.validate();

            var aControl = document.getElementById("aControl");

            assert(aControl.className.match("error"));
            assert.equals('<span class="help-inline error">Please fill out this field.</span>', aControl.lastChild.outerHTML);

            done();
        },

        "should remove the control-group styling, when a field's validity changes to valid": function(done){
            var self = this;

            self.formValidation.validate();

            var aControl = document.getElementById("aControl");
            var aField = document.getElementById("aField");

            aField.value = "something";

            assert(aControl.className.match("error"));
            assert.equals('<span class="help-inline error">Please fill out this field.</span>', aControl.lastChild.outerHTML);

            done();
        }
    }
});
