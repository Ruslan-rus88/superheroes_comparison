let results = document.querySelector('.search-results')
let searchText = document.querySelector('.input')
let accessToken = '10217207434241759'

let compareDataBase = new Set();
let numOfComparedItems = document.querySelector('number-of-compared-items')

function searchFunc(){
    var requestURL = `https://www.superheroapi.com/api.php/${accessToken}/search/${searchText.value}`  // url contains .php !!
    var xhr = new XMLHttpRequest();
    xhr.open( "GET", requestURL);

    xhr.onload = () => {
        var res = xhr.response // typeof xhr.response is String
        res = res.replaceAll('full-name','fullname'); // I did the replace because I could not call full-name in the loop
        res = JSON.parse(res)

        // console.log(res);

        if (res.response == 'error'){
            results.innerHTML = `
            <h2 class='searchResults'>Search Results</h2>
            <div class='text' style='color: red;'>Nothing found for "${searchText.value}"</div>`
            alert('character with given name not found!')
        }
        else {
            results.innerHTML = `
            <h2 class='searchResults'>Search Results</h2>
            <div class='text'>(click to add to comparison)</div>`
    
            for (i=0; i<res.results.length; i++){
                results.innerHTML += `
    
                <div class='superhero'>
                    <div class='name'>${res.results[i].name}</div>
                    <div class='full-name'>${res.results[i].biography.fullname}</div>
                </div>`
            }

            addFunc(res.results);
        }
    }
    xhr.send();
}

function randomFunc(){
    let id = Math.floor(Math.random()*731)+1;
    var requestURL = `https://www.superheroapi.com/api.php/${accessToken}/${id}`  // url contains .php !!
    var xhr = new XMLHttpRequest();
    xhr.open( "GET", requestURL);

    xhr.onload = () => {
        var res = xhr.response // typeof xhr.response is String
        res = res.replaceAll('full-name','fullname'); // I did the replace because I could not call full-name in the loop
        res = JSON.parse(res)

        console.log(res);

        results.innerHTML = `
        <h2 class='searchResults'>Search Results</h2>
        <div class='text'>(click to add to comparison)</div>
        <div class='superhero' onclick='addFunc(${res})'>
            <div class='name'>${res.name}</div>
            <div class='full-name'>${res.biography.fullname}</div>
        </div>`

        var superhero = document.querySelector('.superhero')
        superhero.onclick = function(){
            compareDataBase.add(res)
            let numOfComparedItems = document.querySelector('.number-of-compared-items')
            numOfComparedItems.innerHTML = compareDataBase.size;
            console.log(compareDataBase);
        }
    }
    xhr.send();
}

function addFunc (array){
    var superheroes = document.querySelectorAll('.superhero')

    for(let i=0; i<superheroes.length; i++){
        superheroes[i].onclick = function(){
            compareDataBase.add(array[i])
            let numOfComparedItems = document.querySelector('.number-of-compared-items')
            numOfComparedItems.innerHTML = compareDataBase.size;

            console.log(compareDataBase);    
        }              
    }
}

function compare(){
    results.innerHTML = '';
    if (compareDataBase.size > 0){
        //display compare options
        let options_container = document.querySelector('.options_container');
        options_container.style.display = 'flex';

        // create the main array for google chart
        var chartArray = [] 

        var compareOptions = ['Superhero']
        var activeOptions = document.querySelectorAll('.active')
        for (let i=0; i<activeOptions.length; i++){
            compareOptions.push(activeOptions[i].innerHTML)
        }
        chartArray.push(compareOptions)
        // console.log(compareOptions);

        for(let hero of compareDataBase){
            var heroArray = [hero.name]
            for (let x=1; x < compareOptions.length; x++){
                heroArray.push(hero.powerstats[compareOptions[x]])
            }
            chartArray.push(heroArray)
        }
        // console.log(chartArray);
        
        drawChart(chartArray)
    }    
}

google.charts.load('current', {'packages':['bar']});
google.charts.setOnLoadCallback(drawChart(chartArray));

function drawChart(chartArray) {

    var data = google.visualization.arrayToDataTable(chartArray);

    var options = {
        chart: {
        // title: 'Company Performance',
        // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        }
    };

    var chart = new google.charts.Bar(document.getElementById('chart'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function addRemoveClass(x){
    if (x.classList.contains('active')){
        x.classList.remove('active')
    }
    else{
        x.classList.add('active')
    }
    compare();
}




// google.charts.load('current', {'packages':['bar']});
// google.charts.setOnLoadCallback(drawChart);

// function drawChart() {
//   var data = google.visualization.arrayToDataTable([
//     ['Year', 'Sales', 'Expenses', 'Profit'],
//     ['2014', 1000, 400, 200],
//     ['2015', 1170, 460, 250],
//     ['2016', 660, 1120, 300],
//     ['2017', 1030, 540, 350]
//   ]);

//   var options = {
//     chart: {
//     //   title: 'Company Performance',
//     //   subtitle: 'Sales, Expenses, and Profit: 2014-2017',
//     }
//   };

//   var chart = new google.charts.Bar(document.getElementById('chart'));

//   chart.draw(data, google.charts.Bar.convertOptions(options));
// }