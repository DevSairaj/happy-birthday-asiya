from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    photos = [
        'photo1.jpg', 'photo2.jpg', 'photo3.jpg',
        'photo4.jpg', 'photo5.jpg', 'photo6.jpg'
    ]
    return render_template('index.html', photos=photos)

if __name__ == '__main__':
    app.run(debug=True)
