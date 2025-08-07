import re

class ExtractJobTitle:
    def extract(self, text):

        patterns = [
        r'(?i)(?:position of|role of|hiring for|job title[:\-]?)\s+([A-Z][\w\s\d\-\/]+)', 
        r'(?i)we are looking for a[n]?\s+([A-Z][\w\s\d\-\/]+)'
        r'(?i)^Title[:\-]?\s*([A-Z][\w\s\d\-\/]+)' 
        ]
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()

        lines = text.splitlines()
        for line in lines[:5]:  # Look only at top lines
            if re.match(r"^[A-Z][a-zA-Z ]+$", line) and "job" not in line.lower():
                return line.strip()
            
        return "Untitled JD"


