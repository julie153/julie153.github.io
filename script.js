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

    async function loadPosts() {
        try {
            const response = await fetch("posts.json");
            posts = await response.json();
            displayPosts("home");
        } catch (error) {
            console.error("Error loading posts:", error);
            postsContainer.innerHTML = "<p>Error loading posts. Please refresh.</p>";
        }
    }

    enterBtn.addEventListener("click", () => {
        heroSection.classList.add("hidden");
        appContainer.classList.add("app-flex");
    });

    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            displayPosts(tab.dataset.category);
        });
    });

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function displayPosts(category) {
        postsContainer.innerHTML = "";
        let filtered = category === "home" ? shuffleArray(posts) : posts.filter(p => p.type === category);

        if (filtered.length === 0) {
            postsContainer.innerHTML = "<p>No posts in this category yet.</p>";
            return;
        }

        if (category === "home") displayHome(filtered);
        else if (category === "journal") displayJournal(filtered);
        else if (category === "pictures") displayPictures(filtered);
        else if (category === "songs") displaySongs(filtered);
        else if (category === "quotes") displayQuotes(filtered);
        else if (category === "tweet") displayTweets(filtered);
    }

    function displayHome(arr) {
        postsContainer.className = "pinboard";
        arr.forEach(post => {
            const card = document.createElement("div");
            card.className = "post";
            let title = post.title || (post.type === "tweet" ? "Yap" : "Quote");
            let preview = post.text || post.title || "Click to view";
            card.innerHTML = `<h2>${title}</h2><p>${preview.substring(0, 80)}...</p>`;
            card.addEventListener("click", () => openModal(post));
            postsContainer.appendChild(card);
        });
    }

    function displayJournal(arr) {
        postsContainer.className = "";
        arr.forEach(post => {
            const card = document.createElement("div");
            card.style.cssText = "background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #1b4332; cursor: pointer;";
            card.innerHTML = `<h2 style="color: #1b4332; margin-bottom: 10px;">${post.title}</h2><p style="color: #999; font-size: 0.9rem; margin-bottom: 10px;">${post.date}</p><p style="color: #666;">${post.text}</p>`;
            card.addEventListener("click", () => openModal(post));
            postsContainer.appendChild(card);
        });
    }

    function displayPictures(arr) {
        postsContainer.className = "";
        postsContainer.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;";
        arr.forEach(post => {
            const card = document.createElement("div");
            card.style.cssText = "background: white; border-radius: 8px; overflow: hidden; cursor: pointer;";
            const img = post.images?.[0];
            card.innerHTML = `
                <img src="${img?.url}" alt="picture" style="width: 100%; height: 200px; object-fit: cover;">
                <div style="padding: 15px; font-size: 0.9rem; min-height: 50px;">${img?.memory_text || ""}</div>
            `;
            card.addEventListener("click", () => openModal(post));
            postsContainer.appendChild(card);
        });
    }

    function displaySongs(arr) {
        postsContainer.className = "";
        postsContainer.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px;";
        arr.forEach(post => {
            const card = document.createElement("div");
            card.style.cssText = "background: white; padding: 20px; border-radius: 8px; text-align: center; cursor: pointer;";
            card.innerHTML = `<h3 style="color: #1b4332; margin-bottom: 10px;">${post.title}</h3><p style="color: #666; font-size: 0.9rem;">${post.artist}</p>`;
            card.addEventListener("click", () => openModal(post));
            postsContainer.appendChild(card);
        });
    }

    function displayQuotes(arr) {
        postsContainer.className = "";
        arr.forEach(post => {
            const card = document.createElement("div");
            card.style.cssText = "background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #1b4332; cursor: pointer;";
            card.innerHTML = `<p style="font-size: 1.1rem; font-style: italic; color: #1b4332; margin-bottom: 15px;">"${post.text}"</p><p style="font-weight: bold;">— ${post.author}</p><p style="color: #999; font-size: 0.9rem; margin-top: 10px;">From: ${post.source}</p>`;
            card.addEventListener("click", () => openModal(post));
            postsContainer.appendChild(card);
        });
    }

    function displayTweets(arr) {
        postsContainer.className = "";
        postsContainer.style.maxWidth = "600px";
        arr.forEach(post => {
            const card = document.createElement("div");
            card.style.cssText = "background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #ddd; cursor: pointer;";
            card.innerHTML = `<p>${post.text}</p><p style="color: #999; font-size: 0.85rem; margin-top: 10px;">${post.date}</p>`;
            card.addEventListener("click", () => openModal(post));
            postsContainer.appendChild(card);
        });
    }

    function openModal(post) {
        let html = "";
        if (post.type === "journal") {
            html = `<h2 style="color: #1b4332; margin-bottom: 10px;">${post.title}</h2><p style="color: #999; margin-bottom: 20px;">${post.date}</p><p>${post.text}</p>`;
        } else if (post.type === "picture") {
            const img = post.images?.[0];
            html = `<h2>${post.title}</h2><img src="${img?.url}" style="width: 100%; margin: 20px 0; border-radius: 8px;"><p>${img?.memory_text}</p>`;
        } else if (post.type === "song") {
            html = `<h2>${post.title}</h2><p><strong>Artist:</strong> ${post.artist}</p><p style="margin-top: 20px; white-space: pre-wrap;"><strong>Lyrics:</strong><br>${post.lyrics}</p><p style="margin-top: 20px;"><strong>Analysis:</strong><br>${post.analysis}</p>`;
        } else if (post.type === "quote") {
            html = `<p style="font-size: 1.2rem; font-style: italic; color: #1b4332; margin-bottom: 20px;">"${post.text}"</p><p><strong>${post.author}</strong></p><p style="color: #999; margin-bottom: 20px;">From: ${post.source}</p><p><strong>My thoughts:</strong><br>${post.analysis}</p>`;
        } else if (post.type === "tweet") {
            html = `<p>${post.text}</p><p style="color: #999; margin-top: 20px;">${post.date}</p>`;
        }
        modalBody.innerHTML = html;
        modal.style.display = "block";
    }

    closeModal.addEventListener("click", () => modal.style.display = "none");
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    loadPosts();
});
