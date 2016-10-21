class EditMenu
{

    /**
     *
     * @param options
     */
    constructor(options)
    {
        this.element = options.element;
    }

    /**
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
     *
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
     *
     */
    reset()
    {
        this.hide();
    }

    /**
     *
     * @param e
     */
    selectRow(e, element, parent)
    {
        this.show(parent);
    }

    /**
     *
     * @param e
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