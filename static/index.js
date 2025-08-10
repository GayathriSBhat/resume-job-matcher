let resumeUploaded = false;
let uploadedResumeId = null;

function uploadResume() {
    const fileInput = document.getElementById('resumeUpload');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a resume file.");
        return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    // Show spinner
    document.getElementById('spinner-overlay').style.display = 'flex';

    fetch('http://localhost:5000/upload_resume', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('spinner-overlay').style.display = 'none';

        if (data.resume_id) {
            resumeUploaded = true;
            uploadedResumeId = data.resume_id;

            const first_name = document.getElementById('first_name');
            const last_name = document.getElementById('last_name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const total_experience = document.getElementById('total_experience');
            const degrees = document.getElementById('degrees');
            const institutions = document.getElementById('institutions');
            const majors = document.getElementById('majors');
            const skills = document.getElementById('skills');
            
            let formatted = {};
            const order = [
                'first_name',
                'last_name',
                'email',
                'phone',
                'total_experience',
                'degrees',
                'institutions',
                'majors',
                'skills'
            ];
            const labels = {
                first_name: 'First Name',
                last_name: 'Last Name',
                email: 'Email',
                phone: 'Phone',
                total_experience: 'Total Experience',
                degrees: 'Degrees',
                institutions: 'Institutions',
                majors: 'Majors',
                skills: 'Skills'
            };
            for (const key of order) {
                
                if (key in data.parsed_data) {
                    let value = data.parsed_data[key];

                    switch(key){
                        case "first_name":                        
                            first_name.value=value 
                            break;
                        
                        case "last_name":                        
                            last_name.value=value
                            break;

                        case "email":
                            email.value=value
                            break;

                        case "phone":
                            phone.value=value
                            break;

                        case "total_experience":
                            total_experience.value=value
                            break;

                        case "degrees":
                            degrees.value=value
                            break;

                        case "institutions":
                            institutions.value=value
                            break;

                        case "majors":
                            majors.value=value
                            break;

                        case "skills":
                            skills.value=value
                            break;
                }
                    
                    
                    formatted += `${labels[key]}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
                }
            }
            

            alert("Resume uploaded and parsed successfully!");
        } else {
            alert("Resume uploaded but no ID received.");
        }
    })
    .catch(error => {
        alert("Error uploading resume: " + error.message);
    });
}

// form actions
document.getElementById("contactForm").addEventListener("submit", function(event) {
      event.preventDefault(); // Stop the form from submitting the default way

      // Get form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // Basic validation
      if (!name || !email) {
        document.getElementById("responseMessage").textContent = "Please fill in all required fields.";
        document.getElementById("responseMessage").style.color = "red";
        return;
      }

      // Simulate sending data (you could send this to a server using fetch/AJAX)
      console.log("Form Submitted:", { name, email, message });

      // Show success message
      document.getElementById("responseMessage").textContent = "Thank you! Your message has been sent.";
      document.getElementById("responseMessage").style.color = "green";

      // Optionally, reset the form
      document.getElementById("contactForm").reset();
    });

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('resumeUpload').addEventListener('change', uploadResume);
    document.getElementById('jdUpload').addEventListener('change', uploadJDFile); 
});

function toggleEdit(id) {
    let textarea;

    switch (id) {
        case 'nameEdit':
            textarea = document.getElementById('name');
            break;
        case 'emailEdit':
            textarea = document.getElementById('email');
            break;
        // add more cases as needed
        default:
            console.warn('Unknown ID:', id);
            return;
    }

    if (textarea) {
        textarea.readOnly = !textarea.readOnly;
        if (!textarea.readOnly) {
            textarea.focus();
        }
    }
}


function updateResumeInfo() {
    if (!uploadedResumeId) {
        alert("No resume uploaded yet.");
        return;
    }

    // Debug
     const ids = [
        "first_name", "last_name", "email", "phone",
        "total_experience", "degrees", "institutions", "majors", "skills"
    ];
    for (const id of ids) {
        if (!document.getElementById(id)) {
            alert(`Element with id "${id}" not found!`);
            return;
        }
    }
    // Collect updated data from form fields
        const name = document.getElementById("first_name").value + " " + document.getElementById("last_name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const total_experience = document.getElementById("total_experience").value;
        const degrees = document.getElementById("degrees").value;
        const institutions = document.getElementById("institutions").value;
        const majors = document.getElementById("majors").value;
        const skills = document.getElementById("skills").value;

    const updatedData = {
            resume_id: uploadedResumeId,
            name,
            email,
            phone,
            total_experience,
            degrees,
            institutions,
            majors,
            skills
        };

    

    fetch('/update_resume_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message || "Resume updated.");
        })
        .catch(error => {
            console.error('Update error:', error);
            alert("Error updating resume.");
        });
    }

// Common function to send JD data (from file or manual input)
function submitJD(title, skills) {
    
    fetch('http://localhost:5000/add_jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title,
            // description,
            skills, 
            resume_id: uploadedResumeId
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("JD submission failed.");
        }
        return response.json();
    })
    .then(data => {
        console.log("New JD ID:", data.jd_id);
        alert(data.message || "JD submitted successfully!");
         // If you want to use jd_id later you can use window.latestJDId anywhere else in your script to refer to the latest job description ID
        window.latestJDId = data.jd_id;
    })
    .catch(err => {
        alert("Error submitting JD: " + err.message);
    });

}

// Manual JD submission
function uploadJDManual() {
    const title = document.getElementById('jdTitle').value.trim();
    const description = document.getElementById('jdDesc').value.trim();

    if (!resumeUploaded || !uploadedResumeId) {
        return alert("Please upload a resume first.");
    }
     if (!title || !description) {
        return alert("Title and description are required.");
    }
    // call skill_extraction and send text, skills to database
    skillExtractor(title, description);
}

// Manual JD Skill Extraction
function skillExtractor(title, description) {
    title = document.getElementById('jdTitle').value.trim();
    description = document.getElementById('jdDesc').value.trim();

    if (!resumeUploaded || !uploadedResumeId) {
        return alert("Please upload a resume first.");
    }

    if (!title || !description) {
        return alert("Title and description are required.");
    }

    document.getElementById('spinner-overlay').style.display = 'flex';
    // Step 1: Extract skills from description
    fetch('http://localhost:5000/parse_jd_skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Skill extraction failed.");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('spinner-overlay').style.display = 'none';
        const skills = data.skills;
        // alert("Extracted skills: " + skills.join(', '));
        let formatted = `${Array.from(skills).join(', ')}\n`;


        console.log(formatted);
        // Step 2: Send to database
        submitJD(title, formatted);
        document.getElementById('jdSkill').value = formatted;
    })
    .catch(err => {
        document.getElementById('spinner-overlay').style.display = 'none';
        alert("Error parsing skills: " + err.message);
    });
}

// JD File upload
function uploadJDFile() {
    const fileInput = document.getElementById('jdFileInput');
    const file = fileInput.files[0];

    if (!resumeUploaded || !uploadedResumeId) {
        return alert("Upload a resume first.");    
    }

    const formData = new FormData();
    formData.append('jd_file', file);
    formData.append('resume_id', uploadedResumeId);
    console.log(uploadedResumeId)

    document.getElementById('spinner-overlay').style.display = 'flex';

    fetch('http://localhost:5000/parse_jd_file', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('spinner-overlay').style.display = 'none';

        console.log("Full JD JSON response:", data); 
        const title=data.title;
        const skills= data.skills;

        let formatted = `${Array.from(skills).join(', ')}\n`;

        console.log(formatted)

        document.getElementById('jdTitleUpload').value = title;
        document.getElementById('jdDescUpload').value = formatted;

        if (title && formatted) {
            submitJD(title, formatted);
            alert("JD uploaded and parsed successfully!");
        } else {
            alert("Failed to parse JD file.");
        }
    })
    .catch(err => {
        document.getElementById('spinner-overlay').style.display = 'none';
        alert("Error parsing JD file: " + err.message);
    });
}


// Update JD
function updateJD(source = "manual") {
    if (!window.latestJDId) {
        alert("No JD was found");
        return;
    }

    let title, skills;

    if (source === "manual") {
        // Manual JD form
        title = document.getElementById("jdTitle").value;
        skills = document.getElementById("jdSkill").value;
    } else if (source === "upload") {
        // Uploaded JD form
        title = document.getElementById("jdTitleUpload").value;
        // If skills come from parsing, fetch them from a parsed field
        skills = document.getElementById("jdDescUpload").value; 
    }

    const updatedData = {
        resume_id: uploadedResumeId,
        title,
        skills,
        jd_id: window.latestJDId
    };

    fetch('/update_jd_info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "JD updated.");
    })
    .catch(error => {
        console.error('Update error:', error);
        alert("Error updating JD.");
    });
}

