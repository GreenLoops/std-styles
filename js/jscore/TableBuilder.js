jsc.TableBuilder = function(config)
{
    var self = this;

    self.config = config || {};
};

jsc.TableBuilder.prototype.ce = function(tagName)
{
    return document.createElement(tagName);
};

jsc.TableBuilder.prototype.each = function(collection, fn)
{
    for(var i = 0; i < collection.length; i++)
    {
        fn(collection[i], i);
    }
};

jsc.TableBuilder.prototype.addClass = function(el, className)
{
    if(el.classList)
    {
        el.classList.add(className);
    }
    else
    {
		var trimmed = el.className.replace(/^\s+|\s+$/g, "");
        var classList = trimmed.split(/\s+/);
        var count = classList.length;
        classList.push(className);
        el.className = (count === 1) ? className : classList.join(" ");
    }
};

jsc.TableBuilder.prototype.genHeader = function()
{
    var self = this;

    var tr = self.ce("tr");

    self.each(self.config.cols, function(col, index) {
        var th = self.ce("th");
        th.innerHTML = col.header;
        if(index === 0) self.addClass(th, "first");
        else if(index === self.config.cols.length - 1) self.addClass(th, "last");
        th.setAttribute("width", col.width + "px");
        tr.appendChild(th);
    });

    var thead = self.ce("thead");

    thead.appendChild(tr);

    return thead;
};

jsc.TableBuilder.prototype.genBody = function(data)
{
    var self = this;

    var tbody = self.ce("tbody");

    self.each(data, function(row, rowIndex) {
        var tr = self.ce("tr");
        self.each(self.config.cols, function(col, colIndex) {
            var td = self.ce("td");
            if(colIndex === 0) self.addClass(td, "first");
            else if(colIndex === self.config.cols.length - 1) self.addClass(td, "last");
            td.setAttribute("align", col.align ? col.align : "center");
            td.innerHTML = _.template(col.dataTemplate, row);
            tr.appendChild(td);
        });

        tr.setAttribute("data-id", _.template(self.config.idTemplate, row));

        if(self.config.rowStyleTemplate)
        {
            self.addClass(tr, _.template(self.config.rowStyleTemplate, row));
        }

        tbody.appendChild(tr);
    });

    return tbody;
};

jsc.TableBuilder.prototype.genFooter = function()
{
    var self = this;

    var td = self.ce("td");
    td.setAttribute("colspan", self.config.cols.length);
    td.innerHTML = "&nbsp;";

    var tr = self.ce("tr");
    tr.appendChild(td);

    var tfoot = self.ce("tfoot");
    tfoot.appendChild(tr);

    return tfoot;
};

jsc.TableBuilder.prototype.generate = function(data)
{
    var self = this;

    var table = self.ce("table");

    self.addClass(table, self.config.className);

    table.appendChild(self.genHeader());
    table.appendChild(self.genBody(data));
    table.appendChild(self.genFooter());

    return table;
};

