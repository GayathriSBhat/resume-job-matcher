import re

class ExtractJobTitle:
    def extract(self, text):
        lines = text.splitlines()
        for line in lines[:5]:  # Look only at top lines
            if re.match(r"^[A-Z][a-zA-Z ]+$", line) and "job" not in line.lower():
                return line.strip()
        return "Untitled JD"
