// GPA Calculator script
console.log('GPA Calculator script loaded');

// Default GPA scale
const defaultGpaScale = {
    'aplus': 4.0,
    'a': 4.0,
    'aminus': 3.7,
    'bplus': 3.3,
    'b': 3.0,
    'bminus': 2.7,
    'cplus': 2.3,
    'c': 2.0,
    'cminus': 1.7,
    'dplus': 1.3,
    'd': 1.0,
    'dminus': 0.7,
    'f': 0.0
};

// Current GPA scale
let gpaScale = { ...defaultGpaScale };

// Default prior GPA data
let priorGpaData = {
    gpa: 0.00,
    credits: 0
};

// Store expanded state of semesters
let expandedSemesters = {};
// Store current filter for selecting a semester ('all' shows all)
let currentFilter = 'all';

// Filter by academic year
let currentYearFilter = 'all';
const semesterYearMap = {
    'freshman_fall': 'freshman',
    'freshman_spring': 'freshman',
    'sophomore_fall': 'sophomore',
    'sophomore_spring': 'sophomore',
    'junior_fall': 'junior',
    'junior_spring': 'junior',
    'senior_fall': 'senior',
    'senior_spring': 'senior'
};

// Display semesters in a fixed academic order
const orderedSemesters = [
    'freshman_fall',
    'freshman_spring',
    'sophomore_fall',
    'sophomore_spring',
    'junior_fall',
    'junior_spring',
    'senior_fall',
    'senior_spring'
];

// Determine letter grade from GPA
function getLetterGradeFromGpa(gpa) {
    if (gpa >= 4.0) return 'A+';
    if (gpa >= 3.85) return 'A';
    if (gpa >= 3.5) return 'A-';
    if (gpa >= 3.15) return 'B+';
    if (gpa >= 2.85) return 'B';
    if (gpa >= 2.5) return 'B-';
    if (gpa >= 2.15) return 'C+';
    if (gpa >= 1.85) return 'C';
    if (gpa >= 1.5) return 'C-';
    if (gpa >= 1.15) return 'D+';
    if (gpa >= 0.85) return 'D';
    if (gpa >= 0.5) return 'D-';
    return 'F';
}

// Apply visual style to GPA value based on range
function applyGpaStyle(element, gpa) {
    // Remove existing classes
    element.classList.remove('excellent', 'good', 'average', 'fair', 'poor', 'failing');
    
    // Add appropriate class based on GPA value
    if (gpa >= 3.7) {
        element.classList.add('excellent');
    } else if (gpa >= 3.0) {
        element.classList.add('good');
    } else if (gpa >= 2.3) {
        element.classList.add('average');
    } else if (gpa >= 1.7) {
        element.classList.add('fair');
    } else if (gpa >= 1.0) {
        element.classList.add('poor');
    } else {
        element.classList.add('failing');
    }
}

// Load semester data from localStorage
function loadSemesterData() {
    const savedData = localStorage.getItem('gradeCalculatorData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            return parsedData.semesters || {};
        } catch (e) {
            console.error('Error loading semester data from localStorage:', e);
            return {};
        }
    }
    return {};
}

// Load GPA scale from localStorage
function loadGpaScale() {
    const savedScale = localStorage.getItem('gpaScale');
    if (savedScale) {
        try {
            gpaScale = JSON.parse(savedScale);
            console.log('GPA scale loaded from localStorage');
            
            // Update the scale input values
            document.getElementById('scale-aplus').value = gpaScale.aplus;
            document.getElementById('scale-a').value = gpaScale.a;
            document.getElementById('scale-aminus').value = gpaScale.aminus;
            document.getElementById('scale-bplus').value = gpaScale.bplus;
            document.getElementById('scale-b').value = gpaScale.b;
            document.getElementById('scale-bminus').value = gpaScale.bminus;
            document.getElementById('scale-cplus').value = gpaScale.cplus;
            document.getElementById('scale-c').value = gpaScale.c;
            document.getElementById('scale-cminus').value = gpaScale.cminus;
            document.getElementById('scale-dplus').value = gpaScale.dplus;
            document.getElementById('scale-d').value = gpaScale.d;
            document.getElementById('scale-dminus').value = gpaScale.dminus;
            document.getElementById('scale-f').value = gpaScale.f;
        } catch (e) {
            console.error('Error loading GPA scale from localStorage:', e);
            gpaScale = { ...defaultGpaScale };
        }
    }
}

// Load prior GPA data from localStorage
function loadPriorGpaData() {
    const savedPriorData = localStorage.getItem('priorGpaData');
    if (savedPriorData) {
        try {
            priorGpaData = JSON.parse(savedPriorData);
            console.log('Prior GPA data loaded from localStorage');
            
            // Update the input values
            document.getElementById('prior-gpa').value = priorGpaData.gpa;
            document.getElementById('prior-credits').value = priorGpaData.credits;
        } catch (e) {
            console.error('Error loading prior GPA data from localStorage:', e);
            priorGpaData = { gpa: 0.00, credits: 0 };
        }
    }
}

// Save prior GPA data to localStorage
function savePriorGpaData() {
    try {
        const gpa = parseFloat(document.getElementById('prior-gpa').value) || 0;
        const credits = parseInt(document.getElementById('prior-credits').value) || 0;
        
        priorGpaData = { gpa, credits };
        localStorage.setItem('priorGpaData', JSON.stringify(priorGpaData));
        console.log('Prior GPA data saved to localStorage');
    } catch (e) {
        console.error('Error saving prior GPA data to localStorage:', e);
    }
}

// Save GPA scale to localStorage
function saveGpaScale() {
    try {
        localStorage.setItem('gpaScale', JSON.stringify(gpaScale));
        console.log('GPA scale saved to localStorage');
    } catch (e) {
        console.error('Error saving GPA scale to localStorage:', e);
    }
}

// Update GPA scale from input values
function updateGpaScale() {
    gpaScale.aplus = parseFloat(document.getElementById('scale-aplus').value) || defaultGpaScale.aplus;
    gpaScale.a = parseFloat(document.getElementById('scale-a').value) || defaultGpaScale.a;
    gpaScale.aminus = parseFloat(document.getElementById('scale-aminus').value) || defaultGpaScale.aminus;
    gpaScale.bplus = parseFloat(document.getElementById('scale-bplus').value) || defaultGpaScale.bplus;
    gpaScale.b = parseFloat(document.getElementById('scale-b').value) || defaultGpaScale.b;
    gpaScale.bminus = parseFloat(document.getElementById('scale-bminus').value) || defaultGpaScale.bminus;
    gpaScale.cplus = parseFloat(document.getElementById('scale-cplus').value) || defaultGpaScale.cplus;
    gpaScale.c = parseFloat(document.getElementById('scale-c').value) || defaultGpaScale.c;
    gpaScale.cminus = parseFloat(document.getElementById('scale-cminus').value) || defaultGpaScale.cminus;
    gpaScale.dplus = parseFloat(document.getElementById('scale-dplus').value) || defaultGpaScale.dplus;
    gpaScale.d = parseFloat(document.getElementById('scale-d').value) || defaultGpaScale.d;
    gpaScale.dminus = parseFloat(document.getElementById('scale-dminus').value) || defaultGpaScale.dminus;
    gpaScale.f = parseFloat(document.getElementById('scale-f').value) || defaultGpaScale.f;
    
    saveGpaScale();
}

// Toggle scale settings visibility
function toggleScaleSettings() {
    const settingsDiv = document.getElementById('scale-settings');
    const toggleBtn = document.getElementById('toggle-scale-settings');
    
    if (settingsDiv.classList.contains('hidden')) {
        settingsDiv.classList.remove('hidden');
        toggleBtn.textContent = 'Hide Scale Settings';
    } else {
        settingsDiv.classList.add('hidden');
        toggleBtn.textContent = 'Show Scale Settings';
    }
}

// Convert letter grade to GPA value using current scale
function gpaFromLetter(letter) {
    const l = letter.trim().toUpperCase();
    const map = {
        'A+': gpaScale.aplus,
        'A': gpaScale.a,
        'A-': gpaScale.aminus,
        'B+': gpaScale.bplus,
        'B': gpaScale.b,
        'B-': gpaScale.bminus,
        'C+': gpaScale.cplus,
        'C': gpaScale.c,
        'C-': gpaScale.cminus,
        'D+': gpaScale.dplus,
        'D': gpaScale.d,
        'D-': gpaScale.dminus,
        'F': gpaScale.f
    };
    return map[l] !== undefined ? map[l] : 0;
}

// Save semester data to localStorage
function saveSemestersToLocalStorage(semesters) {
    let data = { semesters: {}, currentSemesterId: '', currentClassId: '' };
    const raw = localStorage.getItem('gradeCalculatorData');
    if (raw) {
        try { data = JSON.parse(raw); } catch (e) {}
    }
    data.semesters = semesters;
    localStorage.setItem('gradeCalculatorData', JSON.stringify(data));
}

// Parse transcript text lines (CSV: semester,year,course,credits,grade)
function parseTranscriptText(text) {
    const semesters = loadSemesterData();
    const creditsMap = loadClassCredits();
    text.split(/\r?\n/).forEach(line => {
        const parts = line.split(/[,\t]/).map(p => p.trim()).filter(p => p);
        if (parts.length < 5) return;
        const [sem, year, course, creditsStr, gradeLetter] = parts;
        const semName = `${sem} ${year}`;
        let semId = Object.keys(semesters).find(id => semesters[id].name === semName);
        if (!semId) {
            semId = `semester${Date.now()}${Math.random().toString(36).slice(2,5)}`;
            semesters[semId] = { name: semName, classes: {} };
        }
        const classId = `class${Date.now()}${Math.random().toString(36).slice(2,5)}`;
        semesters[semId].classes[classId] = {
            name: course,
            assignments: [],
            letterGrade: gradeLetter.trim().toUpperCase()
        };
        creditsMap[classId] = parseFloat(creditsStr) || 0;
    });
    saveSemestersToLocalStorage(semesters);
    localStorage.setItem('classCredits', JSON.stringify(creditsMap));
    updateGpaTable();
}

// Upload an image to OCR API and parse the returned text
function parseTranscriptImage(file) {
    const apiKey = document.getElementById('ocr-api-key').value.trim();
    if (!apiKey) {
        alert('Please enter your OCR API key.');
        return;
    }
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('language', 'eng');
    formData.append('file', file);
    fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data && data.ParsedResults && data.ParsedResults.length > 0) {
                const text = data.ParsedResults.map(pr => pr.ParsedText).join('\n');
                parseTranscriptText(text);
            } else {
                alert('No text detected in the image.');
            }
        })
        .catch(err => {
            console.error('OCR error', err);
            alert('Failed to process image.');
        });
}
// Calculate GPA based on percentage grade using custom scale

function calculateGpaValue(percentage) {
    if (percentage >= 97) return gpaScale.aplus;
    if (percentage >= 93) return gpaScale.a;
    if (percentage >= 90) return gpaScale.aminus;
    if (percentage >= 87) return gpaScale.bplus;
    if (percentage >= 83) return gpaScale.b;
    if (percentage >= 80) return gpaScale.bminus;
    if (percentage >= 77) return gpaScale.cplus;
    if (percentage >= 73) return gpaScale.c;
    if (percentage >= 70) return gpaScale.cminus;
    if (percentage >= 67) return gpaScale.dplus;
    if (percentage >= 63) return gpaScale.d;
    if (percentage >= 60) return gpaScale.dminus;
    return gpaScale.f;
}

// Get letter grade based on percentage
function getLetterGrade(percentage) {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
}

// Calculate final grade for a class
function calculateClassGrade(assignments) {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    assignments.forEach(assignment => {
        const score = parseFloat(assignment.score);
        const weight = parseFloat(assignment.weight);

        if (!isNaN(score) && !isNaN(weight)) {
            totalWeightedScore += score * (weight / 100);
            totalWeight += weight;
        }
    });

    // If no assignments with weights, return 0
    if (totalWeight === 0) {
        return 0;
    }

    return totalWeightedScore / (totalWeight / 100);
}

// Save class credits to localStorage
function saveClassCredits() {
    const classCredits = {};
    document.querySelectorAll('.class-row').forEach(row => {
        if (row.dataset.classId) {
            const classId = row.dataset.classId;
            const credits = row.querySelector('.credits-input').value;
            classCredits[classId] = credits;
        }
    });
    
    localStorage.setItem('classCredits', JSON.stringify(classCredits));
}

// Load class credits from localStorage
function loadClassCredits() {
    const savedCredits = localStorage.getItem('classCredits');
    if (savedCredits) {
        try {
            return JSON.parse(savedCredits) || {};
        } catch (e) {
            console.error('Error loading class credits from localStorage:', e);
            return {};
        }
    }
    return {};
}

// Calculate semester stats (total credits, GPA)
function calculateSemesterStats(semesterId, classes) {
    const classCredits = loadClassCredits();
    let totalCredits = 0;
    let totalPoints = 0;
    
    Object.keys(classes).forEach(classId => {
        const classData = classes[classId];
        let gpaValue;
        if (classData.letterGrade) {
            gpaValue = gpaFromLetter(classData.letterGrade);
        } else {
            const grade = calculateClassGrade(classData.assignments);
            gpaValue = calculateGpaValue(grade);
        }
        const credits = parseFloat(classCredits[classId] || '3');
        
        if (!isNaN(credits) && !isNaN(gpaValue)) {
            totalPoints += gpaValue * credits;
            totalCredits += credits;
        }
    });
    
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    
    return {
        totalCredits,
        gpa
    };
}

// Toggle semester expanded/collapsed state
function toggleSemesterExpanded(semesterId) {
    expandedSemesters[semesterId] = !expandedSemesters[semesterId];
    updateGpaTable();
}

// Update the GPA table with class data
function updateGpaTable() {
    const semesters = loadSemesterData();
    const classCredits = loadClassCredits();
    const gpaTableBody = document.getElementById('gpa-classes');
    // Always show all semesters since selector removed
    const selectedSemesterId = currentFilter;
    const semesterHeading = document.getElementById('gpa-semester-heading');

    let headingText = '';
    if (selectedSemesterId !== 'all') {
        headingText = semesters[selectedSemesterId]?.name || 'Semester';
    } else if (currentYearFilter !== 'all') {
        headingText = `${currentYearFilter.charAt(0).toUpperCase()}${currentYearFilter.slice(1)} Year`;
    } else {
        headingText = 'All Semesters';
    }
    semesterHeading.textContent = headingText;

    // Clear existing rows
    gpaTableBody.innerHTML = '';
    
    // If no semesters, show message
    if (Object.keys(semesters).length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="4" style="text-align: center; padding: 20px;">
                No semesters found. Add classes in the Grade Calculator.
            </td>
        `;
        gpaTableBody.appendChild(row);
        return;
    }
    
    // Function to add semester row and its class rows
    function addSemesterWithClasses(semesterId) {
        const semesterData = semesters[semesterId];
        const classes = semesterData.classes;
        const isExpanded = expandedSemesters[semesterId];
        
        // Calculate semester stats
        const stats = calculateSemesterStats(semesterId, classes);
        
        // Add semester row (the parent row that can be expanded)
        const semesterRow = document.createElement('tr');
        semesterRow.className = 'semester-row';
        semesterRow.dataset.semesterId = semesterId;
        
        semesterRow.innerHTML = `
            <td class="semester-toggle">
                <button class="expand-toggle ${isExpanded ? 'expanded' : ''}" aria-label="${isExpanded ? 'Collapse' : 'Expand'} semester">
                    <span class="toggle-icon">${isExpanded ? '-' : '+'}</span>
                </button>
                <span class="semester-name">${semesterData.name}</span>
            </td>
            <td>${stats.totalCredits.toFixed(1)}</td>
            <td>${stats.gpa.toFixed(2)}</td>
            <td>${getLetterGradeFromGpa(stats.gpa)}</td>
        `;
        
        applyGpaStyle(semesterRow.querySelector('td:nth-child(3)'), stats.gpa);
        gpaTableBody.appendChild(semesterRow);
        
        // Add event listener to toggle button
        const toggleBtn = semesterRow.querySelector('.expand-toggle');
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSemesterExpanded(semesterId);
        });
        
        // Add click handler to the row to filter view by semester (toggle between this semester and all)
        semesterRow.addEventListener('click', (e) => {
            if (!e.target.closest('input') && !e.target.closest('button')) {
                if (currentFilter === semesterId) {
                    currentFilter = 'all';
                    // collapse all semesters
                    Object.keys(expandedSemesters).forEach(id => expandedSemesters[id] = false);
                } else {
                    // show only this semester and expand it
                    currentFilter = semesterId;
                    Object.keys(expandedSemesters).forEach(id => expandedSemesters[id] = false);
                    expandedSemesters[semesterId] = true;
                }
                updateGpaTable();
            }
        });
        
        // If expanded, add class rows
        if (isExpanded) {
            // If no classes, show message
            if (Object.keys(classes).length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.className = 'class-row empty-message';
                emptyRow.innerHTML = `
                    <td colspan="4" style="text-align: center; padding: 10px;">
                        No classes found in this semester.
                    </td>
                `;
                gpaTableBody.appendChild(emptyRow);
            } else {
                // Add a row for each class in the semester
                Object.keys(classes).forEach(classId => {
                    const classData = classes[classId];
                    let gpaValue;
                    let letterGrade;
                    if (classData.letterGrade) {
                        letterGrade = classData.letterGrade.toUpperCase();
                        gpaValue = gpaFromLetter(letterGrade);
                    } else {
                        const grade = calculateClassGrade(classData.assignments);
                        gpaValue = calculateGpaValue(grade);
                        letterGrade = getLetterGrade(grade);
                    }
                    const credits = classCredits[classId] || '3';
                    
                    const row = document.createElement('tr');
                    row.className = 'class-row';
                    row.dataset.classId = classId;
                    row.dataset.semesterId = semesterId;
                    row.dataset.grade = letterGrade;
                    row.dataset.gpaValue = gpaValue;
                    row.dataset.className = classData.name;
                    
                    row.innerHTML = `
                        <td class="class-indent">
                            <span class="class-name">${classData.name}</span>
                        </td>
                        <td>
                            <input type="number" class="credits-input" min="0" max="6" step="0.5" value="${credits}">
                        </td>
                        <td>${gpaValue.toFixed(2)}</td>
                        <td>${letterGrade}</td>
                    `;
                    
                    applyGpaStyle(row.querySelector('td:nth-child(3)'), gpaValue);
                    gpaTableBody.appendChild(row);
                    
                    // Add event listener for the class row to navigate to edit page
                    row.querySelector('.class-name').addEventListener('click', () => {
                        localStorage.setItem('redirectParams', JSON.stringify({
                            currentSemesterId: semesterId,
                            currentClassId: classId
                        }));
                        window.location.href = "index.html";
                    });
                });
            }
        }
    }
    
    // Add semesters based on selected semester
    if (selectedSemesterId === 'all') {
        // Add semesters in predefined order if they exist and match year filter
        orderedSemesters.forEach(semId => {
            if (
                semesters[semId] &&
                (currentYearFilter === 'all' || semesterYearMap[semId] === currentYearFilter)
            ) {
                addSemesterWithClasses(semId);
            }
        });
    } else if (semesters[selectedSemesterId]) {
        // Add just the selected semester
        addSemesterWithClasses(selectedSemesterId);
    }
    
    // If no rows were added, show a message
    if (gpaTableBody.children.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="4" style="text-align: center; padding: 20px;">
                No classes found in the selected semester. Add classes in the Grade Calculator.
            </td>
        `;
        gpaTableBody.appendChild(row);
        return;
    }
    
    // Add event listeners to credit inputs
    document.querySelectorAll('.credits-input').forEach(input => {
        input.addEventListener('change', () => {
            saveClassCredits();
            calculateGpa();
        });
    });
    
    // Add event listeners to edit links
    document.querySelectorAll('.edit-class-link').forEach(link => {
        link.addEventListener('click', (e) => {
            localStorage.setItem('redirectParams', JSON.stringify({
                currentSemesterId: link.dataset.semesterId,
                currentClassId: link.dataset.classId
            }));
        });
    });
    
    // Calculate GPA after updating the table
    calculateGpa();
}

// Listen for changes to localStorage to update in real-time
function setupStorageListener() {
    window.addEventListener('storage', (event) => {
        if (event.key === 'gradeCalculatorData') {
            updateGpaTable();
        }
    });
}

// Calculate and update the GPA display
function calculateGpa() {
    let totalCredits = 0;
    let totalPoints = 0;
    
    document.querySelectorAll('.class-row').forEach(row => {
        if (row.dataset.gpaValue) {
            const gpaValue = parseFloat(row.dataset.gpaValue);
            const credits = parseFloat(row.querySelector('.credits-input').value) || 0;
            
            if (!isNaN(gpaValue) && !isNaN(credits)) {
                totalPoints += gpaValue * credits;
                totalCredits += credits;
            }
        }
    });
    
    // Calculate current term GPA
    const currentGpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const currentGpaElement = document.getElementById('current-gpa');
    const currentLetterGradeElement = document.getElementById('current-letter-grade');
    
    currentGpaElement.textContent = currentGpa.toFixed(2);
    currentLetterGradeElement.textContent = getLetterGradeFromGpa(currentGpa);
    applyGpaStyle(currentGpaElement, currentGpa);
    
    // Calculate cumulative GPA with prior GPA
    const priorGpa = parseFloat(document.getElementById('prior-gpa').value) || 0;
    const priorCredits = parseFloat(document.getElementById('prior-credits').value) || 0;
    
    let cumulativeGpa = 0;
    if (priorCredits > 0 || totalCredits > 0) {
        const totalPriorPoints = priorGpa * priorCredits;
        cumulativeGpa = (totalPriorPoints + totalPoints) / (priorCredits + totalCredits);
    }
    
    const predictedGpaElement = document.getElementById('predicted-gpa');
    const predictedLetterGradeElement = document.getElementById('predicted-letter-grade');
    
    predictedGpaElement.textContent = cumulativeGpa.toFixed(2);
    predictedLetterGradeElement.textContent = getLetterGradeFromGpa(cumulativeGpa);
    applyGpaStyle(predictedGpaElement, cumulativeGpa);
    
    // Update the total credits count in the UI if desired
    document.querySelector('.gpa-heading').setAttribute('title', `Total Credits: ${totalCredits.toFixed(1)}`);
}

// Initialize the GPA calculator
document.addEventListener('DOMContentLoaded', () => {
    // Load GPA scale on load
    loadGpaScale();

    // Load prior GPA data on load
    loadPriorGpaData();

    // No semester selector, only update Gpa table

    // Update GPA table on load
    updateGpaTable();

    // Set up storage listener to detect changes from other pages
    setupStorageListener();

    // Add event listener for update button
    document.getElementById('update-gpa').addEventListener('click', updateGpaTable);

    // Add event listener for expand all button
    document.getElementById('expand-all').addEventListener('click', () => {
        const semesters = loadSemesterData();
        Object.keys(semesters).forEach(semesterId => {
            expandedSemesters[semesterId] = true;
        });
        updateGpaTable();
    });
    
    // Add event listener for collapse all button
    document.getElementById('collapse-all').addEventListener('click', () => {
        const semesters = loadSemesterData();
        Object.keys(semesters).forEach(semesterId => {
            expandedSemesters[semesterId] = false;
        });
        updateGpaTable();
    });

    // Change year filter
    const yearSelect = document.getElementById('year-filter');
    if (yearSelect) {
        yearSelect.addEventListener('change', () => {
            currentYearFilter = yearSelect.value;
            // Collapse semesters when changing filter
            Object.keys(expandedSemesters).forEach(id => expandedSemesters[id] = false);
            updateGpaTable();
        });
    }
    
    // Add event listeners for prior GPA and credits
    document.getElementById('prior-gpa').addEventListener('input', () => {
        savePriorGpaData();
        calculateGpa();
    });
    document.getElementById('prior-credits').addEventListener('input', () => {
        savePriorGpaData();
        calculateGpa();
    });
    document.getElementById("upload-transcript").addEventListener("click", () => {
        const fileInput = document.getElementById("transcript-file");
        if (!fileInput || !fileInput.files.length) return;
        const reader = new FileReader();
        reader.onload = e => parseTranscriptText(e.target.result);
        reader.readAsText(fileInput.files[0]);
    });
    document.getElementById("upload-transcript-photo").addEventListener("click", () => {
        const imgInput = document.getElementById("transcript-image-file");
        if (!imgInput || !imgInput.files.length) return;
        parseTranscriptImage(imgInput.files[0]);
    });

    // Add event listener for scale settings toggle
    document.getElementById('toggle-scale-settings').addEventListener('click', toggleScaleSettings);

    // Add event listener for save scale button
    document.getElementById('save-scale').addEventListener('click', () => {
        updateGpaScale();
        updateGpaTable(); // Update table to reflect new GPA values
        alert('GPA scale saved successfully!');
    });
});