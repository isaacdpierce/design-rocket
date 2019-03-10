'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function displayResults(responseJson) {
  let parks = responseJson.data;

  $('#results-list').empty();

  for (let park of parks) {
    let { fullName, description, url, directionsUrl } = park;

    $('#results-list').append(
      `<li><h3>${fullName}</h3>
      <p>${description}</p>
      <a href="${url}">Website</a>
      <a href="${directionsUrl} target="_blank">Directions</a>
      </li>`
    );
  }

  $('#results').removeClass('hidden');
}

function getParks(stateCode, limit = 10) {
  const params = {
    stateCode,
    limit,
    apiKey: config.apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = `${config.searchURL}?${queryString}`;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    // Remove spaces from search for proper url building
    const stateCode = searchTerm.replace(/\s+/g, '');
    const limit = $('#js-max-results').val();
    getParks(stateCode, limit);
  });
}

$(watchForm);
