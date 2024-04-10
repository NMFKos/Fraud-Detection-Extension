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
                    let regex = /[0-9]+(\.[0-9]+)*/g;
                    let phones = text.match(regex);
                    let validPhones = [];
                    if (phones) {
                        for (let i = 0; i < phones.length; i++) {
                            if (phones[i].length > 10) {
                                validPhones.push(phones[i]);
                            }
                        }
                    }
                    if (validPhones.length > 0) {
                        inputElement.value = validPhones.join(", ");
                    }
                    else {
                        inputElement.value = "Dont have number phone."
                    }
                });
            }            
        }
    });

  // Execute paste command
  document.execCommand('paste');
  
  // Remove temporary input element
  document.body.removeChild(tempInput);
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