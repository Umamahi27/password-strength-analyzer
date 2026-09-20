const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const scoreElement = document.getElementById("score");
const scoreVerdict = document.getElementById("scoreVerdict");
const entropyElement = document.getElementById("entropy");
const entropyMessage = document.getElementById("entropyMessage");

const strengthBar = document.getElementById("strengthBar");
const verdict = document.getElementById("verdict");


// Common passwords
const commonPasswords = [
    "password",
    "password123",
    "123456",
    "12345678",
    "123456789",
    "qwerty",
    "qwerty123",
    "admin",
    "welcome",
    "letmein",
    "abc123",
    "iloveyou"
];


// Analyze password whenever user types
passwordInput.addEventListener("input", analyzePassword);


// Show / hide password
togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }

});


// Main analysis function
function analyzePassword() {

    const password = passwordInput.value;

    if (!password) {
        resetAnalysis();
        return;
    }


    // ==========================================
    // 1. CHARACTER TYPES
    // ==========================================

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);


    // ==========================================
    // 2. LENGTH SCORE
    // ==========================================

    let lengthScore = 0;

    if (password.length >= 20) {
        lengthScore = 25;
    } else if (password.length >= 16) {
        lengthScore = 20;
    } else if (password.length >= 12) {
        lengthScore = 15;
    } else if (password.length >= 8) {
        lengthScore = 10;
    }


    // ==========================================
    // 3. CHARACTER SCORES
    // ==========================================

    const upperScore = hasUpper ? 10 : 0;
    const lowerScore = hasLower ? 10 : 0;
    const numberScore = hasNumber ? 10 : 0;
    const specialScore = hasSpecial ? 10 : 0;


    // ==========================================
    // 4. CHARACTER POOL
    // ==========================================

    let characterPool = 0;

    if (hasLower) characterPool += 26;
    if (hasUpper) characterPool += 26;
    if (hasNumber) characterPool += 10;
    if (hasSpecial) characterPool += 32;


    // ==========================================
    // 5. ENTROPY
    // ==========================================

    let entropy = 0;

    if (characterPool > 0) {
        entropy = password.length * Math.log2(characterPool);
    }

    entropy = Math.round(entropy);


    // ==========================================
    // 6. ENTROPY SCORE
    // ==========================================

    let entropyScore = 0;

    if (entropy >= 100) {
        entropyScore = 25;
    } else if (entropy >= 80) {
        entropyScore = 22;
    } else if (entropy >= 60) {
        entropyScore = 18;
    } else if (entropy >= 40) {
        entropyScore = 12;
    } else if (entropy >= 28) {
        entropyScore = 7;
    }


    // ==========================================
    // 7. PATTERN DETECTION
    // ==========================================

    let penalty = 0;

    const lowerPassword = password.toLowerCase();


    // Common password
    if (commonPasswords.includes(lowerPassword)) {
        penalty += 25;
    }


    // Sequential numbers
    if (
        /123456/.test(lowerPassword) ||
        /234567/.test(lowerPassword) ||
        /345678/.test(lowerPassword)
    ) {
        penalty += 10;
    }


    // Sequential alphabet
    if (
        /abcdef/.test(lowerPassword) ||
        /bcdefg/.test(lowerPassword)
    ) {
        penalty += 10;
    }


    // Repeated characters
    if (/(.)\1{3,}/.test(password)) {
        penalty += 10;
    }


    // Keyboard patterns
    if (
        lowerPassword.includes("qwerty") ||
        lowerPassword.includes("asdfgh")
    ) {
        penalty += 10;
    }


    // Common substitution
    if (
        lowerPassword.includes("p@ssw0rd") ||
        lowerPassword.includes("passw0rd")
    ) {
        penalty += 10;
    }


    // ==========================================
    // 8. FINAL SCORE
    // ==========================================

    let finalScore =
        lengthScore +
        upperScore +
        lowerScore +
        numberScore +
        specialScore +
        entropyScore -
        penalty;


    // Keep between 0 and 100
    finalScore = Math.max(0, Math.min(100, finalScore));


    // ==========================================
    // 9. VERDICT
    // ==========================================

    let finalVerdict = "";

    if (finalScore >= 80) {
        finalVerdict = "VERY STRONG";
    } else if (finalScore >= 60) {
        finalVerdict = "STRONG";
    } else if (finalScore >= 40) {
        finalVerdict = "MODERATE";
    } else if (finalScore >= 20) {
        finalVerdict = "WEAK";
    } else {
        finalVerdict = "VERY WEAK";
    }


    // ==========================================
    // 10. DISPLAY RESULTS
    // ==========================================

    scoreElement.textContent = finalScore;

    scoreVerdict.textContent = finalVerdict;

    entropyElement.textContent = entropy;

    verdict.textContent = finalVerdict;


    // ==========================================
    // 11. ENTROPY MESSAGE
    // ==========================================

    if (entropy < 28) {
        entropyMessage.textContent =
            "Extremely weak estimated entropy.";
    } else if (entropy < 36) {
        entropyMessage.textContent =
            "Very weak estimated entropy.";
    } else if (entropy < 60) {
        entropyMessage.textContent =
            "Weak estimated entropy.";
    } else if (entropy < 80) {
        entropyMessage.textContent =
            "Moderate estimated entropy.";
    } else if (entropy < 100) {
        entropyMessage.textContent =
            "Strong estimated entropy.";
    } else {
        entropyMessage.textContent =
            "Very strong estimated entropy.";
    }


    // ==========================================
    // 12. STRENGTH BAR
    // ==========================================

    strengthBar.style.width = finalScore + "%";


    // ==========================================
    // 13. BREAKDOWN
    // ==========================================

    document.getElementById("lengthScore").textContent =
        `${lengthScore}/25`;

    document.getElementById("upperScore").textContent =
        `${upperScore}/10`;

    document.getElementById("lowerScore").textContent =
        `${lowerScore}/10`;

    document.getElementById("numberScore").textContent =
        `${numberScore}/10`;

    document.getElementById("specialScore").textContent =
        `${specialScore}/10`;

    document.getElementById("entropyScore").textContent =
        `${entropyScore}/25`;

    document.getElementById("penalty").textContent =
        `-${penalty}`;


    // ==========================================
    // 14. PROGRESS BARS
    // ==========================================

    document.getElementById("lengthProgress").style.width =
        (lengthScore / 25) * 100 + "%";

    document.getElementById("upperProgress").style.width =
        (upperScore / 10) * 100 + "%";

    document.getElementById("lowerProgress").style.width =
        (lowerScore / 10) * 100 + "%";

    document.getElementById("numberProgress").style.width =
        (numberScore / 10) * 100 + "%";

    document.getElementById("specialProgress").style.width =
        (specialScore / 10) * 100 + "%";

    document.getElementById("entropyProgress").style.width =
        (entropyScore / 25) * 100 + "%";


    // ==========================================
    // 15. CHECKLIST
    // ==========================================

    updateCheck(
        "checkLength",
        password.length >= 12
    );

    updateCheck(
        "checkUpper",
        hasUpper
    );

    updateCheck(
        "checkLower",
        hasLower
    );

    updateCheck(
        "checkNumber",
        hasNumber
    );

    updateCheck(
        "checkSpecial",
        hasSpecial
    );

    updateCheck(
        "checkPattern",
        penalty === 0
    );

    updateCheck(
        "checkCommon",
        !commonPasswords.includes(lowerPassword)
    );


    // ==========================================
    // 16. RECOMMENDATIONS
    // ==========================================

    generateRecommendations(
        password,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        penalty,
        entropy
    );
}


// Update checklist
function updateCheck(id, passed) {

    const element = document.getElementById(id);

    const originalText = element.textContent.substring(2);

    if (passed) {
        element.textContent = "✓ " + originalText;
    } else {
        element.textContent = "✗ " + originalText;
    }
}


// Recommendations
function generateRecommendations(
    password,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    penalty,
    entropy
) {

    const list = document.getElementById("recommendations");

    list.innerHTML = "";

    const recommendations = [];


    if (password.length < 12) {
        recommendations.push(
            "Increase the password length to at least 12 characters."
        );
    }

    if (!hasUpper) {
        recommendations.push(
            "Add at least one uppercase letter."
        );
    }

    if (!hasLower) {
        recommendations.push(
            "Add at least one lowercase letter."
        );
    }

    if (!hasNumber) {
        recommendations.push(
            "Add at least one number."
        );
    }

    if (!hasSpecial) {
        recommendations.push(
            "Add at least one special character."
        );
    }

    if (penalty > 0) {
        recommendations.push(
            "Avoid common passwords, repeated characters and predictable patterns."
        );
    }

    if (entropy < 60) {
        recommendations.push(
            "Increase password length and character diversity to improve entropy."
        );
    }


    if (recommendations.length === 0) {
        recommendations.push(
            "Your password meets the main security criteria."
        );
    }


    recommendations.forEach(text => {

        const li = document.createElement("li");

        li.textContent = "• " + text;

        list.appendChild(li);

    });
}


// ==========================================
// PASSWORD GENERATOR
// ==========================================

const generateButton = document.getElementById("generate");

generateButton.addEventListener("click", generatePassword);


function generatePassword() {

    const length =
        Number(document.getElementById("passwordLength").value);


    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";


    const all =
        lowercase +
        uppercase +
        numbers +
        special;


    let password = "";


    // Guarantee character diversity
    password += secureRandom(lowercase);
    password += secureRandom(uppercase);
    password += secureRandom(numbers);
    password += secureRandom(special);


    // Fill remaining characters
    while (password.length < length) {
        password += secureRandom(all);
    }


    // Shuffle password
    password = secureShuffle(password);


    document.getElementById("generatedPassword").value =
        password;


    // Put generated password into analyzer
    passwordInput.value = password;

    analyzePassword();
}


// Secure random character
function secureRandom(characters) {

    const array = new Uint32Array(1);

    window.crypto.getRandomValues(array);

    return characters[array[0] % characters.length];
}


// Secure shuffle
function secureShuffle(string) {

    const array = string.split("");

    for (let i = array.length - 1; i > 0; i--) {

        const randomArray = new Uint32Array(1);

        window.crypto.getRandomValues(randomArray);

        const j = randomArray[0] % (i + 1);

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array.join("");
}


// Copy generated password
document.getElementById("copyPassword")
    .addEventListener("click", async () => {

        const generated =
            document.getElementById("generatedPassword").value;

        if (!generated) return;

        await navigator.clipboard.writeText(generated);

        document.getElementById("copyPassword")
            .textContent = "Copied!";

        setTimeout(() => {

            document.getElementById("copyPassword")
                .textContent = "Copy";

        }, 1500);

    });


// Reset
function resetAnalysis() {

    scoreElement.textContent = "0";
    scoreVerdict.textContent = "-";
    entropyElement.textContent = "0";

    entropyMessage.textContent =
        "Enter a password to calculate entropy.";

    verdict.textContent =
        "Enter a password to begin";

    strengthBar.style.width = "0%";

    document.getElementById("lengthScore").textContent = "0/25";
    document.getElementById("upperScore").textContent = "0/10";
    document.getElementById("lowerScore").textContent = "0/10";
    document.getElementById("numberScore").textContent = "0/10";
    document.getElementById("specialScore").textContent = "0/10";
    document.getElementById("entropyScore").textContent = "0/25";
    document.getElementById("penalty").textContent = "0";
}