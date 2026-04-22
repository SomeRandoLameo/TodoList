from flask import Flask, request, jsonify, abort, send_from_directory
import os
import uuid

app = Flask(__name__)


STATIC_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route("/")
def index():
    return send_from_directory(STATIC_DIR, "index.html")

@app.route("/style.css")
def styles():
    return send_from_directory(STATIC_DIR, "style.css")

@app.route("/app.js")
def script():
    return send_from_directory(STATIC_DIR, "app.js")

@app.route("/components/<path:filename>")
def components(filename):
    return send_from_directory(os.path.join(STATIC_DIR, "components"), filename)

todo_lists = {}
todo_entries = {}


def generate_uuid():
    return str(uuid.uuid4())


def get_list_or_404(list_id):
    if list_id not in todo_lists:
        abort(404, description="Invalid list id")
    return todo_lists[list_id]


def get_entry_or_404(entry_id):
    if entry_id not in todo_entries:
        abort(404, description="Invalid entry id")
    return todo_entries[entry_id]

@app.route("/todo-list", methods=["POST"])
def add_list():
    data = request.get_json()

    if not data or "name" not in data:
        return jsonify({"message": "Invalid request data"}), 406

    list_id = generate_uuid()
    new_list = {
        "id": list_id,
        "name": data["name"]
    }

    todo_lists[list_id] = new_list
    return jsonify(new_list), 201


@app.route("/todo-list/<list_id>", methods=["GET"])
def get_list(list_id):
    if list_id not in todo_lists:
        return jsonify({"message": "Invalid list id"}), 404

    entries = [
        entry for entry in todo_entries.values()
        if entry["list_id"] == list_id
    ]

    return jsonify(entries), 200


@app.route("/todo-list/<list_id>", methods=["DELETE"])
def delete_list(list_id):
    if list_id not in todo_lists:
        return jsonify({"message": "Invalid list id"}), 404

    # delete all entries belonging to the list
    to_delete = [eid for eid, e in todo_entries.items() if e["list_id"] == list_id]
    for eid in to_delete:
        del todo_entries[eid]

    del todo_lists[list_id]

    return "", 204


@app.route("/todo-list/<list_id>", methods=["POST"])
def add_entry(list_id):
    if list_id not in todo_lists:
        return jsonify({"message": "Invalid list id"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"message": "Invalid request data"}), 406

    entry_id = generate_uuid()

    new_entry = {
        "id": entry_id,
        "name": data.get("name"),
        "description": data.get("description"),
        "user_id": generate_uuid(),  # mock user id
        "list_id": list_id
    }

    todo_entries[entry_id] = new_entry
    return jsonify(new_entry), 201


@app.route("/entry/<entry_id>", methods=["PATCH"])
def update_entry(entry_id):
    if entry_id not in todo_entries:
        return jsonify({"message": "Invalid entry id"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"message": "Invalid request data"}), 406

    entry = todo_entries[entry_id]

    # partial update
    if "name" in data:
        entry["name"] = data["name"]
    if "description" in data:
        entry["description"] = data["description"]

    return jsonify(entry), 200


@app.route("/entry/<entry_id>", methods=["DELETE"])
def delete_entry(entry_id):
    if entry_id not in todo_entries:
        return jsonify({"message": "Invalid entry id"}), 404

    del todo_entries[entry_id]
    return "", 204

@app.errorhandler(404)
def not_found(e):
    return jsonify({"message": str(e.description)}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"message": "Server error"}), 500


if __name__ == "__main__":
    app.run()