/**
 *
 */
class UtilSetting
{

    /**
     *
     * @param {Object} options
     */
    constructor(options)
    {
        if (options === undefined) {
            options = {};
        }

        this.settings = options;
    }

    /**
     *
     * @param name
     * @param defaultValue
     * @returns {*|boolean}
     */
    get(name, defaultValue)
    {
        if (defaultValue === undefined) {
            defaultValue = false;
        }

        if (this.has(name) === false) {
            this.settings[name] = defaultValue;
        }

        return this.settings[name];
    }

    /**
     *
     * @param name
     * @param value
     */
    add(name, value)
    {
        if (this.has(name)) {
            return;
        }

        this.change(name, value);
    }

    /**
     * 
     * @param name
     * @returns {boolean}
     */
    has(name)
    {
        return this.settings.hasOwnProperty(name);
    }


    /**
     * 
     * @param name
     * @param value
     */
    change(name, value)
    {
        this.settings[name] = value;
    }

    /**
     * 
     * @returns {*|{}}
     */
    getAll()
    {
        return this.settings;
    }

}

module.exports = UtilSetting;