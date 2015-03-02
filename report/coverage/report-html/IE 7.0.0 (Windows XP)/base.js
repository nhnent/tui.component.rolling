YUI().use('datatable', function (Y) {

    var formatters = {
      pct: function (o) {
          o.className += o.record.get('classes')[o.column.key];
          try {
              return o.value.toFixed(2) + '%';
          } catch (ex) { return o.value + '%'; }
      },
      html: function (o) {
          o.className += o.record.get('classes')[o.column.key];
          return o.record.get(o.column.key + '_html');
      }
    },
      defaultFormatter = function (o) {
          o.className += o.record.get('classes')[o.column.key];
          return o.value;
      };

    function getColumns(theadNode) {
        var colNodes = theadNode.all('tr th'),
            cols = [],
            col;
        colNodes.each(function (colNode) {
            col = {
                key: colNode.getAttribute('data-col'),
                label: colNode.get('innerHTML') || ' ',
                sortable: !colNode.getAttribute('data-nosort'),
                className: colNode.getAttribute('class'),
                type: colNode.getAttribute('data-type'),
                allowHTML: colNode.getAttribute('data-html') === 'true' || colNode.getAttribute('data-fmt') === 'html'
            };
            col.formatter = formatters[colNode.getAttribute('data-fmt')] || defaultFormatter;
            cols.push(col);
        });
        return cols;
    }

    function getRowData(trNode, cols) {
        var tdNodes = trNode.all('td'),
                i,
                row = { classes: {} },
                node,
                name;
        for (i = 0; i < cols.length; i += 1) {
            name = cols[i].key;
            node = tdNodes.item(i);
            row[name] = node.getAttribute('data-value') || node.get('innerHTML');
            row[name + '_html'] = node.get('innerHTML');
            row.classes[name] = node.getAttribute('class');
            //Y.log('Name: ' + name + '; Value: ' + row[name]);
            if (cols[i].type === 'number') { row[name] = row[name] * 1; }
        }
        //Y.log(row);
        return row;
    }

    function getData(tbodyNode, cols) {
        var data = [];
        tbodyNode.all('tr').each(function (trNode) {
            data.push(getRowData(trNode, cols));
        });
        return data;
    }

    function replaceTable(node) {
        if (!node) { return; }
        var cols = getColumns(node.one('thead')),
            data = getData(node.one('tbody'), cols),
            table,
            parent = node.get('parentNode');

        table = new Y.DataTable({
            columns: cols,
            data: data,
            sortBy: 'file'
        });
        parent.set('innerHTML', '');
        table.render(parent);
    }

    Y.on('domready', function () {
        replaceTable(Y.one('div.coverage-summary table'));
        if (typeof prettyPrint === 'function') {
            prettyPrint();
        }
    });
});