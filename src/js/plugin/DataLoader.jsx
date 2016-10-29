import Request from "../form/Request";

class DataLoader
{

    /**
     * @example
     *
     * var options = {
     *  button: document.querySelector('#btn-reload'),
     *  url: '/test.php',
     *  form: document.querySelector('form'),
     *  limit: 200,
     *  data: {test: test}, //adds parameter test to form post-data
     *  onLoadStart: function () {
     *      alert('start loading');
     *  }
     * }
     *
     * new Kaas.plugins.DataLoader(options);
     *
     * @param {Object} [options]
     * @param {HTMLElement} [options.button]
     * @param {String} [options.url]
     * @param {HTMLFormElement} [options.form]
     * @param {number} [options.limit]
     * @param {Object} [options.data]
     * @param {Function} [options.onLoadStart]
     *
     *
     */
    constructor (options) {
        /**
         *
         * @type {Request}
         */
        this.currentRequest = null;

        /**
         *
         * @type {Object}
         */
        this.options = options || {};

        /**
         *
         * @type {HTMLElement}
         * @default document.querySelector('#btn-reload')
         */
        this.searchButton = options.button || document.querySelector('#btn-reload');

        /**
         *
         * @type {String}
         */
        this.url = options.url;

        /**
         *
         * @type {HTMLFormElement}
         * @default document.querySelector('form');
         */
        this.form = options.form || document.querySelector('form');

        /**
         *
         * @type {number}
         * @default 200
         */
        this.limit = options.limit || 200;

        /**
         *
         * @type {Object}
         * @default {Object} empty object
         */
        this.data = options.data || {};

        /**
         *
         * @type {number}
         * @default 0
         *
         */
        this.offset = 0;

        /**
         *
         * @type {Function}
         * @default {Function} empty function
         *
         */
        this.onLoadStart = options.onLoadStart || function () {};
    }


    /**
     *
     * @param CustomEvent e
     * @private
     */
    init(e)
    {
        var me = this;
        this.datagrid = e.detail.datagrid;
        setTimeout(function () {
            me._sendNewRequest();
            me._addListener();
        }, 200);


    }

    /**
     *
     * @private
     */
    _addListener()
    {
        var me = this;
        var onClick = function () {
            me.onLoadStart();
            me._sendNewRequest.apply(me);
        };

        this.searchButton.addEventListener('click', onClick, false);
    }

    /**
     *
     * @private
     */
    _sendNewRequest()
    {
        if (this.currentRequest != null) {
            this.currentRequest.abort();
        }

        this.datagrid.reset();

        var me = this;
        let _success = function (result) {
            var resultLength = result.length;
            me.datagrid.addRows(JSON.stringify(result));
            document.querySelector('.table-status-info .loader').classList.remove('hidden');
            if (resultLength > 0 && resultLength == me.limit) {
                me.offset += me.limit;
                this.send(me.limit, me.offset);
            } else {
                me.datagrid.render(true);
                document.querySelector('.table-status-info .loader').classList.add('hidden');
            }
        };

        this.offset = 0;
        this.currentRequest = new Request({
            url: this.url,
            element: this.form,
            data: this.data,
            success: _success
        });

        this.currentRequest.send(me.limit, me.offset);
    }
}


module.exports = DataLoader;