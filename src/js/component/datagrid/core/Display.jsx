import DataElments from "../data/Elements";

/**
 *
 */
class CoreDisplay
{
    /**
     * 
     * @param {object} [options]
     * @param {HTMLElement} [options.dataTable]
     * @param {object} [options.summaryFields]
     * @param {DataSummary} [options.summaryRegister]
     *
     */
    constructor (options) 
    {
        this.dataTable = options.dataTable;
        this.options = options;
        this.footer = this.dataTable.parentNode.parentNode.querySelector('.table-footer-container tfoot');

        this.start = -1;
        this._rowHeight = 0;
        this.minimalPartSize = 75;
        this.numberOfRowsInView = -1;
    };

    /**
     *
     * @param text
     * @returns {Element}
     */
    renderText (text) 
    {
        var newBody = DataElments.tbody.cloneNode(false),
            tr = DataElments.tr.cloneNode(false),
            td = DataElments.td.cloneNode(false);

        if (newBody.firstChild) {
            newBody.removeChild(newBody.firstChild);
        }

        newBody.appendChild(tr);
        tr.appendChild(td);
        td.style.width = '100%';
        td.style.minWidth = '100%';
        td.style.maxWidth = '100%';
        td.setAttribute('colspan', 9999);
        td.insertAdjacentHTML("beforeend", text);
        this.switchCurrentBody(newBody);
        return this.currentBody;
    };

    /**
     *
     * @returns {number}
     */
    getPartSize()
    {
        var partSize = this._getNumberOfRowsInView();
        return Math.max(this.minimalPartSize, partSize * 3);
    }

    /**
     *
     * @param rows
     * @returns {number}
     */
    getStart(rows)
    {
        if (rows.length <= this.minimalPartSize) {
            return 0;
        }

        var difference = this.getPartSize() - this._getNumberOfRowsInView();
        var start = this._getRowNumberFromScrollHeight();
        
        if (difference > 0) {
            start -= Math.floor(difference / 2);
        }

        if (start <= this._getNumberOfRowsInView()) {
            return 0;
        }

        return Math.max(0, start);
    }
    
    
    /**
     *
     * @param rows
     * @param force
     * @returns {Element}|null
     */
    render (rows, force)
    {
        const MODE_RENDERING = 20;
        const MODE_IDLE = 10;

        if (this.mode == MODE_RENDERING) {
            return;
        }

        if (rows.length == 0) {
            return this.renderText('We have no items to show in this selection');
        }

        if (this._rowHeight == 0) {
            rows[0].render();
            this._rowHeight = rows[0].rowHeight;
        }

        var start = this.getStart(rows);

        if (Math.abs(this.start - start) < this._getNumberOfRowsInView() && force !== true) {
            return false;
        }

        this.mode = MODE_RENDERING;
        this.start = start;

        var fragment = document.createDocumentFragment(),
            newBody = DataElments.tbody.cloneNode(false),
            partSize = this.getPartSize(),
            end = start + partSize,
            rowPart = rows.slice(start, end),
            rowsPartLength = rowPart.length,
            rowsLength = rows.length;

        if (rowsPartLength <= 0) {
            this.mode = MODE_IDLE;
            return false;
        }

        if (start > 0) {
            var newTopFiller = this._getTopFiller(start);
            newBody.appendChild(newTopFiller);
        }
        
        var midFiller = this._getMidFiller(rowPart.length);
        newBody.appendChild(midFiller);

        var bottomFiller = false;
        if (end < rowsLength) {
            bottomFiller = this._getBottomFiller(end, rowsLength);
            newBody.appendChild(bottomFiller);
        }
        this.switchCurrentBody(newBody);

        rowPart.forEach(function (row) {
             fragment.appendChild(row.render());
        });

        newBody.replaceChild(fragment, midFiller);
        this.mode = MODE_IDLE;

        return this.currentBody;
    };


    _footerChildren ()
    {
        if (!this.footerChildren) {
            this.footerChildren = this.footer.querySelectorAll('th')
        }
        return this.footerChildren;
    }


    /**
     *
     * @param rowPart
     */
    renderSummary(rowPart)
    {
        if (rowPart.length <= 0) {
            return;
        }

        rowPart[0].render();

        for (var cellName in this.options.summaryFields) {
            var index = rowPart[0].getIndexOfCellName(cellName);
            var value = this.options.summaryRegister.get(cellName);

            if (this._footerChildren()[index]) {
                if (this._footerChildren()[index].firstChild) {
                    this._footerChildren()[index].removeChild(this._footerChildren()[index].firstChild);
                }
                this._footerChildren()[index].insertAdjacentHTML("BeforeEnd", value);
            }
        }
    }

    /**
     *
     * @returns {number}
     * @private
     */
   _getNumberOfRowsInView () 
    {
        if (this.numberOfRowsInView == -1) {
            var windowHeight = this.dataTable.parentNode.parentNode.offsetHeight,
                rowHeight = this.getRowHeight();
            this.numberOfRowsInView = ((windowHeight - (windowHeight % rowHeight)) / rowHeight);
            this.numberOfRowsInView = Math.max(25, this.numberOfRowsInView);
        }

        return this.numberOfRowsInView;
    };

    /**
     *
     * @returns {number}
     * @private
     */
    getRowHeight()
    {
        if (this._rowHeight <= 0) {
            var tmpBody = DataElments.tbody.cloneNode(false),
            tmpTr = DataElments.tr.cloneNode(false),
            tmpTd = DataElments.td.cloneNode(false);
            tmpTd.insertAdjacentHTML('BeforeEnd', 'Test');
            tmpBody.appendChild(tmpTr);
            tmpTr.appendChild(tmpTd);

            this.dataTable.appendChild(tmpBody);
            this._rowHeight = tmpTr.offsetHeight;
            this.dataTable.removeChild(tmpBody);
        }

        return this._rowHeight;
    };

    /**
     *
     * @returns {number}
     * @private
     */
    _getRowNumberFromScrollHeight () 
    {
        var rowHeight = this.getRowHeight(),
            scrollTop = this.dataTable.parentNode.scrollTop,
            numberFromScroll = (scrollTop - (scrollTop % rowHeight)) / rowHeight;

        return Math.max(0, numberFromScroll);
    };

    /**
     *
     * @param start
     * @returns {Element}
     * @private
     */
    _getTopFiller (start) 
    {
        var topFiller = DataElments.tr.cloneNode(false) ,
            tdFiller = DataElments.td.cloneNode(false);

        tdFiller.style.height = (start * this.getRowHeight()) + 'px';
        tdFiller.setAttribute('colspan', 99999 + '');
        topFiller.appendChild(tdFiller);
        topFiller.className = 'top-filler';

        return topFiller;
    };

    /**
     *
     * @param start
     * @returns {Element}
     * @private
     */
    _getMidFiller (rowPartSize)
    {
        var midFiller = DataElments.tr.cloneNode(false) ,
            tdFiller = DataElments.td.cloneNode(false);

        tdFiller.style.height = (rowPartSize * this.getRowHeight()) + 'px';
        tdFiller.setAttribute('colspan', 99999 + '');
        midFiller.appendChild(tdFiller);
        midFiller.className = 'mid-filler';

        return midFiller;
    };


    /**
     *
     * @param end
     * @param length
     * @returns {Element}
     * @private
     */
    _getBottomFiller (end, length) 
    {
            var bottomFiller = DataElments.tr.cloneNode(false),
                tdBottomFiller = DataElments.td.cloneNode(false);
            tdBottomFiller.style.height = ( (length - end) * this.getRowHeight() + 'px');
            tdBottomFiller.setAttribute('colspan', 99999 + '');
            bottomFiller.appendChild(tdBottomFiller);

        return bottomFiller;
    };

    /**
     *
     * @param {Element} newBody
     */
    switchCurrentBody(newBody)
    {
        if (this.currentBody instanceof HTMLElement && this.currentBody.parentNode == this.dataTable) {
            this.dataTable.replaceChild(newBody, this.currentBody);
            this.currentBody = newBody;
            return;
        }

        var oldBody = this.dataTable.querySelector('tbody');
        if (oldBody) {
            this.dataTable.replaceChild(newBody, oldBody);
            this.currentBody = oldBody;
            return;
        }



        this.dataTable.appendChild(newBody);
        this.currentBody = newBody;
    }


}

module.exports = CoreDisplay;

//export {CoreDisplay};