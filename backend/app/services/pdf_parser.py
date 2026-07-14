import re
from typing import List, Dict

import fitz  # PyMuPDF


def detect_sections(text: str):
    section_patterns = r"\n(?:\d+\.?\s*)?([A-Z][A-Za-z\s]{2,})\n"
    splits = re.split(section_patterns, text)

    sections = []
    for i in range(1, len(splits), 2):
        title = splits[i].strip()
        content = splits[i + 1].strip()
        sections.append((title, content))

    if not sections:
        sections.append((" ", text))

    return sections


def extract_pdf_with_metadata(file_path: str) -> List[Dict]:
    doc = fitz.open(file_path)
    documents = []

    for page_num, page in enumerate(doc):
        text = page.get_text()
        sections = detect_sections(text)

        for section_title, section_text in sections:
            documents.append({
                "text": section_text,
                "page": page_num + 1,
                "section": section_title
            })

    doc.close()
    return documents
