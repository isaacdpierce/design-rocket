'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function handleSubmit(event) {
  event.preventDefault();
  hideParticlesBackground();
  showLoader();
  scrollToTop();
}

function hideParticlesBackground() {
  $('#particles-js').addClass('hidden');
}

function showParticlesBackground() {
  $('#particles-js').removeClass('hidden');
}

function showLoader() {
  $('#results__list').html(
    `<li class='results__loader'>
      <div id="js-loader" class="loader"></div>
    </li>`
  );
}

function scrollToTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

function renderError(errorMessage) {
  $('#results__list').html(
    `<li class='results__error'>
      <p id="js-error-message" class="error-message">${errorMessage}</p>
    </li>`
  );
}

function getFirst100ArrayItems(array) {
  return array.slice(0, 99);
}

function resetForms() {
  document.getElementById('js_behance_form').reset();
  document.getElementById('js_unsplash_form').reset();
  document.getElementById('js_fonts_form').reset();
}

function handleQuoteForm() {
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
      const errorMessage = `Something went wrong: ${err.message}`;
      renderError(errorMessage);
    });
}

function displayResultsQuotes(responseJson) {
  makeQuoteHtml(responseJson);
  showParticlesBackground();
}

function makeQuoteHtml(responseJson) {
  const { content, title, link } = responseJson[0];
  $('#results__list').html(
    `<li class='results__quote'>
      <blockquote id='qod-quote'>
        ${content} <a href='${link}'>&mdash; ${title}</a>
      </blockquote>
    </li>`
  );
}

function handleUnsplashForm() {
  const query = getUserUnsplashSearchTerm();
  const limit = getUserUnsplashMaxResults();

  getUnsplashImages(query, limit);
}

function getUnsplashImages(query, limit = 10) {
  const params = {
    per_page: limit,
    query,
    client_id: configUnsplash.apiKey,
  };

  const url = makeFullUnsplashUrl(params);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })

    .then(responseJson => {
      const errorMessage = `There were no images for your search`;
      if (responseJson.results.length > 0) {
        displayResultsUnsplash(responseJson);
      } else {
        renderError(errorMessage);
      }
    })
    .catch(err => {
      const errorMessage = `Something went wrong: ${err.message}`;
      renderError(errorMessage);
    });
}

function displayResultsUnsplash(responseJson) {
  const images = responseJson.results;

  const unsplashResults = images.map(image => {
    const imageDetails = {
      imageUrl: image.urls.regular,
      artist: image.user.name,
      portfolio: image.user.links.html,
      alt_description: image.alt_description,
    };
    return makeUnsplashImageHtml(imageDetails);
  });
  addUnsplashResultsToDOM(unsplashResults);
}

function addUnsplashResultsToDOM(unsplashResults) {
  $('#results__list').html(unsplashResults);
  resetForms();
}

function getUserUnsplashSearchTerm() {
  return $('#js-unsplash-search-term').val();
}

function getUserUnsplashMaxResults() {
  return $('#js-unsplash-max-results').val();
}

function makeFullUnsplashUrl(params) {
  const queryString = formatQueryParams(params);
  const url = `${configUnsplash.searchURL}?${queryString}`;
  return url;
}

function makeUnsplashImageHtml(imageDetails) {
  const { imageUrl, portfolio, artist, alt_description } = imageDetails;

  return `<li class="results__item">        
            <a href="${imageUrl}" target="_blank">
              <img class="results__image" src=${imageUrl} alt="${alt_description}">
            </a>
            <a class="results__overlay" href=${portfolio} target="_blank">
              ${artist}
            </a>
          </li>`;
}

function handleBehanceForm() {
  const query = getUserBehanceSearchTerm();
  const time = getUserBehanceTimeSelection();

  getBehanceProjects(query, time);
}

function getBehanceProjects(query, time) {
  const params = {
    q: query,
    time,
    api_key: configBehance.apiKey,
  };

  const url = makeFullBehanceUrl(params);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      const errorMessage = `There were no projects for your search`;
      if (responseJson.projects.length > 0) {
        displayResultsBehance(responseJson);
      } else {
        renderError(errorMessage);
      }
    })

    .catch(err => {
      const errorMessage = `Something went wrong: ${err.message}`;
      renderError(errorMessage);
    });
}

function displayResultsBehance(responseJson) {
  console.log(responseJson);
  const images = responseJson.projects;

  const behanceResultsList = images.map(image => {
    const imageDetails = {
      imageUrl: image.covers[404],
      artist: image.name,
      project: image.url,
      alt_description: image.name,
    };
    return makeBehanceImageHtml(imageDetails);
  });
  addBehanceResultsToDOM(behanceResultsList);
}

function addBehanceResultsToDOM(behanceResultsList) {
  $('#results__list').html(behanceResultsList);
  resetForms();
}

function getUserBehanceSearchTerm() {
  return $('#js-behance-search-term').val();
}

function getUserBehanceTimeSelection() {
  return $('#js-behance-time').val();
}

function makeFullBehanceUrl(params) {
  const queryString = formatQueryParams(params);
  const url = `${configBehance.searchURL}?${queryString}`;
  const proxyurl = 'https://fathomless-river-91209.herokuapp.com/';
  const fullUrl = proxyurl + url;

  return fullUrl;
}

function makeBehanceImageHtml(imageDetails) {
  const { imageUrl, artist, project, alt_description } = imageDetails;
  return `<li class="results__item">
            <a href="${imageUrl}" target="_blank">
              <img class="results__image" src=${imageUrl} alt="${alt_description}">
            </a>
            <a class="results__overlay" href=${project} target="_blank">
              ${artist}
            </a>
          </li>`;
}

function handleFontsForm() {
  const sortBy = getUserFontSortSelection();
  getGoogleFonts(sortBy);
}

function getUserFontSortSelection() {
  return $('#js-fonts-sort').val();
}

function getUserFontText() {
  return $('#js-fonts-search-term').val();
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
      const errorMessage = `Something went wrong: ${err.message}`;
      renderError(errorMessage);
    });
}

function displayResultsGoogleFonts(responseJson) {
  const fonts = responseJson.items;

  const top100Fonts = getFirst100ArrayItems(fonts);

  const fontResultsList = makeFontTextResultsList(top100Fonts);

  addGoogleFontResultsToDOM(fontResultsList);
}

function makeFontTextResultsList(top100Fonts) {
  const fontResultsList = top100Fonts.map(font => {
    const { family, category } = font;
    const fontDetails = {
      family,
      category,
      cssSnippet: `<span class="results__overlay">
          ${makeCssFontSnippet(family, category)}
        </span>`,
    };
    const encodedFontFamily = encodeFontFamily(family);

    makeHtmlFontLink(encodedFontFamily);
    return makeFontHtml(fontDetails);
  });
  return fontResultsList;
}

function makeFontHtml(fontDetails) {
  const { family, cssSnippet } = fontDetails;
  const userFontText = getUserFontText();

  return `<li class="results__item">
            <p class="results__font" style="font-family:${family};">
              ${userFontText}
            </p>
            ${cssSnippet}
          </li>`;
}

function addGoogleFontResultsToDOM(fontResultsList) {
  $('#results__list').html(fontResultsList);
  resetForms();
}

function makeCssFontSnippet(family, category) {
  return `font-family: '${family}', ${category};`;
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
    `<link href="https://fonts.googleapis.com/css?family=${encodedFontFamily}" rel="stylesheet" type="text/css"/>`
  );
}

function handleForm(eventTarget) {
  const formHandlers = {
    js_quote_form: handleQuoteForm,
    js_fonts_form: handleFontsForm,
    js_unsplash_form: handleUnsplashForm,
    js_behance_form: handleBehanceForm,
  };
  formHandlers[eventTarget]();
}

function watchForms() {
  $(document).on('submit', event => {
    const eventTarget = event.target.id;
    handleSubmit(event);
    handleForm(eventTarget);
  });
}

$(watchForms);
