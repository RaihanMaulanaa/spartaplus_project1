from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
from datetime import datetime

# tambahan
import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME = os.environ.get("DB_NAME")

# memnaggil link mongo db
client = MongoClient(MONGODB_URI)
# memanggil database mongodb
db = client[DB_NAME]

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/diary', methods=['GET'])
def show_diary():
    # mengembalikan permintaan klient yang telah dimodifikasi berbentuk json
    articles = list(db.card.find({}, {'_id': False}))
    return jsonify({'articles': articles})


@app.route('/diary', methods=['POST'])
def save_diary():
    # variabel ini berfungsi untuk menerima permintaan/request dari client
    title_receive = request.form.get('title_give')
    content_receive = request.form.get('content_give')
    # time_receive = request.form.get('time_give')

    # membuat objek datetime
    today = datetime.now()
    # membuat versi dari objek today  yang lebih rapi
    mytime = today.strftime('%d-%m-%Y-%H-%M-%S')

    # variabel ini juga berfungsi untuk menerima rquest dari client berbentuk file
    file = request.files['file_give']
    # membuat ekstensi file dari file original
    extension = file.filename.split('.')[1]
    # ini adalah variabel untuk mengedentifikasi lokasi file
    filename = f'static/image/post-{mytime}.{extension}'
    # lalu file disimpan ke dalam variabel bernama sav_to
    file.save(filename)

    profile = request.files['profile_give']
    extension = profile.filename.split('.')[-1]
    profilename = f'static/image/profil-{mytime}.{extension}'
    profile.save(profilename)

    time = today.strftime('%d.%m.%Y')

    # lalu menyimpan datanya pada doc setelahnya ditambahkan ke database bernama diary
    doc = {
        'file': filename,
        'profile': profilename,
        'title': title_receive,
        'content': content_receive,
        'time': time
    }
    db.card.insert_one(doc)
    return jsonify({'pesan': 'Kartu telah ditambahkan'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
