const searchForm = document.querySelector('#search-form'); // Отримуємо форму по ID
const movie = document.querySelector('#movies')
const urlPoster = 'https://image.tmdb.org/t/p/w500'

function apiSearch(event){ //  Створюємо функцію
    event.preventDefault(); //  за допомогою - preventDefault ми позбавляємось перезагрузки сторінки яка відбувається при 'submit' де обробляються події (строка 8)
    const searchText = document.querySelector('.form-control').value; // Отримуємо значення яке ввели в input
    if(searchText.trim().length === 0) {
        movie.innerHTML = '<h2 class"col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        return;
    }
    
    movie.innerHTML = '<div class="spinner"></div>';

    fetch('https://api.themoviedb.org/3/search/multi?api_key=196b0a7bc9a6a9b28d12b5bccde11087&language=ru&query=' + searchText) // Отримали API (База Данних)
        .then(function(value){
            if (value.status !== 200){
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then(function(output){
            let inner = '';
            if(output.results.length === 0){
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>'
            };
            output.results.forEach(function (item){
            
                let nameItem = item.name || item.title;
                let mediaType = item.title ? 'movie' : 'tv' ;
                const poster = item.poster_path ? urlPoster + item.poster_path : './img/No_poster.svg.png';
                let dataInfo = '';
                if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" 
                data-type="${mediaType}"`
                inner +=`
                <div class="col-12 col-md-4 col-xl-3 item">
                <img src="${poster}" class="img-poster" alt="${nameItem}" ${dataInfo}>
                <h5>${nameItem}</h5>
                </div>
                `;
            });
                movie.innerHTML = inner;
            addEventMedia();
                
        })
        .catch(function(reason){
            movie.innerHTML = 'Упс,щось пішло не так!'
        
        });
    
}

    searchForm.addEventListener('submit', apiSearch); // Обробник подій в якому ми змінній searchForm навішуємо подію 'submit'та викликаємо функцію apiSearch,тобто коли ми в input щось вводимо і натискаємо Enter,то отримаємо в консоль те що вводимо.

    function addEventMedia(){
    const media = movie.querySelectorAll('img[data-id]');
                media.forEach(function(elem){
                    elem.style.cursor = 'pointer' ;
                    elem.addEventListener('click' , showfullInfo);
                });
}

function showfullInfo() {
    let url = '';
    if(this.dataset.type === 'movie'){
        url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=196b0a7bc9a6a9b28d12b5bccde11087&language=ru' ;
    }else if (this.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=196b0a7bc9a6a9b28d12b5bccde11087&language=ru' ;
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка , повторите позже</h2>';
    }
    fetch(url) // Отримали API (База Данних)
        .then(function(value){
            if (value.status !== 200){
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then(function (output) {
            movie.innerHTML = `
            <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
            <div class="col-4">
                <img src='${urlPoster + output.poster_path}' alt='${output.name || output.title}'>
                    ${(output.homepage) ? `<p class="text-center"> <a href="${output.homepage}" target="_blank"> Официальная страница </a> </p>` : ''} 
                    ${(output.imdb_id) ? `<p class="text-center"> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank"> Официальная страница </a> </p>` : ''}          
                </div>
            <div class="col-8"></div>
            `;
           console.log(output);
        })
        .catch(function(reason){
            movie.innerHTML = 'Упс,щось пішло не так!'
        
        });
    
}

document.addEventListener('DOMContentLoaded' , function(){
    fetch('https://api.themoviedb.org/3/trending/all/day?api_key=196b0a7bc9a6a9b28d12b5bccde11087&language=ru')
        .then(function(value){
            if (value.status !== 200){
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then(function(output){
            console.log( 'output: ', output);

            let inner = '<h4 class"col-12 text-center text-info">Популярное за неделю</h4>';
            if(output.results.length === 0){
                inner = '<h2 class"col-12 text-center text-info">По вашему запросу ничего не найдено</h2>'
            };
            output.results.forEach(function (item) {
            
                let nameItem = item.name || item.title;
                const poster = item.poster_path ? urlPoster + item.poster_path : './img/No_poster.svg.png';
                let dataInfo = `data-id="${item.id}" 
                data-type="${item.media_type}"`;
                
                inner +=`
                <div class="col-12 col-md-4 col-xl-3 item">
                <img src="${poster}" class="img-poster" alt="${nameItem}" ${dataInfo}>
                <h5>${nameItem}</h5>
                </div>
                `;
            });
                movie.innerHTML = inner;
            addEventMedia();
                
        })
        .catch(function(reason){
            movie.innerHTML = 'Упс,щось пішло не так!'
        
        });
    

});