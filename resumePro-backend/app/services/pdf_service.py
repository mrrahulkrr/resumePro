import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class PDFService:
    def __init__(self):
        # Using latex.ytotech.com - free, open-source LaTeX compilation service
        # GitHub: https://github.com/YtoTech/latex-on-http
        self.compiler_url = "https://latex.ytotech.com/builds/sync"

    async def compile_latex(self, latex_content: str) -> Optional[bytes]:
        """
        Compiles LaTeX code into a PDF binary using latex.ytotech.com API.
        """
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
