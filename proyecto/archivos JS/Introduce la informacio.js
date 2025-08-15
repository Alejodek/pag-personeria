document.getElementById("formulario").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const cargo = document.getElementById("cargo").value.trim().toLowerCase();
    const propuestas = document.getElementById("propuestas").value.trim();
    const fileInput = document.getElementById("foto");
    const file = fileInput.files[0];

    if (!nombre || !email || !cargo || !propuestas) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, introduce un correo electrónico válido.");
        return;
    }

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const db = new sqlite3.Database(path.join(__dirname, "base_datos.db"))

    const fotoBase64 = file ? await getBase64(file) : "";

    const postulacion = {
        nombre,
        email,
        foto: fotoBase64,
        cargo,
        propuestas
    };

    try {
        const res = await fetch("/postular", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postulacion)
        });

        const data = await res.json();
        alert(data.mensaje);

        if (res.ok) {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error al enviar datos:", error);
        alert("Error de conexión con el servidor");
    }
});
