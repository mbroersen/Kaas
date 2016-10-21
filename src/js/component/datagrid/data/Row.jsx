import Select from "../core/Select";
import Cell from "./Cell";
import EditCell from "./EditCell";
import elements from "./Elements";
import UtilObject from "../../../util/UtilObject";



class Row
{
    /**
     *
     * @param rowData
     * @param options
     */
    constructor (rowData, options)
    {
        this.originalData = JSON.parse(JSON.stringify(rowData));
        this.rowHeight = 20;
        this.cells = {};
        this.data = rowData;
        this.formattedData = null;
        this.sortData = {};
        this.options = options;
        this.editableCells = options.editableCells || [];
        this.sortFields = [];
        this.cellFormatters = options.cellFormatters || {};
        this.sortFormatters = options.sortFormatters || {};
        this.id =  this.originalData.id || 0;
        this.rowHandler = this.options.rowHandler || function (data) {return data};
        this.cellClassFormatters = options.cellClassFormatters || {};
        this.rowSaveHandler = options.rowSaveHandler || function (data) {return data};
        if (this.options.rowIsSelectable) {
            this.selectItem = new Select({row: this})
        }

        for (var fieldName in this.data) {
            this.setSortDataField(fieldName);
            this.addSummaryData(options, fieldName);
        }
    };

    /**
     *
     * @param options
     * @param fieldName
     */
    addSummaryData(options, fieldName)
    {
        if (options.summaryFields.hasOwnProperty(fieldName)) {
            options.summaryRegister.add(fieldName, this.data[fieldName]);
        }
    }

    /**
     *
     * @param fieldName
     */
    setSortDataField(fieldName)
    {
        if (this.sortFormatters.hasOwnProperty(fieldName)) {
            var sortData = this.data[fieldName];
            sortData = this.sortFormatters[fieldName](sortData, this.data);
            this.sortData[fieldName] = sortData;
        }
    }

    /**
     *
     * @param name
     * @returns {number}
     */
    getIndexOfCellName(name)
    {
        return Object.keys(this.cells).indexOf(name);
    }

    /**
     *
     * @param name
     * @returns {*}
     */
    getCell(name)
    {
        return this.cells[name];
    }


    /**
     *
     * @param selected
     */
    selectRow(selected) {

        if (this.options.rowIsSelectable === false) {
            return;
        }

        if (this.selectItem.isSelected() == selected) {
            return;
        }

        this.selectItem.getSelect().click();
    }

    /**
     *
     * @param selected
     */
    onSelectRow(selected)
    {
        var me = this;
        if (selected == true) {

            Object.keys(this.cells).forEach(function (cellNr) {
                let cell = me.cells[cellNr];
                if (cell instanceof EditCell) {
                    cell.showForm();
                }
            });

            if (!this.formattedData) {
                return;
            }

            if (this.formattedData.parentNode === null) {
                return;
            }

            if (this.formattedData.parentNode.parentNode === null) {
                return;
            }

            (this.formattedData.parentNode.parentNode).dispatchEvent(new CustomEvent("selectRow", {detail: {row: this}, bubbles: true, cancelable: true}));


        } else if (selected == false) {
            Object.keys(this.cells).forEach(function (cellNr) {
                let cell = me.cells[cellNr];
                if (cell instanceof EditCell) {
                    cell.hideForm();
                }
            });

            if (!this.formattedData) {
                return;
            }

            if (this.formattedData.parentNode === null) {
                return;
            }

            if (this.formattedData.parentNode.parentNode === null) {
                return;
            }

            (this.formattedData.parentNode.parentNode).dispatchEvent(new CustomEvent("unSelectRow", {detail: {row: this}, bubbles: true, cancelable: true}));
        }
    }

    /**
     *
     * @returns {{}}
     */
    onSave()
    {
        var data = {};

        if(!this.selectItem.getSelect().checked) {
            return data;
        }

        for (var cellNr in this.cells) {
            if (this.cells[cellNr] instanceof EditCell) {
                var cellData = this.cells[cellNr].onSave();
                data = UtilObject.Merge(data, cellData);
            }
        }

        this.selectItem.getSelect().click();

        return this.rowSaveHandler.apply(this, [data]);
    }

    /**
     * 
     */
    onCancel()
    {
        if(!this.selectItem.getSelect().checked) {
            return;
        }

        this.selectItem.getSelect().click();
    }

    /**
     *
     * @returns {Array}
     */
    getSortFields()
    {
        return this.sortFields;
    }

    /**
     *
     * @param name
     * @returns {*}
     */
    getSortDataByFieldName (name)
    {
        return this.sortData[name] || this.originalData[name];
    };

    /**
     *
     * @returns {*}
     */
    getRaw () {
        return this.originalData;
    };

    /**
     *
     * @returns {null|Node|*}
     */
    render () {
        return this.format();
    };

    /**
     *
     * @returns {null|Node|*}
     */
    format() {
        if (this.formattedData !== null) {
            return this.formattedData;
        }

        this.data = this.rowHandler.apply(this, [this.data]);
        this.formattedData = this._formatNew();

        return this.formattedData;
    }

    /**
     *
     * @returns {boolean}
     */
    rowIsSelected() {
        if (this.options.selectable) {
            return this.selectItem.isSelected()
        }
        return false;
    }



    /**
     *
     * @returns {Node}
     * @private
     */
    _formatNew () {

        var rowEntity = elements.tr.cloneNode(false),
            tmpCell, cellOptions, cellData;
        var me = this;
        var rowIsSelected = this.rowIsSelected();

        Object.keys(this.data).forEach(function (cellNr) {
            cellData = me.data[cellNr];
            cellOptions = {};
            if (me.selectItem != undefined && rowEntity.querySelectorAll('td').length == 0) {
                cellOptions.selectItem = me.selectItem;
            }

            cellOptions.rawData = me.originalData[cellNr];
            cellOptions.rowIsSelected = rowIsSelected;

            cellOptions.cellFormatter = me.cellFormatters[cellNr] || null;
            cellOptions.cellClassFormatter = me.cellClassFormatters[cellNr] || null;

            me.sortFields.push(cellNr);

            tmpCell = me.createCell(cellNr, cellOptions, cellData);

            me.cells[cellNr] = tmpCell;
            rowEntity.appendChild(tmpCell.render());

            if (tmpCell instanceof EditCell) {
                if (rowIsSelected) {
                    tmpCell.showForm();
                }
            }

            me.rowHeight = rowEntity.offsetHeight;
        });

        return rowEntity;
    }

    /**
     *
     * @param cellNr
     * @param cellOptions
     * @param cellData
     * @returns {*}
     */
    createCell(cellNr, cellOptions, cellData) {
        var tmpCell;
        if (this.editableCells.hasOwnProperty(cellNr)) {
            var currentEditCell = this.editableCells[cellNr];
            cellOptions['fieldName'] = currentEditCell.fieldName || cellNr + '[%d]';

            if (cellOptions.fieldName.indexOf("%d") == -1) {
                cellOptions['fieldName'] += '[' + this.id + ']';
            }
            cellOptions['fieldName'] = cellOptions['fieldName'].replace("%d", this.id);
            cellOptions['saveDataFormatter'] = currentEditCell.saveDataFormatter;

            if (currentEditCell.hasOwnProperty('showOn') && currentEditCell.showOn(cellData, this.originalData)) {
                cellOptions['form'] = currentEditCell.form.cloneNode(true);
                tmpCell = new EditCell(cellData, cellOptions, this.originalData);
            } else if (!currentEditCell.hasOwnProperty('showOn')) {
                cellOptions['form'] = currentEditCell.form.cloneNode(true);
                tmpCell = new EditCell(cellData, cellOptions, this.originalData);
            } else {
                tmpCell = new Cell(cellData, cellOptions, this.originalData);
            }

        } else {
            tmpCell = new Cell(cellData, cellOptions, this.originalData);
        }

        return tmpCell;
    }
}

module.exports = Row;

