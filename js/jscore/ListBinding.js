jsc.ListBinding = function(elementId, rowId, stylers){
    var self = this;

    EventEmitter.call(self);

    self.rowId = rowId;
    self.lst = document.getElementById(elementId);
    self.data = [];
    self.stylers = stylers;
    self.itemTemplate = self.lst.querySelector("li");
    self.lst.removeChild(self.itemTemplate);
};
jsc.compose(jsc.ListBinding, EventEmitter);

jsc.ListBinding.prototype.bind = function(data){
    var self = this;

    self.data = data;

    for(var x = 0; x < data.length; x++){
        var liNew = self.itemTemplate.cloneNode(true);

        if(liNew.hasAttribute("data-styler")){
            self.applyStyle(liNew, data[x]);
        }

        var styledNodes = liNew.querySelectorAll("[data-styler]");

        for(var i = 0; i < styledNodes.length; i++){
            self.applyStyle(styledNodes[i], data[x]);
        }

        liNew.setAttribute("data-id", data[x][self.rowId]);

        dataBinds = liNew.querySelectorAll("[data-bind]");

        for(var y = 0; y < dataBinds.length; y++) {
            var db = dataBinds[y];

            var binds = db.dataset.bind.split(";");

            for(var z = 0; z < binds.length; z++){
                var attName  = binds[z].split(":")[0];
                var attLookup = binds[z].split(":")[1];
                if(_.isFunction(data[x][attLookup])){
                    db.setAttribute(attName, data[x][attLookup]());
                }else if(attName === "html"){
                    db.innerHTML = data[x][attLookup];
                }else{
                    db.setAttribute(attName, data[x][attLookup]);
                }
            }
        }
        self.lst.appendChild(liNew);
    }
};

jsc.ListBinding.prototype.applyStyle = function(node, row){
    var self = this;
    var dataStyle = node.dataset.styler;
    if(dataStyle){
        var className = self.stylers[dataStyle](row);
        if(className){
            jsc.addClass(node, className);
        }
    }
};

jsc.ListBinding.prototype.renderItem = function(id, row){
    var self = this;
    var li = self.lst.querySelector("li[data-id='"+id+"']");

    var styledNodes = li.querySelectorAll("[data-styler]");

    for(var i = 0; i < styledNodes.length; i++){
        self.applyStyle(styledNodes[i], row[x]);
    }

    dataBinds = li.querySelectorAll("[data-bind]");

    for(var y = 0; y < dataBinds.length; y++) {
        var db = dataBinds[y];

        var binds = db.dataset.bind.split(";");

        for(var z = 0; z < binds.length; z++){
            var attName  = binds[z].split(":")[0];
            var attLookup = binds[z].split(":")[1];
            if(_.isFunction(row[attLookup])){
                db.setAttribute(attName, row[attLookup]());
            }else if(attName === "html"){
                db.innerHTML = row[attLookup];
            }else{
                db.setAttribute(attName, row[attLookup]);
            }
        }
    }
};

jsc.ListBinding.prototype.get = function(id){
    var self = this;
    return self.data.filter(function(x){
        return x[self.rowId] === id;
    })[0];
};

jsc.ListBinding.prototype.update = function(id, fn){
    var self = this;
    var row = self.data.filter(function(x){
        return x[self.rowId] === id;
    })[0];
    fn(row);
    self.renderItem(id, row);
};

jsc.ListBinding.prototype.add = function(row){
    var self = this;
    self.data.push(row);
    var newItem = self.lst.querySelector("li").cloneNode(true);
    self.lst.appendChild(newItem);
};

