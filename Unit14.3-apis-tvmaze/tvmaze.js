async function searchShows(query) {
  const results = [];
  const showInfo = await axios.get("http://api.tvmaze.com/search/shows", {params : {
    q: query,
  }});
  //console.log(showInfo.data);
  for (i = 0; i < showInfo.data.length; i++) {
    if (showInfo.data[i].show.image) {
      results[i] = {
        id: showInfo.data[i].show.id,
        name: showInfo.data[i].show.name,
        summary: showInfo.data[i].show.summary,
        image: showInfo.data[i].show.image.original 
      }
    } else { 
      results[i] = {
        id: showInfo.data[i].show.id,
        name: showInfo.data[i].show.name,
        summary: showInfo.data[i].show.summary,
        image: "https://tinyurl.com/tv-missing"
    }
  }
};
  return results;
}

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body" id="${show.id}"=>
             <img class="card-img-top" src=${show.image}>
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id="${show.id}"> Episodes </button>
             <div class="episodes-area" id=${show.id}></div>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}

async function getEpisodes(id) {
  const episodesInfo = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return await episodesInfo.data;
}

async function populateEpisodes(episodes) {
  const card = document.querySelector(`#episodes-area`)
  console.log(card);
  const episodeList = document.createElement("ul");
  episodeList.innerText = `Total Episodes: ${await episodes.length}`
  if ((await episodes).length < 10) {
    max = (await episodes).length - 1;
  } else {
    max = 10;
  }

  for (let i = 0; i < max; i++) {
    const newEp = document.createElement("li");
    console.log(await episodes);
    console.log(i);
    console.log((await episodes)[i]);
    newEp.innerText = (await episodes)[i].name;
    episodeList.append(newEp);
  }
  card.append(episodeList);
}

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  let episodes = await getEpisodes(this.id);

  populateEpisodes(episodes);
  populateShows(shows);

  $("button").on("click", function(e) {
    e.preventDefault();
    $("#episodes-area").toggle();
  })
});


