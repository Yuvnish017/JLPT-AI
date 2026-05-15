import fitz
import json

pdf_path = "books/n5_book1.pdf"

doc = fitz.open(pdf_path)

pages = []

for page_num, page in enumerate(doc):
    text = page.get_text("text")

    pages.append({
        "page": page_num + 1,
        "content": text
    })

with open("books/n5_pages.json", "w", encoding="utf-8") as file:
    json.dump(
        pages,
        file,
        ensure_ascii=False,
        indent=2
    )

print("Pages extracted!")