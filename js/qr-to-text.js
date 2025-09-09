// === Elements ===
const uploadInput = document.getElementById("uploadInput");
const uploadBtn = document.getElementById("uploadBtn");
const cameraBtn = document.getElementById("cameraBtn");
const cameraContainer = document.getElementById("cameraContainer");
const closeCameraBtn = document.getElementById("closeCameraBtn");
const extractedText = document.getElementById("extractedText");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");

let html5QrCode;

// === Upload QR Code Image ===
uploadBtn.addEventListener("click", () => uploadInput.click());

uploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

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
      } else {
        extractedText.textContent = "❌ No QR code found in image.";
      }
    };
  };
  reader.readAsDataURL(file);
});

// === Use Camera ===
cameraBtn.addEventListener("click", () => {
  cameraContainer.style.display = "block";
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("reader");
  }

  html5QrCode.start(
    { facingMode: "environment" }, // back camera
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (decodedText) => {
      extractedText.textContent = decodedText;

      // ✅ Stop camera after first successful scan
      html5QrCode.stop().then(() => {
        cameraContainer.style.display = "none";
        html5QrCode = null;
      }).catch((err) => console.error("Stop failed: ", err));
    },
    (decodedResult) => {
      console.log("Decoded but not useful: ", decodedResult);
    }
  ).catch((err) => {
    console.error("Camera error: ", err);
    extractedText.textContent = "⚠ Camera not accessible. Please allow permissions.";
    html5QrCode = null;
  });
});

// === Close Camera ===
closeCameraBtn.addEventListener("click", () => {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      console.log("Camera stopped.");
    }).catch((err) => console.error("Stop failed: ", err));
    html5QrCode = null;
  }
  cameraContainer.style.display = "none";
});
// === Copy Text ===
copyBtn.addEventListener("click", () => {
  const text = extractedText.textContent;
  if (
    text &&
    !text.startsWith("No text") &&
    !text.startsWith("❌") &&
    !text.startsWith("⚠")
  ) {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }
});

// === Share Text ===
shareBtn.addEventListener("click", async () => {
  const text = extractedText.textContent;
  if (
    navigator.share &&
    text &&
    !text.startsWith("No text") &&
    !text.startsWith("❌") &&
    !text.startsWith("⚠")
  ) {
    await navigator.share({ text });
  } else {
    alert("Sharing not supported.");
  }
});

// === Close Camera ===
closeCameraBtn.addEventListener("click", () => {
  if (html5QrCode) {
    html5QrCode.stop().catch(() => {});
    html5QrCode = null;
  }
  cameraContainer.style.display = "none";
});