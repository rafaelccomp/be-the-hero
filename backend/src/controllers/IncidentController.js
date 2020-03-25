const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
    async create(req, res){
        const { title, description, value } = req.body;
        //request.headers; //vem a autenticação, dados de idioma, contexto da requisição
        const ong_id = req.headers.authorization;
    
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });
        
        return res.json({ id });
    },
    async index(req, res){
        //page=1 valor padrao
        const { page = 1 } = req.query;
        //[count] equivale a count[0]
        const [count] = await connection('incidents').count();
        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id','=','incidents.ong_id')
        .limit(5)
        .offset((page-1) * 5)
        .select(['incidents.*','ongs.name', 'ongs.email', 'ongs.whatsapp', 'ongs.city', 'ongs.uf']);
        //se eu deixar apenas *, ocorre que o id da ong vai sobrescrever o id do incidente
        res.header('X-Total-Count', count['count(*)'])
        return res.json(incidents); 
    },
    async delete(req, res){
        const { id } = req.params; 
        const ong_id = req.headers.authorization;
        const incident = await connection('incidents')
        .where('id',id)
        .select('ong_id')
        .first();

        if (incident.ong_id != ong_id)
            return res.status(401).json({error: 'Operation not permitted.'}); //não autorizado

        await connection('incidents').where('id', id).delete();
        return res.status(204).send(); //sucesso mas não tem conteúdo para voltar
    },

};