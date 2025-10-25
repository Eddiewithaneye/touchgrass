from google.cloud import vision
from time import time
from ratelimit import limits, sleep_and_retry

myimageURL: str  = "https://mobileimages.lowes.com/productimages/7b325497-8387-4752-b291-aee0b2a8851d/49546971.jpg"

class ImageIdentifier:
	CALLS = 10
	RATE_LIMIT = 60

	@staticmethod
	@sleep_and_retry
	@limits(calls=CALLS, period=RATE_LIMIT)
	def __check_limit():
		# Empty function just to check for calls to API 
		return	

	def checkPhotoURL(self, imageURL: str, valid_names: list[str]) -> bool:
		self.__check_limit()
		valid_names = {name.lower().strip() for name in valid_names}
	
		client = vision.ImageAnnotatorClient()
		request: dict = {
			'image': {
				'source': {'image_uri': imageURL},
			},
		}
		response: vision.AnnotateImageResponse = client.annotate_image(request)

		found = False
		for label in response.label_annotations:
			label_name = label.description.lower()
			if any(v in label_name for v in valid_names):
				print(f"✅ Found partial match: {label.description} (score={label.score:.2f})")
				found = True

		return found

	def checkImageFile(self, file_content: bytes, valid_names: list[str]) -> bool:
		self.__check_limit()
		valid_names = {name.lower().strip() for name in valid_names}
	
		client = vision.ImageAnnotatorClient()
		request: dict = {
			'image': {
				'content': file_content
			},
			"features": [
				{
					"type": vision.Feature.Type.LABEL_DETECTION
				}
			]
		}
		response: vision.AnnotateImageResponse = client.annotate_image(request)
		print((response))
		return_label = None
		for label in response.label_annotations:
			label_name = label.description.lower()
			if any(label_name in v for v in valid_names):
				print(f"✅ Found partial match: {label.description} (score={label.score:.2f})")
				return_label = label
		if (return_label != None):
			return return_label.description
		else: return None

if __name__ == "__main__":
	ImageIdentifier.checkPhotoURL(myimageURL, ["grass", "grasses"])
