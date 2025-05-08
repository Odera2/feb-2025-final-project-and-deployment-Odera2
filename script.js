document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') document.body.classList.add('dark-mode');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', mode);
        });
    }

    // Nav active link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (window.location.href.includes(link.getAttribute('href'))) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });

    // Blog search filter
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const filter = searchInput.value.toLowerCase();
            document.querySelectorAll('.post-card').forEach(card => {
                const title = card.textContent.toLowerCase();
                card.style.display = title.includes(filter) ? 'flex' : 'none';
            });
        });
    }

    // Comments (for post.html)
    const commentBtn = document.getElementById('submit-comment');
    if (commentBtn) {
        commentBtn.addEventListener('click', () => {
            const text = document.getElementById('comment-text').value.trim();
            if (text) {
                const commentsList = document.getElementById('comment-list');
                const newComment = document.createElement('li');
                newComment.textContent = text;
                commentsList.appendChild(newComment);
                document.getElementById('comment-text').value = '';

                let savedComments = JSON.parse(localStorage.getItem('comments') || '[]');
                savedComments.push(text);
                localStorage.setItem('comments', JSON.stringify(savedComments));
            }
        });

        // Load comments
        const savedComments = JSON.parse(localStorage.getItem('comments') || '[]');
        const commentsList = document.getElementById('comment-list');
        savedComments.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            commentsList.appendChild(li);
        });
    }
});

// Blog Posts Data (ID, Title, Link, Image)
const blogPosts = [
    { title: "Why JavaScript Will Always Matter", desc: "A dive into the relevance of JavaScript in today's tech world.", img: "assets/js.jpg", category: "tech", link: "post1.html" },
    { title: "Designing with Purpose", desc: "How purposeful design improves user experience.", img: "assets/design.jpg", category: "design", link: "post4.html" },
    { title: "My Journey into Web Dev", desc: "From curiosity to passion, my web development story.", img: "assets/life.jpg", category: "life", link: "post3.html" },
    { title: "React vs Vanilla JavaScript", desc: "When to go framework-free and when to go React-heavy.", img: "assets/react.jpg", category: "tech", link: "post5.html" },
    { title: "Color Psychology in UI Design", desc: "Color usage principles for beautiful and effective interfaces.", img: "assets/colors.jpg", category: "design", link: "post2.html" }
];

// Pagination & Blog Posts Rendering
const postsPerPage = 3;
let currentPage = 1;
let currentFilter = "all";

function renderBlogs(filter = "all", page = 1) {
    const container = document.getElementById("blog-container");
    const pagination = document.getElementById("pagination");
    container.innerHTML = "";
    pagination.innerHTML = "";

    const filtered = blogPosts.filter(post => filter === "all" || post.category === filter);
    const totalPages = Math.ceil(filtered.length / postsPerPage);
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;

    filtered.slice(start, end).forEach(post => {
        container.innerHTML += `
            <div class="post-card" data-category="${post.category}" data-aos="fade-up">
                <img src="${post.img}" alt="${post.title}" />
                <div>
                    <h3><a href="${post.link}">${post.title}</a></h3>
                    <p>${post.desc}</p>
                </div>
            </div>
        `;
    });

    // Pagination buttons
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <button class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>
        `;
    }

    // Re-initialize AOS for new content
    AOS.init({ duration: 1000, once: true });
}

// Filter by category
document.addEventListener("DOMContentLoaded", () => {
    renderBlogs();

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.category;
            currentPage = 1;
            renderBlogs(currentFilter, currentPage);
        });
    });

    // Pagination button click
    document.addEventListener("click", e => {
        if (e.target.classList.contains("page-btn")) {
            currentPage = parseInt(e.target.dataset.page);
            renderBlogs(currentFilter, currentPage);
        }
    });
});

// Related Posts (excluding current one)
function loadRelatedPosts() {
    const relatedContainer = document.getElementById("related-container");
    if (!relatedContainer) return;

    const currentPost = window.location.pathname.split('/').pop(); // Get current post
    const related = blogPosts
        .filter(post => post.link !== currentPost) // Exclude current post
        .sort(() => 0.5 - Math.random()) // Randomly shuffle
        .slice(0, 3); // Pick top 3

    related.forEach(post => {
        relatedContainer.innerHTML += `
            <div class="post-card">
                <img src="${post.img}" alt="${post.title}" />
                <div>
                    <h3><a href="${post.link}">${post.title}</a></h3>
                    <p>${post.desc}</p>
                </div>
            </div>
        `;
    });
}

// Initialize related posts on load
document.addEventListener("DOMContentLoaded", () => {
    loadRelatedPosts();
});

// Next/Previous post navigation
const prevPostLink = document.getElementById('prev-post');
const nextPostLink = document.getElementById('next-post');
const currentIndex = blogPosts.findIndex(post => post.link === window.location.pathname.split('/').pop());

if (currentIndex > 0) {
    const prevPost = blogPosts[currentIndex - 1];
    prevPostLink.href = prevPost.link;
    prevPostLink.innerHTML = `Previous: ${prevPost.title}`;
} else {
    prevPostLink.style.display = "none";
}

if (currentIndex < blogPosts.length - 1) {
    const nextPost = blogPosts[currentIndex + 1];
    nextPostLink.href = nextPost.link;
    nextPostLink.innerHTML = `Next: ${nextPost.title}`;
} else {
    nextPostLink.style.display = "none";
}


    