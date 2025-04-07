document.addEventListener("DOMContentLoaded", function () {
    const languages = {
        "Indonesian": "Indonesia",
        "English": "Inggris",
        "French": "Prancis",
        "Spanish": "Spanyol",
        "German": "Jerman",
        "Japanese": "Jepang",
        "Korean": "Korea",
        "Chinese": "Mandarin",
        "Russian": "Rusia",
        "Arabic": "Arab"
    };

    const sourceLang = document.getElementById("source-lang");
    const targetLang = document.getElementById("target-lang");

    Object.entries(languages).forEach(([key, value]) => {
        let option1 = new Option(value, key);
        let option2 = new Option(value, key);
        sourceLang.add(option1);
        targetLang.add(option2);
    });

    targetLang.value = "English"; // Default target bahasa Inggris
});

function switchLanguages() {
    let source = document.getElementById("source-lang");
    let target = document.getElementById("target-lang");
    let inputText = document.getElementById("input-text");
    let outputText = document.getElementById("output-text");

    // Tukar bahasa sumber dan target
    [source.value, target.value] = [target.value, source.value];

    // Tukar teks input dan output
    [inputText.value, outputText.value] = [outputText.value, inputText.value];
}

function copyText(id) {
    let textArea = document.getElementById(id);
    textArea.select();
    document.execCommand("copy");
    alert("Teks disalin!");
}

function translateText() {
    let text = document.getElementById("input-text").value.trim();
    let sourceLang = document.getElementById("source-lang").value;
    let targetLang = document.getElementById("target-lang").value;

    if (!text) {
        alert("Masukkan teks terlebih dahulu!");
        return;
    }

    fetch("/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang, style: "Casual" }) // Default casual
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("output-text").value = data.translation;
    })
    .catch(error => console.error("Error:", error));
}

document.getElementById("variation-btn").addEventListener("click", function () {
    let options = document.getElementById("variation-options");
    options.style.display = options.style.display === "none" ? "block" : "none";
});

function getVariation(style) {
    let text = document.getElementById("input-text").value.trim();
    let sourceLang = document.getElementById("source-lang").value;
    let targetLang = document.getElementById("target-lang").value;

    if (!text) {
        alert("Masukkan teks terlebih dahulu!");
        return;
    }

    fetch("/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang, style: style })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("output-text").value = data.translation;
    })
    .catch(error => console.error("Error:", error));
}
// Fitur auto translate setelah user berhenti ngetik 500ms
let debounceTimer;
document.getElementById("input-text").addEventListener("input", function () {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        const text = this.value.trim();
        if (text === "") {
            document.getElementById("output-text").value = "";
        } else {
            translateText();
        }
    }, 500); // delay 500ms
});

// Auto translate saat user ganti bahasa sumber atau target
document.getElementById("source-lang").addEventListener("change", function () {
    let inputText = document.getElementById("input-text").value.trim();
    if (inputText !== "") {
        translateText();
    }
});

document.getElementById("target-lang").addEventListener("change", function () {
    let inputText = document.getElementById("input-text").value.trim();
    if (inputText !== "") {
        translateText();
    }
});
