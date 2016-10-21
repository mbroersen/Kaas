import Row from './Row';

class JsonParser
{
    constructor (options)
    {
        this.rowHandler = options.rowHandler || function (data) {return data};
        this.rowIsSelectable = options.selectable || true;

        /**
         * @var sbjs.component.datagrid.data.Row[]
         */
        this.proccessedData = [];
        this.options = options || {};
    };

    /**
     *
     * @param data
     * @returns {Array}
     */
    processData (data)
    {
        var rowRegister = [];

        data = JSON.parse(data);
        this.rawData = JSON.parse(JSON.stringify(data));

        if (this.rawData.length <= 0) {
            return [];
        }

        var options = this.options;

        data.forEach(function (rowData) {
            rowRegister.push(new Row(rowData, options));
        });

        return rowRegister;
    };

    /**
     *
     * @returns {*}
     */
    getRaw ()
    {
        return this.rawData;
    };

    /**
     *
     * @returns {sbjs.component.datagrid.data.Row[]}
     */
    getProcessed ()
    {
        return this.proccessedData;
    };

}


export {JsonParser};