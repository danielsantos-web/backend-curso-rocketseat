const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(cors());
app.use(express.json());

const projects = [];


//Isso é um midleware
function logRequests(request, response, next){
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next(); //indica para ir para o proximo midleware
};

function validateProjectId(request, response, next){
    const { id } = request.params;

    if(!isUuid(id)){
        return response.status(400).json({error: 'inválid project ID'});
    }; 

    return next();

};

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

//-----------------------------------------------------------------------------------

app.get('/projects', (request, response) => {
    const { title } = request.query;
    
    const results = title
    ? projects.filter(project => project.title.includes(title)) 
    : projects;
    

    return response.json(results); 
});

//-----------------------------------------------------------------------------------

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = {id: uuid(), title, owner};

    projects.push(project);

    return response.json(project);
});  

//-----------------------------------------------------------------------------------

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    //Aqui eu encontro o indice e armazeno na variavel projectIndex
    const projectIndex = projects.findIndex(project => project.id == id);

    if(projectIndex < 0){
        return response.status(400).json({error: 'Project not Found'})
    };

    //Aqui eu reconstruo o objeto com os valores obtidos
    const project = {
        id,
        title,
        owner
    }

    //Aqui eu digo que o array "projetos" no Id obtido"projectIndex" vai receber o novo objeto montado acima
    projects[projectIndex] = project;

    return response.json(project);
});

//-----------------------------------------------------------------------------------

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    //Aqui eu encontro o indice e armazeno na variavel projectIndex
    const projectIndex = projects.findIndex(project => project.id == id);

    if(projectIndex < 0){
        return response.status(400).json({error: 'Project not Found'})
    };

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

app.listen(3333, () => {
    console.log('💥 Backend Started!');
});
