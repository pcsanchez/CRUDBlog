const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

const jsonParser = bodyParser.json();

const app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

let comentarios = [{
    id: uuidv4(),
    titulo: 'Short-circuiting in meta-functions',
    contenido: 'Should cond_a() evaluate to false, cond_b() is guaranteed not to be evaluated. This is useful for two reasons. One is performance: if cond_b() is an expensive operation we do not want to evaluate it if we can determine the final result from only evaluating cond_a(). The other reason is program correctness.',
    autor: 'Carlos Estrada',
    fecha: Date(Date.now())
},
{
    id: uuidv4(),
    titulo: 'String literals make bad ranges',
    contenido: 'C++20 will come with what we call “Ranges” library. Meanwhile, range interface has been supported ever since C++11 in one context: range-based for loop. A range-based for loop can detect anything that is a range and work with it.',
    autor: 'Moises Fernandez',
    fecha: Date(Date.now())
},
{
    id: uuidv4(),
    titulo: 'Generative Adversarial Networks in Python',
    contenido: 'A generative adversarial network is a class of machine learning systems invented by Ian Goodfellow and his colleagues in 2014. Two neural networks contest with each other in a game. Given a training set, this technique learns to generate new data with the same statistics as the training set.',
    autor: 'Erick Gonzales',
    fecha: Date(Date.now())
}
];

app.get('/blog-api/comentarios', (req, res) => {
    return res.status(200).json(comentarios);
})

app.get('/blog-api/comentarios-por-autor', (req,res) => {
    const autor = req.query.autor;
    if(autor === undefined) {
        return res.status(406).send('No se proporciono el autor.');
    }

    const filtered = comentarios.filter(com => com.autor == autor);

    console.log(filtered);

    if(filtered.length < 1) {
        return res.status(404).send('El autor no cuenta con comentarios en el blog.');
    }

    return res.status(200).json(filtered);
})

app.post('/blog-api/nuevo-comentario', jsonParser, (req, res) => {
    const {titulo, contenido, autor} = req.body;
    if(!titulo || !contenido || !autor) {
        return res.status(406).send('El contenido de la peticion no esta completo');
    }

    let comentario = {
        id: uuidv4(),
        titulo: titulo,
        contenido: contenido,
        autor: autor,
        fecha: Date(Date.now())
    }

    comentarios.push(comentario);
    console.log(comentarios);
    return res.status(200).json(comentario);
})

app.delete('/blog-api/remover-comentario/:id', jsonParser, (req, res) => {
    let index = comentarios.findIndex(el => el.id === req.params.id);

    if(index === -1) {
        return res.status(404).send('El id proporcionado no existe');
    }

    comentarios.splice(index,1);
    return res.status(200).send();
})

app.put('/blog-api/actualizar-comentario/:id', jsonParser, (req, res) => {
    const {id, titulo, contenido, autor} = req.body;

    if(!id) {
        return res.status(406).send('No se proporciono el id en el cuerpo');
    }

    if(id != req.params.id) {
        return res.status(409).send('Los ids no coinciden');
    }

    if(!titulo && !contenido && !autor) {
        return res.status(406).send('No se envio ningun valor para actualizar');
    }

    let index = comentarios.findIndex(el => el.id === req.params.id);

    if(index === -1) {
        return res.status(404).send('El id proporcionado no existe');
    }

    if(titulo) {
        comentarios[index].titulo = titulo;
    }

    if(contenido) {
        comentarios[index].contenido = contenido; 
    }

    if(autor) {
        comentarios[index].autor = autor;
    }

    return res.status(202).json(comentarios[index]);

    
})

app.listen(8080, () => {
    console.log('Server has started in port 8080');
})