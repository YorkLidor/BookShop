'use strict'

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function saveOpenBookModalId(bookId) {
    saveToStorage(CURRENT_OPEN_MODAL,bookId)
}
