class AmountFormat
{
    /**
     *
     * @param data
     * @param d
     *
     * @returns {string}
     */
    static numberFormat(data, d)
    {
        var neg = data < 0;
        var val = neg ? data*-1 : data-0;

        var b = val.toFixed(d || 2);
        var re = '[\\-]?\\d(?=(\\d{3})+' + (b > 0 ? '\\D' : '$') + ')';
        var num = b.replace(new RegExp(re, 'g'), '$&' + (','));

        return neg ? '-' + num : num;
    }

    /**
     *
     * @param {number} data
     * @param {Object} rowData
     * @static
     * @alias Kaas/formatter/AmountFormat:format
     * @returns {String}
     */
    static format(data, rowData)
    {
        return AmountFormat.numberFormat(data, 1).split(".")[0];
    }
}

module.exports = AmountFormat;