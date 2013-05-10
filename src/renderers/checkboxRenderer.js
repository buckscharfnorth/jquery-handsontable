/**
 * Checkbox renderer
 * @param {Object} instance Handsontable instance
 * @param {Element} TD Table cell where to render
 * @param {Number} row
 * @param {Number} col
 * @param {String|Number} prop Row object property name
 * @param value Value to render (remember to escape unsafe HTML before inserting to DOM!)
 * @param {Object} cellProperties Cell properites (shared by cell renderer and editor)
 */
Handsontable.CheckboxRenderer = function (instance, TD, row, col, prop, value, cellProperties) {
  if (typeof cellProperties.checkedTemplate === "undefined") {
    cellProperties.checkedTemplate = true;
  }
  if (typeof cellProperties.uncheckedTemplate === "undefined") {
    cellProperties.uncheckedTemplate = false;
  }

  instance.view.wt.wtDom.empty(TD); //TODO identify under what circumstances this line can be removed

  var INPUT = document.createElement('INPUT');
  INPUT.className = 'htCheckboxRendererInput';
  INPUT.type = 'checkbox';
  INPUT.setAttribute('autocomplete', 'off');

  if (value === cellProperties.checkedTemplate || value === Handsontable.helper.stringify(cellProperties.checkedTemplate)) {
    INPUT.checked = true;
    TD.appendChild(INPUT);
	TD.title = 'yes';
  }
  else {
    TD.appendChild(INPUT);
	TD.title = 'no';
  }

  var $input = $(INPUT);

  if (cellProperties.readOnly) {
    $input.on('click', function (event) {
      event.preventDefault();
    });
  }
  else {
    $input.on('mousedown', function (event) {
      if (!this.checked) {
        instance.setDataAtRowProp(row, prop, cellProperties.checkedTemplate);
      }
      else {
        instance.setDataAtRowProp(row, prop, cellProperties.uncheckedTemplate);
      }

      event.stopPropagation(); //otherwise can confuse cell mousedown handler
    });

    $input.on('mouseup', function (event) {
      event.stopPropagation(); //otherwise can confuse cell dblclick handler
    });
  }

  return TD;
};
