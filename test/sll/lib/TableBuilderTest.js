buster.assertions.add("equalsHTML", {

    assert: function (actual, expected) {

        var x = $(actual.outerHTML)[0].outerHTML;
        var y = $(expected)[0].outerHTML;

        return x === y;
    },

    assertMessage: "${0} expected to be equal to ${1}"
});

buster.testCase("Table Builder", {

    "given a table config,":
    {
        setUp: function()
        {
            this.tb = new jsc.TableBuilder({
                idTemplate: "<%= id %>",
                cols: [
                    { header: "Foo",    width:50, dataTemplate: "<%= foo %>"    },
                    { header: "Bar",    width:60, dataTemplate: "<%= bar %>"    },
                    { header: "FooBar", width:60, dataTemplate: "<%= foobar %>" }
                ]
            });
        },

        "generate a table header": function()
        {
            var expected =
            '<thead>' +
                '<tr>' +
                    '<th class="first" width="50px">Foo</th>' +
                    '<th width="60px">Bar</th>' +
                    '<th class="last" width="60px">FooBar</th>' +
                '</tr>' +
            '</thead>';

            var actual = this.tb.genHeader();
            
            assert.equalsHTML(actual, expected);
        },

        "generate a table footer": function()
        {
            var expected =
            '<tfoot>' +
                '<tr>' +
                    '<td colspan="3">&nbsp;</td>' +
                '</tr>' +
            '</tfoot>';

            var actual = this.tb.genFooter();

            assert.equalsHTML(actual, expected);
        },

        "generate a table body": function()
        {
            var data = [
                { id: "1", foo: "foo1",  bar:"bar1", foobar:"foobar1" },
                { id: "2", foo: "foo2",  bar:"bar2", foobar:"foobar2" }
            ];

            var expected =
            '<tbody>' +
                '<tr data-id="1">' +
                    '<td class="first" align="center">foo1</td>' +
                    '<td align="center">bar1</td>' +
                    '<td class="last" align="center">foobar1</td>' +
                '</tr>' +
                '<tr data-id="2">' +
                    '<td class="first" align="center">foo2</td>' +
                    '<td align="center">bar2</td>' +
                    '<td class="last" align="center">foobar2</td>' +
                '</tr>' +
            '</tbody>';

            var actual = this.tb.genBody(data);

            assert.equalsHTML(actual, expected);
        }
    },

    "given an optional alignment,":
    {
        setUp: function()
        {
            this.tb = new jsc.TableBuilder({
                idTemplate: "<%= id %>",
                cols: [
                    { header: "Foo", dataTemplate: "<%= foo %>", align: "left" },
                    { header: "Bar", dataTemplate: "<%= bar %>"                }
                ]
            });
        },

        "apply the appropriate attribute for the data column": function()
        {
            var data = [
                { id: "1", foo: "foo1",  bar:"bar1", foobar:"foobar1" }
            ];

            var expected =
            '<tbody>' +
                '<tr data-id="1"><td class="first" align="left">foo1</td><td class="last" align="center">bar1</td></tr>' +
            '</tbody>';

            var actual = this.tb.genBody(data);

            assert.equalsHTML(actual, expected);
        }
    },

    "given an optional row style template,":
    {
        setUp: function()
        {
            this.tb = new jsc.TableBuilder({
                idTemplate: "<%= id %>",
                rowStyleTemplate: "<%= (id === '1') ? 'red' : 'green' %>",
                cols: [
                    { header: "Foo", dataTemplate: "<%= foo %>" },
                    { header: "Bar", dataTemplate: "<%= bar %>" }
                ]
            });
        },

        "apply the appropriate className to the row": function()
        {
            var data = [
                { id: "1", foo: "foo1",  bar:"bar1" },
                { id: "2", foo: "foo2",  bar:"bar2" }
            ];

            var expected =
            '<tbody>' +
                '<tr data-id="1" class="red">' +
                    '<td class="first" align="center">foo1</td>' +
                    '<td class="last" align="center">bar1</td>' +
                '</tr>' +
                '<tr data-id="2" class="green">' +
                    '<td class="first" align="center">foo2</td>' +
                    '<td class="last" align="center">bar2</td>' +
                '</tr>' +
            '</tbody>';

            var actual = this.tb.genBody(data);

            console.log(expected);
            console.log(actual.outerHTML);

            assert.equalsHTML(actual, expected);
        }
    }
});
