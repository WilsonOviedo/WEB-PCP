const fetch = require('node-fetch');

app.post('/api/authenticate', async (req, res) => {
    const { username, password } = req.body;

    // Realiza la autenticación en tu sistema (por ejemplo, en una base de datos)
    if (/* autenticación exitosa */) {
        const grafanaResponse = await fetch('http://tu-grafana.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
            }
        });

        if (grafanaResponse.ok) {
            const grafanaData = await grafanaResponse.json();
            const token = grafanaData.token; // Esto es solo un ejemplo, el token podría estar en otro lugar de la respuesta
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ error: 'Credenciales de Grafana incorrectas' });
        }
    } else {
        return res.status(401).json({ error: 'Credenciales incorrectas en tu sistema' });
    }
});
