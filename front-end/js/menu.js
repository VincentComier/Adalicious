// Bouton retour à l'accueil
document.addEventListener("DOMContentLoaded", () => {
    const btnRetour = document.getElementById("btnRetourAccueil");
    if (btnRetour) {
        btnRetour.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});
const params = new URLSearchParams(window.location.search);
let name = params.get("name") || localStorage.getItem("userName") || null;
const client_name = document.getElementById("client_name");

if (params.get("name")) {
    try {
        localStorage.setItem("userName", params.get("name"));
        name = params.get("name");
    } catch (e) { console.warn('localStorage unavailable for userName', e); }
}

console.log('Client Name:', name);
if (client_name) client_name.textContent = name ? `Bonjour ${name} !` : 'Bonjour invité';

async function commanderPlat(plat) {
    try {
        const clientNameToSend = name || localStorage.getItem('userName') || 'invité';
        const resp = await fetch("http://localhost:3000/orders-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ menu_id: plat.id, client_name: clientNameToSend }),
        });

        console.log('POST /orders-db status:', resp.status, resp.statusText);

        let data = null;
        try { data = await resp.json(); } catch (err) {  }

        if (!resp.ok) {
            console.error('Erreur serveur:', resp.status, data);
            throw new Error((data && data.error) || `HTTP ${resp.status}`);
        }

        const orderEntry = {
            orderId: `${Date.now()}-${Math.floor(Math.random()*10000)}`,
            menuId: plat.id,
            name: plat.plate,
            image: plat.image,
            createdAt: new Date().toISOString(),
            sqlId: data && data.order && data.order.id ? data.order.id : null,
        };

        try {
            const raw = localStorage.getItem('currentOrders');
            const arr = raw ? JSON.parse(raw) : [];
            arr.push(orderEntry);
            localStorage.setItem('currentOrders', JSON.stringify(arr));
        } catch (e) { console.warn('localStorage failed for currentOrders', e); }

        alert(`✅ ${(data && data.message) || 'Commande enregistrée'}`);
        window.location.href = `suivi.html?orderId=${encodeURIComponent(orderEntry.orderId)}`;

    } catch (e) {
        console.error("Erreur lors de l'envoi de la commande :", e);
        alert("❌ Impossible d'envoyer la commande. Voir console pour détails.");
    }
}

async function fetchMenus() {
    try {
        const res = await fetch(`http://localhost:3000/menu-db`);
        const menus = await res.json();
        console.log('menus', menus)
        const ul = document.getElementById("listMenu") || document.getElementById("menu-list");
        if (!ul) {
            console.error('Aucun <ul> trouvé: attend un élément avec id "listMenu" ou "menu-list"');
            return;
        }
        ul.innerHTML = "";
        menus.forEach((plat) => {
            const li = document.createElement("li");
            const emoji = document.createElement("span");
            emoji.textContent = plat.image;
            li.appendChild(emoji);
            const nameEl = document.createElement("strong");
            nameEl.textContent = plat.plate;
            li.appendChild(nameEl);
            const desc = document.createElement("p");
            desc.textContent = plat.description;
            li.appendChild(desc);
            const btn = document.createElement("button");
            btn.textContent = "Commander";
            btn.addEventListener("click", () => commanderPlat(plat));
            li.appendChild(btn);
            ul.appendChild(li);

        });
    }
    catch (err) {
        console.error("Erreur :", err);
    }
}


fetchMenus();