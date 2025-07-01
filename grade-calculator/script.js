// script.js
console.log('Grade Calculator script loaded');

// Store semester data with classes inside
// Predefined semesters for four academic years
let semesters = {
    'freshman_fall': {
        name: 'Freshman Fall',
        classes: {
            'class1': {
                name: 'Class 1',
                assignments: []
            }
        }
    },
    'freshman_spring': {
        name: 'Freshman Spring',
        classes: {
            'class1': {
                name: 'Class 1',
                assignments: []
            }
        }
    },
    'sophomore_fall': {
        name: 'Sophomore Fall',
        classes: {
            'class1': {
                name: 'Class 1',
                assignments: []
            }
        }
    },
    'sophomore_spring': {
        name: 'Sophomore Spring',
        classes: {
            'class1': {
                name: 'Class 1',
                assignments: []
            }
        }
    },
    'junior_fall': {
        name: 'Junior Fall',
        classes: {
            'class1': {
                name: 'Class 1',
                assignments: []
            }
        }
    },
    'junior_spring': {
        name: 'Junior Spring',
        classes: {
            'class1': {
                name: 'Class 1',
                assignments: []
            }
        }
    },
    'senior_fall': {
        name: 'Senior Fall',
        classes: {
            'class1': {
                name: 'Class 1',
                assignments: []
            }
        }
    },
    'senior_spring': {
        name: 'Senior Spring',
        classes: {
            'class1': {
                name: 'Class 1',
                assignments: []
            }
        }
    }
};

let currentSemesterId = 'freshman_fall';
let currentClassId = 'class1';

// Load data from localStorage if available
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('gradeCalculatorData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            semesters = parsedData.semesters || semesters;
            currentSemesterId = parsedData.currentSemesterId || currentSemesterId;
            currentClassId = parsedData.currentClassId || currentClassId;
            console.log('Data loaded from localStorage');
        } catch (e) {
            console.error('Error loading data from localStorage:', e);
        }
    }
}

// Save all data to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('gradeCalculatorData', JSON.stringify({
            semesters,
            currentSemesterId,
            currentClassId
        }));
        console.log('Data saved to localStorage');
    } catch (e) {
        console.error('Error saving data to localStorage:', e);
    }
}

// Save class data
function saveClassData() {
    const assignments = [];
    document.querySelectorAll('table tbody tr').forEach(row => {
        const name = row.querySelector('input[name="assignment-name"]')?.value || '';
        const score = row.querySelector('input[name="score"]')?.value || '';
        const weight = row.querySelector('input[name="weight"]')?.value || '';
        if (name || score || weight) {
            assignments.push({ name, score, weight });
        }
    });
    
    // Check if the current semester and class exist before saving
    if (semesters[currentSemesterId] && semesters[currentSemesterId].classes[currentClassId]) {
        semesters[currentSemesterId].classes[currentClassId].assignments = assignments;
        saveToLocalStorage();
    } else {
        console.error('Cannot save class data: current semester or class does not exist');
    }
}

// Load class data
function loadClassData(classId) {
    if (!semesters[currentSemesterId]?.classes[classId]) {
        console.error(`Class ${classId} not found in semester ${currentSemesterId}`);
        return;
    }
    
    const classData = semesters[currentSemesterId].classes[classId];
    const tbody = document.getElementById('assignment-rows');
    
    if (!tbody) {
        console.error('Assignment rows table body not found');
        return;
    }
    
    // Clear current rows
    tbody.innerHTML = '';
    
    // Add saved assignments or empty rows to make 5 total
    const assignments = classData.assignments || [];
    const totalRows = Math.max(5, assignments.length);
    
    for (let i = 0; i < totalRows; i++) {
        const assignment = assignments[i] || { name: '', score: '', weight: '' };
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <button class="delete-row" aria-label="Delete row">×</button>
                <input type="text" name="assignment-name" required value="${assignment.name}">
            </td>
            <td><input type="number" name="score" required value="${assignment.score}"></td>
            <td><input type="number" name="weight" required value="${assignment.weight}"></td>
        `;
        tbody.appendChild(row);
    }
    
    updateGrades();
}

// Add new class
function setupAddClassHandler() {
    const addClassButton = document.getElementById('add-class');
    if (addClassButton) {
        addClassButton.addEventListener('click', () => {
            const classes = semesters[currentSemesterId].classes;
            const classCount = Object.keys(classes).length + 1;
            const newClassId = `class${Date.now()}`;
            const className = `Class ${classCount}`;
            
            classes[newClassId] = {
                name: className,
                assignments: []
            };
            
            // Add new tab with delete button
            const tab = document.createElement('div');
            tab.className = 'class-tab';
            tab.dataset.classId = newClassId;
            tab.innerHTML = `
                <input type="text" class="class-name-input" value="${className}" spellcheck="false" readonly>
                <button class="delete-class" aria-label="Delete class">×</button>
            `;
            document.getElementById('class-tabs').appendChild(tab);
            
            // Switch to new class
            switchClass(newClassId);
            saveToLocalStorage();
        });
    } else {
        console.error('Add class button not found');
    }
}

// Add new semester
function addSemester() {
    const semesterCount = Object.keys(semesters).length + 1;
    const newSemesterId = `semester${Date.now()}`;
    const semesterName = `Semester ${semesterCount}`;
    
    semesters[newSemesterId] = {
        name: semesterName,
        classes: {}
    };
    
    // Add a default class to the new semester
    const newClassId = `class${Date.now()}`;
    semesters[newSemesterId].classes[newClassId] = {
        name: 'Class 1',
        assignments: []
    };
    
    // Add new semester tab
    renderSemesterTabs();
    
    // Switch to new semester
    switchSemester(newSemesterId, newClassId);
    saveToLocalStorage();
}

// Set up handlers for delete class button by attaching to the parent container
function setupClassTabsEventListeners() {
    const classTabsContainer = document.getElementById('class-tabs');
    if (!classTabsContainer) {
        console.error('Class tabs container not found');
        return;
    }
    
    // Event delegation for class tabs
    classTabsContainer.addEventListener('click', (event) => {
        // Handle delete class button
        if (event.target.classList.contains('delete-class')) {
            event.stopPropagation(); // Prevent class switching when deleting
            const tab = event.target.closest('.class-tab');
            if (!tab) return;
            
            const classId = tab.dataset.classId;
            const classes = semesters[currentSemesterId].classes;
            
            // Don't delete if it's the last class
            if (Object.keys(classes).length <= 1) {
                return;
            }
            
            // If deleting current class, switch to another class first
            if (classId === currentClassId) {
                const remainingClasses = Object.keys(classes).filter(id => id !== classId);
                switchClass(remainingClasses[0]);
            }
            
            // Remove the class data and tab
            delete classes[classId];
            tab.remove();
            saveToLocalStorage();
        }
        // Handle class tab switching
        else {
            const tab = event.target.closest('.class-tab');
            if (tab) {
                // If clicking the input itself, do nothing (let it handle its own focus)
                if (event.target.classList.contains('class-name-input')) {
                    return;
                }
                switchClass(tab.dataset.classId);
            }
        }
    });
    
    // Handle double click for editing class names
    classTabsContainer.addEventListener('dblclick', (event) => {
        const input = event.target.closest('.class-tab')?.querySelector('.class-name-input');
        if (input) {
            input.focus();
            input.select();
        }
    });
    
    // Handle class name changes
    classTabsContainer.addEventListener('input', (event) => {
        if (event.target.classList.contains('class-name-input')) {
            const tab = event.target.closest('.class-tab');
            const classId = tab.dataset.classId;
            const newName = event.target.value;
            semesters[currentSemesterId].classes[classId].name = newName;
            if (classId === currentClassId) {
                const classNameElement = document.getElementById('current-class-name');
                if (classNameElement) {
                    classNameElement.textContent = newName;
                }
            }
            saveToLocalStorage();
        }
    });
    
    // Handle focus events for class name inputs
    classTabsContainer.addEventListener('focusin', (event) => {
        if (event.target.classList.contains('class-name-input')) {
            event.target.readOnly = false;
        }
    });
    
    classTabsContainer.addEventListener('focusout', (event) => {
        if (event.target.classList.contains('class-name-input')) {
            event.target.readOnly = true;
        }
    });
    
    // Prevent form submission when editing class names
    classTabsContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.target.blur();
        }
    });
}

// Add handler for delete semester button
function setupSemesterDeleteHandlers() {
    document.querySelectorAll('.delete-semester').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const tab = event.target.closest('.semester-tab');
            const semesterId = tab.dataset.semesterId;
            
            // Don't delete if it's the last semester
            if (Object.keys(semesters).length <= 1) {
                return;
            }
            
            // If deleting current semester, switch to another semester first
            if (semesterId === currentSemesterId) {
                const remainingSemesters = Object.keys(semesters).filter(id => id !== semesterId);
                const firstSemesterId = remainingSemesters[0];
                const firstClassId = Object.keys(semesters[firstSemesterId].classes)[0];
                switchSemester(firstSemesterId, firstClassId);
            }
            
            // Remove the semester data and tab
            delete semesters[semesterId];
            renderSemesterTabs();
            saveToLocalStorage();
        });
    });
}

// Handle semester name changes
function setupSemesterNameHandlers() {
    document.querySelectorAll('.semester-name-input').forEach(input => {
        input.addEventListener('input', (event) => {
            const tab = event.target.closest('.semester-tab');
            const semesterId = tab.dataset.semesterId;
            const newName = event.target.value;
            semesters[semesterId].name = newName;
            saveToLocalStorage();
        });

        input.addEventListener('focusin', () => {
            input.readOnly = false;
        });

        input.addEventListener('focusout', () => {
            input.readOnly = true;
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                input.blur();
            }
        });
    });
}

// Switch semesters
function switchSemester(semesterId, classId) {
    // Save current class data before switching
    saveClassData();
    
    // Update active semester tab
    document.querySelectorAll('.semester-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.semesterId === semesterId);
    });
    
    // Switch to new semester
    currentSemesterId = semesterId;
    
    // Update class tabs for the new semester
    renderClassTabs();
    
    // Switch to specified class or first class
    const firstClassId = classId || Object.keys(semesters[semesterId].classes)[0];
    switchClass(firstClassId);
}

// Render class tabs for current semester
function renderClassTabs() {
    const classTabsContainer = document.getElementById('class-tabs');
    if (!classTabsContainer) {
        console.error('Class tabs container not found');
        return;
    }
    
    classTabsContainer.innerHTML = '';
    
    const classes = semesters[currentSemesterId]?.classes || {};
    Object.keys(classes).forEach(classId => {
        const classData = classes[classId];
        const tab = document.createElement('div');
        tab.className = 'class-tab';
        if (classId === currentClassId) {
            tab.classList.add('active');
        }
        tab.dataset.classId = classId;
        tab.innerHTML = `
            <input type="text" class="class-name-input" value="${classData.name}" spellcheck="false" readonly>
            <button class="delete-class" aria-label="Delete class">×</button>
        `;
        classTabsContainer.appendChild(tab);
    });
}

// Set up semester tabs click handlers
function setupSemesterTabsHandlers() {
    const semesterTabsContainer = document.getElementById('semester-tabs');
    if (!semesterTabsContainer) {
        console.error('Semester tabs container not found');
        return;
    }
    
    // Use event delegation for semester tabs
    semesterTabsContainer.addEventListener('click', (event) => {
        const tab = event.target.closest('.semester-tab');
        if (tab) {
            // Ignore clicks on the input itself or delete button
            if (event.target.classList.contains('semester-name-input') || 
                event.target.classList.contains('delete-semester')) {
                return;
            }
            
            const semesterId = tab.dataset.semesterId;
            if (semesterId !== currentSemesterId) {
                switchSemester(semesterId);
            }
        }
    });
    
    // Double-click for editing semester names
    semesterTabsContainer.addEventListener('dblclick', (event) => {
        const tab = event.target.closest('.semester-tab');
        if (tab) {
            const input = tab.querySelector('.semester-name-input');
            if (input && !event.target.classList.contains('delete-semester')) {
                input.focus();
                input.select();
            }
        }
    });
}

// Render semester tabs
function renderSemesterTabs() {
    const semesterTabsContainer = document.getElementById('semester-tabs');
    if (!semesterTabsContainer) {
        console.error('Semester tabs container not found');
        return;
    }
    
    semesterTabsContainer.innerHTML = '';
    
    Object.keys(semesters).forEach(semesterId => {
        const semesterData = semesters[semesterId];
        const tab = document.createElement('div');
        tab.className = 'semester-tab';
        if (semesterId === currentSemesterId) {
            tab.classList.add('active');
        }
        tab.dataset.semesterId = semesterId;
        tab.innerHTML = `
            <input type="text" class="semester-name-input" value="${semesterData.name}" spellcheck="false" readonly>
            <button class="delete-semester" aria-label="Delete semester">×</button>
        `;
        semesterTabsContainer.appendChild(tab);
    });
    
    setupSemesterNameHandlers();
    setupSemesterDeleteHandlers();
}

function switchClass(classId) {
    // Save current class data
    saveClassData();
    
    // Update active tab
    document.querySelectorAll('.class-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.classId === classId);
    });
    
    // Switch to new class
    currentClassId = classId;
    
    // Update class name display
    const currentClassElement = document.getElementById('current-class-name');
    if (currentClassElement && semesters[currentSemesterId]?.classes[classId]) {
        currentClassElement.textContent = semesters[currentSemesterId].classes[classId].name;
    }
    
    loadClassData(classId);
}

// Function to calculate and update both current and required grades
const originalUpdateGrades = function updateGrades() {
    const assignments = document.querySelectorAll('table tbody tr');
    let totalWeightedScore = 0;
    let totalWeight = 0;

    assignments.forEach(row => {
        const score = parseFloat(row.querySelector('input[name="score"]').value);
        const weight = parseFloat(row.querySelector('input[name="weight"]').value);

        if (!isNaN(score) && !isNaN(weight)) {
            totalWeightedScore += score * (weight / 100);
            totalWeight += weight;
        }
    });

    const finalGrade = totalWeight > 0 ? (totalWeightedScore / (totalWeight / 100)) : 0;
    const finalGradeElement = document.getElementById('final-grade');
    if (finalGradeElement) {
        finalGradeElement.textContent = `${finalGrade.toFixed(2)}%`;
    }

    const remainingWeight = 100 - totalWeight;
    const remainingWeightElement = document.getElementById('remaining-weight');
    if (remainingWeightElement) {
        remainingWeightElement.textContent = remainingWeight.toFixed(2);
    }

    const gradeGoalElement = document.getElementById('grade-goal');
    const finalGradeGoal = gradeGoalElement ? (parseFloat(gradeGoalElement.value) || 90) : 90;
    const requiredGradeOutput = document.getElementById('required-grade-output');

    if (!requiredGradeOutput) return;

    if (remainingWeight <= 0) {
        requiredGradeOutput.textContent = '--.--%';
        requiredGradeOutput.style.color = '#888';
        return;
    }

    const currentWeightedAverage = totalWeight > 0 ? totalWeightedScore / (totalWeight / 100) : 0;
    const requiredGrade = (finalGradeGoal - (currentWeightedAverage * totalWeight / 100)) / (remainingWeight / 100);

    if (requiredGrade > 100) {
        requiredGradeOutput.textContent = '--.--%';
        requiredGradeOutput.style.color = '#ff4d4d';
    } else if (requiredGrade < 0) {
        requiredGradeOutput.textContent = '0.00%';
        requiredGradeOutput.style.color = '#4CAF50';
    } else if (requiredGrade > 90) {
        requiredGradeOutput.textContent = `${requiredGrade.toFixed(2)}%`;
        requiredGradeOutput.style.color = '#ff9800';
    } else {
        requiredGradeOutput.textContent = `${requiredGrade.toFixed(2)}%`;
        requiredGradeOutput.style.color = '#4CAF50';
    }
};

function updateGrades() {
    originalUpdateGrades();
    saveClassData();
}

// Setup event listeners
function setupEventListeners() {
    // Add event listener for goal grade input
    const gradeGoalElement = document.getElementById('grade-goal');
    if (gradeGoalElement) {
        gradeGoalElement.addEventListener('input', updateGrades);
    }

    // Add event listeners for input changes in assignment rows
    const assignmentRows = document.getElementById('assignment-rows');
    if (assignmentRows) {
        assignmentRows.addEventListener('input', () => {
            updateGrades();
            saveClassData();
        });
    }

    // Add event listener for delete buttons in assignment rows
    if (assignmentRows) {
        assignmentRows.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-row')) {
                const row = event.target.closest('tr');
                if (row) {
                    // Just remove the row without automatically adding a new one
                    row.remove();
                    updateGrades();
                    saveToLocalStorage();
                }
            }
        });
    }

    // Add event listener for add row button
    const addRowButton = document.getElementById('add-row');
    if (addRowButton) {
        addRowButton.addEventListener('click', () => {
            const tbody = document.getElementById('assignment-rows');
            if (!tbody) return;
            
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>
                    <button class="delete-row" aria-label="Delete row">×</button>
                    <input type="text" name="assignment-name" required>
                </td>
                <td><input type="number" name="score" required></td>
                <td><input type="number" name="weight" required></td>
            `;
            
            tbody.appendChild(newRow);
            
            // Focus on the new row's input field
            const newInput = newRow.querySelector('input[name="assignment-name"]');
            if (newInput) {
                newInput.focus();
            }
            
            updateGrades();
            saveToLocalStorage();
        });
    }

    // Setup add-semester button
    const addSemesterButton = document.getElementById('add-semester');
    if (addSemesterButton) {
        addSemesterButton.addEventListener('click', addSemester);
    }
    
    // Setup semester tabs handlers
    setupSemesterTabsHandlers();
    
    // Setup class tabs event listeners
    setupClassTabsEventListeners();
    
    // Setup Add Class handler
    setupAddClassHandler();
}

// OCR API integration
const OCR_API_KEY = 'K85510836888957';

async function analyzeTranscriptImage(imageFile) {
    const formData = new FormData();
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng');
    formData.append('isTable', 'true');
    formData.append('file', imageFile);

    const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.IsErroredOnProcessing) {
        alert('OCR Error: ' + result.ErrorMessage);
        return null;
    }
    return result.ParsedResults[0].ParsedText;
}

function parseTranscriptText(text) {
    // Simple parser: looks for lines with course-like patterns and GPA-like patterns
    // This is a starting point and can be improved for your transcript format
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const courses = [];
    const gpaSections = [];
    const courseRegex = /([A-Z]{2,}\s*\d{2,})|([A-Z][a-z]+\s+[A-Z][a-z]+)|([A-Z]{2,}\d{2,})/; // e.g. MATH 101, English Literature
    const gpaRegex = /(GPA|Grade Point Average|Cumulative GPA)[:\s]*([0-4]\.[0-9]{1,2})/i;

    lines.forEach(line => {
        if (courseRegex.test(line)) {
            courses.push(line);
        } else if (gpaRegex.test(line)) {
            const match = gpaRegex.exec(line);
            gpaSections.push({ label: match[1], value: match[2] });
        }
    });
    return { courses, gpaSections };
}

// Add OCR upload UI if not present
function addOcrUploadUI() {
    if (!document.getElementById('transcript-upload')) {
        const ocrDiv = document.createElement('div');
        ocrDiv.id = 'ocr-upload-section';
        ocrDiv.innerHTML = `
            <h3>Analyze Transcript Image or PDF</h3>
            <input type="file" id="transcript-upload" accept="image/*,application/pdf">
            <button id="analyze-transcript">Analyze Transcript</button>
            <pre id="ocr-output" style="white-space: pre-wrap; background: #f8f8f8; padding: 10px; margin-top: 10px;"></pre>
        `;
        // Insert at the top of the main container or body
        const container = document.querySelector('.gpa-container') || document.body;
        container.insertBefore(ocrDiv, container.firstChild);
    }
}

// Initialize grade display
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');

    loadFromLocalStorage();

    // Check if we were redirected from the GPA calculator with specific
    // semester/class parameters
    const redirectParamsRaw = localStorage.getItem('redirectParams');
    if (redirectParamsRaw) {
        try {
            const params = JSON.parse(redirectParamsRaw);
            if (params.currentSemesterId && semesters[params.currentSemesterId]) {
                currentSemesterId = params.currentSemesterId;
                if (
                    params.currentClassId &&
                    semesters[currentSemesterId].classes[params.currentClassId]
                ) {
                    currentClassId = params.currentClassId;
                } else {
                    currentClassId = Object.keys(semesters[currentSemesterId].classes)[0];
                }
            }
        } catch (e) {
            console.error('Error parsing redirect parameters:', e);
        }
        localStorage.removeItem('redirectParams');
    }

    // Render semester and class tabs
    renderSemesterTabs();
    renderClassTabs();

    // Setup event listeners
    setupEventListeners();

    // Load current class data
    const currentClassElement = document.getElementById('current-class-name');
    if (currentClassElement && semesters[currentSemesterId]?.classes[currentClassId]) {
        currentClassElement.textContent = semesters[currentSemesterId].classes[currentClassId].name;
    }
    loadClassData(currentClassId);
    
    // Ensure OCR upload UI exists before attaching listeners
    addOcrUploadUI();

    // OCR transcript upload and analyze
    const uploadInput = document.getElementById('transcript-upload');
    const analyzeBtn = document.getElementById('analyze-transcript');
    const output = document.getElementById('ocr-output');
    let selectedFile = null;

    if (uploadInput && analyzeBtn && output) {
        uploadInput.addEventListener('change', (e) => {
            selectedFile = e.target.files[0];
        });

        analyzeBtn.addEventListener('click', async () => {
            if (!selectedFile) {
                alert('Please select an image or PDF file.');
                return;
            }
            output.textContent = 'Analyzing...';
            analyzeBtn.disabled = true;
            analyzeBtn.textContent = 'Loading...';
            try {
                const text = await analyzeTranscriptImage(selectedFile);
                if (!text) {
                    output.textContent = 'No text found.';
                } else {
                    const parsed = parseTranscriptText(text);
                    output.textContent =
                        '--- Raw OCR Text ---\n' + text +
                        '\n\n--- Parsed Structure ---\n' +
                        'Courses:\n' + (parsed.courses.length ? parsed.courses.join('\n') : 'None found') +
                        '\n\nGPA Sections:\n' + (parsed.gpaSections.length ? parsed.gpaSections.map(g => `${g.label}: ${g.value}`).join('\n') : 'None found');
                }
            } catch (e) {
                output.textContent = 'Error during OCR: ' + e.message;
            } finally {
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = 'Analyze Transcript';
            }
        });
    }

});