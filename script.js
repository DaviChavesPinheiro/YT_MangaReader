window.onload = () => {
    createReadElement()
}

let hasMangaAlreadyBeenOpened = false
const readElement = document.createElement("button")

function createReadElement(){
    readElement.id = "read"
    readElement.classList.add("mm")
    readElement.classList.add("button")
    // readElement.classList.add("undecoded")
    readElement.textContent = "READ"
    readElement.addEventListener("click", openManga)
    document.querySelector(".ytp-chrome-controls .ytp-right-controls").prepend(readElement)
}

function openManga() {
    console.log("OK")
    // const canvas = document.querySelector("#canvas")

    // if (decodeElement.classList.contains("undecoded")) { //Undecoded ------> Loading
    //     setLoadingState(canvas)
    // } else if(decodeElement.classList.contains("loading")){//Please, wait.
    //     decodeElement.textContent = "DECODING... Wait"
    // } else if(decodeElement.classList.contains("decoded")){//Decoded ------> Undecoded
    //     setUndecodedState(canvas)
    // }
    // isDecoded = true
    hasMangaAlreadyBeenOpened = true
}
