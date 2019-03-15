'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
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

function displayResultsUnsplash(responseJson) {
  let images = responseJson.results;
  console.log(images);

  $('#results-list').empty();

  for (let image of images) {
    let imageUrl = image.urls.regular;
    let artist = image.user.name;
    let portfolio = image.user.links.html;

    $('#results-list').append(
      `<li class="results-list__item">        
       <a href="${imageUrl}" target="_blank"><img class="viewer-image" src=${imageUrl} alt="No result"></a>
       <a class="viewer-image__details" href=${portfolio} target="_blank">${artist}</a>
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

  $('#results-list').empty();

  for (let image of images) {
    let imageUrl = image.covers.original;
    let artist = image.name;
    let project = image.url;

    $('#results-list').append(
      `<li class="results-list__item">
       <a href="${imageUrl}" target="_blank"><img class="viewer-image" src=${imageUrl} alt="No result"></a>
       <a class="viewer-image__details" href=${project} target="_blank">${artist}</a>
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

function getFontText() {
  const text = $('#js-fonts-search-term').val();
  return text;
}

function encodeFontFamily(fontFamily) {
  const encodedFontFamily = fontFamily.split(' ').join('+');
  return encodedFontFamily;
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

function displayResultsGoogleFonts(responseJson) {
  const fonts = responseJson.items;
  const top100Fonts = getFirst100ArrayItems(fonts);

  $('#results-list').empty();

  for (let font of top100Fonts) {
    const fontFamily = font.family;
    const fontCategory = font.category;
    const encodedFontFamily = encodeFontFamily(fontFamily);

    renderHtmlFontLink(encodedFontFamily);

    $('#results-list').append(
      `<li  class="font-list__item">
        <p class="font-sample" style="font-family:${fontFamily};">${getFontText()}</p>
        <p class="font-list__details viewer-image__details">
          ${makeCssFontSnippet(fontFamily, fontCategory)}
        </p>
      </li>`
    );
  }

  $('#results').removeClass('hidden');
  $('#particles-js').addClass('hidden');
}

function watchUnsplashForm() {
  $('#js-unsplash-form').submit(event => {
    event.preventDefault();
    const query = $('#js-unsplash-search-term').val();
    const limit = $('#js-unsplash-max-results').val();
    getUnsplashImages(query, limit);
    $('html').scrollTop(0);
  });
}

function watchBehanceForm() {
  $('#js-behance-form').submit(event => {
    event.preventDefault();
    const query = $('#js-behance-search-term').val();
    const time = $('#js-behance-time').val();
    getBehanceProjects(query, time);
    $('html').scrollTop(0);
  });
}
function watchFontsForm() {
  $('#js-fonts-form').submit(event => {
    event.preventDefault();
    const sortBy = $('#js-fonts-sort').val();
    getGoogleFonts(sortBy);
    $('html').scrollTop(0);
  });
}

function watchForms() {
  watchUnsplashForm();
  watchBehanceForm();
  watchFontsForm();
}

$(watchForms);
