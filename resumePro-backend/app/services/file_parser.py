import io
import logging
from typing import Optional
from PyPDF2 import PdfReader

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_content: bytes) -> Optional[str]:
    """
    Extract text content from a PDF file.
    
    Args:
        file_content: Raw bytes of the PDF file
        
    Returns:
        Extracted text as a string, or None if extraction fails
    """
    try:
        pdf_file = io.BytesIO(file_content)
        reader = PdfReader(pdf_file)
        
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        
        full_text = "\n".join(text_parts)
        logger.info(f"Successfully extracted {len(full_text)} characters from PDF")
        return full_text.strip()
        
    except Exception as e:
        logger.error(f"Failed to extract text from PDF: {e}")
        return None


def extract_text_from_txt(file_content: bytes) -> Optional[str]:
    """
    Extract text content from a TXT file.
    
    Args:
        file_content: Raw bytes of the TXT file
        
    Returns:
        Text content as a string
    """
    try:
        # Try UTF-8 first, then fall back to latin-1
        try:
            text = file_content.decode('utf-8')
        except UnicodeDecodeError:
            text = file_content.decode('latin-1')
        
        logger.info(f"Successfully extracted {len(text)} characters from TXT")
        return text.strip()
        
    except Exception as e:
        logger.error(f"Failed to extract text from TXT: {e}")
        return None


def extract_text_from_file(file_content: bytes, filename: str) -> Optional[str]:
    """
    Extract text from a file based on its extension.
    
    Args:
        file_content: Raw bytes of the file
        filename: Original filename to determine file type
        
    Returns:
        Extracted text as a string, or None if extraction fails
    """
    filename_lower = filename.lower()
    
    if filename_lower.endswith('.pdf'):
        return extract_text_from_pdf(file_content)
    elif filename_lower.endswith('.txt'):
        return extract_text_from_txt(file_content)
    else:
        logger.warning(f"Unsupported file type: {filename}")
        return None
