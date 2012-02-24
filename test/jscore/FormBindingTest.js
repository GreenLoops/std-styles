buster.testCase("FormBinding", {

    setUp: function()
    {
        this.form = document.createElement("form");
        this.jsbind = new jsc.FormBinding();
    },

    "given a form":
    {
        "parse a set of simple text fields": function()
        {
            this.form.innerHTML = '\
                <input type="text" name="foo" value="" />\
                <input type="text" name="bar" value="whatup" />\
            ';

            assert.equals({
                foo:"",
                bar:"whatup"
            }, 
            this.jsbind.parse(this.form));
        },

        "parse a set of text fields with nested values": function()
        {
            this.form.innerHTML = '\
                <input type="text" name="parent.child1" value="1" />\
                <input type="text" name="parent.child2" value="2" />\
            ';

            assert.equals({
                parent: {
                    child1:"1",
                    child2:"2"
                }
            }, 
            this.jsbind.parse(this.form));
        },

        "parse a set of text fields embedded inside nested divs and fieldset tags": function()
        {
            this.form.innerHTML = '\
                <div>\
                    <div>\
                        <fieldset>\
                            <input type="text" name="foo" value="1" />\
                        </fieldset>\
                    </div>\
                </div>\
            ';

            assert.equals({
                foo:"1"
            },
            this.jsbind.parse(this.form));
        },

        "parse a set of radio options as a single value": function()
        {
            this.form.innerHTML = '\
                <input type="radio" name="group" value="1" checked />\
                <input type="radio" name="group" value="2" />\
            ';

            assert.equals({
                group:"1"
            }, 
            this.jsbind.parse(this.form));
        },

        "parse a set of checkbox fields as booleans": function()
        {
            this.form.innerHTML = '\
                <input type="checkbox" name="child1" checked />\
                <input type="checkbox" name="child2" />\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                child1: true,
                child2: false
            });
        },

        "parse a select menu for a single value": function()
        {
            this.form.innerHTML = '\
                <select name="foo">\
                    <option value="value1" selected />\
                    <option value="value2" />\
                </select>\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                foo: "value1"
            });
        },

        "parse multiple checkbox fields with the array syntax": function()
        {
            this.form.innerHTML = '\
                <input type="checkbox" checked name="children|[]" value="1" />\
                <input type="checkbox" checked name="children|[]" value="2" />\
                <input type="checkbox" name="children|[]" value="3" />\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                children: ["1", "2"]
            });
        },

        "parse multiple text fields with the array syntax": function()
        {
            this.form.innerHTML = '\
                <input type="text" name="children|[]" value="1" />\
                <input type="text" name="children|[]" value="2" />\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                children: ["1", "2"]
            });
        },

        "handle custom processing of values": function()
        {
            function customProcess(node, name, value) {
                if(name === "child2") return "foo";
                else return value;
            }

            this.form.innerHTML = '\
                <input type="text" name="child1" value="1" />\
                <input type="text" name="child2" value="2" />\
            ';

            assert.equals(this.jsbind.parse(this.form, customProcess),
            {
                child1:"1",
                child2:"foo"
            });
        },

        "//handle fieldsets as parent object": function()
        {
            this.form.innerHTML = '\
                <fieldset name="parent">\
                    <input type="text" name="child1" value="1" />\
                    <input type="text" name="child2" value="2" />\
                </fieldset>\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                parent: {
                    child1:"1",
                    child2:"2"
                }
            });
        },

        "parse button values just like input values": function()
        {
            this.form.innerHTML = '\
                <button name="child1">Child1</button>\
                <button name="child2">Child2</button>\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                child1:"Child1",
                child2:"Child2"
            });
        },

        "ignore any elements who's name is empty": function()
        {
            this.form.innerHTML = '\
                <input type="text" name="child1" value="2" />\
                <input type="text" value="3" />\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                child1:"2"
            });
        },

        "ignore any elements with a className of ignore": function()
        {
            this.form.innerHTML = '\
                <input type="text" name="child1" class="ignore" value="1" />\
                <input type="text" name="child2" class="other andagain ignore" value="2" />\
                <input type="text" name="child3" value="3" />\
                <input type="text" name="child4" class="other hey-ignore ignore-hey" value="4" />\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                child3:"3",
                child4:"4"
            });
        },

        "parse textareas": function()
        {
            this.form.innerHTML = '\
                <textarea name="child1">some text</textarea>\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                child1:"some text"
            });
        },

        "automatically apply a boolean filter for true and false values": function()
        {
            this.form.innerHTML = '\
                <input name="child1" value="true" />\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                child1:true
            });
        },

        "apply a numeric filter for integer and float": function()
        {
            this.form.innerHTML = '\
                <input name="child1|i" value="0" />\
                <input name="child2|f" value="0.0" />\
            ';

            var rst = this.jsbind.parse(this.form);

            assert.typeOf(rst.child1, "number");
            assert.typeOf(rst.child2, "number");
        },

        "apply a date filter": function()
        {
            this.form.innerHTML = '\
                <input name="child1|d" value="12-14-2011" />\
                <input name="child2|d" value="12-15-2011" />\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                child1: new Date("12-14-2011"),
                child2: new Date("12-15-2011")
            });
        },

        "date filters can support dateformatting to strings": function()
        {
            var dateFormatterSpy = sinon.spy();
            var jsbind = new jsc.FormBinding({dateFormatter:dateFormatterSpy});

            this.form.innerHTML = '\
                <input name="child1|df:yyyy-mm-dd" value="12-14-2011" />\
            ';

            jsbind.parse(this.form);

            assert.calledOnceWith(dateFormatterSpy, "12-14-2011", "yyyy-mm-dd");
        },

        "dateformmatting filters should have a default format of MM/DD/YYYY": function()
        {
            var dateFormatterSpy = sinon.spy();
            var jsbind = new jsc.FormBinding({dateFormatter:dateFormatterSpy});

            this.form.innerHTML = '\
                <input name="child1|df" value="12-14-2011" />\
            ';

            jsbind.parse(this.form);

            assert.calledOnceWith(dateFormatterSpy, "12-14-2011", "MM/DD/YYYY");
        },

        "given a dollar value and $ filter, convert to an integer of pennies": function()
        {
            this.form.innerHTML = '\
                <input name="sample1|$" value="50" />\
                <input name="sample2|$" value="50.50" />\
                <input name="sample3|$" value="5,000.50" />\
            ';

            assert.equals(this.jsbind.parse(this.form),
            {
                sample1: 5000,
                sample2: 5050,
                sample3: 500050
            });
        }
    },

    "given an object and a form":
    {
        "with standard text fields, use the name attribute to populate it's values": function()
        {
            this.form.innerHTML = '\
                <input name="parent.child1" />\
                <input name="parent.child2" />\
                <input name="parent.childParent.child1" />\
                <input name="other" />\
            ';

            this.jsbind.populate(this.form,
            {
                parent: {
                    child1: "1",
                    child2: "2",
                    childParent: {
                        child1: "3"
                    }
                },
                other: "4"
            });

            assert.equals(this.form.elements["parent.child1"].value, "1");
            assert.equals(this.form.elements["parent.child2"].value, "2");
            assert.equals(this.form.elements["parent.childParent.child1"].value, "3");
            assert.equals(this.form.elements.other.value, "4");
        },

        "with standard checkbox fields, use the name attribute to set it's checked 'status'": function()
        {
            this.form.innerHTML = '\
                <input type="checkbox" name="child1" />\
                <input type="checkbox" name="child2" />\
            ';

            this.jsbind.populate(this.form,
            {
                child1: true,
                child2: false
            });

            assert.equals(this.form.elements.child1.checked, true);
            assert.equals(this.form.elements.child2.checked, false);
        },

        "with a set radio options, use the name attribute and select the approriate option": function()
        {
            this.form.innerHTML = '\
                <input type="radio" name="child1" value="0" />\
                <input type="radio" name="child1" value="1" />\
            ';

            this.jsbind.populate(this.form,
            {
                child1: "1"
            });

            assert(this.form.elements.child1[1].checked);
        },

        "with a select box, use the name attribute and select the approriate option": function()
        {
            this.form.innerHTML = '\
                <select name="child1">\
                    <option value="all">All</option>\
                    <option value="foo">Foo</option>\
                    <option value="bar">Bar</option>\
                </select>\
            ';

            this.jsbind.populate(this.form,
            {
                child1: "bar"
            });

            assert.equals(2, this.form.elements.child1.selectedIndex);
        },

        "with a field embedded inside of a fieldset": function()
        {        
            this.form.innerHTML = '\
                <fieldset>\
                    <input name="sample1" />\
                </fieldset>\
            ';

            this.jsbind.populate(this.form,
            {
                sample1: "foo"
            });

            assert.equals(this.form.elements.sample1.value, "foo");
        },

        "with a select box, use the the name attribute to select the appropriate option": function()
        {
            this.form.innerHTML = '\
                <select name="number">\
                    <option value="1">One</option>\
                    <option value="2">Two</option>\
                </select>\
            ';

            this.jsbind.populate(this.form,
            {
                number: "2"
            });

            assert(this.form.elements.number.options[1].selected);
        },

        "with a 'date' field, use the name attribute and it's format filter to display a formatted date value": function()
        {
            this.form.innerHTML = '\
                <input type="text" name="someDate|df:yyyy-mm-dd" />\
            ';

            var dateFormatterSpy = sinon.spy();
            var jsbind = new jsc.FormBinding({dateFormatter:dateFormatterSpy});

            jsbind.populate(this.form,
            {
                someDate: "1/1/2012"
            });

            assert.calledWith(dateFormatterSpy, "1/1/2012", "yyyy-mm-dd");
        },

        "with a currency field, use the name attribute to display the formatted value": function()
        {        
            this.form.innerHTML = '\
                <input name="sample1|$" />\
            ';

            this.jsbind.populate(this.form,
            {
                sample1: 10000
            });

            assert.equals(this.form.elements["sample1|$"].value, "100.00");
        },

        "with any given field and an undefined value, populate field with empty string": function()
        {        
            this.form.innerHTML = '\
                <input name="sample1" />\
                <input name="sample2" />\
            ';

            this.jsbind.populate(this.form,
            {
                sample1: "foo"
            });

            assert.equals(this.form.elements.sample1.value, "foo");
            assert.equals(this.form.elements.sample2.value, "");
        },

        "with a textarea, use the name attribute to populate field": function()
        {        
            this.form.innerHTML = '\
                <textarea name="sample1"></textarea>\
            ';

            this.jsbind.populate(this.form,
            {
                sample1: "foo"
            });

            assert.equals(this.form.elements.sample1.value, "foo");
        }
    },

    "convert pennies to currency": function()
    {
        assert.equals(this.jsbind.pennies2dollar(10), "0.10");
        assert.equals(this.jsbind.pennies2dollar(1050), "10.50");
        assert.equals(this.jsbind.pennies2dollar(100050), "1,000.50");
        assert.equals(this.jsbind.pennies2dollar(100000050), "1,000,000.50");
    },

    "convert currency to pennies": function()
    {
        assert.equals(this.jsbind.dollar2pennies("0.10"), 10);
        assert.equals(this.jsbind.dollar2pennies("10.50"), 1050);
        assert.equals(this.jsbind.dollar2pennies("1,000.50"), 100050);
        assert.equals(this.jsbind.dollar2pennies("1,000,000.50"), 100000050);
    }

});
