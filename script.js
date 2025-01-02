const searchAnimeContainer = document.querySelector("#search-container");
const airingAnimeContainer = document.querySelector("#airing-container");
const featuredAnimeContainer = document.querySelector("#featured-container");
const upcomingAnimeContainer = document.querySelector(
  "#upcoming-anime-container",
);

const viewAllAiring = document.querySelector("#view-all");
const viewAllFeatured = document.querySelector("#view-all-featured");
const viewAllUpcoming = document.querySelector("#view-all-upcoming");

const searchHeader = document.querySelector("#search-header");
const searchForm = document.querySelector("#form");
const search = document.querySelector("#search");

let query = search.value;

let toggle = false;
let featuredToggle = false;
let upcomingToggle = false;

let debounceTimeout;
let visibleCount = 5;
let lastScroll = 0;

let searchedAnimeList = [];
let airingAnimeList = [];
let featuredAnimeList = [];
let upcomingAnimeList = [];
let topAnimeList = [];

const seachHeaderText = document.createElement("h2");
seachHeaderText.textContent = "Search Result";

// Update Visible Count
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

// Fetch AnimeList Url
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
      break;
    case "upcoming":
      apiUrl = `https://api.jikan.moe/v4/seasons/upcoming`;
      break;
  }

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => data.data || [])
    .catch((error) => {
      console.error("Error fetching anime data:", error);
      return [];
    });
}

// Populate Anime List With data from fetch promise
function populateAnimeList(type, query = "") {
  fetchAnimeList(type, query).then((animeList) => {
    switch (type) {
      case "search":
        searchedAnimeList = animeList;
        break;

      case "airing":
        airingAnimeList = animeList;
        break;

      case "featured":
        featuredAnimeList = animeList;
        break;

      case "upcoming":
        upcomingAnimeList = animeList;
        break;

      case "top100":
        topAnimeList = animeList;
        break;
    }
    renderAnime(getAnimeListByType(type), getContainerByType(type));
  });
}

// Get Array by Type
function getAnimeListByType(type) {
  switch (type) {
    case "search":
      return searchedAnimeList;
    case "airing":
      return airingAnimeList;
    case "featured":
      return featuredAnimeList;
    case "upcoming":
      return upcomingAnimeList;
    case "top100":
      return topAnimeList;
  }
}

// Get Container by Type
function getContainerByType(type) {
  switch (type) {
    case "search":
      return searchAnimeContainer;
    case "airing":
      return airingAnimeContainer;
    case "featured":
      return featuredAnimeContainer;
    case "upcoming":
      return upcomingAnimeContainer;
    case "top100":
      return topAnimeContainer;
  }
}

// Render Anime
function renderAnime(animeList, container, isTop100 = false) {
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

    if (isTop100) {
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
    } else {
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
    }

    animeCard.append(animeImage, animeTitle);
    container.append(animeCard);
  });
}

// Event Handlers

searchForm.addEventListener("input", (e) => {
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
      searchAnimeContainer.innerHTML = "";
      searchHeader.innerHTML = "";
      return;
    }
    searchAnimeContainer.innerHTML = "";
    populateAnimeList("search", query);
    renderAnime(searchedAnimeList, searchAnimeContainer);
  }, 300);
});

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

viewAllUpcoming.addEventListener("click", () => {
  upcomingToggle = !upcomingToggle;

  if (upcomingToggle) {
    visibleCount = upcomingAnimeList.length;
    viewAllUpcoming.textContent = "View less";
  } else {
    visibleCount = 5;
    viewAllUpcoming.textContent = "view All";
  }

  renderAnime(upcomingAnimeList, upcomingAnimeContainer);
});

window.addEventListener("scroll", () => {
  const now = Date.now();
  if (now - lastScroll > 300) {
    lastScroll = now;
  }
});

// Function Calls
populateAnimeList("airing");
populateAnimeList("featured");
populateAnimeList("upcoming");
