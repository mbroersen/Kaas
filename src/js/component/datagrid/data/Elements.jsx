var elements = {
    tr: document.createElement('tr'),
    td: document.createElement('td'),
    checkbox: document.createElement('input'),
    form: document.createElement('form'),
    text: document.createElement('input'),
    tbody: document.createElement('tbody'),
    renderedCells: 0
};

elements.text.setAttribute('type', 'text');
elements.checkbox.setAttribute('name', 'id[]');
elements.checkbox.setAttribute('type', 'checkbox');

module.exports = elements;
//export {elements}