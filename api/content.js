/**
 * GET /api/content
 * Retorna o content.json sempre atualizado (via GitHub API, sem cache CDN)
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const token = process.env.GITHUB_TOKEN;
    const owner = 'lucasferraripro';
    const repo  = 'lovisa-destinos-site';
    const path  = 'content.json';

    function isValidImageSrc(src) {
        const value = String(src || '').trim();
        if (!value) return false;
        if (/^data:image\//i.test(value)) return false;
        if (/^[a-zA-Z]:\\/.test(value) || value.startsWith('\\\\')) return false;
        if (/instagram\.com\/p\//i.test(value)) return false;
        if (/cdninstagram|fbcdn|instagram\.[^/]+\/v\//i.test(value)) return false;
        return /^(https?:\/\/|imagens\/|\.\/imagens\/|\/imagens\/)/i.test(value);
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
                const fotos = Array.isArray(pkg.fotos) ? pkg.fotos.filter(isValidImageSrc) : [];
                if (isValidImageSrc(pkg.img)) fotos.unshift(pkg.img);
                pkg.fotos = [...new Set(fotos)];
                pkg.img = pkg.fotos[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
            });
        }
        return cms;
    }

    try {
        const r = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
            {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'lovisa-editor/1.0'
                }
            }
        );

        if (!r.ok) {
            return res.status(200).json({});
        }

        const data = await r.json();
        const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
        return res.status(200).json(cleanContent(content));

    } catch (_) {
        return res.status(200).json({});
    }
}
