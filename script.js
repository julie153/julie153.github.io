document.addEventListener("DOMContentLoaded", () => {
    const heroSection = document.getElementById("hero-section");
    const appContainer = document.getElementById("app-container");
    const enterBtn = document.getElementById("enter-btn");
    const tabs = document.querySelectorAll(".tab");
    const postsContainer = document.getElementById("posts-container");
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modal-body");
    const closeModal = document.querySelector(".close-modal");

    let posts = [];
    let currentCategory = "home";

    // Load posts from JSON
    async function loadPosts() {
        try {
            const response = await fetch("posts.json");
            posts = await response.json();
            displayPosts("home");
        } catch (error) {
            console.error("Error loading posts:", error);
            postsContainer.innerHTML = "<p>Error loading posts. Please refresh the page.</p>";
        }
    }

    // Enter button - show app
    enterBtn.addEventListener("click", () => {
        heroSection.classList.add("hidden");
        appContainer.style.display = "flex";
    });

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentCategory = tab.dataset.category;
            displayPosts(currentCategory);
        });
    });

    // Shuffle array
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Display posts based on category
    function displayPosts(category) {
        postsContainer.innerHTML = "";
        let filteredPosts = category === "home" ? shuffleArray(posts) : posts.filter(p => p.type === category);

        if (filteredPosts.length === 0) {
            postsContainer.innerHTML = "<p>No posts yet in this category.</p>";
            return;
        }

        if (category === "home") {
            displayHomeGrid(filteredPosts);
        } else if (category === "journal") {
            displayJournal(filteredPosts);
        } else if (category === "pictures") {
            displayPictures(filteredPosts);
        } else if (category === "songs") {
            displaySongs(filteredPosts);
        } else if (category === "quotes") {
            displayQuotes(filteredPosts);
        } else if (category === "tweet") {
            displayTweets(filteredPosts);
        }
    }

    // Home - Pinboard grid
    function displayHomeGrid(postsArray) {
        postsContainer.className = "pinboard";
        postsArray.forEach(post => {
            const div = createPinCard(post);
            postsContainer.appendChild(div);
        });
    }

    // Create pin card
    function createPinCard(post) {
        const div = document.createElement("div");
        div.className = "post";
        let preview = "";
        let title = "";

        if (post.type === "journal") {
            title = post.title;
            preview = post.text.substring(0, 100) + "...";
        } else if (post.type === "picture") {
            title = post.title || "Picture";
            preview = post.images?.[0]?.memory_text || "Picture";
        } else if (post.type === "song") {
            title = post.title;
            preview = `by ${post.artist}`;
        } else if (post.type === "quote") {
            title = "Quote";
            preview = post.text.substring(0, 100) + "...";
        } else if (post.type === "tweet") {
            title = "Tweet";
            preview = post.text.substring(0, 100) + "...";
        }

        div.innerHTML = `<h2>${title}</h2><p>${preview}</p>`;
        div.addEventListener("click", () => openModal(post));
        return div;
    }

    // Journal - Blog posts
    function displayJournal(postsArray) {
        postsContainer.className = "journal-view";
        postsArray.forEach(post => {
            const div = document.createElement("div");
            div.style.cssText = "background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #1b4332; cursor: pointer;";
            div.innerHTML = `
                <h2 style="color: #1b4332; margin-bottom: 10px;">${post.title}</h2>
                <div style="color: #999; font-size: 0.9rem; margin-bottom: 15px;">${post.date}</div>
                <p style="color: #666;">${post.text}</p>
            `;
            div.addEventListener("click", () => openModal(post));
            postsContainer.appendChild(div);
        });
    }

    // Pictures - Grid with memory text
    function displayPictures(postsArray) {
        postsContainer.className = "pictures-view";
        postsContainer.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;";
        postsArray.forEach(post => {
            const div = document.createElement("div");
            div.style.cssText = "background: white; border-radius: 8px; overflow: hidden; cursor: pointer;";
            const image = post.images?.[0];
            div.innerHTML = `
                <img src="${image?.url || 'https://via.placeholder.com/200'}" alt="picture" style="width: 100%; height: 200px; object-fit: cover;">
                <div style="padding: 15px; min-height: 60px; font-size: 0.9rem;">${image?.memory_text || ""`*

