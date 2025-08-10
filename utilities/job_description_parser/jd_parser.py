import fitz  # PyMuPDF
from utilities.job_description_parser.extract_jobTitle import ExtractJobTitle
# from utilties.resume_parser.extract_total_experience import ExtractTotalExperience
from utilities.resume_parser.extract_skills import ExtractSkills

class JDParser:
    def __init__(self, jd_path=None, jd_binary=None):
        self.jd_path = jd_path
        self.jd_binary = jd_binary

    def parse(self):
        if self.jd_binary is not None:
            return self.parse_from_binary()
        elif self.jd_path is not None:
            return self.parse_from_file()
        else:
            raise ValueError("Either jd_path or jd_binary must be provided.")
    
    def parse_from_file(self):
        with open(self.jd_path, "rb") as f:
            content = f.read()
        return self._extract_info_from_pdf(content)
    
    def parse_from_binary(self):
        return self._extract_info_from_pdf(self.jd_binary)
    
    def _extract_info_from_pdf(self, binary_pdf):
        doc = fitz.open(stream=binary_pdf, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()

        return self._extract_fields(text)
    
    def _extract_fields(self, text):
        try:
            title = ExtractJobTitle().extract(text)
        except Exception as e:
            print("Title extraction failed:", e)
            title = None
        
        skills=ExtractSkills().extract_skills(text)

        return {
            'title': title,
            'skills':skills,
            'raw_text': text
        }