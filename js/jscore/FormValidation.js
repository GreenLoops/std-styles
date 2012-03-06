jsc.FormValidation = function(){
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
    
    if(self.validators){
        if(self.validators[validatorName]){
            validator = self.validators[validatorName];
        }else if(jsc.validators[validatorName]){
            validator = jsc.validators[validatorName];
        }
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
    var errorMessage = controls.querySelector("span.error");
    var helpMessage = controls.querySelector("span.help-inline");

    controlGroup.classList.remove("error");
    if(errorMessage) controls.removeChild(errorMessage);
    if(helpMessage) helpMessage.removeAttribute("style");
};

jsc.FormValidation.prototype.showError = function(el){
    var span;
    var self = this;
    var controlGroup = el.parentNode.parentNode;
    var controls = el.parentNode;
    var valid = el.getAttribute("data-valid");
    var validity = el.getAttribute("data-validity");
    var existingHelp = controlGroup.querySelector("span.help-inline");

    controlGroup.classList.add("error");
    if(existingHelp) existingHelp.style.display = "none";

    if(!controls.querySelector("span.error")){
        span = document.createElement("span");
        span.className = "help-inline error";
        if(validity === "valueMissing"){
            span.innerHTML = "Please fill out this field.";
        }else{
            span.innerHTML = "something else";
        }
        controls.appendChild(span);
    }
};

jsc.FormValidation.prototype.initValidation = function(frm){
    var field, fields;
    var self = this;

    self.frm = frm;

    function handleOnChange(e){
        self.validateField(this, self.frm);
    }

    function handleOnInput(){
        self.validateField(this, self.frm);
    }

    function handleOnInvalid(){
        self.showError(this);
    }

    if(self.frm !== undefined){
        fields = self.frm.elements;
        fieldsLength = fields.length;
        for(var i = 0; i < fieldsLength; i++){
            field = fields[i];
            if(field.tagName === "INPUT"){
                jsc.bind(field, "change", handleOnChange);
                jsc.bind(field, "input", handleOnInput);
                jsc.bind(field, "invalid", handleOnInvalid);
            }
        }
    }
};

jsc.FormValidation.prototype.validate = function(){
    var idx, el;
    var self = this;
    var result = true;
    var elementsLength = self.frm.elements.length; 

    for(idx = 0; idx < elementsLength; idx++){
        el = self.frm.elements[idx];
        if(el.tagName !== null && el.tagName === "INPUT"){
            if(self.validateField(el) === false) result = false;
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

