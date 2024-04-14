from flask import Flask, request, jsonify

app = Flask(__name__)

# Định nghĩa hàm để xử lý dữ liệu và trả về kết quả
def predict(data):
    # Đoạn mã xử lý dữ liệu và dự đoán từ mô hình ML
    # Xử lý trên content
    content = data['data']
    if len(content.split()) > 1000:
        prediction = 1
    else:
        prediction = 0 
    return prediction

@app.route('/predict', methods=['POST'])
def handle_prediction():
    data = request.json  # Dữ liệu được gửi từ JavaScript
    result = predict(data)  # Gọi hàm predict với dữ liệu nhận được
    return jsonify(result=result)

if __name__ == '__main__':
    app.run(debug=True)