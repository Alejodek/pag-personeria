document.getElementById("formulario").addEventListener("submit", async function(e) {e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const cargo = document.getElementById("cargo").value;
    const propuestas = document.getElementById("propuestas").value.trim();
    const fotoInput = document.getElementById("foto");
    const file = fotoInput ? fotoInput.files[0] : null;

if (!nombre || !email) {
    alert('Completa nombre y email.');
    return;
}

const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const fotoBase64 = file ? await getBase64(file) : '';

const postulacion = { nombre, email, foto: fotoBase64, cargo, propuestas };

const BASE = 'https://pag-personeria-1.onrender.com';

try {
    const res = await fetch(`${BASE}/postular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postulacion)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error');
    alert(data.mensaje);
    // redirigir a inicio
    window.location.href = 'index.html';
} catch (err) {
    console.error('Error al postular:', err);
    alert('No se pudo postular. Revisa la consola.');
}
});
