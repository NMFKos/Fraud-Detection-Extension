// Function to get clipboard content
function getClipboardContent() {
    const inputElement = document.getElementById('clipboard-content');
    // Create a temporary input element to paste clipboard content
    const tempInput = document.createElement('input');
    tempInput.style.opacity = 0; // Make it invisible
    document.body.appendChild(tempInput);
    tempInput.focus();
    
    // Handle paste event
    tempInput.addEventListener('paste', (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.type.indexOf("image") !== -1) {
                const blob = item.getAsFile();
                // Handle the image blob (e.g., display it on the page)
                handleImageBlob(blob);
                break; // Stop after handling the first image
            } else if (item.type === "text/plain") {
                // Handle text content
                item.getAsString(function(text) {
                    let content = text.toLowerCase()
                    let phone = capturePhones(content);
                    let money = captureSalarys(content)
                    inputElement.value = `${phone}    ${money}`;
                });
            }            
        }
    });

    // Execute paste command
    document.execCommand('paste');
    
    // Remove temporary input element
    document.body.removeChild(tempInput);
}

function capturePhones(text) {
    let regex = /[0-9]+(\.[0-9]+)*/g;
    let phones = text.match(regex);
    let validPhones = [];
    if (phones) {
        for (let i = 0; i < phones.length; i++) {
            if (phones[i].length >= 10) {
                validPhones.push(phones[i]);
            }
        }
    }
    if (validPhones.length > 0) {
        return validPhones.join(", ");
    }
    else {
        return "Dont have number phone.";
    }
}

function captureSalarys(text) {
    let regex = /(?:\d{1,3}(?:[.,]\d{3})+|\d+\s*(?:k|d|đ|vnd|vnđ|tr|triệu))/g;
    let salary = text.match(regex);
    let validSalarys = [];
    if (salary) {
        for (let i = 0; i < salary.length; i++) {
            validSalarys.push(salary[i]);
        }
    }
    if (validSalarys.length > 0) {
        return validSalarys.join(", ");
    }
    else {
        return "Dont have salary.";
    }
}
// Function to handle image blob
function handleImageBlob(blob) {
    const imageUrl = URL.createObjectURL(blob);
    // Do something with the image URL (e.g., display it in an <img> element)
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    document.body.appendChild(imgElement);
}

// Call getClipboardContent when popup is opened
document.addEventListener('DOMContentLoaded', getClipboardContent);
