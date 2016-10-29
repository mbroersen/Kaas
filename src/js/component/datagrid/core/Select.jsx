import elements from "../data/Elements";

class Select
{
    /**
     *
     * @param [options]
     * @param {HTMLElement} [options.row]
     * @param {function} [options.onSelect]
     *
     */
    constructor (options)
    {
        this.row = options.row;
        this.onSelect = options.onSelect || function (checked) {};
    }

    /**
     *
     * @returns {Element|*}
     */
    getSelect()
    {
        if (this.select === undefined) {
            var me = this;
            this.select = elements.checkbox.cloneNode(false);
            this.select.setAttribute('value', this.row.getRaw()['id'] || 0) ;
            this.select.checked = false;
            this.select.addEventListener('click', function (e) {
                //e.preventDefault();
                if (this.hasAttribute('checked')) {
                    this.checked = false;
                    this.removeAttribute('checked');
                } else {
                    this.checked = true;
                    this.setAttribute('checked', 'checked');
                }
                me._onSelect.apply(me, [e, this.checked]);
            }, false);
        }

        return this.select;
    }

    /**
     * 
     * @returns {boolean}
     */
    isSelected()
    {
        return this.getSelect().checked;
    }

    /**
     *
     * @param e
     * @param checked
     * @private
     */
    _onSelect(e, checked)
    {
        this.onSelect(checked);
        this.row.onSelectRow(checked);
    }

}

module.exports = Select;
