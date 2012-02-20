/*
* this is typically mixed into another class, so the constructor is
* never actually call, but is useful for testing 
*/
jsc.FormValidation = function(frm){
    this.frm = frm;
};

jsc.FormValidation.prototype.validateField = function(field){
    var self = this, result = true;

    if(field.hasAttribute("required")){
        field.setAttribute("data-valid", false);
        field.setAttribute("data-validity", "valueMissing");
        if(field.value.length === 0) {
            result = false;
            jsc.trigger(field, "invalid");
        }
    }
    
    var validatorName = field.getAttribute("type");
    var validator;
    
    if(self.validators[validatorName]){
        validator = self.validators[validatorName];
    }else if(jsc.validators[validatorName]){
        validator = jsc.validators[validatorName];
    }

    if(result && validator && !validator(field, self.frm)){
        field.setAttribute("data-valid", false);
        jsc.trigger(field, "invalid");
        result = false;
    }else if(result){
        self.clearError(field);
    }
    return result;
};

jsc.FormValidation.prototype.clearError = function(el){
    var self = this;
    var controlGroup = el.parentNode.parentNode;
    var controls = el.parentNode;
    jsc.removeClass(controlGroup, "error");
    var errorMessage = controls.querySelector("span.error");
    if(errorMessage) controls.removeChild(errorMessage);
    var helpMessage = controls.querySelector("span.help-inline");
    if(helpMessage) helpMessage.removeAttribute("style");
};

jsc.FormValidation.prototype.showError = function(el){
    var self = this;
    var controlGroup = el.parentNode.parentNode;
    var controls = el.parentNode;
    var valid = el.getAttribute("data-valid");
    var validity = el.getAttribute("data-validity");

    jsc.addClass(controlGroup, "error");

    var existingHelp = controlGroup.querySelector("span.help-inline");
    if(existingHelp) existingHelp.style.display = "none";

    if(!controls.querySelector("span.error")){
        var span = document.createElement("span");
        span.className = "help-inline error";
        if(validity === "valueMissing"){
            span.innerHTML = "Please fill out this field.";
        }else{
            span.innerHTML = "something else";
        }
        controls.appendChild(span);
    }
};

jsc.FormValidation.prototype.initValidation = function(){
    var self = this, field, fields;

    if(self.validators === undefined){
        self.validators = {};
    }

    if(self.frm !== undefined){

        fields = self.frm.elements;

        for(var i = 0; i < fields.length; i++){

            field = fields[i];

            if(field.tagName === "INPUT"){
                jsc.bind(field, "change", function(e){
                    self.validateField(this, self.frm);
                });

                jsc.bind(field, "input", function(e){
                    self.validateField(this, self.frm);
                });

                jsc.bind(field, "invalid", function(e){
                    self.showError(this);
                });
            }
        }
    }
};

jsc.FormValidation.prototype.validate = function(){
    var self = this, idx, result = true, el;

    if(self.validators){
        for(idx = 0; idx < self.frm.elements.length; idx++){
            el = self.frm.elements[idx];
            if(el.tagName !== null && el.tagName === "INPUT"){
                if(self.validateField(el) === false) result = false;
            }
        }
    }

    return result;
};

jsc.FormValidation.prototype.addValidator = function(validatorName, validatorFn){
    var self = this;
    if(self.validators){
        self.validators[validatorName] = validatorFn;
    }else{
        self.validators = {};
        self.validators[validatorName] = validatorFn;
    }
};

