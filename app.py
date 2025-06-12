from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def home():
    photos = [
        'photo1.jpg', 'photo2.jpg', 'photo3.jpg',
        'photo4.jpg', 'photo5.jpg', 'photo6.jpg'
    ]
    return render_template('index.html', photos=photos)

# if __name__ == '__main__':
#     app.run(debug=True)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)