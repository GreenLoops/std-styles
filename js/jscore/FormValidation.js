/*
* this is typically mixed into another class, so the constructor is
* never actually call, but is useful for testing 
*/
jsc.FormValidation = function(frm){
    this.frm = frm;
};

jsc.FormValidation.prototype.initValidation = function(){
    var self = this;

    function createError(){
        return $(this);
    }

    function showError($el, msg, field){
        $el.parents(".control-group").addClass("error");
        $el.parent()
            .find(".help-inline")
            .hide()
            .end()
            .append("<span class='help-inline error'>" + msg + "</span>");
    }

    function hideError($el, field){
        $el.parents(".control-group").removeClass("error");
        $el.parent()
            .find(".help-inline.error")
            .remove()
            .end()
            .find(".help-inline").show();
    }

    function validateField(field, form){
        if (field.checkValidity() || field.validity.customError){
            var x, cn, validator;
            var classes = (field.className + '').split(' ');
            var l = classes.length;

            // Check if there is a validator for each class
            for (x = 0; x < l; x++){
                cn = $.trim(classes[x]);
                validator = validators[cn];
                // And run it if so
                if (validator) validator(field.control.value(), field, form);
            }

            // We always have to declare our inputs as valid ourselves
            if (field.checkValidity()) $(field).trigger("valid");
        }
    }

    if(self.frm !== undefined){
        $(self.frm).f5({
            error: {
                create: createError,
                show: showError,
                hide: hideError
            }
        });
        
        var $fields = $(self.frm).f5fields();
            
        $fields.bind("invalid", function(e) {
            $(this).data("checkValidityOnKeyUp", true);
        });

        $fields.bind("change", function(e) {
            self.validateField(this, $form);
            $(this).data("checkValidityOnKeyUp", true);
        });

        $fields.bind("input", function(e) {
            if (false || $(this).data("checkValidityOnKeyUp") === true) {
                self.validateField(this, $form);
            }
        });
    }
};

jsc.FormValidation.prototype.validate = function(){
    var self = this;
    return self.frm.checkValidity();
};

