import express from 'express';
import bodyParser from 'body-parser';
import request from 'request'

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to Node Babel')
})


// Endpoint para obtener todos los posts
app.get('/posts', (req, res) => {
  request.get('https://jsonplaceholder.typicode.com/posts', (error, response, body) => {
    if (error) {
      return res.status(500).send('Error al obtener los posts');
    }
    res.json(JSON.parse(body));
  });
});

// Endpoint para obtener un post por su ID
app.get('/posts/:id', (req, res) => {
  const postId = req.params.id;
  request.get(`https://jsonplaceholder.typicode.com/posts/${postId}`, (error, response, body) => {
    if (error) {
      return res.status(500).send('Error al obtener el post');
    }
    res.json(JSON.parse(body));
  });
});

// Endpoint para crear un nuevo post
app.post('/posts', (req, res) => {
  const newPost = req.body;
  request.post('https://jsonplaceholder.typicode.com/posts', { json: newPost }, (error, response, body) => {
    if (error) {
      return res.status(500).send('Error al crear el post');
    }
    res.json(body);
  });
});

// Endpoint para actualizar un post existente
app.put('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;
  request.put(`https://jsonplaceholder.typicode.com/posts/${postId}`, { json: updatedPost }, (error, response, body) => {
    if (error) {
      return res.status(500).send('Error al actualizar el post');
    }
    res.json(body);
  });
});

// Endpoint para eliminar un post existente
app.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;
  request.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`, (error, response, body) => {
    if (error) {
      return res.status(500).send('Error al eliminar el post');
    }
    res.status(204).send();
  });
});

app.listen(5000, () => {
    console.log(`app is listening to port 5000`);
})