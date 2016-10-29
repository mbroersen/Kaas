class PercentageFormat {

    /**
     *
     * @param {number} data
     * @param {Object} rowData
     * @static
     *
     * @alias Kaas/formatter/PercentageFormat:format
     * @returns {string}
     */
    static format(data, rowData) 
    {
        return (data-0).toFixed(1) + '%';
    }
}

module.exports = PercentageFormat;
