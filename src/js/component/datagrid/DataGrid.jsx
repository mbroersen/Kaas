import CoreDisplay from "./core/Display";
import UtilSetting from "../../util/Setting";
import DataSummary from "./data/Summary";
import CoreSort from "./core/Sort";
import CoreColumn from "./core/Column";
import {JsonParser} from "./data/Json";
import UtilObject from "../../util/UtilObject";
import DataElements from "./data/Elements";



/**
 *
 *
 * @alias Kaas/Datagrid
 *
 * @cLass
 */
class DataGrid
{
    /**
     * @example
     *
     *
     *  var getPlugins = function () {
     *      return [
     *          new Kaas.plugins.DataLoader({url: './data/cars.json'})
     *      ]
     *  };
     *
     *  var getCellFormatters = function () {
     *      return {
     *          model_weight_kg: Kaas.formatters.AmountFormat.format
     *      }
     *   };
     *
     *  var getSummaryFields = function () {
     *      return {
     *          model_weight_kg: Kaas.formatters.AmountFormat.format
     *      }
     *  };
     *
     * var rowFormatter = function(data) {
     *   delete data.model_lkm_city; //remove this data row
     *   data.options = "options"; //add options row to
     *   return data;
     * };
     *
     * var init = function () {
     *   var element = document.querySelector('#cars-table');
     *   new Kaas.DataGrid({
     *      element: element,
     *      plugins: getPlugins(),
     *       cellFormatters: getCellFormatters(),
     *       summaryFields: getSummaryFields(),
     *       rowHandler: rowFormatter,
     *       statusText: '%d Cars'
     *   });
     * };
     *
     *
     * @param {Object} [options]
     * @param {HTMLElement} [options.element]
     * @param {Function} [options.rowFormatter]
     * @param {Object} [options.summaryFields]
     * @param {boolean} [options.selectable]
     * @param {String} [options.statusText]
     * @param {Array} [options.plugins]
     * @param {{fieldName: {String}, form: {HTMLFormElement}, saveDataFormatter: {Function}}} [options.editableCells]
     * @param {{Function}} [options.cellFormatters]
     * @param {{Function}} [options.sortFormatters]
     * @param {{Function}}[options.cellClassFormatters]
     * @param {Function} [options.rowHandler]
     *
     */
    constructor(options)
    {
        options = options || {};

        /**
         * @private
         * @type {UtilSetting}
         */
        this.settings = new UtilSetting(options);

        this.reset();
        this._init();
    };

    /**
     *
     * @private
     */
    _init ()
    {
        var me = this;

        /**
         *
         * @type {CoreSort}
         */
        this.sortHandler = new CoreSort(this.settings.getAll());

        this._initScrollEvents();
        this.enableHeaderSort();

        this.settings.get('plugins', []).forEach(function (p) {
            me.registerPlugin(p);
        });

        this._enableSelectableRows();
        this.element.dispatchEvent(this.createInitEvent());
    };

    /**
     *
     */
    reset()
    {
        /**
         *
         * @type {HTMLTableElement|boolean}
         */
        this.element = this.settings.get('element', document.querySelector('table'));

        /**
         *
         * @type {Node}
         */
        this.yScrollContainer = this.element.parentNode;
        this.yScrollContainer.setAttribute('tabindex', "-1");

        var newBody = document.querySelector("tbody") || document.createElement("tbody");

        /**
         * @private
         * @type {Array}
         */
        this.dataRegister = [];

        /**
         *
         * @type {DataSummary}
         */
        this.summaryRegister = new DataSummary(this.settings.getAll());

        /**
         *
         * @orivate
         * @type {Object}
         */
        this.summaryFields = this.settings.get('summaryFields', {});
        this.settings.change('summaryRegister', this.summaryRegister);

        /**
         * @private
         * @type {JsonParser}
         */
        this.parser = new JsonParser(this.settings.getAll());

        /**
         * @private
         * @type {CoreDisplay}
         */
        this.display = new CoreDisplay({dataTable: this.element, summaryFields: this.summaryFields, summaryRegister: this.summaryRegister});
        this.display.switchCurrentBody(newBody);

        /**
         * @private
         * @type {number}
         */
        this.lastScrollY = 0;

        this.element.dispatchEvent(this.createResetEvent());

        if (this.selectAllInput && this.selectAllInput.checked) {
            this.selectAllInput.click();
        }
    }


    /**
     *
     * @returns {NodeList|*}
     * @private
     */
    _getHeaderCols()
    {
        if (!this._headerCols) {
            var header = this._getMainContainer().querySelector('.table-card thead'),
                headerCols = Array.prototype.slice.call(header.querySelectorAll('td, th'));
            this._headerCols = headerCols;
        }

        return this._headerCols;
    }

    /**
     *
     * @returns {Node|*}
     * @private
     */
    _getMainContainer()
    {
        if (!this.settings.has('mainContainer')) {
            this.settings.add('mainContainer', this.element.parentNode.parentNode);
        }

        return this.settings.get('mainContainer', false);
    }

    /**
     *
     * @returns {boolean}
     * @private
     */
    _setNewScrollAction(e)
    {
        if (this.scrollTimeOut-0 <= 0 || this.scrollTimeOut === undefined) {
            var me = this;
            this.scrollTimeOut = setTimeout(function () {
                me._onScroll.apply(me, [e]);
            }, this.settings.get('scrollTimeout', 200));
            return true;
        }
        return false;
    }



    /**
     *
     * @private
     */
    _initScrollEvents()
    {
        var me = this,
            scrollFunction = function (e) {
                if (this.scrollTimeOut-0 > 0 || this.scrollTimeOut !== undefined) {
                    return;
                }

                e.stopPropagation();
                me._setNewScrollAction(e);
        };

        this.yScrollContainer.addEventListener('scroll', scrollFunction, false);
    };

    /**
     *
     * @private
     */
    _enableSelectableRows()
    {
        if (this.settings.get('selectable', true) == false) {
            return;
        }

        var me = this;

        /**
         * @private
         * @type {Element}
         */
        this.selectAllInput = DataElements.checkbox.cloneNode(true);

        this._getHeaderCols()[0].appendChild(this.selectAllInput);

        this.selectAllInput.addEventListener('click', function (e) {
            e.stopPropagation();
            me.selectAll.apply(me, [this.checked]);
        }, false);
    };

    /**
     * @example
     *
     * var hiddenColumns = [1,2,3]
     * myDataGrid.hideColumns(hiddenColumns);
     *
     *
     * @param {Array} columns // array of column numbers
     */
    hideColumns(columns)
    {
        new CoreColumn({hiddenColumns: columns, mainContainer: this._getMainContainer()});
    }

    /**
     *
     * @param {number} cell
     * @param {HTMLElement|DocumentFragment|String} data
     */
    updateCellData(cell, data)
    {
        var i =0,
            length = this.dataRegister.length;


        for (i; i < length; i++) {

            if(!this.dataRegister[i].selectItem.getSelect().checked) {
                continue;
            }

            this.dataRegister[i].getCell(cell).setFormValue(data);
        }
    }

    /**
     *
     * @returns {{}} //data from edit mode
     */
    getFormsData()
    {
        var data = {};

        this.dataRegister.forEach(function (row) {
            var newData = row.onSave();

            if (newData === {}) {
                return;
            }

            for (var cellName in newData) {
                if (data.hasOwnProperty(cellName)) {
                    data[cellName] = UtilObject.Merge(data[cellName], newData[cellName]);
                } else {
                    data[cellName] = newData[cellName];
                }
            }
        });

        return data;
    }


    /**
     * @private
     */
    onSave()
    {
        this.element.dispatchEvent(this.createPreSaveEvent());
        this.element.dispatchEvent(this.createOnSaveEvent());

        if (this.selectAllInput.checked) {
            this.selectAllInput.click();
        }
    }

    /**
     * @private
     */
    onCancel()
    {
        var i = 0,
            length = this.dataRegister.length;

        for (i; i < length; i++) {
            this.dataRegister[i].onCancel();
        }

        if (this.selectAllInput.checked) {
            this.selectAllInput.click();
        }
    }

    
    /**
     *
     */
    enableHeaderSort () 
    {
        var me = this;
        this._getHeaderCols().forEach(function(col) {
            col.addEventListener('click', function (e) {
                var index = Array.prototype.indexOf.call(me._getHeaderCols(), this);
                me.sort(index + 1);
                me.render(true);
            });
        });
    };


    /**
     * @param {String} json //Json result string
     */
    addRows (json) 
    {
        if (json == null) {
            return;
        }

        var newData = this.parser.processData(json);
        newData = this.sortHandler.sort(newData);

        this.dataRegister = this.dataRegister.concat(newData);

        this.setStatusText();
        this.display.renderSummary(this.dataRegister);
        this.sort(this.sortHandler.sortField + 1, this.sortHandler.sortDirection);
    };

    /**
     *
     * @private
     */
    setStatusText() 
    {
        var text = this.settings.get('statusText', '%d').replace('%d', Object.keys(this.dataRegister).length);
        this.element.parentNode.parentNode.querySelector('.status-text').innerHTML = text;
    }

    /**
     *
     * @param {String} text
     */
    renderText (text)
    {
         this.display.renderText(text);
    };


    /**
     *
     * @param {Boolean} force
     */
    render (force)
    {
        this.display.render(this.dataRegister, force);
    };


    /**
     *
     * @param checked
     */
    selectAll (checked)
    {
        this.dataRegister.forEach(function (row) {
            row.selectRow(checked);
        });
    }

    /**
     *
     * @private
     *
     * @param {number} field
     * @param {number} dir
     */
    setSortDirection(field, dir)
    {
        var defaultDirection = this.settings.get('defaultSortDirection', 1);

        if (dir) {
            this.sortHandler.setSortDirection(dir);
        } else if(this.sortHandler.sortField != field) {
            this.sortHandler.setSortDirection(defaultDirection);
        } else {
            this.sortHandler.invertSortDirection();
        }
    }

    /**
     *
     * @param {number} field
     * @param {number} dir
     */
    sort (field, dir)
    {
        dir = dir || false;
        field = (field || 1) -1;

        this.setSortDirection(field, dir);

        this.setSortHeader(field);

        this.sortHandler.setSortField(field);
        this.dataRegister = this.sortHandler.sort(this.dataRegister);
    };

    /**
     *
     * @private
     * @param {number} field
     *
     */
    setSortHeader(field)
    {
        var headerCols = this._getHeaderCols();

        headerCols.forEach(function (sortChild) {
            sortChild.classList.remove('sort', 'desc');
        });

        headerCols[field].classList.add('sort');

        if (this.sortHandler.sortDirection == -1) {
            headerCols[field].classList.add('desc');
        }
    }

    /**
     *
     * @param e
     * @private
     */
    _onScroll (e)
    {
        var currentScrollY = this.yScrollContainer.scrollTop;
        if (document.activeElement != this.yScrollContainer && (this.lastScrollY - currentScrollY) < -20) {
            this.yScrollContainer.dispatchEvent(this.createScrollFocusEvent());
        }
        this.lastScrollY = currentScrollY;

        this.render(false);
        this.element.dispatchEvent(this.createAfterScrollEvent());
        this.scrollTimeOut = 0;
    };

    /**
     *
     * @private
     * @returns {CustomEvent}
     */
    createInitEvent()
    {
        return new CustomEvent("init",
            {detail: {datagrid: this}, bubbles: true, cancelable: true});
    }

    /**
     *
     * @private
     * @returns {CustomEvent}
     */
    createPreSaveEvent()
    {
        return new CustomEvent("preSave",
            {detail: {datagrid: this}, bubbles: true, cancelable: true});
    }


    /**
     *
     * @private
     * @returns {CustomEvent}
     */
    createScrollFocusEvent()
    {
        return new CustomEvent("scrollFocus",
            {detail: {datagrid: this}, bubbles: true, cancelable: true});
    }



    /**
     * @private
     * @returns {CustomEvent}
     */
    createOnSaveEvent()
    {
        return new CustomEvent("onSave",
            {detail: {data: this.getFormsData()}, bubbles: true, cancelable: true});
    }



    /**
     *
     * @private
     * @returns {CustomEvent}
     */
    createAfterScrollEvent() 
    {
        return new CustomEvent("afterScroll",
            {detail: {datagrid: this, scrollY: this.lastScrollY}, bubbles: true, cancelable: true});
    }
    
    /**
     *
     * @private
     * @returns {CustomEvent}
     */
    createResetEvent() 
    {
        return new CustomEvent("reset",
            {detail: {datagrid: this}, bubbles: true, cancelable: true});
    }

    /**
     *
     * @returns {{direction: {number}, column: {number}}}
     */
    getSortSettings()
    {
        return {
            direction: this.sortHandler.sortDirection,
            column: this.sortHandler.sortField
        }
    }

    /**
     *
     * @param {Plugin} plugin
     */
    registerPlugin (plugin)
    {
        var me = this;

        [
            'init', 'reset', 'afterScroll', 'selectRow', 'unSelectRow',
            'onFocus', 'onSave', 'preSave'
        ].forEach(function (eventName) {
            if (plugin.__proto__.hasOwnProperty(eventName)) {
                me.element.addEventListener(eventName, function (e) {
                    plugin[eventName].apply(plugin, [e, this, me])
                }, false);
            }
        });
    };
}


module.exports = DataGrid;