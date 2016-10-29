class EditMenu
{

    /**
     * @example
     *
     * var options = {
     *  element: document.querySelector('#datagrid-edit-menu')
     * };
     *
     * new Kaas.plugin.EditMenu(options);
     *
     *
     * @param [options]
     * @alias Kaas/plugins/EditMenu
     *
     * @param HTMLElement [options.element]
     *
     */
    constructor(options)
    {
        this.element = options.element;
    }

    /**
     *
     *
     */
    hide ()
    {
        var menu = this.element;

        if (!menu.classList.contains("active")) {
            return;
        }

        menu.classList.remove('active');

        var saveBtn = menu.querySelector('#table-card-btn-save');
        menu.replaceChild(saveBtn.cloneNode(true), saveBtn);

        var cancelBtn = menu.querySelector('#table-card-btn-cancel');
        menu.replaceChild(cancelBtn.cloneNode(true), cancelBtn);
    }

    /**
     * Shows menu and adds event listeners
     *
     * @param {DataGrid} parent
     */
    show(parent)
    {
        var menu = this.element;
        var me = this;

        if (menu.classList.contains("active")) {
            return;
        }

        menu.querySelector('#table-card-btn-save').addEventListener('click', function (e) {
            e.stopPropagation();
            parent.onSave();
            me.hide();
            e.preventDefault();

        }, false);

        menu.querySelector('#table-card-btn-cancel').addEventListener('click', function (e) {
            e.stopPropagation();
            parent.onCancel();
            me.hide();
            e.preventDefault();
        }, false);

        menu.classList.add('active');
    }

    /**
     * @private
     */
    reset()
    {
        this.hide();
    }

    /**
     *
     * @param CustomEvent e
     * @private
     */
    selectRow(e, element, parent)
    {
        this.show(parent);
    }

    /**
     *
     * @param CustomEvent e
     * @private
     */
    unSelectRow(e, element, parent)
    {
        if (element.querySelectorAll(':checked').length > 0) {
            return;
        }

        this.hide();
    }
}

module.exports = EditMenu;