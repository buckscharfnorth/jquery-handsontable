/**
 * Handsontable UndoRedo class
 */
Handsontable.UndoRedo = function (instance) {
  var that = this;
  this.instance = instance;
  this.clear();
  instance.rootElement.on("datachange.handsontable", function (event, changes, origin) {
    if (origin !== 'undo' && origin !== 'undoError' && origin !== 'redo') {
      that.add(changes);
    }
  });
};

/**
 * Undo operation from current revision
 */
Handsontable.UndoRedo.prototype.undo = function () {
  var i, ilen;
  if (this.isUndoAvailable()) {
    var setData = $.extend(true, [], this.data[this.rev]);
    for (i = 0, ilen = setData.length; i < ilen; i++) {
      setData[i].splice(3, 1);
    }
    this.instance.setDataAtRowProp(setData, null, null, 'undo');
    this.rev--;
  }
};

/**
 * Undo specific change from current revision
 * Won't add a redo operation since this undo is called due to an error
 * If there are no more changes left in this revision, remove it and decrement revision number
 * @param Array of indices of changes to undo from current revision
 */
Handsontable.UndoRedo.prototype.undoError = function (indices) {
  if (this.isUndoAvailable()) {
    indices.sort(function(a,b){
      return a - b;
    });
    for (var i = indices.length -1; i >= 0; i--) {
      var setData = this.data[this.rev].splice(indices[i],1);
      setData[0].splice(3,1);
      this.instance.setDataAtRowProp(setData, null, null, 'undoError');
	}
    if(!this.data[this.rev].length){
      this.data.splice(this.rev,1);
      this.rev--;
    }
  }
};

/**
 * Redo operation from current revision
 */
Handsontable.UndoRedo.prototype.redo = function () {
  var i, ilen;
  if (this.isRedoAvailable()) {
    this.rev++;
    var setData = $.extend(true, [], this.data[this.rev]);
    for (i = 0, ilen = setData.length; i < ilen; i++) {
      setData[i].splice(2, 1);
    }
    this.instance.setDataAtRowProp(setData, null, null, 'redo');
  }
};

/**
 * Returns true if undo point is available
 * @return {Boolean}
 */
Handsontable.UndoRedo.prototype.isUndoAvailable = function () {
  return (this.rev >= 0);
};

/**
 * Returns true if redo point is available
 * @return {Boolean}
 */
Handsontable.UndoRedo.prototype.isRedoAvailable = function () {
  return (this.rev < this.data.length - 1);
};

/**
 * Add new history poins
 * @param changes
 */
Handsontable.UndoRedo.prototype.add = function (changes) {
  this.rev++;
  this.data.splice(this.rev); //if we are in point abcdef(g)hijk in history, remove everything after (g)
  this.data.push(changes);
};

/**
 * Clears undo history
 */
Handsontable.UndoRedo.prototype.clear = function () {
  this.data = [];
  this.rev = -1;
};
