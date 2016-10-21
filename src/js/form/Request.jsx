import FormData from "./Data";

/**
 *
 */
class FormRequest {

    /**
     *
     * @param options
     */
    constructor (options) {

        /**
         *
         * @const {string}
         */
        const REQUEST_TYPE_POST = 'POST';

        /**
         *
         * @const {string}
         */
        const REQUEST_TYPE_GET = 'GET';

        this.REQUEST_TYPE_POST = REQUEST_TYPE_POST;
        this.REQUEST_TYPE_GET = REQUEST_TYPE_GET;

        this.url = options.url || "./index.html";
        this.complete = options.complete || function () {};
        this.success = options.success || function () {};
        this.error = options.error || function () {};
        this.element = options.element || null;
        this.status = 0;
        this.data = options.data || false;
        this.requestType = options.type || REQUEST_TYPE_POST;
        this.dataHelper = new FormData({element: (options.element || null)});
    };



    /**
     *
     * @private
     */
    _create () {
        if (this.requestType == this.REQUEST_TYPE_POST) {
            this.createPostRequest();
        } else {
            this.createGetRequest();
        }
    };

    /**
     *
     * @param limit
     * @param offset
     */
    send (limit, offset)
    {
        limit = limit || 1000;
        offset = offset || 0;

        if (this.status == 2) {
            return;
        }

        this.status = 2;
        this._create();

        if (this.requestType == this.REQUEST_TYPE_POST) {
            this.request.send(this.serializePostData(limit, offset));
        } else {
            this.request.send();
        }

    };


    /**
     *
     * @param limit
     * @param offset
     * @returns {string}
     */
    serializePostData(limit, offset)
    {
        var serializeData = '';

        if (this.element != null) {
            serializeData += this.dataHelper.serializeForm();
        }

        if (serializeData.length > 0) {
            serializeData += '&';
        }

        if (this.data) {

            var data = this.data;

            if (this.data.toString().substr(0, 8) == "function") {
                data = data();
            }

            serializeData += this.dataHelper.serializeObject(data);
        }


        if (serializeData.length > 0) {
            serializeData += '&';
        }

        serializeData += encodeURIComponent("offset") + '=' + encodeURIComponent(offset);
        serializeData += "&" + encodeURIComponent("limit") + '=' + encodeURIComponent(limit);

        return serializeData;
    }


    /**
     *
     */
    abort ()
    {
        if (this.request === null) {
            return;
        }

        this.request.abort();
    };


    /**
     *
     */
    createGetRequest()
    {
        var r = this;
        this.request = new XMLHttpRequest();
        this.request.open('GET', this.url, true);
        this.request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                r.lastResult = this.responseText || this.responseXML;
                r.status = 3;
                r.success.call(r, r.lastResult);
            }
        };

        this.request.onerror = function() {
            r.error.call(r, -3);
        };
    }

    /**
     *
     */
    createPostRequest()
    {
        var r = this;
        this.request = new XMLHttpRequest();
        this.request.open('POST', this.url, true);
        this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        this.request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                r.lastResult = this.responseText || this.responseXML;
                try {
                    r.lastResult = JSON.parse(this.responseText);
                } catch (e) {

                }
                r.status = 3;
                r.success.call(r, r.lastResult);
                return;
            }

            r.error(this.status);
            r.status = -2;
        };

        this.request.onerror = function() {
            r.error.call(r, -3);
        };
    }


    /**
     *
     * @param ele
     */
    addHTMLTo(ele)
    {
        this.requestType = this.REQUEST_TYPE_GET;

        if (ele instanceof HTMLElement) {
            this.createGetRequest();
            this.success = function (html) {
                ele.insertAdjacentHTML('before', html);
            };
        }

        this.send();
    }

    /**
     *
     * @param ele
     * @param limit
     * @param offset
     */
    getJsonList(ele, limit, offset)
    {
        this.requestType = this.REQUEST_TYPE_POST;
        this.element = ele;
        this.createPostRequest();
        this.send(limit, offset);
    }


}

module.exports = FormRequest;

