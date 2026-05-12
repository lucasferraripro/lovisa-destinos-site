/**
 * Lovisa Destinos - API de publicacao
 * Recebe o content.json do editor, commita no GitHub e deixa o Vercel
 * publicar pelo projeto oficial lovisa-destinos-site.
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
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

    let { content, secret } = body;
    const adminSecret = process.env.ADMIN_SECRET || 'Lovisa@2025';
    if (secret !== adminSecret) return res.status(401).json({ error: 'Nao autorizado' });

    const token = process.env.GITHUB_TOKEN;
    if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN nao configurado no Vercel' });

    const owner = 'lucasferraripro';
    const repo = 'lovisa-destinos-site';
    const headers = {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'lovisa-editor/1.0'
    };

    function isValidImageSrc(src) {
        const value = String(src || '').trim();
        if (!value) return false;
        if (/^[a-zA-Z]:\\/.test(value) || value.startsWith('\\\\')) return false;
        if (/instagram\.com\/p\//i.test(value)) return false;
        if (/cdninstagram|fbcdn|instagram\.[^/]+\/v\//i.test(value)) return false;
        return /^(data:image\/|https?:\/\/|imagens\/|\.\/imagens\/|\/imagens\/)/i.test(value);
    }

    function cleanPackageId(value) {
        return String(value || '')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase().replace(/[^a-z0-9-]/g, '');
    }

    function cleanContent(input) {
        const cms = JSON.parse(JSON.stringify(input || {}));
        Object.keys(cms).forEach(key => {
            const entry = cms[key];
            if (entry && typeof entry === 'object' && typeof entry.src === 'string' && !isValidImageSrc(entry.src)) {
                delete cms[key];
            }
        });

        if (cms._packages && typeof cms._packages === 'object') {
            Object.entries(cms._packages).forEach(([id, pkg]) => {
                if (!pkg || typeof pkg !== 'object') {
                    delete cms._packages[id];
                    return;
                }
                const cleanId = cleanPackageId(pkg.id || id);
                if (!cleanId) {
                    delete cms._packages[id];
                    return;
                }
                const fotos = Array.isArray(pkg.fotos) ? pkg.fotos.filter(isValidImageSrc) : [];
                if (isValidImageSrc(pkg.img)) fotos.unshift(pkg.img);
                pkg.id = cleanId;
                pkg.fotos = [...new Set(fotos)];
                pkg.img = pkg.fotos[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
            });
        }
        return cms;
    }

    async function commitFile(filePath, fileContent, message) {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        const getRes = await fetch(apiUrl, { headers });
        const getJson = await getRes.json();
        const sha = getJson.sha || null;
        const b64 = Buffer.from(fileContent).toString('base64');
        const putRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, content: b64, ...(sha ? { sha } : {}) })
        });
        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || `Erro ao commitar ${filePath}`);
        }
        return putRes.json();
    }

    try {
        const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        content = cleanContent(content);

        await commitFile('content.json', JSON.stringify(content, null, 2), `Editor: atualiza conteudo (${now})`);

        return res.status(200).json({
            success: true,
            message: 'Publicado! O site sera atualizado em alguns segundos.'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
