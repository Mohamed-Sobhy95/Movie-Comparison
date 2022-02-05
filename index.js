const movieTemplate = movieDatails=>{

    console.log(movieDatails);
    const dollars = parseInt(movieDatails.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
    const metascore = parseInt(movieDatails.Metascore);
    const rating = parseFloat(movieDatails.imdbRating);
    const votes = parseInt(movieDatails.imdbVotes.replace(/,/g,''));
    const awards = movieDatails.Awards.split(' ').reduce((prev,word)=>{

        const val = parseInt(word) ;
        if(isNaN(val)){
            return prev ;
        }else{
            return prev + val ;
        }

    },0);
    console.log(dollars,metascore,rating,votes,awards);
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDatails.Poster==='N/A'?'':movieDatails.Poster}" />
            </p>
        </figure>
        <div class = "media-content">
            <div class = "content">
                <h1>${movieDatails.Title}</h1>
                <h4>${movieDatails.Genre}</h4>
                <p>${movieDatails.Plot}</p>
            </content>
        </div>
    </article>
    <article class="notification" data-value="${awards}">
        <p class = "title">${movieDatails.Awards}</p>
        <p class = "subtitle">Awards</p>
    </article>
    <article class="notification" data-value="${dollars}">
        <p class = "title">${movieDatails.BoxOffice}</p>
        <p class = "subtitle">BoxOffice</p>
    </article>
    <article class="notification" data-value="${metascore}">
        <p class = "title">${movieDatails.Metascore}</p>
        <p class = "subtitle">Metascore</p>
    </article>
    <article class="notification" data-value="${rating}">
        <p class = "title">${movieDatails.imdbRating}</p>
        <p class = "subtitle">IMDB Rating</p>
    </article>
    <article class="notification" data-value="${votes}">
        <p class = "title">${movieDatails.imdbVotes}</p>
        <p class = "subtitle">IMDB Votes</p>
    </article>
    `;
}
const config = {
    renderOption(movie){
        return `
            <img src=${movie.Poster==='N/A'?'':movie.Poster}/>
            ${movie.Title}(${movie.Year})
            `;
    },
    inputValue(movie){
        return movie.Title ; 
    },
    async fetchData(searchText){

        const results = await axios.get('http://www.omdbapi.com/',{
            params:{
                apikey:'b6184deb',
                s:searchText
                // i:'tt4154796'
            }
        });

        if(results.data.Error){
            return [] ;
        }
        return results.data.Search ;

    }
};
// const dropdown = document.createElement('div',{class:'dropdown'});
    
createAutocomplete({
    ...config,
    root:document.querySelector('#left_autocomplete')
    ,
    onOptionSelect(movie){
        const tutorial = document.querySelector('.tutorial');
        tutorial.classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector('#left_summary'),'left'); 
    }
});
createAutocomplete({...config,
    root:document.querySelector('#right_autocomplete'),
    onOptionSelect(movie){
        const tutorial = document.querySelector('.tutorial');
        tutorial.classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector('#right_summary'),'right'); 
    }
});

let leftMovie , rightMovie ;

const onMovieSelect =async (movie,summaryContainer,context)=>{
    const movieDetails = await axios.get('http://www.omdbapi.com/',{
        params:{
            apikey:'b6184deb',
            i:movie.imdbID
        }
    });
    summaryContainer.innerHTML = movieTemplate(movieDetails.data);

    if(context === 'left'){
        leftMovie = movieDetails.data ;
    }else{
        rightMovie = movieDetails.data ;
    }

    if(leftMovie && rightMovie){
        compare();
    }
    
}

const compare = ()=>{
    const leftStats = document.querySelectorAll('#left_summary .notification');
    const rightStats = document.querySelectorAll('#right_summary .notification');

    leftStats.forEach((leftstatitem , index)=>{
        const rightStatItem = rightStats[index] ;

        const leftValue = isNaN(parseInt(leftstatitem.dataset.value))?0:parseInt(leftstatitem.dataset.value);
        const rightvalue = isNaN(parseInt(rightStatItem.dataset.value))?0:parseInt(rightStatItem.dataset.value);
        if(leftValue > rightvalue){
            rightStatItem.classList.add('is-warning');
            leftstatitem.classList.add('is-primary');
        }else{
            rightStatItem.classList.add('is-primary');
            leftstatitem.classList.add('is-warning');
        }
    });
};
