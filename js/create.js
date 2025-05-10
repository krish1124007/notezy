
  const canvas = document.getElementById('tutorial');
  const ctx = canvas.getContext('2d');

  let isTyping = false;
  let currentLines = [''];
  let cursorX = 0;
  let cursorY = 0;
  let showCursor = true;
  const texts = [];
  let canvasBgColor = '#ffffff';
  let editingIndex = -1;

  const fontSizeInput = document.getElementById('fontSize');
  const fontFamilyInput = document.getElementById('fontFamily');
  const fontColorInput = document.getElementById('fontColor');
  const paddingInput = document.getElementById('padding');
  const headingCheckbox = document.getElementById('isHeading');
  const bgColorInput = document.getElementById('bgColor');
  const clearBtn = document.getElementById('clearBtn');

  setInterval(() => {
    if (isTyping) {
      showCursor = !showCursor;
      drawAll();
    }
  }, 500);

  bgColorInput.addEventListener('input', (e) => {
    canvasBgColor = e.target.value;
    drawAll();
  });

  clearBtn.addEventListener('click', () => {
    texts.length = 0;
    drawAll();
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked on existing text
    const clicked = texts.findIndex(t => {
      const width = ctx.measureText(t.text).width;
      const height = t.fontSize;
      return (
        clickX >= t.x &&
        clickX <= t.x + width + 10 &&
        clickY >= t.y - height &&
        clickY <= t.y
      );
    });

    if (clicked !== -1) {
      // Edit existing text
      const t = texts[clicked];
      editingIndex = clicked;
      currentLines = [t.text];
      cursorX = t.x;
      cursorY = t.y - t.fontSize + t.padding;
      isTyping = true;
      showCursor = true;
    } else {
      // Save current first
      if (isTyping && currentLines.some(line => line.trim() !== '')) {
        saveCurrentText();
      }

      // Start new
      editingIndex = -1;
      cursorX = clickX;
      cursorY = clickY;
      currentLines = [''];
      isTyping = true;
      showCursor = true;
    }

    drawAll();
  });

  document.addEventListener('keydown', (e) => {
    if (!isTyping) return;

    if (e.key === 'Escape') {
      isTyping = false;
      currentLines = [''];
      editingIndex = -1;
    } else if (e.key === 'Backspace') {
      let lastLine = currentLines[currentLines.length - 1];
      if (lastLine.length > 0) {
        currentLines[currentLines.length - 1] = lastLine.slice(0, -1);
      } else if (currentLines.length > 1) {
        currentLines.pop();
      }
    } else if (e.key === 'Enter') {
      currentLines.push('');
    } else if (e.key.length === 1) {
      currentLines[currentLines.length - 1] += e.key;
    }

    drawAll();
  });

  function saveCurrentText() {
    if (currentLines.every(line => line.trim() === '')) {
      if (editingIndex !== -1) {
        texts.splice(editingIndex, 1);
      }
      isTyping = false;
      currentLines = [''];
      editingIndex = -1;
      return;
    }

    const fontSize = headingCheckbox.checked
      ? Math.min(parseInt(fontSizeInput.value) * 1.5, 72)
      : parseInt(fontSizeInput.value);

    if (editingIndex !== -1) {
      // Replace the old line
      const t = texts[editingIndex];
      t.text = currentLines[0];
      t.fontSize = fontSize;
      t.fontFamily = fontFamilyInput.value;
      t.color = fontColorInput.value;
      t.padding = parseInt(paddingInput.value);
      t.isHeading = headingCheckbox.checked;
    } else {
      currentLines.forEach((line, i) => {
        if (line.trim() === '') return;

        texts.push({
          text: line,
          x: cursorX,
          y: cursorY + i * (fontSize + 10),
          fontSize,
          fontFamily: fontFamilyInput.value,
          color: fontColorInput.value,
          padding: parseInt(paddingInput.value),
          isHeading: headingCheckbox.checked
        });
      });
    }

    isTyping = false;
    currentLines = [''];
    editingIndex = -1;
  }

  function drawAll() {
    ctx.fillStyle = canvasBgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    texts.forEach(t => {
      ctx.font = `${t.fontSize}px ${t.fontFamily}`;
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x + t.padding, t.y + t.padding);

      if (t.isHeading) {
        const textWidth = ctx.measureText(t.text).width;
        ctx.strokeStyle = t.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(t.x + t.padding, t.y + t.padding + 5);
        ctx.lineTo(t.x + t.padding + textWidth, t.y + t.padding + 5);
        ctx.stroke();
      }
    });

    if (isTyping) {
      const fontSize = headingCheckbox.checked
        ? Math.min(parseInt(fontSizeInput.value) * 1.5, 72)
        : parseInt(fontSizeInput.value);
      const fontFamily = fontFamilyInput.value;
      const color = fontColorInput.value;
      const padding = parseInt(paddingInput.value);

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;

      currentLines.forEach((line, i) => {
        const y = cursorY + i * (fontSize + 10) + padding;
        ctx.fillText(line, cursorX + padding, y);
      });

      if (showCursor) {
        const currentLine = currentLines[currentLines.length - 1];
        const cursorWidth = ctx.measureText(currentLine).width;
        const y = cursorY + (currentLines.length - 1) * (fontSize + 10) + padding;

        ctx.beginPath();
        ctx.moveTo(cursorX + cursorWidth + 2 + padding, y - fontSize * 0.8);
        ctx.lineTo(cursorX + cursorWidth + 2 + padding, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }

  drawAll();
