window.addEventListener('DOMContentLoaded', async () => {
const container = document.querySelector('.block-level');
if (!container) {
    console.warn('No se encontró .block-level');
    return;
}

    const BASE = 'https://pag-personeria-1.onrender.com';

try {
    const res = await fetch(`${BASE}/candidatos`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const postulaciones = await res.json();

    const filtradas = postulaciones.filter(p =>
    window.location.href.includes('personero.html') ? p.cargo === 'Personero'
    : window.location.href.includes('contralor.html') ? p.cargo === 'Contralor'
    : true
    );

    if (filtradas.length === 0) {
        container.innerHTML = '<p>No hay postulaciones aún.</p>';
        return;
    }

    container.innerHTML = '';
    const votoGuardadoPersonero = localStorage.getItem('voto_personero');
    const votoGuardadoContralor = localStorage.getItem('voto_contralor');

    filtradas.forEach(p => {
    const div = document.createElement('div');
    div.classList.add('block-level__item');

    const img = document.createElement('img');
    img.className = 'per';
    img.src = p.foto || 'imagenes2/IMG_0404.JPG';
    img.alt = `Foto ${p.nombre}`;
    img.style.width = '200px';

    const ptag = document.createElement('p');
    ptag.textContent = p.propuestas || '';

    const votoBtn = document.createElement('button');
    votoBtn.className = 'n';
    votoBtn.textContent = p.nombre;

    const yaVoto = window.location.href.includes('personero.html') ? votoGuardadoPersonero : votoGuardadoContralor;
    votoBtn.disabled = !!yaVoto;

    votoBtn.addEventListener('click', async () => {
        if (yaVoto) { alert('Ya has votado.'); return; }
        if (!confirm(`¿Seguro que votas por ${p.nombre}?`)) return;

        try {
        const r = await fetch(`${BASE}/votar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ candidato: p.nombre })
        });
            const data = await r.json();
            if (!r.ok) throw new Error(data.mensaje || 'Error al votar');
            alert(data.mensaje);
            if (p.cargo === 'Personero') localStorage.setItem('voto_personero', p.nombre);
            if (p.cargo === 'Contralor') localStorage.setItem('voto_contralor', p.nombre);
            votoBtn.disabled = true;
        } catch (err) {
            console.error(err);
            alert('Error al enviar el voto. Revisa la consola (F12).');
        }
    });

        div.appendChild(img);
        div.appendChild(votoBtn);
        div.appendChild(ptag);
        container.appendChild(div);
    });
} catch (err) {
    console.error('Error al cargar candidatos:', err);
    container.innerHTML = '<p>Error al cargar candidatos. Revisa la consola.</p>';
}
});
