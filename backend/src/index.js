const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const projects = [];

function logRequests (request, response, next) {
    const { method, url } = request.params;

    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.log(logLabel);
    return next();
}

function validateProjectId(request, response, next) {
    const { uuid } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid project ID.' })
    }

    return next();
}

app.use(logRequests);
app.use('projects/:id', validateProjectId);

app.get('/projects', logRequests, (request, response) => {
    const { title } = request.query;

    const result = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

    return response.json({});
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', validateProjectId, (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found'})
    }

    const project = {
        id,
        title,
        owner
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', validateProjectId, (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found'})
    }

    projects.splice(projectIndex, 1)

    return response.status(204).json({});
});

app.listen(3333, () => {
    console.log('Back-end started 🙌')
});