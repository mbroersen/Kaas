var cars = {
    init: function () {},
    datagrid: {
        grid: null,
    }
};

(function (SBJS, cars) {
    /**
     * List of used plugins
     *
     * @returns {*[]}
     */
    var getPlugins = function () {

        return [
            new SBJS.plugins.DataLoader({url: './data/cars.json'})
        ]
    };

    /**
     *
     * @returns {{}}
     */
    var getCellFormatters = function () {
        return {
            revenue: SBJS.formatters.MoneyFormat.format,
            margin: SBJS.formatters.MoneyFormat.format,
            percentage: SBJS.formatters.PercentageFormat.format,
            t2s: SBJS.formatters.PercentageFormat.format
        }
    }


    /**
     * SummaryFields with format
     *
     * @returns {{revenue: (StatusFormat.format|PercentageFormat.format|MoneyFormat.format|MarginPercentageFormat.format|Row.format|MarginFormat.format|*)}}
     */
    var getSummaryFields = function () {
        return {
            revenue: SBJS.formatters.MoneyFormat.format
        }
    };

    /**
     * for removing and adding cells
     */
    var rowFormatter = function(data) {
        delete data.model_lkm_city; //remove this data row
        data.options = "options"; //add options row to
        return data;
    };




    /**
     *
     */
    var init = function () {
        var element = document.querySelector('#cars-table');
        cars.datagrid.grid = new SBJS.DataGrid({
            element: element,
            plugins: getPlugins(),
            cellFormatters: getCellFormatters(),
            summaryFields: getSummaryFields(),
            rowHandler: rowFormatter,
            statusText: '%d Cars'
        });
    };

    cars.init = init;


    var load = function () {
        cars.init();
        console.log('load');
        document.removeEventListener('DOMContentLoaded', load);
    };

    SBJS.util.DomReady(load);

}) (SBJS, cars);


