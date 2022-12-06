'use strict'
const STORAGE_KEY = 'booksDB'
const CURRENT_OPEN_MODAL = 'openModal'
const PAGE_SIZE = 4

var gBooks
var gPageIdx = 0
var gPriceSortToggle = 1
var gRateToggle = 1

_createBooks()

function getBooks(booksFromSerch) {
    if(booksFromSerch){
        return booksFromSerch
    }
    var startIdx = gPageIdx * PAGE_SIZE
    return gBooks.slice(startIdx, startIdx + PAGE_SIZE)
}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = [
            _createBook('pokemon', 10),
            _createBook('atomic', 15),
            _createBook('glory', 25),
            _createBook('secret', 12),
            _createBook('grit', 17),
            _createBook('lessons', 20),
            _createBook('bibi', 8),
            _createBook('one', 15),
            _createBook('foster', 17),
        ]
    }
    gBooks = books
    _saveBooksToStorage()
}

function _createBook(name, price, rate = 0) {
    return {
        id: makeId(),
        name,
        price,
        summary: makeLorem(),
        rate,
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(bookName, bookPrice) {
    const newBook = _createBook(bookName, bookPrice)
    gBooks.unshift(newBook)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => bookId === book.id)
    book.price = newPrice
    _saveBooksToStorage()
}

function changeRate(num) {
    //Deal between 0-10
    const bookId = loadFromStorage(CURRENT_OPEN_MODAL)
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    if (num === 1 && gBooks[bookIdx].rate !== 10) {
        gBooks[bookIdx].rate++
    } else if (num === -1 && gBooks[bookIdx].rate !== 0) {
        gBooks[bookIdx].rate--
    } 
    _saveBooksToStorage() // making problems when serching by name 
    return gBooks[bookIdx].rate
}

function changeSpecificBookRate(currBook) {
    const books = loadFromStorage(STORAGE_KEY)
    const bookIdx = books.findIndex((book) => book.id === currBook.id)
    books[bookIdx].rate++
    saveToStorage(STORAGE_KEY, books)
}

function clearOpenBookModal() {
    localStorage.removeItem(CURRENT_OPEN_MODAL)
}

function setSortBy(sortBy) {
    gPageIdx = 0
    if (sortBy === 'price') {
        gPriceSortToggle *= -1
        gBooks.sort((book1, book2) => (book1.price - book2.price) * gPriceSortToggle)
    } else if (sortBy === 'rate') {
        gRateToggle *= -1
        gBooks.sort((book1, book2) => (book1.rate - book2.rate) * gRateToggle)
    }
    _saveBooksToStorage()
}

function serchByName(bookName) {
    const booksByName = gBooks.filter(book => book.name === bookName)
    if (booksByName.length <= 0) return null
    return booksByName
}

function renderbooksToShow(booksToShow){
    renderbooks(booksToShow)
}

function returnOrginalGbooks() {
    gBooks = loadFromStorage(STORAGE_KEY)
}

function updateLocalBookById(bookId, bookToSet) {
    var localBooks = loadFromStorage(STORAGE_KEY)
    var localBookIdx = localBooks.findIndex(book => book.id === bookId)
    localBooks[localBookIdx] = bookToSet
    _saveBooksToStorage()
}

function updateGlobalBookById(bookId, bookToSet) {
    var globalBookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks[globalBookIdx] = bookToSet
}

function paging(direction) {
    if (direction === 'right') {
        gPageIdx++
        if (gPageIdx * PAGE_SIZE >= gBooks.length-PAGE_SIZE) {
            return 1
        }
    } else {
        gPageIdx--
        if (gPageIdx * PAGE_SIZE <= 0) {
            return -1
        }
    }
}

function getCurrPageAndSize(){
    const res = Math.floor(gBooks.length/PAGE_SIZE)+1
    return {currPage: gPageIdx, size: res}
}