document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("contenedor-candidatos");

    try {
        const res = await fetch("/candidatos");
        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        const candidatos = await res.json();

        if (candidatos.length === 0) {
            contenedor.innerHTML = "<p>No hay candidatos registrados.</p>";
            return;
        }

        // Mostrar cada candidato
        candidatos.forEach(c => {
            const div = document.createElement("div");
            div.classList.add("candidato");

            div.innerHTML = `
                <img src="${c.foto || 'default.jpg'}" alt="Foto de ${c.nombre}" width="150">
                <h3>${c.nombre}</h3>
                <p><strong>Cargo:</strong> ${c.cargo}</p>
                <p><strong>Propuestas:</strong> ${c.propuestas}</p>
                <p><strong>Votos:</strong> ${c.votos}</p>
                <button data-id="${c.id}" class="btn-votar">Votar</button>
            `;

            contenedor.appendChild(div);
        });

        // Asignar evento de voto
        document.querySelectorAll(".btn-votar").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.getAttribute("data-id");

                const resVoto = await fetch(`/votar/${id}`, {
                    method: "POST"
                });

                const data = await resVoto.json();
                alert(data.mensaje);

                // Recargar para mostrar votos actualizados
                location.reload();
            });
        });

    } catch (error) {
        console.error("❌ Error al cargar los candidatos:", error);
        contenedor.innerHTML = "<p>No se pudieron cargar los candidatos.</p>";
    }
});
