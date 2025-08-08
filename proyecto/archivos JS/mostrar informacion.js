const BASE = window.location.origin.includes('localhost')
    ? 'http://localhost:3000'
    : 'https://pag-personeria-1.onrender.com';

async function cargarCandidatos() {
    try {
        const res = await fetch(`${BASE}/candidatos`);
        const candidatos = await res.json();

        const contenedor = document.getElementById("candidatos");
        contenedor.innerHTML = "";

        if (!candidatos.length) {
            contenedor.innerHTML = "<p>No hay candidatos registrados.</p>";
            return;
        }

        candidatos.forEach(p => {
            const div = document.createElement("div");
            div.innerHTML = `
                <img src="${p.foto || 'sin-foto.jpg'}" width="100">
                <h3>${p.nombre}</h3>
                <p>${p.propuestas}</p>
                <button class="n" onclick="votar(${p.id})">Votar</button>
            `;
            contenedor.appendChild(div);
        });
    } catch (err) {
        console.error("Error al cargar candidatos:", err);
        alert("No se pudieron cargar los candidatos.");
    }
}

async function votar(id) {
    try {
        const res = await fetch(`${BASE}/votar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        const data = await res.json();
        alert(data.mensaje);
        cargarCandidatos();
    } catch (err) {
        console.error("Error al votar:", err);
    }
}

cargarCandidatos();
