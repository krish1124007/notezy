// === Active Style Tracking ===
const activeStyles = {
  bold: false,
  italic: false,
  underline: false,
  color: null,
  bgcolor: null,
  fontSize: null,
  fontFamily: null
};

// === Style Wrapping Function ===
function applyStyle(tagName, style = null) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const wrapper = document.createElement(tagName);
  if (style) Object.assign(wrapper.style, style);

  try {
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);

    // Reset cursor
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(wrapper);
    newRange.collapse(true);
    selection.addRange(newRange);
  } catch (e) {
    console.warn("Error wrapping:", e);
  }
}

function wrapWithSpanStyle(styleObj) {
  applyStyle("span", styleObj);
}

function insertLink(url) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";

  try {
    a.appendChild(range.extractContents());
    range.insertNode(a);

    // Reset cursor
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(a);
    newRange.collapse(true);
    selection.addRange(newRange);
  } catch (e) {
    console.warn("Link insert failed:", e);
  }
}

// === Event Binding ===
document.addEventListener("DOMContentLoaded", () => {
  // Tool buttons
  document.querySelectorAll(".tool-btn").forEach(button => {
    button.addEventListener("click", () => {
      const tool = button.dataset.tool;
      const selection = window.getSelection();

      switch (tool) {
        case "bold":
          if (selection.isCollapsed) {
            activeStyles.bold = !activeStyles.bold;
            button.classList.toggle("active", activeStyles.bold);
          } else {
            applyStyle("strong");
          }
          break;

        case "italic":
          if (selection.isCollapsed) {
            activeStyles.italic = !activeStyles.italic;
            button.classList.toggle("active", activeStyles.italic);
          } else {
            applyStyle("em");
          }
          break;

        case "underline":
          if (selection.isCollapsed) {
            activeStyles.underline = !activeStyles.underline;
            button.classList.toggle("active", activeStyles.underline);
          } else {
            applyStyle("u");
          }
          break;

        case "fontsize":
          const size = document.querySelector(".font-size-select").value;
          if (selection.isCollapsed) {
            activeStyles.fontSize = size;
          } else {
            wrapWithSpanStyle({ fontSize: size });
          }
          break;

        case "fontfamily":
          const family = document.querySelector(".font-family-select").value;
          if (selection.isCollapsed) {
            activeStyles.fontFamily = family;
          } else {
            wrapWithSpanStyle({ fontFamily: family });
          }
          break;

        case "link":
          const url = prompt("Enter a URL:");
          if (url) insertLink(url);
          break;

        case "addpage":
          addNewPage();
          break;

        case "save":
          savePdf()
          break;
      }
    });
  });

  // Font size dropdown
  document.querySelector(".font-size-select").addEventListener("change", (e) => {
    const size = e.target.value;
    activeStyles.fontSize = size;

    const selection = window.getSelection();
    if (!selection.isCollapsed) {
      wrapWithSpanStyle({ fontSize: size });
    }
  });

  // Font family dropdown
  document.querySelector(".font-family-select").addEventListener("change", (e) => {
    const family = e.target.value;
    activeStyles.fontFamily = family;

    const selection = window.getSelection();
    if (!selection.isCollapsed) {
      wrapWithSpanStyle({ fontFamily: family });
    }
  });

  // Color Pickers
  document.querySelectorAll('.color-option').forEach(opt => {
    opt.addEventListener("click", () => {
      const tool = opt.closest(".dropdown").querySelector("button").dataset.tool;
      const color = opt.dataset.color;
      const selection = window.getSelection();

      if (tool === "textcolor") {
        activeStyles.color = color;
        if (!selection.isCollapsed) {
          wrapWithSpanStyle({ color: color });
        }
      } else if (tool === "bgcolor") {
        activeStyles.bgcolor = color;
        if (!selection.isCollapsed) {
          wrapWithSpanStyle({ backgroundColor: color });
        }
      }
    });
  });

  // Typing Handler
  document.querySelectorAll(".page").forEach(page => {
    page.addEventListener("beforeinput", (e) => {
      if (e.inputType === "insertText" && e.data && hasActiveStyles()) {
        e.preventDefault();

        const span = document.createElement("span");
        if (activeStyles.bold) span.style.fontWeight = "bold";
        if (activeStyles.italic) span.style.fontStyle = "italic";
        if (activeStyles.underline) span.style.textDecoration = "underline";
        if (activeStyles.color) span.style.color = activeStyles.color;
        if (activeStyles.bgcolor) span.style.backgroundColor = activeStyles.bgcolor;
        if (activeStyles.fontSize) span.style.fontSize = activeStyles.fontSize;
        if (activeStyles.fontFamily) span.style.fontFamily = activeStyles.fontFamily;
        span.textContent = e.data;

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.insertNode(span);

        range.setStartAfter(span);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  });

  // Page Switching
  document.querySelectorAll(".page-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const pageNum = tab.dataset.page;

      document.querySelectorAll(".page-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".page").forEach(page => {
        if (page.dataset.page === pageNum) {
          page.classList.add("active-page");
          page.style.display = "block";
        } else {
          page.classList.remove("active-page");
          page.style.display = "none";
        }
      });
    });
  });
});

function hasActiveStyles() {
  return activeStyles.bold || activeStyles.italic || activeStyles.underline || activeStyles.color || activeStyles.bgcolor || activeStyles.fontSize || activeStyles.fontFamily;
}

function addNewPage() {
  alert("Add Page feature coming soon!");
}

function savePdf()
{
    const trial = document.getElementById('trial')
    const filename = document.getElementById('filename').value
    html2pdf(trial).save(filename)
}

// document.getElementById('savepdf').addEventListener('click' ,savePdf)