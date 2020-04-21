window.onload = () => {
  const FPS = 4;
  const PAGE_SCALE = 0.6;
  let currentPage = 0;
  let currentChapter = 0;

  let video;

  let hasMangaAlreadyBeenOpened = false;
  const readElement = document.createElement("button");
  const panelElement = document.createElement("div");
  const toolBarElement = document.createElement("div");
  const closeElement = document.createElement("button");
  const bottonToolBarElement = document.createElement("div");
  const pageViewer = document.createElement("div");
  const chapterView = document.createElement("div");

  createReadElement();
  createPanelElement();
  createToolBarElement();
  createCloseElement();
  createBottonToolBarElement();

  function createReadElement() {
    readElement.id = "read";
    readElement.classList.add("mm");
    readElement.classList.add("button");
    readElement.textContent = "READ";
    readElement.addEventListener("click", read);
    document
      .querySelector(".ytp-chrome-controls .ytp-right-controls")
      .prepend(readElement);
  }
  function createPanelElement() {
    panelElement.id = "panel";
    panelElement.classList.add("mm");
    panelElement.classList.add("panel");
    panelElement.classList.add("hidden");
    document.querySelector("body").append(panelElement);
  }
  function createToolBarElement() {
    toolBarElement.id = "toolBar";
    toolBarElement.classList.add("mm");
    document.querySelector("#panel").prepend(toolBarElement);
  }
  function createCloseElement() {
    closeElement.id = "close";
    closeElement.classList.add("mm");
    closeElement.classList.add("button");
    closeElement.textContent = "X";
    closeElement.addEventListener("click", read);
    document.querySelector("#toolBar").prepend(closeElement);
  }
  function createBottonToolBarElement() {
    bottonToolBarElement.id = "bottonToolBar";
    bottonToolBarElement.classList.add("mm");
    document.querySelector("#panel").prepend(bottonToolBarElement);

    // Next Page
    const nextPageElement = document.createElement("button");
    nextPageElement.id = "next";
    nextPageElement.classList.add("mm");
    nextPageElement.classList.add("button");
    nextPageElement.classList.add("toolBarButtons");
    nextPageElement.textContent = "Next";
    document.querySelector("#bottonToolBar").prepend(nextPageElement);
    //Page Viewer
    pageViewer.id = "pageViewer";
    pageViewer.classList.add("mm");
    pageViewer.classList.add("toolBarButtons");
    pageViewer.textContent = "Page 0";
    document.querySelector("#bottonToolBar").prepend(pageViewer);
    //Chapter Select
    const chapterSelect = document.createElement("select");
    chapterSelect.id = "chapter-select";
    chapterSelect.classList.add("mm");
    document.querySelector("#bottonToolBar").prepend(chapterSelect);
    //Chapter Viewer
    chapterView.id = "chapterViewer";
    chapterView.classList.add("mm");
    chapterView.classList.add("toolBarButtons");
    chapterView.textContent = "Chapter 0";
    document.querySelector("#bottonToolBar").prepend(chapterView);
    // Previous Page
    const previousPageElement = document.createElement("button");
    previousPageElement.id = "previous";
    previousPageElement.classList.add("mm");
    previousPageElement.classList.add("button");
    previousPageElement.classList.add("toolBarButtons");
    previousPageElement.textContent = "Previous";
    document.querySelector("#bottonToolBar").prepend(previousPageElement);
  }

  function read() {
    if (!hasMangaAlreadyBeenOpened) {
      openManga();
    }
    if (panelElement.classList.contains("hidden")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
    panelElement.classList.toggle("hidden");
    hasMangaAlreadyBeenOpened = true;
  }

  function openManga() {
    let intervalID;

    video = document.querySelector("video");
    if (!video) {
      console.log("VIDEO NÃO ENCONTRADO NESSA PÁGINA.");
      return;
    }

    const config = getConfig();

    loadChapterToSelect(config.chapters);

    currentPage = Math.floor((video.getCurrentTime() - 1 / (FPS * 2)) * FPS);
    video.currentTime = (1 / FPS) * currentPage + 1 / (FPS * 2);

    document.querySelector("#chapter-select").addEventListener("change", selectedChapter);
    video.addEventListener("play", play);
    video.addEventListener("pause", pause);
    video.addEventListener("seeked", seeked);
    document.querySelector("#next").addEventListener("click", nextPage);
    document.querySelector("#previous").addEventListener("click", previousPage);

    let cHeigth = video.clientHeight;
    let cWidth = video.clientWidth;
    let vHeigth = video.videoHeight;
    let vWidth = video.videoWidth;

    const canvas = GetCanvas("canvas");
    const ctx = canvas.getContext("2d");

    pause();

    function GetCanvas(id) {
      const canvas = document.createElement("canvas");
      canvas.id = id;
      var body = document.body,
        html = document.documentElement;

      var Width = Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      );
      canvas.height = Width * PAGE_SCALE;
      canvas.width = (cWidth / cHeigth) * canvas.height;
      canvas.style.left = `calc(50% - ${canvas.width / 2}px)`;
      canvas.style.top = `calc((${canvas.width}px - ${canvas.height}px) / 2)`;
      panelElement.appendChild(canvas);
      return canvas;
    }

    function play() {
      console.log("Play");
      resizeCanvas();
      video.play();
      intervalID = setInterval(update, 1000 / 60.0);
    }

    function pause() {
      console.log("Pause");
      video.pause();

      resizeCanvas();
      DrawCanvas();

      clearInterval(intervalID);
    }

    function nextPage() {
      currentPage = Math.floor((video.getCurrentTime() - 1 / (FPS * 2)) * FPS);
      console.log(`Move to page: ${currentPage + 1}`);
      video.currentTime = (1 / FPS) * (currentPage + 1) + 1 / (FPS * 2);
      currentPage = Math.min(
        Math.floor(video.getDuration() * FPS) - 1,
        Math.floor((video.getCurrentTime() - 1 / (FPS * 2)) * FPS)
      );
      DrawCanvas();
    }

    function previousPage() {
      currentPage = Math.floor((video.getCurrentTime() - 1 / (FPS * 2)) * FPS);
      console.log(`Move to page: ${currentPage + 1}`);
      video.currentTime = (1 / FPS) * (currentPage - 1) + 1 / (FPS * 2);
      currentPage = Math.max(
        0,
        Math.floor((video.getCurrentTime() - 1 / (FPS * 2)) * FPS)
      );
      DrawCanvas();
    }

    function seeked() {
      currentPage = getCurrentPage();
      pageViewer.textContent = `Page ${currentPage}`;
      currentChapter = getCurrentChapter();
      chapterView.textContent = `Chapter ${currentChapter + 1}`;
      DrawCanvas();
    }

    function getCurrentPage() {
      var page = Math.floor((video.getCurrentTime() - 1 / (FPS * 2)) * FPS);
      page = Math.max(0, page);
      page = Math.min(Math.floor(video.getDuration() * FPS) - 1, page);
      return page;
    }

    function getCurrentChapter() {
      if (config.chapters) {
        let sum = 0;
        for (let index = 1; index < config.chapters.length; index++) {
          if (currentPage > sum && currentPage < sum + config.chapters[index]) {
            return index - 1;
          }
          sum += config.chapters[index];
        }
      }
      return 0;
    }

    function resizeCanvas() {
      var body = document.body,
        html = document.documentElement;

      var Width = Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      );
      canvas.height = Width * PAGE_SCALE;
      canvas.width = (cWidth / cHeigth) * canvas.height;
      canvas.style.left = `calc(50% - ${canvas.width / 2}px)`;
      canvas.style.top = `calc((${canvas.width}px - ${canvas.height}px) / 2)`;
    }

    function DrawCanvas() {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    function update() {
      if (!(video.paused | video.ended)) {
        DrawCanvas();
        currentPage = getCurrentPage();
        pageViewer.textContent = `Page ${currentPage}`;
        currentChapter = getCurrentChapter();
        chapterView.textContent = `Chapter ${currentChapter + 1}`;
      }
    }

    function getConfig() {
      const description = document.querySelector("#description").textContent;
      if (!description) return "";
      const c = description.split("[[[")[1].split("]]]")[0];
      try {
        return JSON.parse(c);
      } catch (error) {
        console.log(
          "ERROR: Informações de configuração não encontradas na descrição."
        );
        return "";
      }
    }

    function loadChapterToSelect(chapters){
      if(!chapters || !chapters.length) return
      let select = document.querySelector("#chapter-select")
      chapters.forEach((chapter, index) => {
        let option = document.createElement("option")
        option.value = index
        option.text = index + 1
        select.appendChild(option)
      });

    }
    function selectedChapter(){
      let select = document.querySelector("#chapter-select")
      currentPage = chapterToPage(select.value)
      video.currentTime = (1 / FPS) * (currentPage - 1) + 1 / (FPS * 2);
      console.log(select.value)
    }
    function chapterToPage(chapter){
      let sum = 0
      for (let index = 1; index < chapter; index++) {
        sum += config.chapters[index];
      }
      return sum
    }

  }
  

  
};
