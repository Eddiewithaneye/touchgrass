from flask import Flask, request, jsonify
from werkzeug.datastructures import FileStorage
from ImageIdentifier import ImageIdentifier
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS
from app import app

@app.route("/analyze", methods=["POST"])
def analyze_image():
	if "file" not in request.files:
		return jsonify({"eror": "No file part"}), 400

	file: FileStorage = request.files["file"]
	if file.filename == "":
		return jsonify({"error": "No selected file"}), 400
	
	file_content: bytes = file.stream.read()
	identifier = ImageIdentifier()
	result = identifier.checkImageFile(file_content, ["whiteboard", "beard"])
	if (result != None): 	
		return jsonify({"message": f"{result}", "challenge_success": True}), 200
	else:
		return jsonify ({"message": "no image found", "challenge_success": False}), 200