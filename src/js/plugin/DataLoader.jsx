import Request from "../form/Request";

class DataLoader
{

    /**
     *
     * @param options
     */
    constructor (options) {
        this.currentRequest = null;
        this.options = options || {};
        this.searchButton = options.button || document.querySelector('#btn-reload');
        this.url = options.url;
        this.form = options.form || document.querySelector('form');
        this.limit = options.limit || 200;
        this.data = options.data || {};
        this.offset = 0;
        this.onLoadStart = options.onLoadStart || function () {};
    }


    /**
     *
     * @param e
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
            me.datagrid.renderText("loading....");
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