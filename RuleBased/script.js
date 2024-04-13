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
              if (text) {
                let result = ruleBased(text);
                alert(result);
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

function ruleBased(content) {
  content = content.toLowerCase();
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  let matches = content.match(/\n(.*?)\n\n/g);
  matches = matches.map(match => match.trim()).filter(match => match !== '');

  const crawl = {};
  let result = [0, 0, 0, 0, 0, 0];
  let i = 0;
  while (i < matches.length) {
    if (matches[i].split(' ').length > 5) {
      i++;
    } else {
      if (i !== matches.length - 1) {
        const index1 = content.indexOf(matches[i]);
        const index2 = content.indexOf(matches[i + 1]);
        let value = content.substring(index1 + matches[i].length, index2 + matches[i + 1].length);
        value = value.replace(/\s+/g, ' ').trim();
        crawl[matches[i]] = value;
      } else {
        const index1 = content.indexOf(matches[i]);
        let value = content.substring(index1 + matches[i].length);
        value = value.replace(/\s+/g, ' ').trim();
        crawl[matches[i]] = value;
      }
      i += 2;
    }
  }

  if (emailRegex.test(content)) {
    //console.log("HAS EMAIL");
    result[0] = 1;
  }

  for (const [key, value] of Object.entries(crawl)) {
    if (['company profile', 'company description', 'about'].some(keyword => key.includes(keyword))) {
      //console.log("HAS COMPANY PROFILE");
      result[1] = 1;
    } else if (['responsibilities', 'requirements', 'required'].some(keyword => key.includes(keyword))) {
      //console.log("HAS JOB REQUIREMENTS");
      result[2] = 1;
    } else if (['job description', 'description'].some(keyword => key.includes(keyword))) {
      //console.log("HAS JOB DESCRIPTIONS");
      result[3] = 1;
    } else if (key.includes('skills')) {
      //console.log("HAS SKILLS REQUIREMENTS");
      result[4] = 1;
    } else if (['qualifications', 'quality'].some(keyword => key.includes(keyword))) {
      //console.log("HAS QUALIFICATIONS");
      result[5] = 1;
    }
  }
  const resultString = result.join(" - ");
  
  return resultString
}
