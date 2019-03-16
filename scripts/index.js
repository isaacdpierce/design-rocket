'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function getUserFontText() {
  return $('#js-fonts-search-term').val();
}

function encodeFontFamily(fontFamily) {
  const encodedFontFamily = fontFamily.split(' ').join('+');
  return encodedFontFamily;
}

function scrollToTop() {
  $('html').scrollTop(0);
}

function makeCssFontSnippet(fontFamily, fontCategory) {
  return `font-family: '${fontFamily}', ${fontCategory};`;
}

function getFirst100ArrayItems(array) {
  return array.slice(0, 99);
}

function activateParticlesBackground() {
  $('#particles-js').removeClass('hidden');
}

function removeResults() {
  $('#results__list').empty();
}

function removeQuote() {
  $('#qod-quote').addClass('hidden');
}

function addQuote(content, title, link) {
  $('#qod-quote').empty();
  $('#results').addClass('hidden');
  $('#qod-quote').append(`${content} <a href="${link}">&mdash; ${title}</a> `);
  $('#qod-quote').removeClass('hidden');
  activateParticlesBackground();
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

function clearViewer() {
  removeQuote();
  removeResults();
}

// ! QUOTES ////////////////////////////////////////
function watchQuoteButton() {
  $('#js-button__quote').click(event => {
    event.preventDefault();

    getRandomQuote();
    clearViewer();
    scrollToTop();
  });
}

// !UNSPLASH //////////////////////////////////
function getUserUnsplashSearchTerm() {
  return $('#js-unsplash-search-term').val();
}

function getUserUnsplashMaxResults() {
  return $('#js-unsplash-max-results').val();
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

function renderUnsplashResults(imageDetails) {
  const { imageUrl, portfolio, artist } = imageDetails;

  return $('#results__list').append(
    `<li class="results__item">        
      <a href="${imageUrl}" target="_blank">
        <img class="results__image" src=${imageUrl} alt="No result">
      </a>
      <a class="results__overlay" href=${portfolio} target="_blank">
        ${artist}
      </a>
    </li>`
  );
}

function displayResultsUnsplash(responseJson) {
  let images = responseJson.results;

  clearViewer();

  for (let image of images) {
    const imageDetails = {
      imageUrl: image.urls.regular,
      artist: image.user.name,
      portfolio: image.user.links.html,
    };

    renderUnsplashResults(imageDetails);
  }

  $('#results').removeClass('hidden');
  $('#particles-js').addClass('hidden');
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

// !BEHANCE /////////////////////////////////
// function getUserBehanceSearchTerm() {
//   return $('#js-behance-search-term').val();
// }

// function getUserBehanceTimeSelection() {
//   return $('#js-behance-time').val();
// }

function getBehanceProjects(query, time) {
  const params = {
    q: query,
    time,
    api_key: configBehance.apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = `${configBehance.searchURL}?${queryString}`;
  const proxyurl = 'https://fathomless-river-91209.herokuapp.com/';
  const fullUrl = proxyurl + url;
  console.log(fullUrl);

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

    $('#results__list').append(
      `<li class="results__item">
        <a href="${imageUrl}" target="_blank">
          <img class="results__image" src=${imageUrl} alt="No result">
        </a>
        <a class="results__overlay" href=${project} target="_blank">
          ${artist}
        </a>
      </li>`
    );
  }

  $('#results').removeClass('hidden');
  $('#particles-js').addClass('hidden');
}

function watchBehanceForm() {
  $('#js-behance-form').submit(event => {
    event.preventDefault();
    const query = $('#js-behance-search-term').val();
    const time = $('#js-behance-time').val();

    getBehanceProjects(query, time);
    scrollToTop();
  });
}

// !FONTS ////////////////////////////////////////
function getUserFontSortSelection() {
  return $('#js-fonts-sort').val();
}

function makeHtmlFontLink(encodedFontFamily) {
  return $('head').append(
    `<link href="https://fonts.googleapis.com/css?family=${encodedFontFamily}" rel="stylesheet"/>`
  );
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

function makeFontsResultsHtml(fontFamily, fontCategory) {
  return $('#results__list').append(
    `<li class="results__item">
        <p class="results__font" style="font-family:$   {fontFamily};">${getUserFontText()}
        </p>
        <span class="results__overlay">
          ${makeCssFontSnippet(fontFamily, fontCategory)}
        </span>
      </li>`
  );
}

function displayResultsGoogleFonts(responseJson) {
  const fonts = responseJson.items;
  const top100Fonts = getFirst100ArrayItems(fonts);

  clearViewer();

  for (let font of top100Fonts) {
    const fontFamily = font.family;
    const fontCategory = font.category;
    const encodedFontFamily = encodeFontFamily(fontFamily);

    makeHtmlFontLink(encodedFontFamily);
    makeFontsResultsHtml(fontFamily, fontCategory);
  }

  $('#results').removeClass('hidden');
  $('#particles-js').addClass('hidden');
}

function watchFontsForm() {
  $('#js-fonts-form').submit(event => {
    event.preventDefault();
    const sortBy = getUserFontSortSelection();
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
