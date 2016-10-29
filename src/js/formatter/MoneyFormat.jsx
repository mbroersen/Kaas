import AmountFormat from "./AmountFormat";

class MoneyFormat {

    /**
     * 
     * @param {number} data
     * @param {Object} rowData
     * @static
     * @alias Kaas/formatter/MoneyFormat:format
     * @see Kaas/formatter/AmountFormat:format
     * @returns {string}
     */
    static format(data, rowData) 
    {
        return '&euro; ' + AmountFormat.numberFormat(data, 2);
    }
}

module.exports = MoneyFormat;
