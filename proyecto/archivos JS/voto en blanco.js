async function votarEnBlanco(cargo) {
    const usuario = prompt("Ingresa tu nombre de usuario para confirmar tu voto en blanco:");
    if (!usuario) return;

    const res = await fetch("https://pag-personeria-1.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, cargo })
    });

    const data = await res.json();
    alert(data.mensaje);
}
