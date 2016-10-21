import CoreDisplay from "./core/Display";
import UtilSetting from "../../util/Setting";
import DataSummary from "./data/Summary";
import CoreSort from "./core/Sort";
import CoreColumn from "./core/Column";
import {JsonParser} from "./data/Json";
import UtilObject from "../../util/UtilObject";



/**
 *
 */
class DataGrid
{
    /**
     *
     * @param options
     */
    constructor(options)
    {
        options = options || {};
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
            this.settings.add('mainContainer', this.element.parentNode.parentNode.parentNode);
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
        if (this.settings.get('selectable', false) == false) {
            return;
        }

        var me = this;

        this.selectAllInput = document.createElement('input');
        this.selectAllInput.setAttribute('type', 'checkbox');
        this._getHeaderCols()[0].appendChild(this.selectAllInput);

        this.selectAllInput.addEventListener('click', function (e) {
            e.stopPropagation();
            me.selectAll.apply(me, [this.checked]);
        }, false);
    };

    /**
     *
     * @param columns
     */
    hideColumns(columns)
    {
        new CoreColumn({hiddenColumns: columns, mainContainer: this._getMainContainer()});
    }

    /**
     *
     * @param cell
     * @param data
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
     * @returns {{}}
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
     *
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
     *
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
     *
     * @param json
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
     */
    setStatusText() 
    {
        var text = this.settings.get('statusText', '%d').replace('%d', Object.keys(this.dataRegister).length);
        this.element.parentNode.parentNode.querySelector('.status-text').innerHTML = text;
    }

    /**
     *
     * @param text
     */
    renderText (text)
    {
         this.display.renderText(text);

    };


    /**
     *
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
     * @param dir
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
     * @param field
     * @param dir
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
     * @param field
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
     */
    reset()
    {
        /**
         *
         * @type {HTMLTableElement|boolean}
         */
        this.element = this.settings.get('element', document.querySelector('table'));

        this.yScrollContainer = this.element.parentNode;
        this.yScrollContainer.setAttribute('tabindex', "-1");

        var newBody = document.createElement("tbody");

        this.dataRegister = [];
        this.summaryRegister = new DataSummary(this.settings.getAll());
        this.summaryFields = this.settings.get('summaryFields', {});
        this.settings.change('summaryRegister', this.summaryRegister);
        this.parser = new JsonParser(this.settings.getAll());
        this.display = new CoreDisplay({dataTable: this.element, summaryFields: this.summaryFields, summaryRegister: this.summaryRegister});
        this.display.switchCurrentBody(newBody);
        this.lastScrollY = 0;

        this.element.dispatchEvent(this.createResetEvent());

        if (this.selectAllInput && this.selectAllInput.checked) {
            this.selectAllInput.click();
        }
    }

    /**
     *
     * @returns {CustomEvent}
     */
    createInitEvent()
    {
        return new CustomEvent("init",
            {detail: {datagrid: this}, bubbles: true, cancelable: true});
    }

    /**
     *
     * @returns {CustomEvent}
     */
    createPreSaveEvent()
    {
        return new CustomEvent("preSave",
            {detail: {datagrid: this}, bubbles: true, cancelable: true});
    }


    /**
     *
     * @returns {CustomEvent}
     */
    createScrollFocusEvent()
    {
        return new CustomEvent("scrollFocus",
            {detail: {datagrid: this}, bubbles: true, cancelable: true});
    }



    /**
     *
     * @returns {CustomEvent}
     */
    createOnSaveEvent()
    {
        return new CustomEvent("onSave",
            {detail: {data: this.getFormsData()}, bubbles: true, cancelable: true});
    }



    /**
     * 
     * @returns {CustomEvent}
     */
    createAfterScrollEvent() 
    {
        return new CustomEvent("afterScroll",
            {detail: {datagrid: this, scrollY: this.lastScrollY}, bubbles: true, cancelable: true});
    }
    
    /**
     * 
     * @returns {CustomEvent}
     */
    createResetEvent() 
    {
        return new CustomEvent("reset",
            {detail: {datagrid: this}, bubbles: true, cancelable: true});
    }

    /**
     *
     * @returns {{direction: *, column: *}}
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
     * @param plugin
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