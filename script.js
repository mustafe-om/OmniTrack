const searchAnimeContainer = document.querySelector("#search-container");
const airingAnimeContainer = document.querySelector("#airing-container");
const featuredAnimeContainer = document.querySelector("#featured-container");

const viewAllAiring = document.querySelector("#view-all");
const viewAllFeatured = document.querySelector("#view-all-featured");
const searchHeader = document.querySelector("#search-header");
const form = document.querySelector("#form");
const search = document.querySelector("#search");

let query = search.value;
let toggle = false;
let featuredToggle = false;
let debounceTimeout;

let airingAnimeList = [];
let searchedAnimeList = [];
let topAnimeList = [];
let featuredAnimeList = [];

let visibleCount = 5;
const seachHeaderText = document.createElement("h2");
seachHeaderText.textContent = "Search Result";

form.addEventListener("input", (e) => {
  e.preventDefault();
  query = search.value.trim();

  seachHeaderText.classList.add(
    "mb-4",
    "text-sm",
    "font-semibold",
    "uppercase",
    "tracking-widest",
    "text-slate-600",
  );

  searchHeader.append(seachHeaderText);

  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    if (query === "") {
      searchAnimeContainer.innerHTML = ""; // Clear search results container
      searchHeader.innerHTML = ""; // Clear the search header
      return; // Exit early to avoid triggering search logic
    }
    searchAnimeContainer.innerHTML = "";
    populateAnimeList("search", query);
    renderAnime(searchedAnimeList, searchAnimeContainer);
  }, 300);
});

function updateVisibleCount() {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 600) {
    return 6;
  } else if (screenWidth <= 900) {
    return 5;
  } else {
    return 7;
  }
}

function fetchAnimeList(type = "airing", query = "") {
  let apiUrl;

  switch (type) {
    case "search":
      apiUrl = `https://api.jikan.moe/v4/anime?q=${query}`;
      break;
    case "top100":
      apiUrl = `https://api.jikan.moe/v4/top/anime`;
      break;
    case "airing":
      apiUrl = `https://api.jikan.moe/v4/seasons/now`;
      break;
    case "featured":
      apiUrl = `https://api.jikan.moe/v4/anime?q=${query}`;
  }

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => data.data || [])
    .catch((error) => {
      console.error("Error fetching anime data:", error);
      return [];
    });
}

function populateAnimeList(type, query = "") {
  fetchAnimeList(type, query).then((animeList) => {
    switch (type) {
      case "search":
        searchedAnimeList = animeList.filter((anime) =>
          anime.title.toLowerCase().includes(query.toLowerCase()),
        );
        break;

      case "top100":
        topAnimeList = animeList;
        break;

      case "airing":
        airingAnimeList = animeList;
        break;

      case "featured":
        featuredAnimeList = animeList;
    }
    renderAnime(getAnimeListByType(type), getContainerByType(type));
  });
}

function getAnimeListByType(type) {
  switch (type) {
    case "search":
      return searchedAnimeList;
    case "top100":
      return topAnimeList;
    case "airing":
      return airingAnimeList;
    case "featured":
      return featuredAnimeList;
  }
}

function getContainerByType(type) {
  switch (type) {
    case "search":
      return searchAnimeContainer;
    case "top100":
      return topAnimeContainer;
    case "airing":
      return airingAnimeContainer;
    case "featured":
      return featuredAnimeContainer;
  }
}

function renderAnime(animeList, container) {
  container.innerHTML = "";
  if (!animeList || animeList.length === 0) {
    container.innerHTML = "<p>No anime found</p>";
    return;
  }

  animeList.slice(0, visibleCount).forEach((anime) => {
    const animeCard = document.createElement("div");
    const animeImage = document.createElement("img");
    const animeTitle = document.createElement("h3");

    animeImage.src = anime.images.jpg.image_url;
    animeTitle.textContent =
      anime.title.length > 40 ? `${anime.title.slice(0, 40)}...` : anime.title;

    animeCard.classList.add("flex", "w-36", "flex-col", "lg:w-44");
    animeImage.classList.add(
      "mb-2",
      "h-52",
      "object-cover",
      "object-center",
      "shadow-lg",
      "rounded",
      "lg:h-64",
    );
    animeTitle.classList.add(
      "font-medium",
      "text-slate-500",
      "text-xs",
      "w-full",
    );

    animeCard.append(animeImage, animeTitle);
    container.append(animeCard);
  });
}

function toggleHandler(toggle) {}

window.addEventListener("resize", () => {
  visibleCount = updateVisibleCount();
  renderAnime(airingAnimeList.slice(0, visibleCount), airingAnimeContainer);
  renderAnime(featuredAnimeList.slice(0, visibleCount), featuredAnimeContainer);
});

viewAllAiring.addEventListener("click", (e) => {
  toggle = !toggle;
  if (toggle) {
    visibleCount = airingAnimeList.length;
    viewAllAiring.textContent = "View less";
  } else {
    visibleCount = 5;
    viewAllAiring.textContent = "View all";
  }

  renderAnime(airingAnimeList, airingAnimeContainer);
});

viewAllFeatured.addEventListener("click", () => {
  featuredToggle = !featuredToggle;
  if (featuredToggle) {
    visibleCount = featuredAnimeList.length;
    viewAllFeatured.textContent = "View less";
  } else {
    visibleCount = 5;
    viewAllFeatured.textContent = "View all";
  }

  renderAnime(featuredAnimeList, featuredAnimeContainer);
});

populateAnimeList("airing");
populateAnimeList("featured");
