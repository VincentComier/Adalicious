document.addEventListener("DOMContentLoaded", () => {
  const inputName = document.getElementById("inputName");
  const validateBtn = document.getElementById("validateBtn");

  validateBtn.addEventListener("click", () => {
    const userName = inputName.value.trim();

    if (!userName) {
      alert("Merci de saisir ton prénom avant de valider.");
      inputName.focus();
      return;
    }

    // stocke pour réutiliser sur les autres pages
    localStorage.setItem("userName", userName);

    window.location.href = "nosMenus.html";
  });

  // Enter valide aussi le formulaire
  inputName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") validateBtn.click();
  });
});
