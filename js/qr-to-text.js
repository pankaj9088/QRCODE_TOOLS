// Wait for DOM and libraries to load
document.addEventListener('DOMContentLoaded', function () {

  // === Elements ===
  const uploadInput = document.getElementById("uploadInput");
  const uploadBtn = document.getElementById("uploadBtn");
  const cameraBtn = document.getElementById("cameraBtn");
  const cameraContainer = document.getElementById("cameraContainer");
  const closeCameraBtn = document.getElementById("closeCameraBtn");
  const extractedText = document.getElementById("extractedText");
  const copyBtn = document.getElementById("copyBtn");
  const shareBtn = document.getElementById("shareBtn");
  const saveHistoryBtn = document.getElementById("saveHistoryBtn");
  const darkModeToggle = document.getElementById("darkModeToggle");

  let html5QrCode;

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
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

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

  // === Upload QR Code Image ===
  uploadBtn.addEventListener("click", () => uploadInput.click());

  uploadInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showToast("Processing image...", "info");

    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.src = reader.result;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          extractedText.textContent = code.data;
          showToast("✅ QR Code scanned successfully!", "success");
        } else {
          extractedText.textContent = "❌ No QR code found in image.";
          showToast("❌ No QR code found in image", "error");
        }
      };
    };
    reader.readAsDataURL(file);
  });

  // === Use Camera ===
  cameraBtn.addEventListener("click", async () => {
    try {
      // Show camera container
      cameraContainer.style.display = "block";
      extractedText.textContent = "📷 Opening camera...";

      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported");
      }

      // Check if Html5Qrcode library is loaded
      if (typeof Html5Qrcode === 'undefined') {
        throw new Error("Html5Qrcode library not loaded. Please refresh the page.");
      }

      // Initialize Html5Qrcode if not already done
      if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
      }

      // Start camera with configuration
      await html5QrCode.start(
        { facingMode: "environment" }, // back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          // ✅ Successfully scanned QR code
          extractedText.textContent = decodedText;
          showToast("✅ QR Code scanned successfully!", "success");

          // Stop camera after first successful scan
          html5QrCode.stop().then(() => {
            console.log("✅ Camera stopped after scan.");
            html5QrCode = null;
            cameraContainer.style.display = "none";
          }).catch((err) => {
            console.error("❌ Stop failed after scan: ", err);
            html5QrCode = null;
            cameraContainer.style.display = "none";
          });
        },
        (errorMessage) => {
          // This is called when scanning fails (normal behavior)
          // Don't show error to user, just log it
          // console.log("Scan error: ", errorMessage);
        }
      );

      extractedText.textContent = "📸 Point camera at QR code...";

    } catch (err) {
      console.error("Camera error: ", err);
      cameraContainer.style.display = "none";
      html5QrCode = null;

      // Provide specific error messages
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        extractedText.textContent = "❌ Camera permission denied!\n\nकृपया camera की permission दें।\n\nSettings में जाकर camera access allow करें।";
        showToast("❌ Camera permission denied!", "error");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        extractedText.textContent = "❌ No camera found!\n\nकोई camera नहीं मिला।\n\nकृपया camera connect करें।";
        showToast("❌ No camera found!", "error");
      } else if (err.message && err.message.includes("secure")) {
        extractedText.textContent = "❌ HTTPS required for camera!\n\nCamera के लिए HTTPS या localhost जरूरी है।\n\nकृपया http://localhost:8000 पर खोलें।";
        showToast("❌ HTTPS required for camera!", "error");
      } else if (err.message && err.message.includes("not supported")) {
        extractedText.textContent = "❌ Camera not supported!\n\nआपका browser camera support नहीं करता।\n\nकृपया Chrome या Firefox use करें।";
        showToast("❌ Camera not supported!", "error");
      } else {
        extractedText.textContent = `❌ Camera error!\n\n${err.message || err}\n\nकृपया:\n1. Camera permission check करें\n2. http://localhost:8000 पर खोलें\n3. Chrome/Firefox browser use करें`;
        showToast("❌ Camera error occurred", "error");
      }
    }
  });

  // === Close Camera ===
  closeCameraBtn.addEventListener("click", async () => {
    if (html5QrCode) {
      try {
        // First stop the camera
        await html5QrCode.stop();
        console.log("✅ Camera stopped successfully.");

        // Then clear the instance
        html5QrCode = null;

        // Finally hide the container
        cameraContainer.style.display = "none";

        // Reset the extracted text message
        extractedText.textContent = "No text extracted yet. Please scan a QR code.";
        showToast("📷 Camera closed", "info");

      } catch (err) {
        console.error("❌ Stop failed: ", err);

        // Even if stop fails, try to clear and hide
        html5QrCode = null;
        cameraContainer.style.display = "none";

        // Show user-friendly error
        extractedText.textContent = "⚠️ Camera closed with error. Please refresh if camera doesn't work next time.";
        showToast("⚠️ Camera closed with error", "error");
      }
    } else {
      // No camera instance, just hide container
      cameraContainer.style.display = "none";
    }
  });

  // === Copy Text ===
  copyBtn.addEventListener("click", () => {
    const text = extractedText.textContent;
    if (
      text &&
      !text.startsWith("No text") &&
      !text.startsWith("❌") &&
      !text.startsWith("⚠") &&
      !text.startsWith("📷") &&
      !text.startsWith("📸")
    ) {
      navigator.clipboard.writeText(text).then(() => {
        showToast("✅ Copied to clipboard!", "success");
      }).catch(() => {
        showToast("❌ Failed to copy!", "error");
      });
    } else {
      showToast("⚠️ No valid text to copy!", "error");
    }
  });

  // === Share Text ===
  shareBtn.addEventListener("click", async () => {
    const text = extractedText.textContent;

    // Check if text is valid
    if (
      !text ||
      text.startsWith("No text") ||
      text.startsWith("❌") ||
      text.startsWith("⚠") ||
      text.startsWith("📷") ||
      text.startsWith("📸")
    ) {
      showToast("⚠️ No valid text to share!", "error");
      return;
    }

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code Text',
          text: text
        });
        showToast("✅ Shared successfully!", "success");
      } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
          console.error("Share failed:", err);
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(text).then(() => {
            showToast("📋 Sharing failed, but text copied to clipboard!", "info");
          }).catch(() => {
            showToast("❌ Sharing not available. Please copy manually.", "error");
          });
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(text).then(() => {
        showToast("📋 Sharing not supported. Text copied to clipboard!", "info");
      }).catch(() => {
        showToast("❌ Sharing not supported. Please copy manually.", "error");
      });
    }
  });

  // === Save to History ===
  if (saveHistoryBtn) {
    saveHistoryBtn.addEventListener("click", () => {
      const text = extractedText.textContent;

      if (
        !text ||
        text.startsWith("No text") ||
        text.startsWith("❌") ||
        text.startsWith("⚠") ||
        text.startsWith("📷") ||
        text.startsWith("📸")
      ) {
        showToast("⚠️ No valid scanned text to save!", "error");
        return;
      }

      // Use a default QR placeholder or generate one if you want (for now, just using a scanner icon placeholder)
      // Since we don't generate the image here, we can use a generic icon or try to create a simple canvas
      // For this implementation, let's use a generic image URL or base64 placeholder for scanned items
      // unless we scanned an image upload, which we don't have easy access to anymore.

      // Let's create a visual placeholder for scanned history
      const placeholderCanvas = document.createElement('canvas');
      placeholderCanvas.width = 100;
      placeholderCanvas.height = 100;
      const ctx = placeholderCanvas.getContext('2d');
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = '#333';
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📷', 50, 50);

      const imageData = placeholderCanvas.toDataURL("image/png");

      // Get existing history
      let history = JSON.parse(localStorage.getItem("qrHistory") || "[]");

      // Add new entry
      history.unshift({
        text: text,
        image: imageData, // Using placeholder for scanned items
        timestamp: new Date().toISOString(),
        size: "Scanned",
        type: "scanned"
      });

      // Keep only last 10 items
      history = history.slice(0, 10);

      // Save to localStorage
      localStorage.setItem("qrHistory", JSON.stringify(history));

      showToast("💾 Saved to history!", "success");
    });
  }

  // View History Shortcut (Ctrl+H)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'h') {
      e.preventDefault();
      window.location.href = "history.html";
    }
  });

}); // End of DOMContentLoaded