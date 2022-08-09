const searchForm = document.querySelector('#search-form'); // Отримуємо форму по ID
const movie = document.querySelector('#movies')
function apiSearch(event){ //  Створюємо функцію
    event.preventDefault(); //  за допомогою - preventDefault ми позбавляємось перезагрузки сторінки яка відбувається при 'submit' де обробляються події (строка 8)
    const searchText = document.querySelector('.form-control').value; // Отримуємо значення яке ввели в input
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=196b0a7bc9a6a9b28d12b5bccde11087&language=ru&query=' + searchText;// Отримали API (База Данних)
    requestApi(server);
}

searchForm.addEventListener('submit', apiSearch); // Обробник подій в якому ми змінній searchForm навішуємо подію 'submit'та викликаємо функцію apiSearch,тобто коли ми в input щось вводимо і натискаємо Enter,то отримаємо в консоль те що вводимо.

function requestApi(url){
    
 const request = new XMLHttpRequest();// это встроенный в браузер объект, который даёт возможность делать HTTP-запросы к серверу без перезагрузки страницы.
 request.open('GET', url);
 request.send();

 request.addEventListener('readystatechange', function() {
    if (request.readyState !== 4) return;

    if (request.status !== 200){
        console.log('error: ' + request.status);
        return;
    }

    const output = JSON.parse(request.responseText)

    let inner = '';

    output.results.forEach(function (item, i){
        let nameItem = item.name || item.title;
        console.log(nameItem);
        inner +='<div class="col-12">' + nameItem + '</div>';
    });
        
    

    movie.innerHTML = inner;
 
 });
}