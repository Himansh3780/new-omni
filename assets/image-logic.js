/* assets/image-logic.js */

document.addEventListener("DOMContentLoaded", () => {
    // 1. GET SETTINGS FROM THE HTML PAGE
    const config = window.TOOL_CONFIG || { maxSizeKB: 100, width: null, height: null };
    
    // 2. UPDATE UI BASED ON SETTINGS
    const statusText = document.getElementById("status-text");
    const downloadBtn = document.getElementById("download-btn");
    
    // Automatically update the label to show user the target
    document.getElementById("target-info").innerText = 
        `Target Size: Under ${config.maxSizeKB}KB ${config.width ? `| Dims: ${config.width}x${config.height}px` : ''}`;

    // 3. THE COMPRESSION LOGIC
    document.getElementById("upload-file").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Start processing
        statusText.innerText = "Processing for " + config.examName + "...";
        
        // ... (Insert your standard resizing logic here) ...
        // BUT, inside the logic, use 'config.maxSizeKB' instead of a hard number.
        
        // Example simulation:
        setTimeout(() => {
            statusText.innerText = `Success! Image is now optimized for ${config.examName}.`;
            downloadBtn.style.display = "block";
        }, 1000);
    });
});
