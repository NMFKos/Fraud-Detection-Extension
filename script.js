document.addEventListener('DOMContentLoaded', function() {
  var getSelectedTextButton = document.getElementById('getSelectedText');
  var text;
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
              text = response.selectedText;
              let isScam = checkForScam(text);
              if (isScam) {
                alert('Đoạn văn bản này có khả năng là lừa đảo!');
              } else {
                alert('Đoạn văn bản này có vẻ không phải là lừa đảo.');
              }
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

// document.addEventListener('DOMContentLoaded', function() {
//   var getSelectedTextButton = document.getElementById('Report');
//   var text;
//   getSelectedTextButton.addEventListener('click', function() {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       for (let i = 0; i < tabs.length; i++) {
//         if (tabs[i].active) {
//           chrome.tabs.sendMessage(tabs[i].id, {action: "Report"}, function(response) {
//             if (response && response.selectedText) {
//               text = response.selectedText;
//               savetoGoogleSheet(text);
//             } else {
//               alert("No selected text found.");
//             }
//           });
//           break;
//         }
//       }
//     });
//    });
// });


function hasIcon(text)
{
  //Kiểm tra xem có icon trong text hay không
  let iconRegex = /<img[^>]*>/g; // Biểu thức chính quy để tìm các thẻ <img>
  let matches = text.match(iconRegex); // Tìm các kết quả khớp với biểu thức chính quy trong văn bản
  if (matches && matches.length > 5) {
    return true; // Trả về true nếu có nhiều hơn một icon trong văn bản
  }  
  else{
    return false;
  }
}


function hasTeencode(text)
{
  //Kiểm tra xem có teencode trong văn bản hay không
  const vietnameseChars = ['a', 'á', 'à', 'ả', 'ã', 'ạ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ', 'b', 'c', 'd', 'đ', 'e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ', 'g', 'h', 'i', 'í', 'ì', 'ỉ', 'ĩ', 'ị', 'k', 'l', 'm', 'n', 'o', 'ó', 'ò', 'ỏ', 'õ', 'ọ', 'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ', 'p', 'q', 'r', 's', 't', 'u', 'ú', 'ù', 'ủ', 'ũ', 'ụ', 'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự', 'v', 'x', 'y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'];
  const teencodeChars = ['4', 'á', 'à', 'ả', 'ã', 'ạ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ', 'b', 'c', 'd', 'đ', '3', 'é', 'è', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ', 'g', 'h', 'i', 'í', 'ì', 'ỉ', 'ĩ', 'ị', 'k', '1', 'm', 'n', '0', 'ó', 'ò', 'ỏ', 'õ', 'ọ', 'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ', 'p', 'q', 'r', 's', 't', 'u', 'ú', 'ù', 'ủ', 'ũ', 'ụ', 'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự', 'v', 'x', 'y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'];
  const number = /\d/;
  let words = text.split(" ");
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].toLowerCase();
    for (let j = 0; j < word.length; j++) {
        const char = word[j];
        if (number.test(char))
        {
          continue;
        }
        for (let k = 0; k < vietnameseChars.length; k++) {
              const u = vietnameseChars[k];
              const v = teencodeChars[k];
              if (char !== u && char === v) {
                alert(char);
                alert(word.indexOf(char));
                return true;
              }

        }
    }
}
  return false; 
}

function hasPhone(text)
{
  const phoneBeginWith = ['084', '84', 
                          '098', '086', '096', '097', '032', '033', '034', '035', '036', '037', '038', '039',
                          '091', '094', '083', '084', '085', '081', '082', '088',
                          '089', '090', '093', '070', '079', '077', '076', '078',
                          '092', '056', '058',
                          '099', '059']
  
  
  
  for (let i = 0; i < phoneBeginWith.length; i++)
  {
    pattern = new RegExp("(^|\\s|:)" + phoneBeginWith[i] + "\\b");
    if (pattern.test(text)){
      return true;
    }
  }
  return false;
}

function checkForScam(text){
  if(hasIcon(text))  
  {
    alert("hasIcon");
    return true;
  } 
  else if (hasTeencode(text)){
    alert("hasTeencode");
    return true;
  }
  else if (hasPhone(text)){
    alert("hasPhone");
    return true;
  }
  // else if (hasExpressionbetweenChar(text))
  // {
  //   alert("hasExpression");
  //   return true;
  // }
  // else if (hasSuspiciousEmail(text)){
  //   return true;
  // }
  else{
    return false;
  }
}

// function savetoGoogleSheet(text)
// {
//   const express = require("express");
//   const { google } = require("googleapis");

//   const app = express();
//   app.get("/", async (req, res) => {
//     const auth = new google.auth.GoogleAuth({
//       keyFile: "job-scamming-498c16e5fa44.json",
//       scopes: "https://www.googleapis.com/auth/spreadsheets",
//     });
  
//     // Create client instance for auth
//     const client = await auth.getClient();
  
//     // Instance of Google Sheets API
//     const googleSheets = google.sheets({ version: "v4", auth: client });
  
//     const spreadsheetId = "1NM1CaEByNgvCK3fb8g7Cbz56phDnz2fc9I0oW7DFD2s";
  
//     await googleSheets.spreadsheets.values.append({
//       auth,
//       spreadsheetId,
//       range: "Sheet1!A:A",
//       valueInputOption: "USER_ENTERED",
//       resource: {
//         values: [[text]],
//       },
//     });
//   });
// }

