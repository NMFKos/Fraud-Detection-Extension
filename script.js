function ruleBased(content) {
  return fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({data: content})
  })
  .then(response => response.json())
  .then(data => {
      // Kiểm tra kết quả từ API và trả về thông báo tương ứng
      if (data.result == '0') {
        return "Đoạn văn này có nguy cơ lừa đảo.";
      } else if (data.result == '1') {
        return "Đoạn văn này có thể tin tưởng.";
      }
      else {
        return "dau ra k hop le.";
      }
  })
  .catch(error => {
      // Trả về thông báo lỗi nếu có
      return error.toString();
  });
}

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
                              // Gọi hàm ruleBased và xử lý kết quả
                              ruleBased(text)
                              .then(result => {
                                  alert(result);
                              })
                              .catch(error => {
                                  alert(`Error -> ${error}`);
                              });
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
