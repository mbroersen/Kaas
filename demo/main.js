var cars = {
    init: function () {},
    datagrid: {
        grid: null,
    }
};

(function (Kaas, cars) {
    /**
     * List of used plugins
     *
     * @returns {*[]}
     */
    var getPlugins = function () {

        return [
            new Kaas.plugins.DataLoader({url: './data/cars.json'})
        ]
    };

    /**
     *
     * @returns {{}}
     */
    var getCellFormatters = function () {
        return {
            revenue: Kaas.formatters.MoneyFormat.format,
            margin: Kaas.formatters.MoneyFormat.format,
            percentage: Kaas.formatters.PercentageFormat.format,
            t2s: Kaas.formatters.PercentageFormat.format
        }
    }


    /**
     * SummaryFields with format
     *
     * @returns {{revenue: (StatusFormat.format|PercentageFormat.format|MoneyFormat.format|MarginPercentageFormat.format|Row.format|MarginFormat.format|*)}}
     */
    var getSummaryFields = function () {
        return {
            revenue: Kaas.formatters.MoneyFormat.format
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
        cars.datagrid.grid = new Kaas.DataGrid({
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

    Kaas.util.DomReady(load);

}) (Kaas, cars);


