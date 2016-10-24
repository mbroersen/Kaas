module.exports = {
    DataGrid: require("./component/datagrid/DataGrid"),
    form: {
        Request: require("./form/Request"),
        Data: require("./form/Data")
    },
    formatters: {
        AmountFormat:  require('./formatter/AmountFormat'),
        MoneyFormat: require('./formatter/MoneyFormat'),
        PercentageFormat: require('./formatter/PercentageFormat'),
    },
    plugins: {
        HiddenColumns: require('./plugin/HiddenColumns'),
        EditMenu: require('./plugin/EditMenu'),
        MultiEdit: require('./plugin/MultiEdit'),
        ScrollGridIntoView: require('./plugin/ScrollToTop'),
        DataLoader: require('./plugin/DataLoader')
    },
    util: require('./util/UtilObject'),
    version: 0.6
};




