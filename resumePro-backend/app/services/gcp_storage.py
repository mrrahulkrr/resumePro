import os
import json
import logging
from google.cloud import storage
from google.oauth2 import service_account
from app.core.config import settings
from datetime import timedelta

logger = logging.getLogger(__name__)

class GCPStorageService:
    def __init__(self):
        self.bucket_name = settings.GCP_BUCKET_NAME
        self.project_id = settings.GCP_PROJECT_ID
        
        # Load credentials safely
        try:
            if settings.GOOGLE_APPLICATION_CREDENTIALS:
                if os.path.exists(settings.GOOGLE_APPLICATION_CREDENTIALS):
                    self.client = storage.Client.from_service_account_json(
                        settings.GOOGLE_APPLICATION_CREDENTIALS
                    )
                else:
                    # Alternative: If it's a JSON string in env
                    try:
                        creds_dict = json.loads(settings.GOOGLE_APPLICATION_CREDENTIALS)
                        creds = service_account.Credentials.from_service_account_info(creds_dict)
                        self.client = storage.Client(credentials=creds, project=self.project_id)
                    except:
                        logger.warning("GCP Credentials path not found and not a valid JSON string.")
                        self.client = None
            else:
                # Fallback to default credentials (useful for cloud environments)
                self.client = storage.Client()
        except Exception as e:
            logger.error(f"Failed to initialize GCP Storage: {e}")
            self.client = None

    def upload_file(self, content: bytes, destination_blob_name: str, content_type: str = "application/pdf"):
        """Uploads a file to the bucket."""
        if not self.client:
            logger.error("GCP client not initialized")
            return None

        try:
            bucket = self.client.bucket(self.bucket_name)
            blob = bucket.blob(destination_blob_name)
            blob.upload_from_string(content, content_type=content_type)
            logger.info(f"File uploaded to {destination_blob_name}")
            return blob.public_url
        except Exception as e:
            logger.error(f"Error uploading to GCP: {e}")
            return None

    def get_signed_url(self, blob_name: str, expiration_minutes: int = 60):
        """Generates a signed URL for temporary access to a file."""
        if not self.client:
            return None

        try:
            bucket = self.client.bucket(self.bucket_name)
            blob = bucket.blob(blob_name)
            url = blob.generate_signed_url(
                version="v4",
                expiration=timedelta(minutes=expiration_minutes),
                method="GET",
            )
            return url
        except Exception as e:
            logger.error(f"Error generating signed URL: {e}")
            return None

    def delete_file(self, blob_name: str):
        """Deletes a file from the bucket."""
        if not self.client:
            return False

        try:
            bucket = self.client.bucket(self.bucket_name)
            blob = bucket.blob(blob_name)
            blob.delete()
            logger.info(f"File {blob_name} deleted")
            return True
        except Exception as e:
            logger.error(f"Error deleting from GCP: {e}")
            return False

storage_service = GCPStorageService()
