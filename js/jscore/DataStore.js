jsc.DataStore = function(contextId){
    var self = this;

    self.data = {};
    self.contextId = contextId;
};

jsc.DataStore.prototype.byName = function(domainName, queryName, fn){
    var self = this;
    $.getJSON("/q/"+self.contextId+"/"+domainName+"/"+queryName+"/all", function(r, x) {
        fn(r);
    }).error(function(e) {

    });
};

jsc.DataStore.prototype.byNameAndId = function(domainName, queryName, queryId, fn){
    var self = this;
    $.getJSON("/q/"+self.contextId+"/"+domainName+"/"+queryName+"/"+queryId, function(r) {
        fn(r);
    }).error(function(e) {

    });
};

