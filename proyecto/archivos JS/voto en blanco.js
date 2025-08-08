const BASE = window.location.origin.includes('localhost')
    ? 'http://localhost:3000'
    : 'https://pag-personeria-1.onrender.com';

document.getElementById("btnVotoBlanco").addEventListener("click", async () => {
    try {
        const res = await fetch(`${BASE}/votar-blanco`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();
        alert(data.mensaje);
    } catch (err) {
        console.error("Error al votar en blanco:", err);
    }
});
