// 1. read the file
// 2. extract header row
// 3. filter value according to graph necessities
// 4. write the filtered values into a json

//1. read the file

const fs = require('fs');
const readline = require('readline');

let count = 0;
let year;
let description;
let primaryType;
let newobj = [];

const rl = readline.createInterface({
    input: fs.createReadStream('../Material/chicagocrimes.csv')
    // input: fs.createReadStream('../Material/chicagocrimes_3.csv')
});

rl.on('line', (line) => {

    
    //2. extract header row
    line = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);    
    if (count === 0) {
        year = line.indexOf('Year');
        description = line.indexOf('Description');
        primaryType = line.indexOf('Primary Type');
        count++;
    }       

    //3. filter value according graph necesstities
    if(line[primaryType] === 'THEFT')
    {var flag =0;
         newobj.map(function(element){
        if(line[year] === element['Year'] ){
                    if(line[description] === 'OVER $500')
                    {
                        element['OVER $500'] += 1;
                    }
                    else if(line[description] === '$500 AND UNDER')
                    {
                        element['$500 AND UNDER'] += 1;
                    }
                    flag = 1;
        }
        });
        if(flag == 0){
                if(line[description] === 'OVER $500')
                    newobj.push({"OVER $500": 1,"$500 AND UNDER": 0,"Year": line[year]})
                else if(line[description] === '$500 AND UNDER')
                    newobj.push({"OVER $500": 0,"$500 AND UNDER": 1,"Year": line[year]})
        }
                  
    }
    

}).on('close', () =>{
   writemyfile(newobj);
})

// function to write a file

function writemyfile(thearray){

    fs.writeFile('chicagocrimes.json',JSON.stringify(thearray),(err) => {

            if (err) throw err;

     });

}