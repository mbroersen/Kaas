import Cell from './Cell';
import FormData from '../../../form/Data';
import elements from './Elements';

/**
 *  <code>
 *      var options {
 *          fieldName: 'name',
 *          form: HTMLFormElement,
 *          saveDataFormatter: function,
 *      }
 *      </code>
 */
class EditCell extends Cell {

    /**
     *
     * @param data
     * @param options
     * @param rowData
     */
    constructor(data, options, rowData)
    {
        super(data, options, rowData);

        this.classList.push('editable');

        this.rawData = options.rawData;
        this.fieldName = options.fieldName;
        this.formCell = elements.td.cloneNode(false);
        this.form = (options.form);
        this.saveDataFormatter = options.saveDataFormatter || function (data) {return data};
        this.formCell.appendChild(this.form);
        this.rowIsSelected = options.rowIsSelected || false;
        this._init();

    }

    /**
     *
     * @private
     */
    _init()
    {
        this.cell = null;

        var input = this.form.querySelector('input, select');

        input.setAttribute('name', this.fieldName);
        input.addEventListener('focus', function (e) {
            e.preventDefault();
        }, true);

        input.addEventListener('blur', function () {
            this.parentNode.parentNode.parentNode.parentNode.scrollTop = this.parentNode.parentNode.parentNode.parentNode.scrollTop + 1;
            this.parentNode.parentNode.parentNode.parentNode.scrollTop = this.parentNode.parentNode.parentNode.parentNode.scrollTop - 1;
        }, true);

        this.form.addEventListener('submit', function (e) {
            e.preventDefault();
            return false;
        }, false);


    }

    /**
     *
     * @param data
     * @returns {*}
     */
    update(data) 
    {
        this.rawData = data;
        return super.update(data);
    }

    /**
     * 
     * @returns {null|*}
     */
    render()
    {
        var addListener = false;
        if (this.cell == null) {
            addListener = true;
        }

        super.render();

        if (addListener) {
            this.cell.addEventListener('click', function (e) {
                this.parentNode.querySelector('[type="checkbox"]').click();
            }, false);
        }


        return this.cell;
    }

    /**
     * 
     * @param data
     */
    setFormValue(data)
    {
        var input = this.formCell.querySelector('input, select');

        if (input instanceof HTMLInputElement) {
            input.value = data;
            input.setAttribute('value', data);
        }


        if (input instanceof HTMLSelectElement) {

            var selected = input.querySelector("option:checked");

            if (selected) {
                selected.removeAttribute('selected');
            }

            var option = input.querySelector('[value="' + data + '"]');

            if (option) {
                input.value = data;
                option.setAttribute("selected", "");
            }
        }
    }
    

    /**
     *
     */
    resetFormValue()
    {
        var input = this.formCell.querySelector('input, select');

        if (input instanceof HTMLInputElement) {
            input.value = this.rawData;
            input.setAttribute('value', this.rawData);
        }
        

        if (input instanceof HTMLSelectElement) {

            var selected = input.querySelector("option:checked");

            if (selected) {
                selected.removeAttribute('selected');
            }

            var option = input.querySelector('[value="' + this.rawData + '"]');

            if (option) {
                input.value = this.rawData;
                option.setAttribute("selected", "");
            }
        }
    }

    /**
     *
     */
    showForm()
    {
        this.rowIsSelected = true;
        this.cell.parentNode.replaceChild(this.formCell, this.cell);

        this.resetFormValue();
    }

    /**
     *
     */
    hideForm()
    {
        if (this.formCell.parentNode) {
            this.formCell.parentNode.replaceChild(this.cell, this.formCell);
            this.rowIsSelected = false;
        }
    }


    /**
     * 
     * @returns {{}}
     */
    getFormData()
    {
        var formData = new FormData({element: this.form});
        return formData.dataToObject();
    }


    /**
     *
     * @returns {boolean}
     */
    isChanged()
    {
        return this.rawData != this.form.querySelector('input, select').value;
    }

    /**
     *
     * @returns {*}
     */
    onSave()
    {
        if (this.isChanged()) {
            this.update(this.form.querySelector('input, select').value);

            return this.saveDataFormatter(this.getFormData());
        }

        return {};
    }

}
module.exports = EditCell;
