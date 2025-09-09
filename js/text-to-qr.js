const qrText = document.getElementById("qrtext");
const generateBtn = document.getElementById("generateBtn");
const qrCodeContainer = document.getElementById("qrCode");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");

let qrCanvas; // Store the generated QR canvas

// Generate QR code
generateBtn.addEventListener("click", () => {
  const text = qrText.value.trim();
  if (!text) {
    alert("Please enter text to generate QR code");
    return;
  }
  qrCodeContainer.innerHTML = ""; // Clear previous QR code

  QRCode.toCanvas(text, { width: 200, margin: 2 }, (err, canvas) => {
    if (err) console.error(err);
    qrCanvas = canvas;
    qrCodeContainer.appendChild(canvas);
  });
});

// Download QR code
downloadBtn.addEventListener("click", () => {
  if (!qrCanvas) return alert("Generate QR code first!");

  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = qrCanvas.toDataURL("image/png");
  link.click();
});

// Share QR code (if supported)
shareBtn.addEventListener("click", async () => {
  if (!qrCanvas) return alert("Generate QR code first!");

  const blob = await new Promise(resolve => qrCanvas.toBlob(resolve));
  const file = new File([blob], "qrcode.png", { type: "image/png" });

  if (navigator.share) {
    navigator.share({
      files: [file],
      title: "QR Code",
      text: "Here is your QR code",
    }).catch(err => console.log("Share cancelled", err));
  } else {
    alert("Sharing not supported on this browser.");
  }
});
