const GITHUB_USERNAME = 'animeshdinda12-netizen';
const REPO_NAME = 'StreamLog';
const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main`;
const API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents`;

const postsContainer = document.getElementById('postsContainer');

async function loadPosts() {
  try {
    const response = await fetch(`${API_URL}/posts.json?t=${Date.now()}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        showEmpty();
        return;
      }
      throw new Error('Failed to load posts');
    }
    
    const data = await response.json();
    const content = atob(data.content);
    const posts = JSON.parse(content);
    
    if (!posts || posts.length === 0) {
      showEmpty();
      return;
    }
    
    renderPosts(posts);
  } catch (error) {
    showError(error.message);
  }
}

function renderPosts(posts) {
  const html = posts.map(post => {
    const date = new Date(post.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const imageHtml = post.image 
      ? `<img src="${BASE_URL}/${post.image}" alt="Post image" class="post-image" loading="lazy">` 
      : '';
    
    return `
      <article class="post">
        ${imageHtml}
        <div class="post-content">${escapeHtml(post.content)}</div>
        <div class="post-meta">
          <span class="post-date">${formattedDate}</span>
        </div>
      </article>
    `;
  }).join('');
  
  postsContainer.innerHTML = html;
}

function showEmpty() {
  postsContainer.innerHTML = `
    <div class="empty">
      <div class="empty-icon">📝</div>
      <p>No posts yet. Check back later!</p>
    </div>
  `;
}

function showError(message) {
  postsContainer.innerHTML = `
    <div class="error">
      <p>Error loading posts: ${message}</p>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

loadPosts();