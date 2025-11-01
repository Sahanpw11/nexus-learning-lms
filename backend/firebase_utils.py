import firebase_admin
from firebase_admin import credentials, storage
from typing import Optional
import os
from config import FIREBASE_CREDENTIALS_PATH
import uuid

class FirebaseStorage:
    def __init__(self):
        self.initialized = False
        self.bucket = None
        self._initialize()

    def _initialize(self):
        try:
            if not firebase_admin._apps:
                if os.path.exists(FIREBASE_CREDENTIALS_PATH):
                    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
                    firebase_admin.initialize_app(cred, {
                        'storageBucket': 'your-firebase-project.appspot.com'  # Replace with your bucket
                    })
                else:
                    # For development, you can use default credentials
                    # Make sure to set up Firebase properly in production
                    print("Warning: Firebase credentials not found. Please configure Firebase.")
                    return

            self.bucket = storage.bucket()
            self.initialized = True
        except Exception as e:
            print(f"Firebase initialization error: {e}")
            self.initialized = False

    def upload_file(self, file_content: bytes, file_name: str, content_type: str = None) -> Optional[str]:
        if not self.initialized:
            return None
        
        try:
            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}_{file_name}"
            blob = self.bucket.blob(unique_filename)
            
            if content_type:
                blob.content_type = content_type
            
            blob.upload_from_string(file_content)
            
            # Make the blob publicly readable (optional)
            blob.make_public()
            
            return blob.public_url
        except Exception as e:
            print(f"File upload error: {e}")
            return None

    def delete_file(self, file_url: str) -> bool:
        if not self.initialized:
            return False
        
        try:
            # Extract blob name from URL
            blob_name = file_url.split('/')[-1]
            blob = self.bucket.blob(blob_name)
            blob.delete()
            return True
        except Exception as e:
            print(f"File deletion error: {e}")
            return False

    def get_download_url(self, file_path: str) -> Optional[str]:
        if not self.initialized:
            return None
        
        try:
            blob = self.bucket.blob(file_path)
            # Generate a signed URL that expires in 1 hour
            url = blob.generate_signed_url(expiration=3600)
            return url
        except Exception as e:
            print(f"URL generation error: {e}")
            return None

# Global instance
firebase_storage = FirebaseStorage()
