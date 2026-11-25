/**
 * Lovisa Destinos - API de Captura e Consulta de Leads / Solicitacoes
 * Salva novos contatos enviados pelo formulario diretamente no content.json (campo _leads)
 * para a cliente visualizar de forma organizada no painel administrativo.
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const token = process.env.GITHUB_TOKEN;
    const owner = (process.env.GITHUB_OWNER || 'lucasferraripro').trim();
    const repo  = (process.env.GITHUB_REPO || 'lovisa-destinos-site').trim();
    const path  = 'content.json';
    const headers = {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'lovisa-editor/1.0'
    };

    // GET /api/lead - Retorna os leads salvos
    if (req.method === 'GET') {
        try {
            const r = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
                { headers }
            );
            if (!r.ok) return res.status(200).json({ leads: [] });
            const data = await r.json();
            const cms = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
            return res.status(200).json({ leads: Array.isArray(cms._leads) ? cms._leads : [] });
        } catch (_) {
            return res.status(200).json({ leads: [] });
        }
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        if (!body) {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            body = JSON.parse(Buffer.concat(chunks).toString());
        }
    } catch {
        return res.status(400).json({ error: 'Body invalido' });
    }

    const { lead } = body || {};
    if (!lead || !lead.nome || !lead.whats) {
        return res.status(400).json({ error: 'Dados incompletos do lead' });
    }

    // Se nao tiver token configurado, responde ok para nao travar o usuario
    if (!token) {
        return res.status(200).json({ success: true, localOnly: true });
    }

    try {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const getRes = await fetch(apiUrl, { headers });
        if (!getRes.ok) throw new Error('Falha ao ler content.json no GitHub');

        const getJson = await getRes.json();
        const sha = getJson.sha;
        const cms = JSON.parse(Buffer.from(getJson.content, 'base64').toString('utf-8'));

        if (!Array.isArray(cms._leads)) cms._leads = [];

        // Adiciona o novo lead no topo
        cms._leads.unshift(lead);

        // Limita a 300 leads para nao inflar o content.json
        if (cms._leads.length > 300) {
            cms._leads = cms._leads.slice(0, 300);
        }

        const b64 = Buffer.from(JSON.stringify(cms, null, 2)).toString('base64');
        const commitMsg = `Lead: nova solicitacao de ${lead.nome} (${lead.destino || 'Geral'})`;

        const putRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: commitMsg, content: b64, sha })
        });

        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || 'Erro ao salvar lead');
        }

        return res.status(200).json({ success: true, lead });
    } catch (err) {
        // Retorna sucesso para o cliente nao ver erro se a API do GitHub demorar
        return res.status(200).json({ success: true, warning: err.message });
    }
}
