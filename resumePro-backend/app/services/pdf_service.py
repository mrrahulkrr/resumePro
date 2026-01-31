import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class PDFService:
    def __init__(self):
        # Using a public LaTeX compilation service
        # In production, this should ideally be a local installation or a private service
        self.compiler_url = "https://latex.online/compile"

    async def compile_latex(self, latex_content: str) -> Optional[bytes]:
        """
        Compiles LaTeX code into a PDF binary using an external service.
        """
        try:
            logger.info("Sending LaTeX to compilation service...")
            async with httpx.AsyncClient(timeout=60.0) as client:
                # The service expects the LaTeX content either as a file or in the query/body
                # Sending as a file is usually more reliable for larger content
                files = {'file': ('resume.tex', latex_content)}
                response = await client.post(self.compiler_url, files=files)
                
                if response.status_code == 200:
                    logger.info("PDF compilation successful")
                    return response.content
                else:
                    logger.error(f"LaTeX compilation failed with status {response.status_code}: {response.text[:200]}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error during PDF compilation: {str(e)}")
            return None

pdf_service = PDFService()
