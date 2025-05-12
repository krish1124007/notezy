document.addEventListener("DOMContentLoaded", function () {
  const pages = document.querySelectorAll(".page");
  const pageTabs = document.querySelectorAll(".page-tab");
  const fontSizeSelect = document.querySelector(".font-size-select");
  const fontFamilySelect = document.querySelector(".font-family-select");
  const colorOptions = document.querySelectorAll(".color-option");
  const bgcolour = document.getElementById("bgcolor");
  const bgcolours = document.getElementById("bgcolours");
  let activePage = document.querySelector(".page.active-page");
  const pagewidthinput = document.getElementById("widthinput");
  const pageheightinput = document.getElementById("heightinput");

  activePage.style.width = `${pagewidthinput.value}mm`;
  activePage.style.height = `${pageheightinput.value}mm`;

  pagewidthinput.addEventListener("input", function () {
    document.querySelectorAll(".page").forEach(page => {
      page.style.width = `${pagewidthinput.value}mm`;
    });
  });

  pageheightinput.addEventListener("input", function () {
    document.querySelectorAll(".page").forEach(page => {
      page.style.height = `${pageheightinput.value}mm`;
    });
  });

  const formatState = {
    bold: false,
    italic: false,
    underline: false,
    fontSize: "16px",
    fontFamily: "Arial",
    textColor: "#000000",
    bgColor: ""
  };

  pageTabs.forEach(tab => {
    pageChange(tab);
  });

  document.querySelectorAll(".tool-btn").forEach(button => {
    button.addEventListener("click", () => {
      const tool = button.dataset.tool;
      switch (tool) {
        case "bold":
        case "italic":
        case "underline":
          formatState[tool] = !formatState[tool];
          break;
        case "link":
          const url = prompt("Enter URL:");
          if (url) document.execCommand("createLink", false, url);
          break;
        case "addpage":
          const newPage = document.createElement("div");
          newPage.className = "page";
          newPage.contentEditable = true;
          newPage.style.width = `${pagewidthinput.value}mm`;
          newPage.style.height = `${pageheightinput.value}mm`;
          newPage.dataset.page = pages.length + 1;
          newPage.style.display = "none";
          document.getElementById("window").appendChild(newPage);

          const newTab = document.createElement("div");
          newTab.className = "page-tab";
          newTab.dataset.page = pages.length + 1;
          newTab.innerHTML = `<i class='fa-solid fa-file'></i>`;
          pageChange(newTab);
          document.getElementById("pages").appendChild(newTab);

          newTab.addEventListener("click", () => newTab.click());
          break;

        case "table":
          createTable();
          break;

        case "save":
  const filename = document.getElementById("filename").value || "untitled";
  const { jsPDF } = window.jspdf;

  // Show loading spinner
  document.getElementById("loading-spinner").style.display = "flex";

  const allPages = document.querySelectorAll(".page");
  const pageWidth = parseInt(pagewidthinput.value);
  const pageHeight = parseInt(pageheightinput.value);

  const pdf = new jsPDF({
    unit: 'mm',
    format: [pageWidth, pageHeight],
    orientation: 'portrait'
  });

  const addPagesToPDF = async () => {
    for (let i = 0; i < allPages.length; i++) {
      const page = allPages[i];

      await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const mmCanvasWidth = (canvasWidth * 0.264583); // px to mm
        const mmCanvasHeight = (canvasHeight * 0.264583); // px to mm

        const ratio = Math.min(
          pageWidth / mmCanvasWidth,
          pageHeight / mmCanvasHeight
        );

        const imgWidth = mmCanvasWidth * ratio;
        const imgHeight = mmCanvasHeight * ratio;

        const posX = (pageWidth - imgWidth) / 2;
        const posY = (pageHeight - imgHeight) / 2;

        if (i !== 0) {
          pdf.addPage([pageWidth, pageHeight]);
        }

        pdf.addImage(imgData, 'PNG', posX, posY, imgWidth, imgHeight);
      }).catch(err => {
        console.error("Canvas rendering failed:", err);
      });
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`);

    // Hide loading spinner after saving
    document.getElementById("loading-spinner").style.display = "none";
  };

  addPagesToPDF();
  break;



      }
    });
  });

  fontSizeSelect.addEventListener("change", () => {
    formatState.fontSize = fontSizeSelect.value;
  });

  fontFamilySelect.addEventListener("change", () => {
    formatState.fontFamily = fontFamilySelect.value;
  });

  colorOptions.forEach(option => {
    option.addEventListener("click", () => {
      const parentTool = option.closest(".dropdown-content").previousElementSibling.dataset.tool;
      if (parentTool === "textcolor") {
        formatState.textColor = option.dataset.color;
      } else if (parentTool === "bgcolor") {
        formatState.bgColor = option.dataset.color;
      }
    });
  });

  function attachInputListener(page) {
    page.addEventListener("input", handleAutoFormatInput);
  }

  function handleAutoFormatInput(e) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    if (range.startContainer.nodeType !== 3) return;

    const insertedChar = e.data;
    if (!insertedChar || insertedChar.trim() === '') return;

    const offset = range.startOffset;
    const span = document.createElement("span");

    if (formatState.bold) span.style.fontWeight = "bold";
    if (formatState.italic) span.style.fontStyle = "italic";
    if (formatState.underline) span.style.textDecoration = "underline";
    if (formatState.fontSize) span.style.fontSize = formatState.fontSize;
    if (formatState.fontFamily) span.style.fontFamily = formatState.fontFamily;
    if (formatState.textColor) span.style.color = formatState.textColor;
    if (formatState.bgColor) span.style.backgroundColor = formatState.bgColor;

    span.textContent = insertedChar;

    range.setStart(range.startContainer, offset - 1);
    range.deleteContents();
    range.insertNode(span);
    range.setStartAfter(span);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function createTable() {
    const rows = parseInt(prompt("Enter number of rows:"));
    const cols = parseInt(prompt("Enter number of columns:"));

    if (rows > 0 && cols > 0) {
      const table = document.createElement("table");
      table.style.border = "1px solid black";
      table.style.borderCollapse = "collapse";
      table.style.position = "absolute";
      table.style.touchAction = "none";
      table.style.backgroundColor = "white";
      table.id = `myTable${Math.floor(Math.random() * 1000)}`;

      for (let i = 0; i < rows; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
          const td = document.createElement("td");
          td.textContent = "test";
          td.contentEditable = true;
          td.style.border = "1px solid black";
          td.style.padding = "8px";
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }

      activePage.appendChild(table);

      requestAnimationFrame(() => {
        const tableWidth = table.offsetWidth;
        const tableHeight = table.offsetHeight;
        const parentWidth = activePage.offsetWidth;
        const parentHeight = activePage.offsetHeight;

        let posX = (parentWidth - tableWidth) / 2;
        let posY = (parentHeight - tableHeight) / 2;

        table.style.left = posX + "px";
        table.style.top = posY + "px";

        const hammer = new Hammer(table);
        hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });

        hammer.on("panmove", function (ev) {
          table.style.left = posX + ev.deltaX + "px";
          table.style.top = posY + ev.deltaY + "px";
        });

        hammer.on("panend", function (ev) {
          posX += ev.deltaX;
          posY += ev.deltaY;
        });
      });
    }
  }

  function pageChange(tab) {
    tab.addEventListener("click", () => {
      document.querySelector(".page-tab.active")?.classList.remove("active");
      tab.classList.add("active");
      const pageNum = tab.dataset.page;

      pages.forEach(page => {
        page.classList.remove("active-page");
        page.style.display = "none";
      });
      const active = document.querySelector(`.page[data-page='${pageNum}']`);
      active.classList.add("active-page");
      active.style.display = "block";
      activePage = active;
      attachInputListener(activePage);
    });
  }

  attachInputListener(activePage);
});

