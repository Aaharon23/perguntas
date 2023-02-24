const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database')
const Pergunta = require('./database/pergunta')
const Resposta = require('./database/Resposta')

//Database
connection
    .authenticate()
    .then(()=>{
        console.log('conexão feita com sucecesso no banco de dados');
    })
    .catch((erro)=>{
        console.log(erro);
    })

//ESTOU DIZENDO PARA O EXPRESS USAR O 'EJS' PARA LANÇAR view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

//ROTA PRINCIPAL
app.get('/', (req,res)=>{
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']
    ]}).then(perguntas =>{
        res.render('index',{
            perguntas: perguntas
        });
    });
    
});

//ROTA PARA REALIZAR A PERGUNTA
app.get('/perguntar',(req,res)=>{
    res.render('perguntar');
});

//SALVA PERGUNTA NO BANCO DE DADOS
app.post('/salvarpergunta',(req, res)=>{

    //CAPTA AS INFORMAÇOES NO FRONT END
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    //FAZ UM INSERT NO BANCO DE DADOS
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect('/')
    });
});

//ROTA PARA BUSCAR PERGUNTAS NO  BANCO DE DADOS
app.get('/pergunta/:id',(req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where:{id:id}
    }).then(pergunta =>{
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[ 
                ['id', 'DESC']
                ]
            }).then(respostas =>{
                res.render('pergunta',{
                    pergunta:pergunta,
                    respostas: respostas
                });
            });

            
        }else{
            res.redirect('/')
        }        
    })
});

app.post('/responder',(req, res)=>{
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect('/pergunta/'+perguntaId)
    })

});

app.listen(8080, ()=>{console.log('App rodando');});
