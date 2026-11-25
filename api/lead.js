/**
 * Lovisa Destinos - Solicitações (leads) do formulário
 *
 * Os dados dos clientes (nome, WhatsApp, e-mail) NUNCA vão para o content.json,
 * que é público. Ficam em data/leads.json, criptografados (AES-256-GCM), e só
 * o painel administrativo (com a senha) consegue ler ou excluir.
 *
 *   POST   /api/lead            -> público: grava uma nova solicitação
 *   GET    /api/lead            -> admin (header x-admin-secret): lista
 *   DELETE /api/lead?id=lead_x  -> admin: remove uma solicitação
 */
import crypto from 'crypto';

const FILE = 'data/leads.json';
const MAX_LEADS = 500;

function adminSecret() {
    return (process.env.ADMIN_SECRET || '').trim();
}

function keyBytes() {
    const base = (process.env.LEADS_KEY || process.env.ADMIN_SECRET || '').trim();
    if (!base) throw new Error('LEADS_KEY nao configurada');
    return crypto.createHash('sha256').update('lovisa-leads:' + base).digest();
}

function encrypt(list) {
    const iv = crypto.randomBytes(12);
    const c = crypto.createCipheriv('aes-256-gcm', keyBytes(), iv);
    const data = Buffer.concat([c.update(JSON.stringify(list), 'utf8'), c.final()]);
    return JSON.stringify({
        v: 1,
        note: 'Arquivo criptografado. Leia pelo painel: Solicitacoes.',
        iv: iv.toString('base64'),
        tag: c.getAuthTag().toString('base64'),
        data: data.toString('base64')
    });
}

function decrypt(text) {
    const o = JSON.parse(text);
    if (!o || o.v !== 1) return [];
    const d = crypto.createDecipheriv('aes-256-gcm', keyBytes(), Buffer.from(o.iv, 'base64'));
    d.setAuthTag(Buffer.from(o.tag, 'base64'));
    const out = Buffer.concat([d.update(Buffer.from(o.data, 'base64')), d.final()]).toString('utf8');
    const list = JSON.parse(out);
    return Array.isArray(list) ? list : [];
}

function gh() {
    const owner = (process.env.GITHUB_OWNER || 'lucasferraripro').trim();
    const repo = (process.env.GITHUB_REPO || 'lovisa-destinos-site').trim();
    return {
        url: `https://api.github.com/repos/${owner}/${repo}/contents/${FILE}`,
        headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'lovisa-editor/1.0'
        }
    };
}

async function readLeads() {
    const { url, headers } = gh();
    const r = await fetch(url + '?ref=master', { headers });
    if (r.status === 404) return { list: [], sha: null };
    if (!r.ok) throw new Error('Falha ao ler solicitacoes (' + r.status + ')');
    const j = await r.json();
    return { list: decrypt(Buffer.from(j.content, 'base64').toString('utf8')), sha: j.sha };
}

async function writeLeads(list, sha, message) {
    const { url, headers } = gh();
    const r = await fetch(url, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            content: Buffer.from(encrypt(list)).toString('base64'),
            branch: 'master',
            ...(sha ? { sha } : {})
        })
    });
    if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        const e = new Error(err.message || 'Erro ao salvar');
        e.status = r.status;
        throw e;
    }
}

/** Lê, altera e grava; repete se outra gravação aconteceu ao mesmo tempo. */
async function update(mutator, message) {
    for (let i = 0; i < 4; i++) {
        const { list, sha } = await readLeads();
        const next = mutator(list);
        try {
            await writeLeads(next, sha, message);
            return next;
        } catch (e) {
            if (e.status !== 409 && e.status !== 422) throw e;
            await new Promise(r => setTimeout(r, 300 + Math.random() * 500));
        }
    }
    throw new Error('Conflito ao salvar, tente novamente');
}

const clip = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);

async function readBody(req) {
    if (req.body && typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') return JSON.parse(req.body);
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    return JSON.parse(Buffer.concat(chunks).toString() || '{}');
}

function isAdmin(req) {
    const s = adminSecret();
    const given = String(req.headers['x-admin-secret'] || '').trim();
    if (!s || !given) return false;
    const a = Buffer.from(s), b = Buffer.from(given);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (!process.env.GITHUB_TOKEN) {
        return res.status(req.method === 'POST' ? 200 : 500).json({ success: false, error: 'GITHUB_TOKEN nao configurado' });
    }

    try {
        if (req.method === 'GET') {
            if (!isAdmin(req)) return res.status(401).json({ error: 'Nao autorizado' });
            const { list } = await readLeads();
            return res.status(200).json({ leads: list });
        }

        if (req.method === 'DELETE') {
            if (!isAdmin(req)) return res.status(401).json({ error: 'Nao autorizado' });
            const id = clip(req.query && req.query.id, 80);
            if (!id) return res.status(400).json({ error: 'id obrigatorio' });
            const list = await update(l => l.filter(x => x.id !== id), 'Painel: solicitacao removida');
            return res.status(200).json({ success: true, leads: list });
        }

        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

        const body = await readBody(req);
        const raw = (body && body.lead) || {};
        if (raw.website) return res.status(200).json({ success: true }); // robô (campo-isca preenchido)
        const lead = {
            id: 'lead_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex'),
            timestamp: Date.now(),
            data: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
            nome: clip(raw.nome, 120),
            whats: clip(raw.whats, 40),
            email: clip(raw.email, 160),
            destino: clip(raw.destino, 120),
            viajantes: clip(raw.viajantes, 160),
            ida: clip(raw.ida, 20),
            volta: clip(raw.volta, 20),
            obs: clip(raw.obs, 1500),
            origem: clip(raw.origem, 60),
            status: 'novo'
        };
        if (!lead.nome || lead.whats.replace(/\D/g, '').length < 8) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }
        await update(l => [lead, ...l].slice(0, MAX_LEADS), 'Nova solicitacao recebida pelo site');
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('[lead]', err.message);
        return res.status(req.method === 'POST' ? 200 : 500).json({ success: false, error: err.message });
    }
}
