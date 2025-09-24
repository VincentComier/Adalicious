async function fetchMenu() {
  try {
    const res = await fetch("http://localhost:3000/menu-db");
    const menu = await res.json();

    const ul = document.getElementById("listMenu");
    ul.innerHTML = "";

    menu.forEach((plat) => {
      const li = document.createElement("li");

      if (plat.image) {
        const img = document.createElement("img");
        img.src = plat.image;
        img.alt = plat.plate || "Plat";
        img.width = 48; 
        li.appendChild(img);
        li.appendChild(document.createTextNode(" "));
      } else {

      }

      const strong = document.createElement("strong");
      strong.textContent = plat.plate;
      li.appendChild(strong);
      li.appendChild(document.createElement("br"));

      // Lien "Voir le détail"
      const linkDetail = document.createElement("a");
      linkDetail.href = `detail.html?id=${plat.id}`;
      linkDetail.textContent = "Voir le détail";
      li.appendChild(linkDetail);

      li.appendChild(document.createTextNode(" "));

      // Lien "Commander" -> envoie vers la page de suivi avec uniquement l'id
      const linkOrder = document.createElement("a");
      linkOrder.href = `suivi.html?id=${plat.id}`;
      linkOrder.textContent = "Commander";
      li.appendChild(linkOrder);

      ul.appendChild(li);
    });
  } catch (err) {
    console.error("Erreur :", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const greeting = document.getElementById("greeting");
  const userName = localStorage.getItem("userName");
  if (greeting) {
    greeting.textContent = userName ? `Bonjour ${userName}` : "Bonjour invité";
  }

  fetchMenu();
});
