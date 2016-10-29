class CoreSort
{

    /**
     *
     * @param [options]
     * @param {function} [options.sortDataHandler]
     * @param {number} [options.sortField]
     * @param {number} [options.sortDirection]
     */
    constructor (options)
    {
        this.sortDataHandler = options.sortDataHandler || function (data) {return data};
        this.sortField = options.sortField || 1;
        this.sortDirection = options.sortDirection || 1;
    };

    /**
     *
     */
    invertSortDirection ()
    {
        this.sortDirection = this.sortDirection == 1 ? -1 : 1;
    };

    /**
     *
     * @param field
     */
    setSortField (field)
    {
        this.sortField = field;
    };

    /**
     *
     * @param dir
     */
    setSortDirection (dir)
    {
        this.sortDirection = dir;
    }

    /**
     *
     * @param rows
     * @returns {Array.<T>}
     */
    sort (rows)
    {
        if (Object.keys(rows).length <= 0) {
            return [];
        }

        var nr = this.sortField,
            sortDir = this.sortDirection,
            keys = rows[0].getSortFields(),
            keyField = keys[nr];

        return rows.sort(function(a, b) {
            var dataA = a.getSortDataByFieldName(keyField);
            var dataB = b.getSortDataByFieldName(keyField);

            if (dataA == undefined) {
                dataA = "";
            }

            if (dataB == undefined) {
                dataB = "";
            }

            if (!isNaN(dataA)) {
                if (dataA-0 > (dataB-0)) {
                    return -1 * sortDir;
                }
                return 1 * sortDir;
            }

            if (dataB === null || typeof dataB.localeCompare !== 'function') {
                return -1;
            }

            return dataB.localeCompare(dataA) * sortDir;
        });
    };


}
module.exports = CoreSort;

//export {CoreSort};