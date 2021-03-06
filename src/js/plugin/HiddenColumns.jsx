/**
 * Created by mbroersen on 10/2/16.
 */

class HiddenColumns {
    /**
     *  @example
     *
     *  var options = {
     *      presets: document.querySelectorAll('.datagrid-column-preset-toggle'),
     *      checkboxContainer: document.querySelectorAll('#checkbox-filters'),
     *  }
     *
     *  new Kaas.plugins.HiddenColumns(options);
     *
     *
     * @param [options]
     * @param {HTMLElement} [options.presets]
     * @param {HTMLElement} [options.checkboxContainer]
     *
     */
    constructor (options)
    {
        options = options || {};

        /**
         * @default document.querySelectorAll(".datagrid-column-preset-toggle")
         * @type {HTMLElement}
         */
        this.presets = options.presets || document.querySelectorAll(".datagrid-column-preset-toggle");

        /**
         * @default document.querySelector("#checkbox-filters")
         *
         * @type {HTMLElement}
         */
        this.checkboxContainer = options.checkboxContainer || document.querySelector("#checkbox-filters");

        /**
         *
         * @type {NodeList}
         */
        this.checkboxes = this.checkboxContainer.querySelectorAll("[type='checkbox']");

    }

    /**
     *
     * @param e
     */
    init(e)
    {
        this.datagrid = e.detail.datagrid;
        var me = this;

        Array.prototype.forEach.call(this.checkboxes, function (checkbox) {
            checkbox.addEventListener('click', function () {
                me.hide.call(me, this);
            }, false);
        });

        Array.prototype.forEach.call(this.presets, function (preset) {
            preset.addEventListener("click", function () {
                me.handlePresets.call(me, this);
            }, false);
        });

        this.hide();
    }

    /**
     *
     */
    hide ()
    {
        var checkboxes = this.checkboxContainer.querySelectorAll(":not(:checked)"),
            hiddenColumns = [];

        Array.prototype.forEach.call(checkboxes, function (checkbox) {
            hiddenColumns.push(checkbox.getAttribute("data-column-pos"));
        });

        this.datagrid.hideColumns(hiddenColumns);
    };

    /**
     *
     */
    handlePresets (ele)
    {
        var checkboxes = this.checkboxes,
            presetData = JSON.parse(ele.getAttribute('data-columns'));

        Array.prototype.forEach.call(checkboxes, function (checkbox) {
            var columnNumber = checkbox.getAttribute('data-column-pos')-0;

            if (presetData.indexOf(columnNumber) !== -1 && !checkbox.checked) {
                checkbox.click();
            } else if (presetData.indexOf(columnNumber) === -1 && checkbox.checked) {
                checkbox.click();
            }
        });
    };
}

module.exports = HiddenColumns;