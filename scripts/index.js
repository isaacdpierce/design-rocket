'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function getFontText() {
  const text = $('#js-fonts-search-term').val();
  return text;
}

function encodeFontFamily(fontFamily) {
  const encodedFontFamily = fontFamily.split(' ').join('+');
  return encodedFontFamily;
}

function scrollToTop() {
  $('html').scrollTop(0);
}

function renderHtmlFontLink(encodedFontFamily) {
  $('head').append(
    `<link href="https://fonts.googleapis.com/css?family=${encodedFontFamily}" rel="stylesheet"/>`
  );
}

function makeCssFontSnippet(fontFamily, fontCategory) {
  return `font-family: '${fontFamily}', ${fontCategory};`;
}

function getFirst100ArrayItems(array) {
  return array.slice(0, 99);
}

function removeQuote() {
  $('#qod-quote').addClass('hidden');
}

function removeResults() {
  $('#results-list').empty();
}

function addQuote(content, title, link) {
  $('#qod-quote').empty();
  $('#results').addClass('hidden');
  $('#qod-quote').append(`${content} <a href="${link}">&mdash; ${title}</a> `);
  $('#qod-quote').removeClass('hidden');
}

function getRandomQuote() {
  const queryString = `filter[orderby]=rand&filter[posts_per_page]=1`;
  const url = `${configDesignQuote.searchURL}?${queryString}`;

  fetch(url, { cache: 'no-cache' })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })

    .then(responseJson => displayResultsQuotes(responseJson))

    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResultsQuotes(responseJson) {
  const { content, title, link } = responseJson[0];
  addQuote(content, title, link);
}

function getUnsplashImages(query, limit = 10) {
  const params = {
    per_page: limit,
    query,
    client_id: configUnsplash.apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = `${configUnsplash.searchURL}?${queryString}`;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })

    .then(responseJson => displayResultsUnsplash(responseJson))

    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function clearViewer() {
  removeQuote();
  removeResults();
}

function displayResultsUnsplash(responseJson) {
  let images = responseJson.results;

  clearViewer();

  for (let image of images) {
    let imageUrl = image.urls.regular;
    let artist = image.user.name;
    let portfolio = image.user.links.html;

    $('#results-list').append(
      `<li class="results-list__item">        
       <a href="${imageUrl}" target="_blank"><img class="results-image" src=${imageUrl} alt="No result"></a>
       <a class="results-image__details" href=${portfolio} target="_blank">${artist}</a>
      </li>`
    );
  }

  $('#results').removeClass('hidden');
  $('#particles-js').addClass('hidden');
}

function getBehanceProjects(query, time) {
  const params = {
    q: query,
    time,
    api_key: configBehance.apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = `${configBehance.searchURL}?${queryString}`;
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';

  fetch(proxyurl + url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })

    .then(responseJson => displayResultsBehance(responseJson))

    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResultsBehance(responseJson) {
  let images = responseJson.projects;

  clearViewer();

  for (let image of images) {
    let imageUrl = image.covers.original;
    let artist = image.name;
    let project = image.url;

    $('#results-list').append(
      `<li class="results-list__item">
       <a href="${imageUrl}" target="_blank"><img class="results-image" src=${imageUrl} alt="No result"></a>
       <a class="results-image__details" href=${project} target="_blank">${artist}</a>
      </li>`
    );
  }

  $('#results').removeClass('hidden');
  $('#particles-js').addClass('hidden');
}

function getGoogleFonts(sortBy) {
  const params = {
    sort: sortBy,
    key: configGoogleFonts.apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = `${configGoogleFonts.searchURL}?${queryString}`;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })

    .then(responseJson => displayResultsGoogleFonts(responseJson))

    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResultsGoogleFonts(responseJson) {
  const fonts = responseJson.items;
  const top100Fonts = getFirst100ArrayItems(fonts);

  clearViewer();

  for (let font of top100Fonts) {
    const fontFamily = font.family;
    const fontCategory = font.category;
    const encodedFontFamily = encodeFontFamily(fontFamily);

    renderHtmlFontLink(encodedFontFamily);

    $('#results-list').append(
      `<li  class="font-list__item">
        <p class="font-sample" style="font-family:${fontFamily};">${getFontText()}</p>
        <p class="font-list__details results-image__details">
          ${makeCssFontSnippet(fontFamily, fontCategory)}
        </p>
      </li>`
    );
  }

  $('#results').removeClass('hidden');
  $('#particles-js').addClass('hidden');
}

function watchQuoteButton() {
  $('#js-button__quote').click(event => {
    event.preventDefault();

    getRandomQuote();
    clearViewer();
    scrollToTop();
  });
}

function getUserUnsplashSearchTerm() {
  return $('#js-unsplash-search-term').val();
}

function getUserUnsplashMaxResults() {
  return $('#js-unsplash-max-results').val();
}

function watchUnsplashForm() {
  $('#js-unsplash-form').submit(event => {
    event.preventDefault();
    const query = getUserUnsplashSearchTerm();
    const limit = getUserUnsplashMaxResults();
    getUnsplashImages(query, limit);
    scrollToTop();
  });
}

function getUserBehanceSearchTerm() {
  return $('#js-behance-search-term').val();
}

function getUserBehanceTimeSelection() {
  return $('#js-behance-time').val();
}

function watchBehanceForm() {
  $('#js-behance-form').submit(event => {
    event.preventDefault();
    const query = getUserBehanceSearchTerm();
    const time = getUserBehanceTimeSelection();

    getBehanceProjects(query, time);
    scrollToTop();
  });
}

function getUserSortSelection() {
  return $('#js-fonts-sort').val();
}

function watchFontsForm() {
  $('#js-fonts-form').submit(event => {
    event.preventDefault();
    const sortBy = getUserSortSelection();
    getGoogleFonts(sortBy);
    scrollToTop();
  });
}

function watchForms() {
  watchUnsplashForm();
  watchBehanceForm();
  watchFontsForm();
  watchQuoteButton();
}

$(watchForms);
