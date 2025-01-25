import flask
from flask import request

app = flask.Flask(__name__)


# this should be pretty safe from directory travel attacks!
@app.get("/images/<id:id>")
def image_get(id):
    id = "".join(list(filter(str.isdigit, id)))
    img_url = id + ".png"
    return flask.send_from_directory("images", img_url)


app.run(
    host='0.0.0.0',
    port=5000,
)
