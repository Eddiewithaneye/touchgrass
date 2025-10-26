from google.cloud import vision
from time import time
from ratelimit import limits, sleep_and_retry
from google import genai
from google.genai import types
import enum
from pydantic import BaseModel

class Answers(enum.Enum):
    YES = "Yes"
    NO = "No"

class IdentificationResponse(BaseModel):
    final_answer: Answers
    explanation: str

class ImageIdentifier:
    CALLS = 10
    RATE_LIMIT = 60

    def __init__(self, GEMINI_API_KEY: str):
        # Initialize Gemini client with API key
        try:
            self.gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        except:
            print("key is: " + str(GEMINI_API_KEY))
     

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

    def checkImageFile(self, file_content: bytes, description: str) -> bool:
        print("description: " + str(description))

        self.__check_limit()

        response = self.gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                f"Does this image contain something with the following description? {description}",
                types.Part.from_bytes(
                    data=file_content,
                    mime_type='image/png'
                )
            ],
            config={
                "response_mime_type": "application/json",
                "response_schema": IdentificationResponse,
            },
        )
  
        print(response.parsed)

        is_match = response.parsed.final_answer == Answers.YES
        print(is_match)

        return is_match

        # return_label = None
        # for label in response.label_annotations:
        # 	label_name = label.description.lower()
        # 	if any(label_name in v for v in valid_names):
        # 		print(f"✅ Found partial match: {label.description} (score={label.score:.2f})")
        # 		return_label = label
        # if (return_label != None):
        # 	return return_label.description
        # else: return None

    # def checkImageFile(self, file_content: bytes, valid_names: list[str]) -> bool:
    # 	self.__check_limit()
    # 	valid_names = {name.lower().strip() for name in valid_names}
    
    # 	client = vision.ImageAnnotatorClient()
    # 	request: dict = {
    # 		'image': {
    # 			'content': file_content
    # 		},
    # 		"features": [
    # 			{
    # 				"type": vision.Feature.Type.LABEL_DETECTION,
    # 				"max_results": 10
    # 			}
    # 		]
    # 	}
    # 	response: vision.AnnotateImageResponse = client.annotate_image(request)
    # 	print((response))
    # 	return_label = None
    # 	for label in response.label_annotations:
    # 		label_name = label.description.lower()
    # 		if any(label_name in v for v in valid_names):
    # 			print(f"✅ Found partial match: {label.description} (score={label.score:.2f})")
    # 			return_label = label
    # 	if (return_label != None):
    # 		return return_label.description
    # 	else: return None
