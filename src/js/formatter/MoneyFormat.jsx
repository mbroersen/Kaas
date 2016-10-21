import AmountFormat from "./AmountFormat";

class MoneyFormat {

    /**
     * 
     * @param data
     * @param rowData
     * @returns {string}
     */
    static format(data, rowData) 
    {
        return '&euro; ' + AmountFormat.numberFormat(data, 2);
    }
}

module.exports = MoneyFormat;
