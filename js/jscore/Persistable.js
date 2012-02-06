jsc.Persistable = function(){
};

jsc.Persistable.prototype.persist = function(){
    var self = this;
    jsc.logger.log("persiting", self.data);
    localStorage.setItem(self.menuId, JSON.stringify(self.data));
};

jsc.Persistable.prototype.restore = function(){
    var self = this;
    jsc.logger.log("restoring", self.data);
    var persisted = JSON.parse(localStorage.getItem(self.menuId)); 
    if(persisted === null){
        self.data = self.defaultData;
    }else{
        self.data = persisted;
    }
};

jsc.Persistable.prototype.reset = function(){
    var self = this;
    jsc.logger.log("reseting", self.menuId);
    self.data = self.defaultData;
    localStorage.removeItem(self.menuId);
};

