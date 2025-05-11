document.addEventListener("DOMContentLoaded", () => {

  // 🧠 Helper to apply style command
  function applyStyle(command, value = null) {
    document.execCommand(command, false, value);
  }

  // 🅰️ Toolbar Actions
  document.querySelectorAll(".tool-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const tool = button.getAttribute("data-tool");

      switch (tool) {
        case "bold":
        case "italic":
        case "underline":
          applyStyle(tool);
          break;

        case "link":
          const url = prompt("Enter the URL:");
          if (url) applyStyle("createLink", url);
          break;

        case "addpage":
          addNewPage();
          break;

        case "bgcolor":
        case "textcolor":
          // Handled by color pickers below
          break;

        case "save":
          e.preventDefault();
          e.stopPropagation();
          savePdf();
          break;
      }
    });
  });

  // 🅱️ Font Size & Font Family
  document.querySelector(".font-size-select").addEventListener("change", (e) => {
    const size = e.target.value;
    document.execCommand("fontSize", false, "7"); // Use 7 as placeholder
    const fontElements = document.getElementsByTagName("font");
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === "7") {
        fontElements[i].removeAttribute("size");
        fontElements[i].style.fontSize = size;
      }
    }
  });

  document.querySelector(".font-family-select").addEventListener("change", (e) => {
    const font = e.target.value;
    applyStyle("fontName", font);
  });

  // 🎨 Color Pickers
  document.querySelectorAll(".color-option").forEach(colorDiv => {
    colorDiv.addEventListener("click", () => {
      const color = colorDiv.getAttribute("data-color");
      const parent = colorDiv.closest(".dropdown-content");
      const toolType = parent.previousElementSibling.getAttribute("data-tool");

      if (toolType === "bgcolor") {
        applyStyle("backColor", color);
      } else if (toolType === "textcolor") {
        applyStyle("foreColor", color);
      }
    });
  });

  // 📄 Dropper Menu Actions
  document.querySelectorAll(".drop-option").forEach(option => {
    option.addEventListener("click", (e) => {
      const action = e.target.getAttribute("data-option");

      switch (action) {
        case "save":
          e.preventDefault();
          e.stopPropagation();
          savePdf();
          break;

        case "new":
          document.querySelector(".page.active-page").innerHTML = "";
          break;

        case "import":
          alert("Import functionality coming soon.");
          break;

        case "export":
          alert("Export functionality coming soon.");
          break;
      }
    });
  });

  // 📚 Page Tab Switcher
  document.querySelectorAll(".page-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const pageNum = tab.getAttribute("data-page");

      document.querySelectorAll(".page-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
      document.querySelectorAll(".page").forEach(p => p.style.display = "none");

      tab.classList.add("active");
      const activePage = document.querySelector(`.page[data-page="${pageNum}"]`);
      activePage.classList.add("active-page");
      activePage.style.display = "block";
    });
  });

  // ➕ Add Page
  function addNewPage() {
    const pagesContainer = document.getElementById("pages");
    const windowContainer = document.getElementById("window");
    const newPageNum = document.querySelectorAll(".page").length + 1;

    const newTab = document.createElement("div");
    newTab.classList.add("page-tab");
    newTab.setAttribute("data-page", newPageNum);
    newTab.innerHTML = `<i class="fas fa-file-alt"></i>`;
    pagesContainer.appendChild(newTab);

    const newPage = document.createElement("div");
    newPage.classList.add("page");
    newPage.setAttribute("contenteditable", "true");
    newPage.setAttribute("data-page", newPageNum);
    newPage.style.display = "none";
    newPage.innerHTML = `<h2>Page ${newPageNum}</h2><p>Start writing here...</p>`;
    windowContainer.appendChild(newPage);

    newTab.addEventListener("click", () => {
      document.querySelectorAll(".page-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active-page");
        p.style.display = "none";
      });

      newTab.classList.add("active");
      newPage.classList.add("active-page");
      newPage.style.display = "block";
    });
  }

  // 💾 Save PDF Function
  let isSaving = false;
  function savePdf() {
    if (isSaving) return;
    isSaving = true;

    const activePage = document.querySelector(".page.active-page");
    const filename = document.getElementById("filename").value || "untitled";

    const opt = {
      margin: 0.5,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(activePage).save().then(() => {
      isSaving = false;
    }).catch(err => {
      console.error("PDF Save Failed:", err);
      isSaving = false;
    });
  }

});
