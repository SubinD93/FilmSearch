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

    function addEventMedia() {
    const media = movie.querySelectorAll('img[data-id]');
                media.forEach(function(elem){
                    elem.style.cursor = 'pointer' ;
                    elem.addEventListener('click' , showfullInfo);
                   
                });
}

function showfullInfo() {
    console.log('type', this )
    let url = '';
    let th = this
    if(this.dataset.type === 'movie'){
        
        url = 'https://api.themoviedb.org/3/movie/' + th.dataset.id + '?api_key=196b0a7bc9a6a9b28d12b5bccde11087&language=ru' ;
    }else if (th.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + th.dataset.id + '?api_key=196b0a7bc9a6a9b28d12b5bccde11087&language=ru' ;
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
                    ${(output.homepage) ? `<p class='text-center'> <a href="${output.homepage}" target="_blank"> Официальная страница </a></p>` : ''}
                    ${(output.imdb_id) ? `<p class='text-center'> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank"> Страница на IMBD.com </a> </p>` : ''}        
                </div>
            <div class="col-8">
             <p> Рейтинг: ${output.vote_average} </p>
             <p> Статус: ${output.status} </p>
             <p> Дата релиза: ${output.first_air_date || output.release_date} </p>

             ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезонов ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}

             <p> Описание: ${output.overview} </p>
          
             <div class="youtube"></div>

            </div>
            `;

             getVideo (th.dataset.type, th.dataset.id);

        })
        .catch(function(reason){
            movie.innerHTML = 'Упс,что то пошло не так!'
                console.error(reason || reason.status)
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
function getVideo(type, id){
    let youtube = movie.querySelector('.youtube');

    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=196b0a7bc9a6a9b28d12b5bccde11087&language=ru`)
        .then((value) => {
            if (value.status !== 200){
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {
            console.log(output);
           
            let videoFrame= '<h5 class="text-info">Видео</h5>';
            if(output.results.length === 0){
                videoFrame = '<p>К сожалению видео отсутствует!</p>'
            }

            output.results.forEach(function (item) {
            videoFrame += '<iframe width="360" height="215" src="https://www.youtube.com/embed/' + item.key + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            });
            youtube.innerHTML = videoFrame;
            
        })
        .catch((reason) => {
            youtube.innerHTML = 'Видео отсутствует!'
            console.error(reason || reason.status)
        });

     
     
    
 }