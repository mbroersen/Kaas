import FormRequest from "../form/Request";

class MultiEdit
{
    /**
     *
     * @param options
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
     * @param e
     */
    preSave(e)
    {
        this.onStart();
    }

    /**
     *
     * @param e
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