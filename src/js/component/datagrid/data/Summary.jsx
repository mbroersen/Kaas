class DataSummary {

    constructor(options)
    {
        this.summaryRegister = {};
        this.formatters = options.summaryFields || {};
    }

    /**
     *
     * @param name
     * @param value
     */
    add(name, value)
    {
        if (!this.summaryRegister.hasOwnProperty(name)) {
            this.summaryRegister[name] = 0;
        }

        this.summaryRegister[name] += (value-0);
    }

    /**
     *
     * @param name
     * @returns {*}
     */
    getRaw(name)
    {
        if (!this.summaryRegister.hasOwnProperty(name)) {
            return false;
        }

        return this.summaryRegister[name];
    }

    /**
     *
     * @param name
     * @returns {*}
     */
    get(name)
    {
        if (this.formatters.hasOwnProperty(name)) {
            return this.formatters[name](this.getRaw(name), this.summaryRegister);
        }

        return this.getRaw(name);
    }

}

module.exports = DataSummary;
