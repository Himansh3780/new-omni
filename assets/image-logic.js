/* assets/image-logic.js */

document.addEventListener("DOMContentLoaded", () => {
    // 1. READ THE CONFIGURATION FROM THE HTML PAGE
    // If no config is found, use default settings
    const config = window.TOOL_CONFIG || { 
        maxSizeKB: 100, 
        width: null, 
        height: null,
        forceJPG: true 
    };

    // 2. SETUP UI ELEMENTS
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const statusText = document.getElementById('status-text');
    const downloadBtn = document.getElementById('download-btn');
    const previewImg = document.getElementById('preview-img');
    const qualityBadge = document.getElementById('quality-badge');

    // Update the UI text based on the specific exam
    document.getElementById('target-text').innerText = 
        `Target: Under ${config.maxSizeKB}KB ${config.width ? `| ${config.width}x${config.height}px` : ''}`;

    // 3. EVENT LISTENERS
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) processImage(e.target.files[0]);
    });

    // 4. THE CORE LOGIC (The "Chef")
    async function processImage(file) {
        statusText.innerText = "Processing...";
        statusText.style.color = "var(--text-main)";
        downloadBtn.style.display = "none";
        previewImg.style.display = "none";

        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            
            img.onload = () => {
                // Create a Canvas to manipulate the image
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // A. RESIZE DIMENSIONS (If required by the exam)
                if (config.width && config.height) {
                    width = config.width;
                    height = config.height;
                } else if (config.width) {
                    // Maintain aspect ratio if only width is given
                    const ratio = config.width / width;
                    width = config.width;
                    height = height * ratio;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                // Draw image (White background for transparency support)
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                // B. COMPRESS TO TARGET SIZE (The Loop)
                // We start at 90% quality and go down until it fits
                let quality = 0.9;
                let dataUrl = canvas.toDataURL('image/jpeg', quality);
                
                // Helper to estimate size in KB
                const getSizeKB = (url) => Math.round((url.length * 3 / 4) / 1024);

                // Recursively lower quality until under limit
                const attemptCompression = () => {
                    let currentSize = getSizeKB(dataUrl);
                    
                    if (currentSize > config.maxSizeKB && quality > 0.1) {
                        quality -= 0.05; // Reduce quality by 5%
                        dataUrl = canvas.toDataURL('image/jpeg', quality);
                        attemptCompression(); // Try again
                    } else {
                        // C. SUCCESS! UPDATE UI
                        finishProcessing(dataUrl, currentSize);
                    }
                };

                attemptCompression();
            };
        };
    }

    function finishProcessing(url, size) {
        // Show Preview
        previewImg.src = url;
        previewImg.style.display = "block";
        
        // Update Text
        const color = size <= config.maxSizeKB ? "#10b981" : "#ef4444"; // Green or Red
        statusText.innerHTML = `<span style="color:${color}; font-weight:bold;">Final Size: ${size}KB</span>`;
        
        // Setup Download Button
        downloadBtn.style.display = "block";
        downloadBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = `optimized-for-${config.examName || 'exam'}.jpg`;
            a.click();
        };
    }
});
