'use strict'

function onInit() {
    document.querySelector('.btn.disable-l').disabled = true
    renderFilterByQueryStringParams()
    renderCards()
    renderbooks()
    doTrans()
}

function renderbooks(booksFromSerch) {
    var books = getBooks(booksFromSerch)
    var strHtmls = books.map(book => `
    <tr><td>${book.id}</td><td>${book.name.charAt(0).toUpperCase() + book.name.slice(1)}</td>
    <td>${book.price}$</td>
    <td>${book.rate}</td>
    <td><img onerror="this.src='images/defultBook.jpg'" src="images/${book.name}.jpg"></td>
    <td><button class="read-btn" onclick="onReadBook('${book.id}')" data-trans="read">Read</button>
    <button class="update-btn" onclick="onUpdateBook('${book.id}')" data-trans="update">Update</button>
    <button class="delete-btn" onclick="onRemoveBook('${book.id}')" data-trans="delete">Delete</button></td></tr>`
    )
    strHtmls.unshift('<div class="container"><table><thead><tr><th data-trans="id">Id</th><th data-trans="name">Name</th><th class="sort" onclick="onSetSortBy(\'price\')" data-trans="price">Price</th><th class="sort" onclick="onSetSortBy(\'rate\')" data-trans="rate">Rate</th><th data-trans="picture">Picture</th><th data-trans="actions">Actions</th></tr></thead><tbody>')
    strHtmls.push('</tbody></table></div>')
    document.querySelector('.books-container').innerHTML = strHtmls.join('')
    doTrans()
}

function renderCards(booksFromSerch){
    var books = getBooks(booksFromSerch)
    var strHtmls = books.map(book => `
    <div class="card">
        <h2>${book.name.charAt(0).toUpperCase() + book.name.slice(1)}</h2>
        <img onerror="this.src='images/defultBook.jpg'" src="images/${book.name}.jpg"><br><br>

        <h3 style="display: inline;" data-trans="price"></h3><h3 style="display: inline;">: ${book.price}</h3><br><br>
        
        <h3 style="display: inline;" data-trans="id"></h3><h3 style="display: inline;">: ${book.id}</h3><br><br>
        
        <h3 style="display: inline;" data-trans="rate"></h3><h3 style="display: inline;">: ${book.rate}</h3><br><br>         
        
        <button class="read-btn" onclick="onReadBook('${book.id}')" data-trans="read">Read</button>
        <button class="update-btn" onclick="onUpdateBook('${book.id}')" data-trans="update">Update</button>
        <button class="delete-btn" onclick="onRemoveBook('${book.id}')" data-trans="delete">Delete</button>
    </div>
    `)
    document.querySelector('.cards-container-section').innerHTML = strHtmls.join('')
    doTrans()
}

function onDisplayChange(){
    // document.querySelector('.books-container').removeAttribute(hidden)
    // document.querySelector('.books-container').setAttribute('hidden',false)
    // document.querySelector('.books-container').setAttribute('hidden',true)
    // document.querySelector('.books-container').setAttribute('hidden')
    // document.querySelector('.books-container').style.visibility = ('hidden')
    document.querySelector('.books-container').classList.toggle('hidden')
    document.querySelector('.cards-container').classList.toggle('hidden')

}


function onRemoveBook(bookId) {
    removeBook(bookId)
    renderbooks()
    renderCards()
}

function onAddBook() {
    var bookName = prompt('Enter book name')
    var bookPrice = +prompt('Enter book price')
    while (!bookPrice) {
        alert("Enter valid price")
        bookPrice = +prompt('Enter book price')
    }
    addBook(bookName, bookPrice)
    renderbooks()
    renderCards()

}

function onUpdateBook(bookId) {
    var newPrice = +prompt('Enter new price')
    while (!newPrice) {
        alert("Enter valid price")
        newPrice = +prompt('Enter new price')
    }
    updateBook(bookId, newPrice)
    renderbooks()
    renderCards()

}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    console.log('elModal:', elModal)
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('span.price-span').innerText = book.price + '$'
    elModal.querySelector('span.rate').innerText = book.rate
    elModal.querySelector('p').innerText = book.summary
    elModal.classList.add('open')
    saveOpenBookModalId(book.id)
    doTrans()
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
    clearOpenBookModal()
}

function onRateChange(num) {
    const bookRate = changeRate(num)
    const elModal = document.querySelector('.modal')
    elModal.querySelector('span.rate').innerText = bookRate
    renderbooks()
    renderCards()

}

function onSetSortBy(sortBy) {
    setSortBy(sortBy)

    const queryStringParams = `?sort=${sortBy}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

    renderbooks()
    renderCards()

}

function onSerchByName() {
    if (document.querySelector('.serch-book').innerText === 'Back') {
        document.querySelector('.serch-book').innerText = 'Serch Book By Name'
        renderbooks()
        renderCards()

        return
    }
    const bookName = prompt('Enter Book Name')
    const booksToShow = serchByName(bookName)
    if (!booksToShow) {
        alert('We don\'t have a book with this name')
        return
    }
    renderbooksToShow(booksToShow)
    document.querySelector('.serch-book').innerText = 'Back'
}

function onPaging(direction) {
    const res = paging(direction)
    if (res === 1) {
        document.querySelector('.btn.disable-r').disabled = true
    }
    if (res === -1) {
        document.querySelector('.btn.disable-l').disabled = true
    }

    var results = getCurrPageAndSize()
    if (results.currPage !== 0) {
        document.querySelector('.btn.disable-l').disabled = false
    }
    if (results.currPage !== results.size - 1) {
        document.querySelector('.btn.disable-r').disabled = false
    }
    renderbooks()
    renderCards()

}

////////////////// Language choosing //////////////////

function onSetLang(lang) {
    setLang(lang)
    if (lang === 'he') {
        document.body.classList.add('rtl')
    }else {
        document.body.classList.remove('rtl')
    } 
    const queryStringParams = `?language=${lang}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
    renderbooks()
    renderCards()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = queryStringParams.get('language') || '' 
    
    if (!filterBy) return
    document.querySelector('.select-lang').value = filterBy
    onSetLang(filterBy)
}
