from flask import Flask, request, jsonify
import numpy as np
import os
import re
import spacy
import tensorflow as tf
from tensorflow import keras
from keras import Sequential
from keras.layers import Input, Dense, BatchNormalization, Dropout
from keras.regularizers import l2
import gensim.downloader as api

model = Sequential()
model.add(Input(shape=(7, )))
model.add(Dense(256, activation='relu', kernel_regularizer=l2(0.01), bias_regularizer=l2(0.01)))
model.add(BatchNormalization())
model.add(Dense(128, activation='relu', kernel_regularizer=l2(0.01), bias_regularizer=l2(0.01)))
model.add(Dense(64, activation='relu', kernel_regularizer=l2(0.01), bias_regularizer=l2(0.01)))
model.add( BatchNormalization())
model.add(Dense(64, activation='relu', kernel_regularizer=l2(0.01), bias_regularizer=l2(0.01)))
model.add(Dense(64, activation='relu', kernel_regularizer=l2(0.01), bias_regularizer=l2(0.01)))
model.add(BatchNormalization())
model.add(Dense(32, activation='relu', kernel_regularizer=l2(0.01), bias_regularizer=l2(0.01)))
model.add(Dense(32, activation='relu', kernel_regularizer=l2(0.01), bias_regularizer=l2(0.01)))
model.add(BatchNormalization())
model.add(Dropout(0.5))
model.add(Dense(2, activation='sigmoid'))

model.load_weights('Fraud-Detection-Extension/Product/model.h5')
wv = api.load('word2vec-google-news-300')
nlp = spacy.load('en_core_web_lg')
app = Flask(__name__)



def preprocess__and_vectorize(text):
    doc = nlp(text)

    filtered_tokens = []
    for token in doc:
      if token.is_punct or token.is_stop:
        continue
      filtered_tokens.append(token.lemma_)

    return filtered_tokens

# Định nghĩa hàm để xử lý dữ liệu và trả về kết quả
def predict(data):
    content = data['data']
    pre_text = preprocess__and_vectorize(content)
    text_vec = wv.get_mean_vector(pre_text)
    fir = np.mean(text_vec[:100])
    sec = np.mean(text_vec[100:200])
    thir = np.mean(text_vec[200:])

    matches = re.findall(r'\n(.*?)\n\n', content)
    matches = [matche.rstrip() for matche in matches if matche != '']
    com = 0.0
    req = 0.0
    qua = 0.0
    ski = 0.0

    crawl = {}
    i = 0
    while i < len(matches):
      if len(matches[i].split()) > 5:
            i += 1
      else:
        if i != len(matches)-1:
            index_1 = content.index(matches[i])
            index_2 = content.index(matches[i+1])
            value = content[index_1+len(matches[i]):index_2+len(matches[i+1])]
            value = " ".join(value.split("\n"))
            crawl[matches[i]] = re.sub(r'\s+', ' ', value).strip()
        else:
            index_1 = content.index(matches[i])
            value = content[index_1+len(matches[i]):]
            value = " ".join(value.split("\n"))
            crawl[matches[i]] = re.sub(r'\s+', ' ', value).strip()

        i += 2

    for key, value in crawl.items():

        if any(keyword in key for keyword in ['company profile', 'company description']):
          com = 1.0
        elif any(keyword in key for keyword in ['responsibilities', 'requirements', 'required']):
          req = 1.0
        elif 'skills' in key:
          ski = 1.0
        elif any(keyword in key for keyword in ['qualifications', 'quality']):
          qua = 1.0
    res = [fir,sec,thir,com,req,ski,qua]
    res = np.array(res).reshape(1, -1)
    pred = model.predict(res)
    prediction = np.argmax(pred, axis=-1)
    print(prediction)
    return str(prediction[0])

@app.route('/predict', methods=['POST'])
def handle_prediction():
    data = request.json  # Dữ liệu được gửi từ JavaScript
    result = predict(data)  # Gọi hàm predict với dữ liệu nhận được
    print(result)
    return jsonify(result=result)

if __name__ == '__main__':
    app.run(debug=True)