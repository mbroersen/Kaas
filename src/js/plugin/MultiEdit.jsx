import FormRequest from "../form/Request";

class MultiEdit
{
    /**
     * @example
     *
     * var options = {
     *  url: '/save.php'
     *  onStart: function () { alert('start')},
     *  onSuccess: function () { alert('edit successfull')},
     *  onFail: function () { alert('error')},
     *  onNoChanges: function ( alert('nothing changed') )
     * };
     *
     * new Kaas.plugins.MultiEdit(options);
     *
     *
     * @param [options]
     * @param {String} [options.url]
     * @param {Function} [options.onStart]
     * @param {Function} [options.onSuccess]
     * @param {Function} [options.onFail]
     * @param {Function} [options.onNoChanges]
     *
     */
    constructor(options)
    {
        this.url = options.url || "./";
        this.onStart = options.onStart || function () {};
        this.onSuccess = options.onSuccess || function () {};
        this.onFail = options.onFail || function () {};
        this.onNoChanges = options.onNoChanges || function () {};
    }

    /**
     *
     * @param CustomEvent e
     * @private
     */
    preSave(e)
    {
        this.onStart();
    }

    /**
     *
     * @param CustomEvent e
     * @private
     */
    onSave(e) {
        
        var data = e.detail.data;

        if (Object.keys(data).length == 0) {
            this.onNoChanges();
            return;
        }

        var rq = new FormRequest({
            url: this.url,
            data: data,
            success: this.onSuccess,
            error: this.onFail
        });
        rq.send();
    }
}

module.exports = MultiEdit;