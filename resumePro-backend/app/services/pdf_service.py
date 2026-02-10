import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

import hashlib

class PDFService:
    def __init__(self):
        # Using latex.ytotech.com - free, open-source LaTeX compilation service
        self.compiler_url = "https://latex.ytotech.com/builds/sync"
        self._cache = {} # In-memory cache: {latex_hash: pdf_bytes}

    async def compile_latex(self, latex_content: str) -> Optional[bytes]:
        """
        Compiles LaTeX code into a PDF binary using latex.ytotech.com API.
        Includes local caching to prevent redundant compilations.
        """
        # Generate hash for caching
        latex_hash = hashlib.md5(latex_content.encode()).hexdigest()
        
        # Check cache
        if latex_hash in self._cache:
            logger.info("Returning cached PDF compilation result")
            return self._cache[latex_hash]
        try:
            logger.info("Sending LaTeX to compilation service...")
            async with httpx.AsyncClient(timeout=120.0) as client:
                # ytotech expects JSON with compiler and resources
                payload = {
                    "compiler": "pdflatex",
                    "resources": [
                        {"main": True, "content": latex_content}
                    ]
                }
                response = await client.post(
                    self.compiler_url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                # ytotech returns 201 on success
                if response.status_code in [200, 201]:
                    # Verify it's actually a PDF
                    if response.content[:4] == b'%PDF':
                        logger.info("PDF compilation successful")
                        # Update cache
                        self._cache[latex_hash] = response.content
                        return response.content
                    else:
                        logger.error(f"Response is not a valid PDF: {response.content[:100]}")
                        return None
                else:
                    error_msg = response.text[:500] if response.text else "Unknown error"
                    logger.error(f"LaTeX compilation failed with status {response.status_code}: {error_msg}")
                    return None
                    
        except httpx.TimeoutException:
            logger.error("LaTeX compilation timed out after 120 seconds")
            return None
        except Exception as e:
            logger.error(f"Error during PDF compilation: {str(e)}")
            return None

pdf_service = PDFService()
