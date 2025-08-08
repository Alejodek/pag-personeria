document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:3000/candidatos");
        if (!res.ok) throw new Error("No se pudieron cargar los candidatos");

        const candidatos = await res.json();
        const contenedor = document.getElementById("listaCandidatos");

        candidatos.forEach(c => {
            const div = document.createElement("div");
            div.classList.add("candidato");
            div.innerHTML = `
                <h3>${c.nombre} (${c.cargo})</h3>
                <p>Votos: ${c.votos}</p>
                <input type="text" id="usuario_${c.id}" placeholder="Tu nombre de usuario">
                <button onclick="votar(${c.id})">Votar</button>
            `;
            contenedor.appendChild(div);
        });
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los candidatos");
    }
});

async function votar(id) {
    const usuario = document.getElementById(`usuario_${id}`).value.trim();
    if (!usuario) {
        return alert("Debes ingresar tu nombre de usuario");
    }

    const res = await fetch(`http://localhost:3000/votar/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario })
    });

    const data = await res.json();
    alert(data.mensaje);
}
