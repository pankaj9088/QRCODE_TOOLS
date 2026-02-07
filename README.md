# 📱 Ultimate QR Code Tools

A powerful and modern web application for generating, customizing, and scanning QR codes. Packed with advanced features, dark mode, and history management.

![QR Code Tools Banner](https://via.placeholder.com/800x200?text=Ultimate+QR+Code+Tools)

## ✨ Awesome Features

### 🎨 Advanced QR Generator (Text to QR)
- **Customization**: 
  - 🌈 **Color Picker**: Choose custom foreground and background colors
  - 📏 **Size Options**: Select from Small (200px) to Extra Large (500px)
  - 🛡️ **Quality Levels**: Adjust error correction (Low, Medium, High, Very High)
- **Dark Mode**: sleek dark theme for comfortable viewing at night
- **History**: Automatically saves your generated QR codes
- **Actions**: Download as PNG or Share instantly

### 📷 Smart QR Scanner (QR to Text)
- **Dual Mode Scanning**: 
  - 📂 **Upload Image**: Extract text from QR code images
  - 🎥 **Live Camera**: Scan QR codes in real-time using your device camera
- **Smart Features**:
  - 🔦 **Auto-Stop**: Camera stops automatically after successful scan
  - 💾 **Save to History**: Save scanned results for later
  - 📋 **Copy & Share**: One-click copy to clipboard or share with other apps
- **Full Dark Mode Support**: Consistent theme across the app

### 📜 History Manager
- **Dedicated History Page**: View all your generated and scanned QR codes
- **Preview**: See QR images and text details
- **Actions**:
  - ⬇️ Download any saved QR code
  - 🗑️ Delete individual items
  - 🧹 Clear all history
- **Persistent Storage**: Data is saved in your browser (LocalStorage)

## 🚀 How to Run

### Method 1: Using Python HTTP Server (Recommended)
This is required for camera access due to browser security policies.

1. **Open Terminal** in the project folder:
   ```bash
   cd "c:\Users\PANKAJ KUMAR SAH\Desktop\New folder\QRCODE_TOOLS"
   ```

2. **Start the Server**:
   ```bash
   python -m http.server 8000
   ```

3. **Open in Browser**:
   - [http://localhost:8000/index.html](http://localhost:8000/index.html)

### Method 2: Live Server (VS Code)
If you use VS Code, simply right-click `index.html` and select **"Open with Live Server"**.

## 🎮 How to Use

### Generating a QR Code
1. Open **Text to QR Code** page
2. Enter your text or URL
3. Customize **Color**, **Background**, **Size**, and **Quality**
4. Click **"Generate QR Code"**
5. Use the buttons to **Download**, **Share**, or **Save to History**

### Scanning a QR Code
1. Open **QR code to Text** page
2. Click **"📷 Use Camera"** (Allow camera permission)
3. Point camera at a QR code
4. OR Click **"📂 Upload Image"** to pick an image file
5. View the extracted text and **Copy**, **Share**, or **Save** it!

### Managing History
1. Click **"📜 View History"** button on any page
2. OR Press **Ctrl + H** shortcut
3. View, Download, or Delete your saved items

## 🔧 Troubleshooting Camera Issues

If you see "Camera error" or "HTTPS required":
1. **Ensure you are using localhost**: Address bar should show `http://localhost:8000`
2. **Check Permissions**: Click the 🔒 icon in address bar and Allow Camera
3. **Use Supported Browser**: Chrome, Edge, or Firefox recommended

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + H` | Open History Page |

## 🛠️ Technologies Used

- **HTML5 & CSS3** - Modern, responsive UI with CSS Variables
- **JavaScript (ES6+)** - Core logic and interactivity
- **LocalStorage** - Data persistence
- **Libraries**:
  - `qrcode.js`: For generating QR codes
  - `html5-qrcode`: For camera scanning
  - `jsQR`: For image scanning

---

**Made with ❤️ for easy QR code management**
