document.addEventListener('DOMContentLoaded', function() {
  var getSelectedTextButton = document.getElementById('getSelectedText');
  getSelectedTextButton.addEventListener('click', function() {
    // Lấy tab hiện tại của người dùng
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Lặp qua các tab trong cửa sổ hiện tại
      for (let i = 0; i < tabs.length; i++) {
        // Kiểm tra xem tab đó có đang hoạt động không
        if (tabs[i].active) {
          // Gửi tin nhắn đến tab hiện tại để lấy đoạn văn bản được chọn
          chrome.tabs.sendMessage(tabs[i].id, {action: "getSelectedText"}, function(response) {
            if (response && response.selectedText) {
              alert(response.selectedText);
            } else {
              alert("No selected text found.");
            }
          });
          break; // Dừng vòng lặp sau khi tìm thấy tab hiện tại
        }
      }
    });
  });
});


// document.getElementById("myButton").addEventListener("click", highlightAndCheck);

// function highlightAndCheck() {
//     let text = document.getElementById('textArea').value;
//     let highlightedText = '<span style="background-color: yellow;">' + text + '</span>';
//     document.getElementById('textArea').innerHTML = highlightedText;
  
//     // Kiểm tra lừa đảo (Đây là một hàm giả định)
//     let isScam = checkForScam(text);
//     if (isScam) {
//       alert('Đoạn văn bản này có khả năng là lừa đảo!');
//     } else {
//       alert('Đoạn văn bản này có vẻ không phải là lừa đảo.');
//     }
// }


// function hasIcon(text)
// {
//   //Kiểm tra xem có icon trong text hay không
//   let iconRegex = /<img[^>]*>/g; // Biểu thức chính quy để tìm các thẻ <img>
//   let matches = text.match(iconRegex); // Tìm các kết quả khớp với biểu thức chính quy trong văn bản
//   if (matches && matches.length > 5) {
//     return true; // Trả về true nếu có nhiều hơn một icon trong văn bản
//   }  
//   else{
//     return false;
//   }
// }


// function hasTeencode(text)
// {
//   //Kiểm tra xem có teencode trong văn bản hay không
//   const vietnameseChars = ['a', 'e', 'i', 'l', 'o', 'h'];
//   const teencodeChars = ['4', '3', 'I', '1', '0', 'k'];

//   let words = text.split(" ");
  
//   for (let i = 0; i < words.length; i++) {
//     const word = words[i];
//     for (let j = 0; j < word.length; j++) {
//         const char = word[j];
//         for (let k = 0; k < vietnameseChars.length; k++) {
//             const u = vietnameseChars[k];
//             for (let l = 0; l < teencodeChars.length; l++) {
//                 const v = teencodeChars[l];
//                 if (char !== u && char === v) {
//                     return true;
//                 }
//             }
//         }
//     }
// }
//   return false; 
// }

// function hasPhone(text)
// {
//   const phoneBeginWith = ['084', '84', 
//                           '098', '086', '096', '097', '032', '033', '034', '035', '036', '037', '038', '039',
//                           '091', '094', '083', '084', '085', '081', '082', '088',
//                           '089', '090', '093', '070', '079', '077', '076', '078',
//                           '092', '056', '058',
//                           '099', '059']
  
  
  
//   for (let i = 0; i < phoneBeginWith.length; i++)
//   {
//     pattern = new RegExp("(^|\\s|:)" + phoneBeginWith[i] + "\\b");
//     if (pattern.test(text)){
//       return true;
//     }
//   }
//   return false;
// }


// function hasExpressionbetweenChar(text)
// {
//   let pattern = /[^\w]/;
//   let words = text.split(" ");

//   for (let i = 0; i < words.length; i++)
//   {
//     const word = words[i];
//     if (pattern.test(word)){
//       return true;
//     }
//   }
  
//   return false;
// }

// // function hasSuspiciousEmail(text)
// // {
// //   const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
// //   var email = text.match(emailRegex)[0];
// //   console.log(email)
// //   const specialCharactersRegex = /[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;
// //   if (specialCharactersRegex.test(email)) {
// //       return true;
// //   }

// //   // Kiểm tra xem địa chỉ email có ký tự khoảng trắng không phù hợp
// //   if (email.includes(" ")) {
// //       return true;
// //   }

// //   // Kiểm tra xem địa chỉ email có tên miền không phù hợp
// //   const domain = email.split("@")[1];
// //   const suspiciousDomains = ["example.com", "suspiciousdomain.com"];
// //   if (suspiciousDomains.includes(domain)) {
// //     return true;
// //   }
// //   // Nếu không có dấu hiệu nào của một địa chỉ email không chính thống
// //   return false;
// // }


// function checkForScam(text){
//   if(hasIcon(text))  
//   {
//     return true;
//   } 
//   else if (hasTeencode(text)){
//     return true;
//   }
//   else if (hasPhone(text)){
//     return true;
//   }
//   else if (hasExpressionbetweenChar(text))
//   {
//     return true;
//   }
//   // else if (hasSuspiciousEmail(text)){
//   //   return true;
//   // }
//   else{
//     return false;
//   }


  
   
  
  
  

// }