// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {

  const qrText = document.getElementById("qrtext");
  const generateBtn = document.getElementById("generateBtn");
  const qrCodeContainer = document.getElementById("qrCode");
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn = document.getElementById("shareBtn");
  const saveHistoryBtn = document.getElementById("saveHistoryBtn");

  // Customization controls
  const qrColor = document.getElementById("qrColor");
  const bgColor = document.getElementById("bgColor");
  const qrSize = document.getElementById("qrSize");
  const errorLevel = document.getElementById("errorLevel");
  const darkModeToggle = document.getElementById("darkModeToggle");

  let qrCanvas; // Store the generated QR canvas

  // === Dark Mode Toggle ===
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      darkModeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
      localStorage.setItem("darkMode", isDark);
      showToast(isDark ? "🌙 Dark mode enabled" : "☀️ Light mode enabled", "info");
    });

    // Load dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
      darkModeToggle.textContent = "☀️ Light Mode";
    }
  }

  // === Toast Notification ===
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Generate QR code
  generateBtn.addEventListener("click", () => {
    const text = qrText.value.trim();
    if (!text) {
      showToast("⚠️ Please enter text to generate QR code", "error");
      return;
    }
    qrCodeContainer.innerHTML = ""; // Clear previous QR code

    const options = {
      width: parseInt(qrSize.value),
      margin: 2,
      color: {
        dark: qrColor.value,
        light: bgColor.value
      },
      errorCorrectionLevel: errorLevel.value
    };

    QRCode.toCanvas(text, options, (err, canvas) => {
      if (err) {
        console.error(err);
        showToast("❌ Failed to generate QR code", "error");
        return;
      }
      qrCanvas = canvas;
      qrCodeContainer.appendChild(canvas);
      showToast("✅ QR Code generated successfully!", "success");
    });
  });

  // Download QR code
  downloadBtn.addEventListener("click", () => {
    if (!qrCanvas) {
      showToast("⚠️ Generate QR code first!", "error");
      return;
    }

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrCanvas.toDataURL("image/png");
    link.click();
    showToast("📥 QR Code downloaded!", "success");
  });

  // Share QR code (if supported)
  shareBtn.addEventListener("click", async () => {
    if (!qrCanvas) {
      showToast("⚠️ Generate QR code first!", "error");
      return;
    }

    try {
      const blob = await new Promise(resolve => qrCanvas.toBlob(resolve));
      const file = new File([blob], "qrcode.png", { type: "image/png" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "QR Code",
            text: "Here is your QR code",
          });
          showToast("✅ Shared successfully!", "success");
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error("Share failed:", err);
            const link = document.createElement("a");
            link.download = "qrcode.png";
            link.href = qrCanvas.toDataURL("image/png");
            link.click();
            showToast("📋 Sharing failed. QR code downloaded instead!", "info");
          }
        }
      } else {
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = qrCanvas.toDataURL("image/png");
        link.click();
        showToast("📋 Sharing not supported. QR code downloaded instead!", "info");
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("❌ An error occurred. Please try downloading instead.", "error");
    }
  });

  // === Save to History ===
  saveHistoryBtn.addEventListener("click", () => {
    if (!qrCanvas) {
      showToast("⚠️ Generate QR code first!", "error");
      return;
    }

    const text = qrText.value.trim();
    const imageData = qrCanvas.toDataURL("image/png");

    // Get existing history
    let history = JSON.parse(localStorage.getItem("qrHistory") || "[]");

    // Add new entry
    history.unshift({
      text: text,
      image: imageData,
      timestamp: new Date().toISOString(),
      color: qrColor.value,
      bgColor: bgColor.value,
      size: qrSize.value
    });

    // Keep only last 10 items
    history = history.slice(0, 10);

    // Save to localStorage
    localStorage.setItem("qrHistory", JSON.stringify(history));

    showToast("💾 Saved to history! (" + history.length + " items)", "success");
  });

  // === View History Button (if you want to add it) ===
  // You can add a button to view history
  function viewHistory() {
    const history = JSON.parse(localStorage.getItem("qrHistory") || "[]");

    if (history.length === 0) {
      showToast("📭 No history yet!", "info");
      return;
    }

    console.log("QR Code History:", history);
    showToast(`📜 You have ${history.length} saved QR codes. Check browser console (F12) to view.`, "info");
  }

  // Add keyboard shortcut to view history (Ctrl+H)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'h') {
      e.preventDefault();
      viewHistory();
    }
  });

}); // End of DOMContentLoaded
