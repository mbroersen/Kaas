class CoreColumn {

    /**
     *
     * @param options
     */
    constructor(options)
    {
        this.hiddenColumns = options.hiddenColumns || [];
        this.mainContainer = options.mainContainer;
        this.applySettings();
    }

    /**
     *
     */
    applySettings()
    {
        this.showAll();

        var style = document.createElement('style');

        var text = '';
        for (var col in this.hiddenColumns) {
             text += '.table-card table tr > :nth-child(' + this.hiddenColumns[col] + ') {display: none;}\n';
        }
        
        style.appendChild(document.createTextNode(text));
        this.mainContainer.appendChild(style);
    }

    /**
     *
     */
    showAll()
    {
        var cur = this.mainContainer.querySelector('style');

        if (cur) {
            this.mainContainer.removeChild(cur);
        }
    }

}

module.exports = CoreColumn;