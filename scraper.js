const fetch = require('node-fetch');
const searchUrl = 'https://www.imdb.com/find?ref_=nv_sr_fn&q=';
const movieUrl = 'https://www.imdb.com/title/';
const cheerio = require('cheerio');

function searchMovies(searchTerm) {
    return fetch(`${searchUrl}${searchTerm}`)
    .then(response => response.text())
    .then(body => {
        const movies = [];
        const $ = cheerio.load(body);
        $('.findResult').each(function(i, element) {
            const $element = $(element);
            const $image = $element.find('td a img');
            const $title = $element.find('td.result_text a');
            const imdbID = $title.attr('href').match(/title\/(.*)\//);
            const movie = {
                image: $image.attr('src'),
                title: $title.text(),
                imdbID
            };
            movies.push(movie);
        });
        return movies;
    });
}

function getMovie(imdbID) {
    return fetch(`${movieUrl}${imdbID}`)
    .then(response => response.text())
    .then(body => {
        const $ = cheerio.load(body);
        const $title = $('.title_wrapper h1');
        const title = $title.first().contents().filter(function() {
            return this.type === 'text';
        }).text().trim();
        const duration = $('time[datetime]').first().contents().filter(function() {
            return this.type === 'text';
        }).text().trim();
        const yearReleased = $('#titleYear').text().trim().replace(/[\(\)']+/g,'');
        return {
            title,
            duration,
            yearReleased
        };
    });
}

module.exports = {
    searchMovies,
    getMovie
};
    
