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
	def check_limit():
		# Empty function just to check for calls to API 
		return	

	def checkPhoto(self, imageURL: str, valid_names: list[str]) -> bool:
		self.check_limit()
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

if __name__ == "__main__":
	ImageIdentifier.checkPhoto(myimageURL, ["grass", "grasses"])
