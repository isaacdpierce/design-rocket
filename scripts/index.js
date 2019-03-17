'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function toggleLoadingAnimation() {
  $('#js-loader').toggleClass('hidden');
}

function scrollToTop() {
  $(window).scrollTop(0);
}

function getFirst100ArrayItems(array) {
  return array.slice(0, 99);
}

function showParticlesBackground() {
  $('#particles-js').removeClass('hidden');
}

function showResults() {
  $('#results').removeClass('hidden');
}

function hideParticlesBackGround() {
  $('#particles-js').addClass('hidden');
}

function removeResults() {
  $('#results').addClass('hidden');
  $('#results__list').empty();
}

function clearViewer() {
  removeResults();
  hideParticlesBackGround();
}

// ! QUOTES ////////////////////////////////////////
function watchQuoteButton() {
  $('#js-button__quote').click(event => {
    event.preventDefault();
    clearViewer();
    toggleLoadingAnimation();
    scrollToTop();
    getRandomQuote();
    showParticlesBackGround();
  });
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
  makeQuoteHtml(content, title, link);
  toggleLoadingAnimation();
  showResults();
  showParticlesBackground();
}

function makeQuoteHtml(content, title, link) {
  $('#results__list').append(
    `<li class='results__quote'>
      <blockquote id='qod-quote'>
        ${content} <a href='${link}'>&mdash; ${title}</a>
      </blockquote>
    </li>`
  );
}

// !UNSPLASH //////////////////////////////////
function watchUnsplashForm() {
  $('#js-unsplash-form').submit(event => {
    event.preventDefault();
    clearViewer();
    toggleLoadingAnimation();
    const query = getUserUnsplashSearchTerm();
    const limit = getUserUnsplashMaxResults();
    getUnsplashImages(query, limit);
    scrollToTop();
  });
}

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

function makeUnsplashHtmlResults(imageDetails) {
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
  const images = responseJson.results;

  for (let image of images) {
    const imageDetails = {
      imageUrl: image.urls.regular,
      artist: image.user.name,
      portfolio: image.user.links.html,
    };

    makeUnsplashHtmlResults(imageDetails);
  }
  toggleLoadingAnimation();
  showResults();
}

// !BEHANCE /////////////////////////////////
function watchBehanceForm() {
  $('#js-behance-form').submit(event => {
    event.preventDefault();
    const query = getUserBehanceSearchTerm();
    const time = getUserBehanceTimeSelection();

    clearViewer();
    toggleLoadingAnimation();
    getBehanceProjects(query, time);
    scrollToTop();
  });
}
function getUserBehanceSearchTerm() {
  return $('#js-behance-search-term').val();
}

function getUserBehanceTimeSelection() {
  return $('#js-behance-time').val();
}

function makeFullUrl(params) {
  const queryString = formatQueryParams(params);
  const url = `${configBehance.searchURL}?${queryString}`;
  const proxyurl = 'https://fathomless-river-91209.herokuapp.com/';
  const fullUrl = proxyurl + url;

  return fullUrl;
}

function getBehanceProjects(query, time) {
  const params = {
    q: query,
    time,
    api_key: configBehance.apiKey,
  };

  const url = makeFullUrl(params);

  fetch(url)
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

function makeBehanceHtmlResults(imageDetails) {
  const { imageUrl, artist, project } = imageDetails;

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

function displayResultsBehance(responseJson) {
  const images = responseJson.projects;
  const imageNumber = '404';

  for (let image of images) {
    const imageDetails = {
      imageUrl: image.covers[404],
      artist: image.name,
      project: image.url,
    };
    console.log(imageDetails.imageUrl);

    makeBehanceHtmlResults(imageDetails);
  }
  toggleLoadingAnimation();
  showResults();
}

//! FONTS ////////////////////////////////////////
function watchFontsForm() {
  $('#js-fonts-form').submit(event => {
    event.preventDefault();
    clearViewer();
    toggleLoadingAnimation();
    const sortBy = getUserFontSortSelection();
    getGoogleFonts(sortBy);
    scrollToTop();
  });
}

function getUserFontSortSelection() {
  return $('#js-fonts-sort').val();
}

function getUserFontText() {
  return $('#js-fonts-search-term').val();
}

function makeCssFontSnippet(fontFamily, fontCategory) {
  return `font-family: '${fontFamily}', ${fontCategory};`;
}

function encodeFontFamily(fontFamily) {
  const encodedFontFamily = fontFamily.split(' ').join('+');
  return encodedFontFamily;
}

function makeHtmlFontLink(encodedFontFamily) {
  const openSansCondensedWeight = `:300`;
  if (encodedFontFamily === 'Open+Sans+Condensed') {
    return encodedFontFamily + openSansCondensedWeight;
  }

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
        <p class="results__font" style="font-family:${fontFamily};">${getUserFontText()}
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

  for (let font of top100Fonts) {
    const fontFamily = font.family;
    const fontCategory = font.category;
    const encodedFontFamily = encodeFontFamily(fontFamily);

    makeHtmlFontLink(encodedFontFamily);
    makeFontsResultsHtml(fontFamily, fontCategory);
  }
  showResults();
  toggleLoadingAnimation();
}

function watchForms() {
  watchUnsplashForm();
  watchBehanceForm();
  watchFontsForm();
  watchQuoteButton();
}

$(watchForms);
