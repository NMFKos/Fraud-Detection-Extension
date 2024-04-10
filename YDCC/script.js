function highlightAndCheck() {
    let text = document.getElementById('textArea').value;
    let highlightedText = '<span style="background-color: yellow;">' + text + '</span>';
    document.getElementById('textArea').innerHTML = highlightedText;
  
    // Kiểm tra lừa đảo (Đây là một hàm giả định)
    let isScam = checkForScam(text);
    if (isScam) {
      alert('Đoạn văn bản này có khả năng là lừa đảo!');
    } else {
      alert('Đoạn văn bản này có vẻ không phải là lừa đảo.');
    }
}


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
  const vietnameseChars = ['a', 'e', 'i', 'l', 'o', 'h'];
  const teencodeChars = ['4', '3', 'I', '1', '0', 'k'];

  let words = text.split(/\s+/);
  let lowercasewords = words.toLowerCase();
  
  for (let i = 0; i < lowercasewords.length; i++) {
    let word = lowercasewords[i];
    for (let j = 0; i < word.length; j ++){
      let char = word[j];
      for (let k = 0; k <= 6; k++)
      {
        if (!vietnameseChars[k].includes(char) && teencodeChars[k].includes(char)) {
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
  
  pattern = new RegExp("(^|\\s|:)" + word + "\\b");
  for (let i = 0; i < phoneBeginWith.length; i++)
  {
    match = text.match(phoneBeginWith[i]);
    if (match && pattern.test(match)){
      return true;
    }
  }
  return false;
}


function hasExpressionbetweenChar(text)
{
  let pattern = /[^\w\s]/;
  let words = text.split(/\s+/);

  for (let i = 0; i < words.length; i++)
  {
    if (pattern.test(words[i]))
    {
      return true;
    }
  }
  return false;
}


function checkForScam(text){
  if(hasIcon(text))  
  {
    return true;
  } 
  else if (hasTeencode(text)){
    return true;
  }
  else if (hasPhone(text)){
    return true;
  }
  else if (hasExpressionbetweenChar(text))
  {
    return true;
  }
  else{
    return false;
  }


  
   
  
  
  

}