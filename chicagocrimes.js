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
var createfile = true;
const re = /,(?=(?:(?:[^"]*"){2})*[^"]+$)/;


// paths created

const path = '../Material/chicagocrimes.csv';
// const path1 = '../Material/chicagocrimes_3.csv';   // this path is for checking whether it would allow the improper format in csv data

//checking the path

if(!fs.existsSync(path)){

    console.log('The file you are trying to access is not available on the given path!');
    console.log('Please provide an appropriate path!');

}
else{

    const rl = readline.createInterface({

    input: fs.createReadStream(path)
    // input: fs.createReadStream(path1)

    });
    

        rl.on('line', (line) => {

          // checks whether the format inside csv is correct or not
            if(line.split(',') == false){

                 createfile = false;
                 return;    
                 
            }  
            else{

                line = line.split(re);  

                if (count === 0) {
                    year = line.indexOf('Year');
                    description = line.indexOf('Description');
                    primaryType = line.indexOf('Primary Type');
                    count++;
                }       

                //3. filter value according graph necesstities
                if(line[primaryType] === 'THEFT')
                {
                    var flag =0;
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
        
            }
    }).on('close', () => { // whenever the reading of the file is completed it would execute this close event

    if(createfile === false)
    {
        console.log('The data inside the file is not comma seperated!');
        console.log('Hence, JSON File could not be written!');
    }
    else{
        writemyfile(newobj);
        console.log('JSON File has been successfully written!');
    }
})

}

// function to write a file

function writemyfile(thearray){

    fs.writeFile('chicagocrimes.json',JSON.stringify(thearray),(err) => {

            if (err) throw err;

     });
}