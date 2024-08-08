const express = require('express');
const app = express();
const cors=require('cors')
const PORT=process.env.PORT||3001
const morgan=require('morgan')
app.use(express.json());
app.use(express.static('dist'))
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
  });
  
  // Use custom log format including the body token
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
  
let persons = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const date = new Date();
    const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `;
    res.send(info);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    const newPerson = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(newPerson);
    res.json(newPerson);
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
