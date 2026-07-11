const shelfGrid = document.getElementById("shelfGrid");
const showDetails = document.getElementById("showDetails");
const addShowForm = document.getElementById("addShowForm");
const posterFile = document.getElementById("posterFile");
const posterValue = document.getElementById("poster");
const posterPreview = document.getElementById("posterPreview");

if (posterFile && posterValue && posterPreview) {
    function displayPoster(imageSource) {
        if (!imageSource) {
            posterPreview.removeAttribute("src");
            posterPreview.style.display = "none";
            return;
        }

        posterPreview.src = imageSource;
        posterPreview.style.display = "block";
    }

    // Shows the existing poster when opening the Edit page.
    displayPoster(posterValue.value);

    posterFile.addEventListener("change", event => {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please choose a valid image file.");
            posterFile.value = "";
            return;
        }

        const reader = new FileReader();

        reader.addEventListener("load", () => {
            posterValue.value = reader.result;
            displayPoster(reader.result);
        });

        reader.addEventListener("error", () => {
            alert("The poster image could not be loaded.");
        });

        reader.readAsDataURL(file);
    });
}
let savedShows = JSON.parse(localStorage.getItem("savedShows"));

if (!savedShows) {
    savedShows = shows;
    localStorage.setItem("savedShows", JSON.stringify(savedShows));
}

const allShows = savedShows;
const wrappedSlides = document.querySelectorAll(".wrapped-slide");
const wrappedDots = document.querySelectorAll(".wrapped-dot");
const completedShows = allShows.filter(show =>
    show.status &&
    show.status.trim().toLowerCase() === "completed"
);

const wrappedShows = document.getElementById("wrappedShows");
const wrappedCountry = document.getElementById("wrappedCountry");
const wrappedMood =document.getElementById("wrappedMood");
const wrappedTrope = document.getElementById("wrappedTrope");
const wrappedAverage = document.getElementById("wrappedAverage");
const wrappedPersonality = document.getElementById("wrappedPersonality");
const wrappedPersonalityText = document.getElementById("wrappedPersonalityText");
const wrappedBest = document.getElementById("wrappedBest");
const wrappedHours = document.getElementById("wrappedHours");

function mostCommonValue(list, key) {
    const counts = {};

    list.forEach(item => {
        const value = item[key];

        if (!value) return;

        const cleanValue = value.trim();

        counts[cleanValue] = (counts[cleanValue] || 0) + 1;
    });

    return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || "—";
}

function mostCommonTrope(list) {
    const counts = {};

    list.forEach(show => {
        if (!show.tropes) return;

        show.tropes.forEach(trope => {
            const cleanTrope = trope.trim();

            if (!cleanTrope) return;

            counts[cleanTrope] = (counts[cleanTrope] || 0) + 1;
        });
    });

    return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || "—";
}

const showOfTheYear = [...completedShows].sort(
    (a, b) => b.rating - a.rating
)[0];
const averageRating =
    completedShows.length > 0
        ? (
            completedShows.reduce((sum, show) => sum + Number(show.rating || 0), 0) /
            completedShows.length
        ).toFixed(1)
        : "—";

const favoriteMood = mostCommonValue(completedShows, "mood");
const favoriteTrope = mostCommonTrope(completedShows);


function getViewerProfile() {
    const mood = favoriteMood.toLowerCase();
    const trope = favoriteTrope.toLowerCase();

    const avgChemistry =
        completedShows.reduce((sum, show) => sum + Number(show.chemistry || 0), 0) /
        (completedShows.length || 1);

    const avgRewatch =
        completedShows.reduce((sum, show) => sum + Number(show.rewatchability || 0), 0) /
        (completedShows.length || 1);

    if (mood.includes("comfort") || mood.includes("healing") || avgRewatch >= 4.5) {
        return {
            title: "☁️ Comfort Seeker",
            text: "You naturally gravitate toward stories that leave you feeling lighter than when you started. The series that stay with you are the ones that feel like coming home."
        };
    }

    if (trope.includes("slow burn")) {
        return {
            title: "🐢 Slow Burn Enthusiast",
            text: "You enjoy watching relationships grow one step at a time. Every glance, conversation, and shared moment makes the payoff feel earned."
        };
    }

    if (mood.includes("emotional") || mood.includes("angst")) {
        return {
            title: "😭 Emotional Explorer",
            text: "You are drawn to stories that leave an emotional mark. The series you remember most are the ones that make you truly feel something."
        };
    }

    if (avgChemistry >= 4.5) {
        return {
            title: "🔥 Chemistry Connoisseur",
            text: "You notice the little things that make two characters believable together. Great chemistry can turn even quiet scenes into unforgettable ones."
        };
    }

    if (trope.includes("enemies") || trope.includes("rivals")) {
        return {
            title: "⚔️ Rivals-to-Lovers Expert",
            text: "You love watching tension slowly turn into trust. There is something satisfying about seeing two people challenge each other before realizing they care."
        };
    }

    return {
        title: "🌈 Variety Watcher",
        text: "Your bookshelf is built on curiosity. You enjoy exploring different moods, countries, and story styles, making every watch feel like a new experience."
    };
}

const viewerProfile = getViewerProfile();

const personality = viewerProfile.title;
const personalityText = viewerProfile.text;

if (wrappedCountry) {
    wrappedCountry.textContent =
        mostCommonValue(completedShows, "country");
}

if (wrappedMood) {
    wrappedMood.textContent =
        mostCommonValue(completedShows, "mood");
}

if (wrappedTrope) {
    wrappedTrope.textContent =
        mostCommonTrope(completedShows);
}
if (wrappedAverage) {
    wrappedAverage.textContent = averageRating;
}

if (wrappedPersonality) {
    wrappedPersonality.textContent = personality;
}

if (wrappedPersonalityText) {
    wrappedPersonalityText.textContent = personalityText;
}

if (wrappedBest) {
    wrappedBest.innerHTML = showOfTheYear
        ? `${showOfTheYear.title}<br><span>${showOfTheYear.rating}/10</span>`
        : "—";
}

const summaryProfile = document.getElementById("summaryProfile");




if (wrappedSlides.length > 0) {
    let currentSlide = 0;

    function showWrappedSlide(index) {
        wrappedSlides.forEach((slide, i) => {
            slide.classList.toggle("active-slide", i === index);
        });

        wrappedDots.forEach((dot, i) => {
            dot.classList.toggle("active-dot", i === index);
        });
    }

    document.addEventListener("click", event => {
    
        const clickedWrappedButton =
            event.target.closest("#nextSlide, .nextWrapped");

        if (!clickedWrappedButton) return;

        if (currentSlide < wrappedSlides.length - 1) {
            currentSlide++;
            showWrappedSlide(currentSlide);
        }
    });

    showWrappedSlide(currentSlide);
    }



function hearts(score, symbol) {
    return symbol.repeat(score) + "♡".repeat(5 - score);
}

function renderShelf(showList) {
    shelfGrid.innerHTML = "";

    showList.forEach(show => {
        const card = document.createElement("a");

        card.className = "poster-card";
        card.href = `show.html?id=${show.id}`;

        if (show.mood === "Comfort") card.classList.add("comfort");
        if (show.mood === "Emotional") card.classList.add("emotional");

        card.innerHTML = `
    <div class="shelf-poster-wrap">
        <img src="${show.poster}" alt="${show.title} poster">

        <span class="shelf-rating-badge">
            ⭐ ${show.rating || "—"}
        </span>
    </div>

    <div class="shelf-card-body">
        <h3>${show.title}</h3>

        <div class="shelf-card-tags">
            ${show.country ? `<span>🌍 ${show.country}</span>` : ""}
            ${show.mood ? `<span>😊 ${show.mood}</span>` : ""}
        </div>
    </div>
`;

        shelfGrid.appendChild(card);
    });
}

if (shelfGrid) {
    const shelfShows = allShows.filter(show =>
        !show.status ||
        show.status.trim().toLowerCase() !== "watchlist"
    );

    renderShelf(shelfShows);
    const shelfTotalShows =
    document.getElementById("shelfTotalShows");

const shelfAverageRating =
    document.getElementById("shelfAverageRating");

const shelfCountries =
    document.getElementById("shelfCountries");

if (shelfTotalShows) {

    shelfTotalShows.textContent = shelfShows.length;

    shelfAverageRating.textContent =
        (
            shelfShows.reduce(
                (sum, show) =>
                    sum + Number(show.rating || 0),
                0
            ) / shelfShows.length
        ).toFixed(1);

    shelfCountries.textContent =
        new Set(
            shelfShows.map(show => show.country)
        ).size;
}
    renderShelf(shelfShows);

    const shelfSearch = document.getElementById("shelfSearch");
    const countryFilter = document.getElementById("countryFilter");
    const moodFilter = document.getElementById("moodFilter");
    const ratingFilter = document.getElementById("ratingFilter");
    const sortFilter = document.getElementById("sortFilter");

    function updateShelf() {
        const searchText = shelfSearch.value.toLowerCase();
        const selectedCountry = countryFilter.value;
        const selectedMood = moodFilter.value;
        const selectedRating = ratingFilter.value;
        const selectedSort = sortFilter.value;

        let filteredShows = shelfShows.filter(show => {
            const matchesSearch =
                show.title.toLowerCase().includes(searchText) ||
                show.country.toLowerCase().includes(searchText) ||
                show.mood.toLowerCase().includes(searchText) ||
                show.tropes.join(" ").toLowerCase().includes(searchText);

            const matchesCountry = selectedCountry === "All" || show.country === selectedCountry;
            const matchesMood = selectedMood === "All" || show.mood === selectedMood;
           const rating = Number(show.rating || 0);
            const matchesRating =
                selectedRating === "All" ||
                (selectedRating === "12" && rating === 12) ||
                (selectedRating === "11" && rating >= 11) ||
                (selectedRating === "10" && rating >= 10) ||
                (selectedRating === "9" && rating >= 9) ||
                (selectedRating === "8" && rating >= 8) ||
                (selectedRating === "below8" && rating < 8);

            return matchesSearch && matchesCountry && matchesMood && matchesRating;
        });

        if (selectedSort === "rating") filteredShows.sort((a, b) => b.rating - a.rating);
        if (selectedSort === "lowest") {filteredShows.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0)
    );
}
        if (selectedSort === "az") filteredShows.sort((a, b) => a.title.localeCompare(b.title));
        if (selectedSort === "za") filteredShows.sort((a, b) => b.title.localeCompare(a.title));
        if (selectedSort === "newest") filteredShows.sort((a, b) => b.year - a.year);
        if (selectedSort === "oldest") filteredShows.sort((a, b) => a.year - b.year);

        renderShelf(filteredShows);
    }

    shelfSearch.addEventListener("input", updateShelf);
    countryFilter.addEventListener("change", updateShelf);
    moodFilter.addEventListener("change", updateShelf);
    ratingFilter.addEventListener("change", updateShelf);
    sortFilter.addEventListener("change", updateShelf);
}

if (showDetails) {
    const params = new URLSearchParams(window.location.search);
    const showId = params.get("id");

    const show = allShows.find(item => item.id === showId);

    if (show) {
        showDetails.innerHTML = `
            <div class="detail-layout">
                <img class="detail-poster" src="${show.poster}" alt="${show.title} poster">

                <div class="detail-info">
                    <p class="back-link"><a href="shelf.html">← Back to My Shelf</a></p>
                    <a class="edit-btn" href="edit.html?id=${show.id}">Edit Show</a>
                    <button class="delete-btn" id="deleteShowBtn">Delete Show</button>

                    <h2>${show.title}</h2>

                    <p class="star-rating">⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐</p>
                    <p class="big-rating">${show.rating}/10</p>

                 <div class="detail-tags">
    <span>🌍 ${show.country}</span>
    <span>📅 ${show.year}</span>
    <span>📺 ${show.episodes} Episodes</span>
    <span>😊 ${show.mood}</span>
    <span id="statusBadge">
        ${show.status === "Completed" ? "✅ Completed" : "▶ Watching"}
    </span>
</div>

<section class="detail-section">
    <h3>📺 Watch Progress</h3>

    <p>
    <strong id="episodeProgressText">
        Episode ${show.currentEpisode || 0} of ${show.episodes}
    </strong>
</p>

   <p class="progress-percent">
    ${Math.round(((show.currentEpisode || 0) / show.episodes) * 100)}% Complete
</p>

    <div class="progress-bar">
        <div
            class="progress-fill"
            style="width:${Math.min(
                ((show.currentEpisode || 0) / show.episodes) * 100,
                100
            )}%">
        </div>
    </div>

   <div class="episode-controls">

    <button id="minusEpisode">◀</button>

    <span class="episode-number">
        Episode ${show.currentEpisode || 0}
    </span>

    <button id="plusEpisode">▶</button>

</div>

</section>

                    <section class="detail-section">
                        <h3>Ratings</h3>

                        <div class="rating-row">
                            <span>❤️ Chemistry</span>
                            <strong>${hearts(show.chemistry, "❤️")}</strong>
                        </div>

                        <div class="rating-row">
                            <span>📈 Relationship Progression</span>
                            <strong>${hearts(show.progression, "💜")}</strong>
                        </div>

                        <div class="rating-row">
                            <span>😭 Emotional Impact</span>
                            <strong>${hearts(show.emotionalImpact, "💙")}</strong>
                        </div>

                        <div class="rating-row">
                            <span>🎭 Acting</span>
                            <strong>${hearts(show.acting, "⭐")}</strong>
                        </div>

                        <div class="rating-row">
                            <span>🔁 Rewatchability</span>
                            <strong>${hearts(show.rewatchability, "🔁")}</strong>
                        </div>
                    </section>

                    <section class="detail-section">
                        <h3>Mood & Tropes</h3>
                        <div class="detail-tags">
                            <span>${show.mood}</span>
                            ${show.tropes.map(trope => `<span>${trope}</span>`).join("")}
                        </div>
                    </section>

                    <section class="detail-section">
                        <h3>Mini Review</h3>
                        <p>${show.miniReview}</p>
                    </section>

                    <section class="detail-section">
                        <h3>Favorite Scene</h3>
                        <p>${show.favoriteScene}</p>
                    </section>
                    <section class="detail-section">
   <section class="detail-section">
    <h3>📅 Watch History</h3>

    <p>
        <strong>Started Watching:</strong>
        <span id="startedDateText">${show.dateStarted || "Not recorded"}</span>
    </p>

    <p>
        <strong>Finished Watching:</strong>
        <span id="finishedDateText">${show.dateFinished || "Not recorded"}</span>
    </p>
</section>
                </div>
            </div>
        `;
const minusEpisode = document.getElementById("minusEpisode");
const plusEpisode = document.getElementById("plusEpisode");

function saveEpisodeChange(newEpisode) {
    const today = new Date().toISOString().split("T")[0];

    const updatedShow = {
        ...show,
        currentEpisode: newEpisode,

        dateStarted:
            show.dateStarted ||
            (newEpisode > 0 ? today : null),

        status:
            newEpisode >= show.episodes
                ? "Completed"
                : newEpisode > 0
                    ? "Watching"
                    : show.status,

        dateFinished:
            newEpisode >= show.episodes
                ? show.dateFinished || today
                : show.dateFinished
    };

    const index = savedShows.findIndex(item => item.id === show.id);

    if (index !== -1) {
        savedShows[index] = updatedShow;
        localStorage.setItem("savedShows", JSON.stringify(savedShows));
    }

    show.currentEpisode = updatedShow.currentEpisode;
    show.status = updatedShow.status;
    show.dateStarted = updatedShow.dateStarted;
    show.dateFinished = updatedShow.dateFinished;
    const statusBadge = document.getElementById("statusBadge");

if (statusBadge) {

    if (show.status === "Completed") {

        statusBadge.textContent = "✅ Completed";

    } else {

        statusBadge.textContent = "▶ Watching";

    }

}
    
    const startedDateText = document.getElementById("startedDateText");
const finishedDateText = document.getElementById("finishedDateText");

if (startedDateText) {
    startedDateText.textContent = show.dateStarted || "Not recorded";
}

if (finishedDateText) {
    finishedDateText.textContent = show.dateFinished || "Not recorded";
}

    document.querySelector(".episode-number").textContent =
    `Episode ${show.currentEpisode || 0}`;

const episodeProgressText =
    document.getElementById("episodeProgressText");

if (episodeProgressText) {
    episodeProgressText.textContent =
        `Episode ${show.currentEpisode || 0} of ${show.episodes}`;
}

    const percent = Math.round(((show.currentEpisode || 0) / show.episodes) * 100);

    document.querySelector(".progress-fill").style.width =
        `${Math.min(percent, 100)}%`;

    const progressText = document.querySelector(".progress-percent");
    if (progressText) {
        progressText.textContent = `${percent}% Complete`;
    }
}

minusEpisode.addEventListener("click", () => {
    const current = show.currentEpisode || 0;
    const newEpisode = Math.max(current - 1, 0);

    saveEpisodeChange(newEpisode);
});

plusEpisode.addEventListener("click", () => {
    const current = show.currentEpisode || 0;
    const newEpisode = Math.min(current + 1, show.episodes);

    saveEpisodeChange(newEpisode);
});

        const deleteBtn = document.getElementById("deleteShowBtn");

        deleteBtn.addEventListener("click", () => {
            const confirmDelete = confirm(`Delete ${show.title} from your bookshelf?`);

            if (confirmDelete) {
                const updatedSavedShows = savedShows.filter(item => item.id !== show.id);
                localStorage.setItem("savedShows", JSON.stringify(updatedSavedShows));

                window.location.href = "shelf.html";
            }
        });
    } else {
        showDetails.innerHTML = `<h2>Show not found.</h2>`;
    }
}

if (addShowForm) {
    addShowForm.addEventListener("submit", event => {
        event.preventDefault();

        const newShow = {
            id: document.getElementById("title").value.toLowerCase().replaceAll(" ", "-"),
            title: document.getElementById("title").value,
            poster: document.getElementById("poster").value || "https://via.placeholder.com/300x450?text=Poster",
            country: document.getElementById("country").value,
            year: Number(document.getElementById("year").value),
            episodes: Number(document.getElementById("episodes").value),
            currentEpisode: Number(document.getElementById("currentEpisode").value) || 0,
            rating: Number(document.getElementById("rating").value),
            chemistry: Number(document.getElementById("chemistry").value) || 5,
            progression: Number(document.getElementById("progression").value) || 5,
            emotionalImpact: Number(document.getElementById("emotionalImpact").value) || 5,
            acting: Number(document.getElementById("acting").value) || 5,
            rewatchability: Number(document.getElementById("rewatchability").value) || 5,
            mood: document.getElementById("mood").value,
            tropes: document.getElementById("tropes").value.split(",").map(trope => trope.trim()),
            miniReview: document.getElementById("miniReview").value,
            favoriteScene: document.getElementById("favoriteScene").value,
            status: document.getElementById("status").value,
            priority: document.getElementById("priority").value,

            dateStarted: document.getElementById("dateStarted").value || null,

            dateFinished:
            document.getElementById("dateFinished").value
        ? document.getElementById("dateFinished").value
        : document.getElementById("status").value === "Completed"
            ? new Date().toISOString().split("T")[0]
            : null,
        };

        savedShows.push(newShow);
        localStorage.setItem("savedShows", JSON.stringify(savedShows));

        window.location.href = "shelf.html";
    });
}const editShowForm = document.getElementById("editShowForm");

if (editShowForm) {

    const params = new URLSearchParams(window.location.search);
    const showId = params.get("id");

    const show = allShows.find(item => item.id === showId);

    if (show) {
        document.getElementById("title").value = show.title;
        document.getElementById("poster").value = show.poster;
        if (posterPreview && show.poster) {
    posterPreview.src = show.poster;
    posterPreview.style.display = "block";
}
        document.getElementById("country").value = show.country;
        document.getElementById("year").value = show.year;
        document.getElementById("episodes").value = show.episodes;
        document.getElementById("currentEpisode").value = show.currentEpisode || 0;
        document.getElementById("dateStarted").value = show.dateStarted || "";
        document.getElementById("dateFinished").value = show.dateFinished || "";
        document.getElementById("rating").value = show.rating;

        document.getElementById("chemistry").value = show.chemistry;
        document.getElementById("progression").value = show.progression;
        document.getElementById("emotionalImpact").value = show.emotionalImpact;
        document.getElementById("acting").value = show.acting;
        document.getElementById("rewatchability").value = show.rewatchability;

        document.getElementById("mood").value = show.mood;
        document.getElementById("status").value = show.status;
        document.getElementById("tropes").value = show.tropes.join(", ");
        document.getElementById("miniReview").value = show.miniReview;
        document.getElementById("favoriteScene").value = show.favoriteScene;
        document.getElementById("status").value = show.status;
        document.getElementById("priority").value = show.priority || "Medium";
       editShowForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedStatus = document.getElementById("status").value;
    const typedStartDate = document.getElementById("dateStarted").value;
    const typedFinishDate = document.getElementById("dateFinished").value;
    const today = new Date().toISOString().split("T")[0];

    const updatedShow = {
        ...show,
        title: document.getElementById("title").value,
        poster: document.getElementById("poster").value,
        country: document.getElementById("country").value,
        year: Number(document.getElementById("year").value),
        episodes: Number(document.getElementById("episodes").value),
        currentEpisode: Number(document.getElementById("currentEpisode").value) || 0,
        rating: Number(document.getElementById("rating").value),
        chemistry: Number(document.getElementById("chemistry").value),
        progression: Number(document.getElementById("progression").value),
        emotionalImpact: Number(document.getElementById("emotionalImpact").value),
        acting: Number(document.getElementById("acting").value),
        rewatchability: Number(document.getElementById("rewatchability").value),
        mood: document.getElementById("mood").value,
        status: selectedStatus,
        priority: document.getElementById("priority").value,

        dateStarted:
            typedStartDate ||
            show.dateStarted ||
            (selectedStatus === "Watching" || selectedStatus === "Completed" ? today : null),

        dateFinished:
            typedFinishDate ||
            (selectedStatus === "Completed" ? today : null),

        tropes: document.getElementById("tropes").value
            .split(",")
            .map(trope => trope.trim()),

        miniReview: document.getElementById("miniReview").value,
        favoriteScene: document.getElementById("favoriteScene").value
    };

    const index = savedShows.findIndex(item => item.id === show.id);

    if (index !== -1) {
        savedShows[index] = updatedShow;
        localStorage.setItem("savedShows", JSON.stringify(savedShows));
    }

    window.location.href = `show.html?id=${updatedShow.id}`;
});
    }

}
const exportBtn = document.getElementById("exportBtn");

if (exportBtn) {

    exportBtn.addEventListener("click", () => {

        const data = JSON.stringify(savedShows, null, 2);

        const blob = new Blob([data], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "my-bl-bookshelf-backup.json";

        link.click();

        URL.revokeObjectURL(url);

    });

}
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

if (importBtn && importFile) {

    importBtn.addEventListener("click", () => {
        importFile.click();
    });

    importFile.addEventListener("change", (event) => {

        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {

            try {

                const importedShows = JSON.parse(e.target.result);

                localStorage.setItem(
                    "savedShows",
                    JSON.stringify(importedShows)
                );

                alert("Bookshelf imported successfully!");

                window.location.href = "shelf.html";

            } catch {

                alert("That isn't a valid My BL Bookshelf backup.");

            }

        };

        reader.readAsText(file);

    });

}
const statsGrid = document.getElementById("statsGrid");

if (statsGrid) {

    const totalShows = allShows.length;
const ratedShows = allShows.filter(
    show => Number(show.rating) > 0
);

const averageRating =
    ratedShows.length > 0
        ? (
            ratedShows.reduce(
                (sum, show) => sum + Number(show.rating),
                0
            ) / ratedShows.length
        ).toFixed(1)
        : "—";

    const totalEpisodes =
        allShows.reduce((sum, show) => sum + show.episodes, 0);

    const countries =
        new Set(allShows.map(show => show.country)).size;

    const averageYear =
        Math.round(
            allShows.reduce((sum, show) => sum + show.year, 0) /
            totalShows
        );

    const stats = [
        {
            title: "📚 Total Shows",
            value: totalShows
        },
        {
            title: "⭐ Average Rating",
            value: averageRating
        },
        {
            title: "🌍 Countries",
            value: countries
        },
        {
            title: "📺 Episodes",
            value: totalEpisodes
        },
        {
            title: "📅 Average Year",
            value: averageYear
        }
    ];

    stats.forEach(stat => {

        statsGrid.innerHTML += `
            <div class="stat-card">
                <h3>${stat.title}</h3>
                <p>${stat.value}</p>
            </div>
        `;

    });

}
const insightsGrid = document.getElementById("insightsGrid");

if (insightsGrid) {

    const highestRated =
        [...allShows].sort((a,b)=>b.rating-a.rating)[0];

    const longestShow =
        [...allShows].sort((a,b)=>b.episodes-a.episodes)[0];

    function mostCommon(property){

        const count={};

        allShows.forEach(show=>{

            count[show[property]]=(count[show[property]]||0)+1;

        });

        return Object.keys(count).reduce((a,b)=>
            count[a]>count[b]?a:b
        );

    }

    const insights=[

        {
            title:"🏆 Highest Rated",
            value:highestRated.title
        },

        {
            title:"🌍 Favorite Country",
            value:mostCommon("country")
        },

        {
            title:"😊 Favorite Mood",
            value:mostCommon("mood")
        },

        {
            title:"📺 Longest Show",
            value:longestShow.title
        }

    ];

    insights.forEach(insight=>{

        insightsGrid.innerHTML+=`

        <div class="stat-card">

            <h3>${insight.title}</h3>

            <p style="font-size:1.4rem;">
                ${insight.value}
            </p>

        </div>

        `;

    });

}
// ======================
// DASHBOARD STATS
// ======================

const dashTotalShows = document.getElementById("dashTotalShows");
const dashCompletedShows = document.getElementById("dashCompletedShows");
const dashAverageRating = document.getElementById("dashAverageRating");
const dashWatchlistCount = document.getElementById("dashWatchlistCount");

if (dashTotalShows) {
    const completed = allShows.filter(show =>
        show.status && show.status.trim().toLowerCase() === "completed"
    );

    const watchlist = allShows.filter(show =>
        show.status && show.status.trim().toLowerCase() === "watchlist"
    );

    const avgRating =
        completed.length > 0
            ? (
                completed.reduce((sum, show) => sum + Number(show.rating || 0), 0) /
                completed.length
            ).toFixed(1)
            : "0";

    dashTotalShows.textContent = allShows.length;
    dashCompletedShows.textContent = completed.length;
    dashAverageRating.textContent = avgRating;
    dashWatchlistCount.textContent = watchlist.length;
}
const continueWatching = document.getElementById("continueWatching");

if (continueWatching) {
    const watchingShows = allShows.filter(show => show.status === "Watching");

    if (watchingShows.length === 0) {
        continueWatching.innerHTML = `
            <p class="empty-message">Nothing currently watching.</p>
        `;
    } else {
        const featuredShow = watchingShows.sort(
    (a, b) => (b.currentEpisode || 0) - (a.currentEpisode || 0)
)[0];
    

if (featuredShow) {

    const show = featuredShow;
     continueWatching.innerHTML = `

        <div class="continue-card">

            <img src="${show.poster}" alt="${show.title}">

            <div class="continue-content">

                <h3>${show.title}</h3>

                <div class="continue-meta">
                    Episode ${show.currentEpisode || 1}
                    of
                    ${show.episodes}
                </div>

                <div class="progress-track">

                    <div
                        class="progress-fill"
                        style="width:${
                            ((show.currentEpisode || 1) /
                            show.episodes) * 100
                        }%">
                    </div>

                </div>

                <button class="continue-button" data-id="${show.id}">
                 ▶ Next Episode
                </button>

            </div>

        </div>
    `;
    const continueButton =
    continueWatching.querySelector(".continue-button");

    continueButton.addEventListener("click", event => {
        event.preventDefault();

    const showId = continueButton.dataset.id;


    const show = savedShows.find(
        item => item.id === showId
    );

    if (!show) return;

    const today =
        new Date().toISOString().split("T")[0];

    show.currentEpisode = Math.min(
        (show.currentEpisode || 0) + 1,
        show.episodes
    );

    if (!show.dateStarted &&
        show.currentEpisode > 0) {

        show.dateStarted = today;
    }

    if (show.currentEpisode >= show.episodes) {

        show.status = "Completed";

        show.dateFinished =
            show.dateFinished || today;
    }

    localStorage.setItem(
        "savedShows",
        JSON.stringify(savedShows)
    );

    location.reload();
});
}  
}
}

const recentlyFinished = document.getElementById("recentlyFinished");

    document.getElementById("recentlyFinished")
;
if (recentlyFinished) {
    
    const finishedShows = allShows
        .filter(show => show.status && show.status.trim().toLowerCase() === "completed")
        .sort((a, b) => {
    const dateA = a.dateFinished ? new Date(a.dateFinished).getTime() : 0;
    const dateB = b.dateFinished ? new Date(b.dateFinished).getTime() : 0;

    return dateB - dateA;
})
        .slice(0, 4);

    if (finishedShows.length === 0) {
        recentlyFinished.innerHTML = `
            <p class="empty-message">No finished shows yet.</p>
        `;
    } else {
        finishedShows.forEach(show => {
            const card = document.createElement("a");

            card.className = "poster-card";
            card.href = `show.html?id=${show.id}`;

            if (show.mood === "Comfort") card.classList.add("comfort");
            if (show.mood === "Emotional") card.classList.add("emotional");

            card.innerHTML = `
                <img src="${show.poster}" alt="${show.title} poster">

                <div class="finished-card-body">
                    <h3>${show.title}</h3>

                    <p class="finished-date">
                       ${show.dateFinished ? "Finished " + new Date(show.dateFinished).toLocaleDateString() : "Finished"}
                    </p>

                    <p class="finished-rating">
                        ⭐ ${show.rating}/10
                    </p>
                </div>
            `;

            recentlyFinished.appendChild(card);
        });
    }
}
const topShelf = document.getElementById("topShelf");

if (topShelf) {
    const topShows = [...allShows]
        .filter(show => show.rating)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

    topShows.forEach(show => {
        const card = document.createElement("a");

       card.className = "poster-card top-shelf-card";
        card.href = `show.html?id=${show.id}`;

        if (show.mood === "Comfort") card.classList.add("comfort");
        if (show.mood === "Emotional") card.classList.add("emotional");

        card.innerHTML = `
            <img src="${show.poster}" alt="${show.title} poster">

            <div class="finished-card-body">
                <h3>${show.title}</h3>

                <div class="top-rating">
                ⭐ ${show.rating}/10
                </div>
                </p>
            </div>
        `;

        topShelf.appendChild(card);
    });
}
const watchlistTable = document.getElementById("watchlistTable");

if (watchlistTable) {
    const watchlistSearch = document.getElementById("watchlistSearch");
    const watchlistCountry = document.getElementById("watchlistCountry");
    const watchlistMood = document.getElementById("watchlistMood");
    const watchlistEpisodes = document.getElementById("watchlistEpisodes");
    const watchlistSort = document.getElementById("watchlistSort");
    const pickRandomBtn = document.getElementById("pickRandomBtn");
    const randomRecommendation = document.getElementById("randomRecommendation");
    const recommendationModal = document.getElementById("recommendationModal");
    const closeRecommendation = document.getElementById("closeRecommendation");

    let filteredWatchlist = [];

    function renderWatchlist() {
        let watchlistShows = allShows.filter(show =>
            show.status &&
            show.status.trim().toLowerCase() === "watchlist"
        );

        const searchText = watchlistSearch.value.toLowerCase();

        watchlistShows = watchlistShows.filter(show => {
            const matchesSearch =
                show.title.toLowerCase().includes(searchText);

            const matchesCountry =
                watchlistCountry.value === "All" ||
                (show.country || "").trim().toLowerCase() === watchlistCountry.value.toLowerCase();

            const matchesMood =
                watchlistMood.value === "All" ||
                (show.mood || "").trim().toLowerCase() === watchlistMood.value.toLowerCase();

            const episodeCount = Number(show.episodes);

            const matchesEpisodes =
                watchlistEpisodes.value === "All" ||
                (watchlistEpisodes.value === "short" && episodeCount >= 1 && episodeCount <= 8) ||
                (watchlistEpisodes.value === "medium" && episodeCount >= 9 && episodeCount <= 12) ||
                (watchlistEpisodes.value === "long" && episodeCount >= 13 && episodeCount <= 16) ||
                (watchlistEpisodes.value === "extra" && episodeCount >= 17);

            return matchesSearch && matchesCountry && matchesMood && matchesEpisodes;
        });

        filteredWatchlist = [...watchlistShows];

        if (watchlistSort.value === "az") {
            watchlistShows.sort((a, b) => a.title.localeCompare(b.title));
        }

        if (watchlistSort.value === "shortest") {
            watchlistShows.sort((a, b) => a.episodes - b.episodes);
        }

        if (watchlistSort.value === "longest") {
            watchlistShows.sort((a, b) => b.episodes - a.episodes);
        }

        if (watchlistShows.length === 0) {
            watchlistTable.innerHTML = `
                <p class="empty-message">No watchlist shows match your filters.</p>
            `;
            return;
        }

        watchlistTable.innerHTML = `
            <div class="watchlist-header">
                <span>Title</span>
                <span>Country</span>
                <span>Mood</span>
                <span>Episodes</span>
                <span>Action</span>
            </div>
        `;

        watchlistShows.forEach(show => {
            watchlistTable.innerHTML += `
                <div class="watchlist-row">
                    <span class="watchlist-title">${show.title}</span>
                    <span>${show.country || "Unknown"}</span>
                    <span>${show.mood || "—"}</span>
                    <span>${show.episodes || "?"}</span>
                    <<div class="random-actions">
    <button class="start-watching-btn" data-id="${show.id}">
        ▶ Start Watching
    </button>

    <button class="pick-again-btn" id="pickAgainBtn">
        🎲 Pick Again
    </button>
</div>
                </div>
            `;
        });
    }

    function startWatching(showId) {
        const show = savedShows.find(item => item.id === showId);

        if (!show) return;

        const today = new Date().toISOString().split("T")[0];

        show.status = "Watching";
        show.dateStarted = show.dateStarted || today;
        show.currentEpisode = show.currentEpisode || 0;

        localStorage.setItem("savedShows", JSON.stringify(savedShows));

        if (recommendationModal) {
            recommendationModal.classList.remove("show");
        }

        renderWatchlist();
    }

    renderWatchlist();

    watchlistSearch.addEventListener("input", renderWatchlist);
    watchlistCountry.addEventListener("change", renderWatchlist);
    watchlistMood.addEventListener("change", renderWatchlist);
    watchlistEpisodes.addEventListener("change", renderWatchlist);
    watchlistSort.addEventListener("change", renderWatchlist);

    watchlistTable.addEventListener("click", event => {
        if (!event.target.classList.contains("start-watching-btn")) return;

        startWatching(event.target.dataset.id);
    });

    if (pickRandomBtn) {
        pickRandomBtn.addEventListener("click", () => {
            if (filteredWatchlist.length === 0) {
                randomRecommendation.innerHTML = `
                    <p class="empty-message">
                        No shows match your current filters.
                    </p>
                `;

                recommendationModal.classList.add("show");
                return;
            }

            const show = filteredWatchlist[
                Math.floor(Math.random() * filteredWatchlist.length)
            ];

            randomRecommendation.innerHTML = `
                <div class="random-card">
                    <img src="${show.poster}" alt="${show.title}">

                    <div class="random-info">
                        <h2>✨ Tonight's Recommendation</h2>

                        <h3>${show.title}</h3>

                        <div class="random-tags">
                            <span>🌍 ${show.country || "Unknown"}</span>
                            <span>😊 ${show.mood || "—"}</span>
                            <span>📺 ${show.episodes || "?"} Episodes</span>
                            <span>⭐ ${show.priority || "Medium"}</span>
                        </div>

                       <div class="random-actions">
                        <button class="start-watching-btn" data-id="${show.id}">
                        ▶ Start Watching
                        </button>

    <button class="pick-again-btn">
        🎲 Pick Again
    </button>
</div>
                    </div>
                </div>
            `;

            recommendationModal.classList.add("show");
        });
    }

 if (randomRecommendation) {

    randomRecommendation.addEventListener("click", event => {

        if (event.target.classList.contains("start-watching-btn")) {
            startWatching(event.target.dataset.id);
        }

        if (event.target.classList.contains("pick-again-btn")) {

            recommendationModal.classList.remove("show");

            setTimeout(() => {
                pickRandomBtn.click();
            }, 150);

        }

    });

}
    

   if (closeRecommendation) {
    closeRecommendation.addEventListener("click", () => {
        recommendationModal.classList.remove("show");
    });
   }

    if (recommendationModal) {
        recommendationModal.addEventListener("click", event => {
            if (event.target === recommendationModal) {
                recommendationModal.classList.remove("show");
            }
        });
    }
}
