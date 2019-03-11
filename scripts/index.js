'use strict';

// https://api.unsplash.com/search/photos/?page=1&per_page=10&query=${query}&client_id=${cred.APP_ID}

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function displayResultsUnsplash(responseJson) {
  let images = responseJson.results;
  console.log(images);

  $('#results-list').empty();

  for (let image of images) {
    let imageUrl = image.urls.regular;
    let artist = image.user.name;
    let portfolio = image.user.links.html;

    console.log(imageUrl);
    console.log(artist);
    console.log(portfolio);

    $('#results-list').append(
      `<li>        
       <a class="unsplash-image" href="${imageUrl}" target="_blank"><img src=${imageUrl} alt="No result"></a>
       <a class="unsplash-image__details" href=${portfolio} target="_blank"><span>${artist}</span></a>
      </li>`
    );
  }

  $('#results').removeClass('hidden');
  $('#particles-js').addClass('hidden');
}

function getUnsplashImages(query, limit = 10) {
  const params = {
    per_page: limit,
    query,
    client_id: configUnsplash.apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = `${configUnsplash.searchURL}?${queryString}`;
  // TODO remove log
  console.log(queryString);
  console.log(url);

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

// function getIcons(stateCode, limit = 10) {
//   const params = {
//     stateCode,
//     limit,
//     apiKey: config.apiKey,
//   };
//   const queryString = formatQueryParams(params);
//   const url = `${config.searchURL}?${queryString}`;

//   fetch(url)
//     .then(response => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then(responseJson => displayResults(responseJson))
//     .catch(err => {
//       $('#js-error-message').text(`Something went wrong: ${err.message}`);
//     });
// }

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const query = $('#js-search-term').val();
    const limit = $('#js-max-results').val();
    getUnsplashImages(query, limit);
    $('html').scrollTop(0);
  });
}

$(watchForm);
