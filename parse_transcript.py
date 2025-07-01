import os
import sys
import json
from typing import Dict
from pdfminer.high_level import extract_text
import openai

SYSTEM_PROMPT = """You are an academic transcript parser. Extract semester, course, credits and final letter grade information. Reply with JSON in the following form:\n{\n  \"semesters\": {\n    \"semester1\": {\n      \"name\": \"Fall 2020\",\n      \"classes\": {\n        \"class1\": {\n          \"name\": \"MATH 101\",\n          \"assignments\": [],\n          \"letterGrade\": \"A\"\n        }\n      }\n    }\n  },\n  \"classCredits\": {\n    \"class1\": 3\n  }\n}\nUse sequential identifiers like semester1, class1, class2, etc. If data is missing, use null. Do not include explanations."""

GPA_SCALE = {
    "A+": 4.0,
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "D-": 0.7,
    "F": 0.0,
}


def extract_pdf_text(path: str) -> str:
    """Return text extracted from a PDF file."""
    return extract_text(path)


def call_openai(prompt: str) -> Dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY environment variable not set")
    openai.api_key = api_key
    resp = openai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
        temperature=0,
    )
    content = resp.choices[0].message.content.strip()
    return json.loads(content)


def compute_gpa(data: Dict) -> Dict[str, float]:
    results = {}
    semesters = data.get("semesters", {})
    credits = data.get("classCredits", {})
    for sem_id, sem_data in semesters.items():
        total_c = 0.0
        total_p = 0.0
        for class_id, class_data in sem_data.get("classes", {}).items():
            credit = float(credits.get(class_id, 0))
            grade = class_data.get("letterGrade")
            if grade:
                grade = grade.strip().upper()
                gpa_val = GPA_SCALE.get(grade)
                if gpa_val is not None:
                    total_c += credit
                    total_p += gpa_val * credit
        gpa = total_p / total_c if total_c else 0.0
        results[sem_data.get("name", sem_id)] = round(gpa, 2)
    return results


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_transcript.py <transcript.pdf>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    text = extract_pdf_text(pdf_path)
    print("Extracted text from PDF. Parsing with OpenAI...")
    data = call_openai(text)
    with open("transcript_parsed.json", "w") as f:
        json.dump(data, f, indent=2)
    print("Saved parsed data to transcript_parsed.json")

    gpa_results = compute_gpa(data)
    for sem, gpa in gpa_results.items():
        print(f"{sem}: GPA {gpa:.2f}")


if __name__ == "__main__":
    main()
