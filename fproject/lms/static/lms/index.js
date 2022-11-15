function createEl(id, type, view) {
    const el = document.createElement(type);
    el.setAttribute('id', id);
    view.append(el);
    return el;
}
