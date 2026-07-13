const prompt = `This is my first AI Prompt`;

document
.getElementById("copyBtn")
.addEventListener("click", async () => {

    await navigator.clipboard.writeText(prompt);

    alert("Prompt Copied ✅");

});