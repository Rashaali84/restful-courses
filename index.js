
//dependencies 
const fs = require('fs');//to read and write from course.json
const path = require('path');
const express = require('express'); // it returns a function 
const app = express(); //app.get() app.post() app.put() app.delete()
//in this tutorial we are going to create endpoints that responds to the app.get()
//No More IF Blocks !! -- express is scalable for large projects 
const Joi = require('joi'); // Joi is class and we use pascal naming conventions to name our classes 
app.use(express.json()); // middle ware to use that request pipeline 

const COURSES_PATH = 'courses.json';

// get request for main page 
app.get('/', (req, res) => {
    res.send('Hello world');
}); //call back function // root directory

//list all courses in courses.json 
app.get('/api/courses', (req, res) => {
    // get the course from db courses.json use fs
    fs.readFile(path.join(__dirname, COURSES_PATH), 'utf-8',
        (err, contents) => {
            if (err) res.status(404).send(err);
            res.send(JSON.parse(contents));

        });

});


///api/courses /:id  // string parameters
app.get('/api/courses/:id', (req, res) => {
    // get the course from db courses.json use fs
    fs.readFile(path.join(__dirname, COURSES_PATH), 'utf-8',
        (err, contents) => {
            const parsedContent = JSON.parse(contents);
            if (err) res.status(404).send(err);
            if (parsedContent[req.params.id]) {
                res.send(JSON.parse('{"' + req.params.id + '":"' + parsedContent[req.params.id] + '"}'));
            }
            else {
                return res.status(404).send('the course with the given id was not found ... ');
            }
        });

});

//post a course
app.post('/api/courses', (req, res) => {
    //do some input validation to the name inputs
    if (!req.body.name) {
        res.status(400).send('Name is required .. ')
        return;
    } // here comes npm joi to validation !!!
    //npm i joi  npm i joi@13.1.0
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    fs.readFile(path.join(__dirname, COURSES_PATH), 'utf-8',
        (err, contents) => {
            if (err) res.status(404).send(err);

            let obj = JSON.parse(contents); //now it an object
            console.log(contents);
            obj[Object.keys(obj).length + 1] = req.body.name; //add some data
            let json = JSON.stringify(obj); //convert it back to json

            fs.writeFile(path.join(__dirname, COURSES_PATH), json, 'utf8', (err) => {
                if (err)
                    res.status(404).send(err);
                res.send(json);
            });
        });

});

//update a course
app.put('/api/courses/:id', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    fs.readFile(path.join(__dirname, COURSES_PATH), 'utf-8',
        (err, contents) => {
            const parsedContent = JSON.parse(contents);
            if (err) res.status(404).send(err);
            if (parsedContent[req.params.id]) {
                parsedContent[req.params.id] = req.body.name;
                let json = JSON.stringify(parsedContent); //convert it back to json
                fs.writeFile(path.join(__dirname, COURSES_PATH), json, 'utf8', (err) => {
                    if (err)
                        res.status(404).send(err);
                    res.send(json);
                });

            }
            else {
                return res.status(404).send('the course with the given id was not found ... ');
            }
        });

});

//http delete request 

app.delete('/api/courses/:id', (req, res) => {

    fs.readFile(path.join(__dirname, COURSES_PATH), 'utf-8',
        (err, contents) => {
            const parsedContent = JSON.parse(contents);
            if (err) res.status(404).send(err);
            if (parsedContent[req.params.id]) {
                delete parsedContent[req.params.id];
                console.log(parsedContent);
                const toWrite = JSON.stringify(parsedContent, null, '  ');
                //now write the data again
                fs.writeFile(path.join(__dirname, COURSES_PATH), toWrite, (err) => {
                    if (err)
                        res.status(404).send(err);
                    res.send(parsedContent);
                })
            }
            else {
                return res.status(404).send('the course with the given id was not found ... ');
            }
        });
});

function validateCourse(course) {
    const schema = { name: Joi.string().min(2).required() };//schema for Joi to validate input 
    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`listening to port ${port}`) });


//study notes 
//for better testing we are going to install npm i -g nodemon 
//no more stop and restart the server for any changes 
// now instead of using node index.js use nodemon index.js
//Environement variable --> value is set outside the application 
//PORT -- > Environement variable
 // use production variable if not use 3000 locally
//process is a global variable with env parameter in node.js
//now we need the webserver to listen to port 3000 , also we used a call-back function

