# GPA & Grade Calculator

This project provides a simple client‑side grade tracker and GPA calculator. Both tools are plain HTML pages that use vanilla JavaScript and store their data in `localStorage`.

## Project layout

```
grade-calculator/
├── index.html            # Grade calculator page
├── script.js             # Logic for grade calculator
├── gpa-calculator.html   # GPA calculator page
├── gpa-calculator.js     # Logic for GPA calculator
├── styles.css            # Styles for grade page
└── gpa-styles.css        # Styles for GPA page
```

## Usage

No build step is required. Clone the repository and open one of the HTML files in a web browser:

```bash
# Grade calculator
open grade-calculator/index.html

# GPA calculator
open grade-calculator/gpa-calculator.html
```

Your data is saved automatically in the browser using `localStorage`. For example, the grade calculator loads and saves under the key `"gradeCalculatorData"` as shown in `script.js`:

```javascript
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('gradeCalculatorData');
    // ...
}

function saveToLocalStorage() {
    localStorage.setItem('gradeCalculatorData', JSON.stringify({
        semesters,
        currentSemesterId,
        currentClassId
    }));
}
```

The GPA calculator defines a default scale of letter grades to GPA values:

```javascript
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
```

You can adjust these values in the GPA calculator page and the settings will persist for future visits.

---

Feel free to extend the calculators with additional features or refactor the scripts into modules as the project grows.
