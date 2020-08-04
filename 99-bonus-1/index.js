const fs = require('fs');
const http = require('http'); 
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((request, response) => {
    const pathName = url.parse(request.url, true).pathname;
    const laptopId = url.parse(request.url, true).query.id;
    //PRODUCTS OVERVIEW:
    if (pathName === '/' || pathName == '/products') {
        console.log('Routing to products overview page...');
        response.writeHead(200, { 'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/overview-template.html`, 'utf-8', (error, data) => {
            let overviewOutput = data;
            fs.readFile(`${__dirname}/templates/overview-card-template.html`, 'utf-8', (error, data) => {
                const cardsOutput = laptopData.map(element => replaceTemplate(data, element)).join('');
                overviewOutput = overviewOutput.replace('{__CARDS__', cardsOutput);
                response.end(overviewOutput);
            });
        });
    }
    //LAPTOP DETAILS:
    else if (pathName === '/laptop' && laptopId < laptopData.length) {
        console.log('Routing to laptop details page...');
        response.writeHead(200, { 'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/laptop-template.html`, 'utf-8', (error, data) => {
            const output = replaceTemplate(data, laptopData[laptopId])
            response.end(output); 
        });
    }
    //IMAGES:
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        console.log('Serving image file [' + pathName + ']...');
        fs.readFile(`${__dirname}/data/img${pathName}`, (error, data) => {
            response.writeHead(200, { 'Content-type': 'image/jpg'});
            response.end(data);  
        });
    }
    //URL NOT FOUND:
    else {
        const notFoundMessage = 'The URL that you requested is not found on the server';
        console.log(notFoundMessage);
        response.writeHead(404, { 'Content-type': 'text/html'});
        response.end(notFoundMessage);
    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now...');
});

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{__ID__}/g,           laptop.id);
        output =       output.replace(/{__PRODUCT_NAME__}/g, laptop.productName);
        output =       output.replace(/{__IMAGE__}/g,        laptop.image);
        output =       output.replace(/{__PRICE__}/g,        laptop.price);
        output =       output.replace(/{__SCREEN__}/g,       laptop.screen);
        output =       output.replace(/{__CPU__}/g,          laptop.cpu);
        output =       output.replace(/{__STORAGE__}/g,      laptop.storage);
        output =       output.replace(/{__RAM__}/g,          laptop.ram);
        output =       output.replace(/{__DESCRIPTION__}/g,  laptop.description);
    return output;
}
