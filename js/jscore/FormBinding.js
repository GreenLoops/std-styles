jsc.FormBinding = function(args) {
    args = args || {};
    this.customFilters = args.customFilters || {};
    this.ignorePattern = args.ignorePattern || /(^|\s)ignore(\s|$)/;
    this.dateFormatter = args.dateFormatter;
};

jsc.FormBinding.prototype.parse = function(form, customProcess)
{
    var el, formData = {};

    for(var i = 0; i < form.elements.length; i++)
    {
        this.parseNode(formData, form.elements[i], customProcess);
    }

    return formData;
};

jsc.FormBinding.prototype.parseEl = function(formId, customProcess)
{
    return this.parse(document.getElementById(formId), customProcess);
};

jsc.FormBinding.prototype.parseNode = function(obj, node, customProcess)
{
    if(node.name !== "" && node.tagName !== "FIELDSET" && node.className.match(this.ignorePattern) === null)
    {
        var filterParts = node.name.split("|");

        if(node.tagName === "BUTTON")
        {
            var buttonValue = (node.value === "") ? node.innerHTML : node.value;
            this.parseName(obj, filterParts[0], buttonValue, filterParts[1], customProcess);
        }
        else if(node.tagName.match(/(INPUT|TEXTAREA)/))
        {
            if(node.type === "radio")
            {
                if(node.checked) this.parseName(obj, filterParts[0], node.value, filterParts[1], customProcess);
            }
            else if(node.type === "checkbox")
            {
                if(filterParts[1])
                {
                    if(node.checked) this.parseName(obj, filterParts[0], node.value, filterParts[1], customProcess);
                }
                else
                {
                    if(node.checked) this.parseName(obj, node.name, true);
                    else this.parseName(obj, node.name, false);
                }
            }
            else
            {
                this.parseName(obj, filterParts[0], node.value, filterParts[1], customProcess);
            }
        }
        else if(node.tagName === "SELECT")
        {
            this.parseName(obj, filterParts[0], node.value, filterParts[1], customProcess);
        }
        else
        {
            if(console)
            {
                console.warn("not supported node type: " + node.tagNmae);
            }
        }
    }
};

jsc.FormBinding.prototype.parseName = function(obj, string, val, filter, customProcess)
{
    var parts = string.split(".");
    var currentName = parts[0];
    var isArray = filter === "[]";

    if(!obj[currentName])
    {
        if(isArray) obj[currentName] = [];
        else obj[currentName] = {};
    }

    if(parts[1])
    {
        var newObjOrArray = obj[currentName];
        parts.splice(0,1);
        var newString = parts.join('.');
        return this.parseName(newObjOrArray,newString, val, filter, customProcess);
    }

    var filteredValue = this.applyFilter(filter, val);

    if(customProcess === undefined)
    {
        if(isArray) obj[currentName].push(filteredValue);
        else obj[currentName] = filteredValue;
    }
    else
    {
        if(isArray) obj[currentName].push(customProcess(obj, currentName, filteredValue));
        else obj[currentName] = customProcess(obj, currentName, filteredValue);
    }
};

jsc.FormBinding.prototype.applyFilter = function(filter, origValue, isPopulate)
{
    if(this.customFilters[filter]) return this.customFilters[filter](origValue);
    else if(origValue === "true") return true;
    else if(origValue === "false") return false;
    else if(filter === "i") return parseInt(origValue, 10);
    else if(filter === "f") return parseFloat(origValue);
    else if(filter === "d") return new Date(origValue);
    else if(filter === "$") return isPopulate ? this.pennies2dollar(origValue) : this.dollar2pennies(origValue);
    else if(filter !== undefined && filter.match(/df:.*/) !== null) return this.dateFormatter(origValue, filter.split(":")[1]);
    else if(filter !== undefined && filter === "df") return this.dateFormatter(origValue, "MM/DD/YYYY");
    else return origValue;
};

jsc.FormBinding.prototype.pennies2dollar = function(pennies)
{
    return (pennies / 100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

jsc.FormBinding.prototype.dollar2pennies = function(dollar)
{
    return parseFloat(dollar.replace(/,/g, ""))*100;
};

jsc.FormBinding.prototype.populate = function(form, model)
{
    var self = this,
        elements = form.elements,
        flattened = {};

    function flattenModel(obj, parentPath)
    {
        for(var key in obj)
        {
            if(obj.hasOwnProperty(key))
            {
                var current = obj[key];
                if(typeof current === "object")
                {
                    parentPath.push(key);
                    flattenModel(current, parentPath);
                    parentPath.pop();
                }
                else
                {
                    if(parentPath.length > 0)
                    {
                        parentPath.push(key);
                        flattened[parentPath.join(".")] = current;
                        parentPath.pop();
                    }
                    else
                    {
                        flattened[key] = current;
                    }
                }
            }
        }
    }

    flattenModel(model, []);

    for(var x = 0; x < elements.length; x++)
    {
        var node = elements[x];
        if(node.name){
            var nodeNameParts = node.name.split("|");
            var name = nodeNameParts[0];
            var filter = nodeNameParts[1];
            this.populateNode(node, flattened[name], filter);
        }
    }
};

jsc.FormBinding.prototype.populateNode = function(node, value, filter)
{
    if(value === undefined) value = "";

    if(node.tagName === "INPUT" && node.type === "checkbox")
    {
        node.checked = value;
    }
    else if(node.tagName === "SELECT")
    {
        for(var x = 0; x < node.options.length; x++)
        {
            node.options[x].selected = (node.options[x].value === value);
        }
    }
    else if(node.tagName === "INPUT" && node.type === "radio")
    {
        if(node.value === value) node.checked = true;
        else node.checked = false;
    }
    else if(node.tagName === "INPUT" || node.tagName === "TEXTAREA")
    {
        node.value = this.applyFilter(filter, value, true);
    }
};

