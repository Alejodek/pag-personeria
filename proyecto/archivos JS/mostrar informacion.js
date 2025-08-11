async function cargarCandidatos() {
    try {
        const res = await fetch("/candidatos");
        if (!res.ok) throw new Error("Error al obtener candidatos");

        const candidatos = await res.json();
        const contenedor = document.getElementById("lista-candidatos");
        contenedor.innerHTML = "";

        if (candidatos.length === 0) {
            contenedor.innerHTML = "<p>No hay candidatos registrados.</p>";
            return;
        }

        candidatos.forEach(c => {
            const div = document.createElement("div");
            div.classList.add("candidato");
            div.innerHTML = `
                <img src="${c.foto || 'img/default.jpg'}" alt="${c.nombre}" width="100">
                <h3>${c.nombre}</h3>
                <p><b>Cargo:</b> ${c.cargo}</p>
                <p><b>Propuestas:</b> ${c.propuestas}</p>
                <p><b>Votos:</b> ${c.votos}</p>
            `;
            contenedor.appendChild(div);
        });
    } catch (error) {
        console.error(error);
        document.getElementById("lista-candidatos").innerHTML =
            "<p>Error al cargar candidatos.</p>";
    }
}

document.addEventListener("DOMContentLoaded", cargarCandidatos);
