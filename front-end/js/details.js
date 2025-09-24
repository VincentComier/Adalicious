async function fetchDetail() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    const container = document.getElementById("plat")
    
    if (!id) {
        container.textContent = "aucun ID"
        return;
    }
    try {
        const res = await fetch(`http://localhost:3000/menu-db/${id}`)
        if (!res.ok) throw new Error ("Plat non trouvé");
        const plat = await res.json();
        container.textContent="";

        const h2 = document.createElement("h2");
        h2.textContent = `${plat.image} ${plat.plate}`;
        container.appendChild(h2)

        const p = document.createElement("p")
        p.textContent = plat.description;
        container.appendChild(p)
    } catch (err) {
        container.textContent = "Erreur : " + err.message;
    }
}

fetchDetail()