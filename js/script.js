const searchForm = document.querySelector('#search-form'); // Отримуємо форму по ID
const movie = document.querySelector('#movies')
const urlPoster = 'https://image.tmdb.org/t/p/w500'

function apiSearch(event){ //  Створюємо функцію
    event.preventDefault(); //  за допомогою - preventDefault ми позбавляємось перезагрузки сторінки яка відбувається при 'submit' де обробляються події (строка 8)
    const searchText = document.querySelector('.form-control').value; // Отримуємо значення яке ввели в input
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=196b0a7bc9a6a9b28d12b5bccde11087&language=ru&query=' + searchText;// Отримали API (База Данних)
    movie.innerHTML = 'Загрузка';

    fetch(server)
        .then(function(value){
            if (value.status !== 200){
                return Promise.reject(new Error('Ошибка'));
            }
            return value.json();
        })
        .then(function(output){
            let inner = '';
            output.results.forEach(function (item, i){
                let nameItem = item.name || item.title;
                inner +=`
                <div class="col-12 col-md-4 col-xl-3 item">
                <img src="${urlPoster + item.poster_path}" alt="${nameItem}">
                <h5>${nameItem}</h5>
                </div>
                `;
            });
                movie.innerHTML = inner;
        })
        .catch(function(reason){
            movie.innerHTML = 'Упс,щось пішло не так!'
            console.log('error: ' + reason.status);
        });
    
}

searchForm.addEventListener('submit', apiSearch); // Обробник подій в якому ми змінній searchForm навішуємо подію 'submit'та викликаємо функцію apiSearch,тобто коли ми в input щось вводимо і натискаємо Enter,то отримаємо в консоль те що вводимо.



