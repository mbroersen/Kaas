import elements from "./Elements";

/**
 *
 * @param data
 * @param {object} [options]
 * @param {function} [options.cellFormatter]
 * @param {function} [options.cellClassFormatter]
 * @param {Array} [options.classList]
 * @param {Select} [options.selectItem]
 * @param {object} rowData
 *
 *
 */
class Cell {

    /**
     *
     * @param data
     * @param options
     * @param rowData
     */
    constructor(data, options, rowData)
    {
        this.cellFormatter = options.cellFormatter || function (data, rowData) { return data};
        this.cellClassFormatter = options.cellClassFormatter || function (data) { return []};
        this.data = data;
        this.cell = null;
        this.rowData = rowData;
        this.classList = options.classList || [];
        this.selectItem = options.selectItem || null;
    }

    /**
     *
     * @param data
     */
    update(data)
    {
        this.data = data;
        this.cell = null;
        this.render();
    }

    /**
     *
     * @returns {null|*}
     */
    render ()
    {
        if (this.cell == null) {
            this.cell = elements.td.cloneNode(false);

            if (this.selectItem != null) {
                this.cell.appendChild(this.selectItem.getSelect());
            }

            this.classList = this.classList.concat(this.cellClassFormatter(this.data, this.rowData));

            for (var i = 0; i < this.classList.length; i++) {
                this.cell.classList.add(this.classList[i]);
            }

            this.data = this.cellFormatter(this.data, this.rowData);

            if (this.data == null) {
                this.cell.innerHTML = '';
            } else if (this.data.innerHTML != undefined || this.data instanceof DocumentFragment) {
                this.cell.appendChild(this.data);
            } else if (this.data[0] instanceof Object) {
                this.cell.appendChild(this.data[0]);
            } else {
                this.cell.insertAdjacentHTML("BeforeEnd", this.data);
            }
        }

        return this.cell;
    }
}


module.exports = Cell;

//export {Cell}