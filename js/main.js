const list = document.querySelector(".books__section")
const bookItem = document.querySelector(".books__section--item")
const selectList = document.querySelector(".main__left--list")
let selectTemlate = document.querySelector("#select__template");
const resulte = document.querySelector(".search__section--result")
let bookTemlate = document.querySelector("#book__template");
const cardTemplate = document.querySelector("#card")
const cardList = document.querySelector(".info__card")
const overlay = document.querySelector(".overlay")
const input = document.querySelector(".header__left--input")

const selectCollect = []
const storage = window.localStorage


let search = "python"
let searchIndex = 0

const API = async() => {
    const dataBase = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${searchIndex}`)
    const base = await dataBase.json()
    const data = base.items
    console.log(base);
    renderSectionss(data)
    renderData(data, list, cardList, base)
}
API();

input.addEventListener("change", () => {
    search = input.value
    input.value = null
    API()
})

const paginationLeft = document.querySelector(".left__btn")
const paginationCenter = document.querySelector(".center__btn")
const paginationRight = document.querySelector(".right__btn")

paginationLeft.addEventListener("click", () => {
    if (searchIndex > 1) {
        searchIndex--
    }
    API()
})

paginationRight.addEventListener("click", () => {
    searchIndex++
    API()
})


const renderData = (data, list, cardList, base) => {
    resulte.textContent = `Showing ${base.totalItems} Result(s)`
    list.innerHTML = null
    data.forEach(item => {
        let cloneBookTemplate = bookTemlate.content.cloneNode("true")
        cloneBookTemplate.querySelector(".books__section--item-center-book").textContent = ` ${item.volumeInfo.title.length < 25 ? item.volumeInfo.title : item.volumeInfo.title.split(" ").slice(0,2).join(" ")}... `
        cloneBookTemplate.querySelector(".books__section--item-center-author").textContent = ` ${item.volumeInfo.authors} `
        cloneBookTemplate.querySelector(".book__img").src = `${ item.volumeInfo.imageLinks.thumbnail }`
        cloneBookTemplate.querySelector(".books__section--item").id = `${item.id}`
        cloneBookTemplate.querySelector(".bookmark").dataset.id = `${item.id}`
        cloneBookTemplate.querySelector(".more_info").dataset.id = `${item.id}`
        cloneBookTemplate.querySelector(".read").href = `${item.volumeInfo.previewLink}`
        cloneBookTemplate.querySelector(".read").target = "_blank"

        const moreInfoBtn = cloneBookTemplate.querySelector(".more_info")
        moreInfoBtn.onclick = () => {
            cardList.classList.remove("card-hidden")
            overlay.classList.remove("overlay-hidden")
            cardList.innerHTML = null
            let cloneCard = cardTemplate.content.cloneNode("true")
            cloneCard.querySelector(".info__card--bookImage").src = `${item.volumeInfo.imageLinks.thumbnail}`
            cloneCard.querySelector(".info__card--text").textContent = `${item.volumeInfo.description}`
            cloneCard.querySelector(".info__card--item-authorName1").textContent = `${item.volumeInfo.authors}`
            cloneCard.querySelector(".info__card--item-year").textContent = `${item.volumeInfo.publishedDate}`
            cloneCard.querySelector(".info__card--item-publishersName").textContent = `${item.volumeInfo.publisher}`
            cloneCard.querySelector(".info__card--item-category").textContent = `${item.volumeInfo.categories}`
            cloneCard.querySelector(".info__card--item-page").textContent = `${item.volumeInfo.pageCount}`
            cloneCard.querySelector(".read__card").href = `${item.volumeInfo.previewLink}`
            cloneCard.querySelector(".read__card").target = "_blank"

            const closeBtn = cloneCard.querySelector(".close__btn")
            closeBtn.addEventListener("click", () => {
                cardList.classList.add("card-hidden")
                overlay.classList.add("overlay-hidden")
            })
            cardList.append(cloneCard)
        }

        list.append(cloneBookTemplate)

    })
}
const renderSections = (arr, element) => {
    let fragment = document.createDocumentFragment()
    arr.forEach(item => {
        let cloneSelectTemplate = selectTemlate.content.cloneNode("true")
        cloneSelectTemplate.querySelector("#book__name").textContent = `${ item.volumeInfo.title }`
        cloneSelectTemplate.querySelector(".book__author").textContent = `${ item.volumeInfo.authors }`
        cloneSelectTemplate.querySelector(".book__delete").dataset.id = `${item.id}`
        fragment.append(cloneSelectTemplate)
    })
    element.append(fragment)
}

const renderSectionss = (data) => {
    list.addEventListener("click", (evt) => {
        if (evt.target.matches(".bookmark")) {
            const foundIndex = data.find((item) => item.id === evt.target.dataset.id)
            if (!selectCollect.includes(foundIndex)) {
                selectCollect.push(foundIndex)
                selectList.innerHTML = null;
                renderSections(selectCollect, selectList)
                window.localStorage.setItem("books", JSON.stringify(selectCollect))
            }
        }
    })
}

selectList.addEventListener("click", evt => {
    if (evt.target.matches(".book__delete")) {
        const foundIndex = selectCollect.findIndex(item => evt.target.dataset.id === item.id)
        selectCollect.splice(foundIndex, 1)
        selectList.innerHTML = null
        renderSections(selectCollect, selectList)
        window.localStorage.setItem("books", JSON.stringify(selectCollect))
    }
})

JSON.parse(storage.getItem("books")) ? JSON.parse(storage.getItem("books")) : selectCollect;