jsc.Actionable = function(){
};

jsc.Actionable.prototype.initActions = function(el){
    var item;
    var self = this;

    function handleEvent(ev){
        ev.preventDefault();
        self[this.dataset.action](ev);
        return false;
    }

    el = el || self.el;
    self.actionableItems = el.querySelectorAll("[data-action]");
    for(var i = 0; i < self.actionableItems.length; i++){
        item = self.actionableItems[i];
        if(self[item.dataset.action]){
            item.addEventListener("click", handleEvent, false);
        }
    }
};
