

/**
 *
 */
class FormData {
    /**
     *
     * @param element
     */
    constructor (options) {

        options = options || {};

        /**
         *
         * @type {RegExp}
         * @const
         */
        this.MATCH_ARRAY_NAME = /(.*)\[\]$/;

        /**
         *
         * @type {RegExp}
         * @const
         */
        this.MATCH_ARRAY_KEY_NAME = /(.*)\[(.*)\]$/;

        /**
         *
         */
        this.element = options.element || document.querySelector('form');

        /**
         *
         * @type {{}}
         * @private
         */
        this._objectContainer = {};
    };

    /**
     *
     * @returns {{}}
     */
    dataToObject () {
        this._objectContainer = {};

        var form = this.element,
            formElements = form.elements,
            me = this;

        Array.prototype.forEach.call(formElements, function (e) {
           if (e.nodeName === 'SELECT') {
               me._addSelectedOptionsToObject(e);
               return;
           }
           me._addNodeToObject(e);
       });

        return this._objectContainer;
    };

    /**
     *
     * @param e
     * @private
     */
    _addSelectedOptionsToObject (e) {
        var options = e.querySelectorAll('option:checked'),
            me = this;

        Array.prototype.forEach.call(options, function (option) {
            me._addNodeToObject(option);
        });
    };

    /**
     *
     * @param e
     * @private
     */
    _addNodeToObject (e) {
        var name = e.getAttribute('name'),
            nodeName = e.nodeName,
            type = e.getAttribute('type');

        if (nodeName === 'OPTION') {
            name = e.parentNode.getAttribute('name');
            if (e.parentNode.nodeName === 'OPTGROUP') {
                name = e.parentNode.parentNode.getAttribute('name');
            }
        }

        if (typeof name !== 'string') {
            return;
        }

        if (nodeName === 'INPUT' && type == 'checkbox' && !e.checked) {
            return;
        }

        if (nodeName === 'INPUT' && type == 'file') {
            //skip file type TODO fix file type;
            return;
        }

        if (name.match(this.MATCH_ARRAY_NAME)) {
            this._addArrayTypeToObject(name, e);
            return;
        }

        if (name.match(this.MATCH_ARRAY_KEY_NAME)) {
            this._addObjectTypeToObject(name, e);
            return;
        }

        this._objectContainer[name] = e.value;
    };

    /**
     *
     * @param name
     * @param e
     * @private
     */
    _addArrayTypeToObject (name, e) {
        name = name.replace(this.MATCH_ARRAY_KEY_NAME, '$1');
        this._objectContainer[name] = this._objectContainer[name] || [];
        this._objectContainer[name].push(e.value);
    };

    /**
     *
     * @param name
     * @param e
     * @private
     */
    _addObjectTypeToObject (name, e) {
        var dataName = name.replace(this.MATCH_ARRAY_KEY_NAME, '$1');
        var dataKey = name.replace(this.MATCH_ARRAY_KEY_NAME, '$2');

        this._objectContainer[dataName] = this._objectContainer[dataName] || {};
        this._objectContainer[dataName][dataKey] = e.value;
    };

    /**
     *
     * @returns {string}
     */
    serializeForm () {
        return this.serializeObject(this.dataToObject());
    };

    /**
     * 
     */
    serializeObject(object) 
    {
        return this._serializePart(object);
    }   


    /**
     *
     * @param data
     * @param prefix
     * @returns {string}
     * @private
     */
    _serializePart (data, prefix) {
        prefix = prefix || '';

        var dataKeys = Object.keys(data),
            me = this,
            str = '',
            hasPrefix = prefix.length > 0;


        dataKeys.forEach(function (key, i) {
            var value = data[key],
                name = key.replace(/\[\]$/, '');

            if (hasPrefix) {
                name = prefix + '[' + key + ']';
            }

            if (i > 0) {
                str += '&';
            }

            if (typeof value === 'array' || typeof value === 'object') {
                str += me._serializePart(data[key], name);
                return;
            }

            str += encodeURIComponent(name) + '=' + encodeURIComponent(value);
        });

        return str;
    };
}

module.exports = FormData;
