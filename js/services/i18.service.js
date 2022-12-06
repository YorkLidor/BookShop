'use strict'

var gTrans = {
    title: {
        en: 'My Book Shop',
        he: 'חנות הספרים שלי'
    },
    id: {
        en: 'Id',
        he: 'ברקוד'
    },
    name: {
        en: 'Name',
        he: 'שם'
    },
    price: {
        en: 'Price',
        he: 'מחיר'
    },
    rate: {
        en: 'Rate',
        he: 'דירוג'
    },   
    picture: {
        en: 'Picture',
        he: 'תמונה'
    },   
    actions: {
        en: 'Actions',
        he: 'פעולות'
    },   
    next: {
        en: 'Next',
        he: 'קדימה'
    },   
    prev: {
        en: 'Prev',
        he: 'אחורה'
    },   
    'add-book': {
        en: 'Add Book',
        he: 'הוספת ספר'
    },   
    'serch-book': {
        en: 'Serch Book By Name',
        he: '(באנגלית) חיפוש ספר לפי שם'
    },   
    read: {
        en: 'Read',
        he: 'מידע'
    },   
    update: {
        en: 'Update',
        he: 'עידכון'
    },   
    delete: {
        en: 'Delete',
        he: 'מחיקה'
    },     
    'modal-price': {
        en: 'Book Price',
        he: 'מחיר הספר'
    },   
    'modal-summary': {
        en: 'Book Summary',
        he: 'תקציר הספר'
    },   
    'modal-close': {
        en: 'close',
        he: 'סגור'
    },   
 
}

var gCurrLang = 'en'

function setLang(lang) {
    gCurrLang = lang
}

function getTrans(transKey) {
    //if key is unknown return 'UNKNOWN'
    const key = gTrans[transKey]
    if (!key) return 'UNKNOWN'

    //get from gTrans
    var translation = key[gCurrLang]

    //If translation not found - use english
    if (!translation) translation = key.en

    return translation
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const translation = getTrans(transKey)

        el.innerText = translation

        // supports placeholders    
        if (el.placeholder) el.placeholder = translation
    }) 
}




