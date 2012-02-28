jsc.TableBinding = function(tbl, stylers, formaters){
    var self = this;

    self.tbl = tbl;
    self.data = [];

    self.formats = {
        "special": function(value){
            return value.toUpperCase();
        }
    };
    self.stylers = stylers;
};

jsc.TableBinding.prototype.bind = function(data){
    var self = this;

    self.data = data;

    function applyStyle(node, row){
        var dataStyle = node.getAttribute("data-styler");
        if(dataStyle){
            var className = self.stylers[dataStyle](row);
            if(className){
                jsc.addClass(node, className);
            }
        }
    }

    var body = self.tbl.querySelector("tbody");
    var tr = body.querySelector("tr");

    for(var i = 0; i < data.length; i++){
        var trNew = (i === 0) ? tr : tr.cloneNode(true);

        if(trNew.hasAttribute("data-styler")){
            applyStyle(trNew, data[i]);
        }

        var styledNodes = trNew.querySelectorAll("[data-styler]");

        for(var x = 0; x < styledNodes.length; x++){
            applyStyle(styledNodes[x], data[i]);
        }

        trNew.setAttribute("data-id", data[i][trNew.getAttribute("data-row")]);
        dataFields = trNew.querySelectorAll("[data-field]");
        for(var k = 0; k < dataFields.length; k++) {
            var td = dataFields[k];
            var dataField = td.getAttribute("data-field");
            var dataFormat = td.getAttribute("data-format");
            if(dataFormat){
                td.innerHTML = self.formats[dataFormat](data[i][dataField]);
            }else{
                td.innerHTML = data[i][dataField];
            }
        }
        body.appendChild(trNew);
    }
};

