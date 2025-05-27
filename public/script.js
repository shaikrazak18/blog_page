function navigate(event) {
  event.preventDefault();
  const href = event.target.getAttribute("href");
  window.history.pushState({}, "", href);
  handleRoute();
}

window.onpopstate = () => handleRoute();

function handleRoute() {
  const path = window.location.pathname;

  if (path === "/") {
    fetch("/index.html")
      .then(res => res.text())
      .then(html => document.body.innerHTML = html)
      .then(() => loadPosts());
  } else if (path === "/create") {
    fetch("/create.html")
      .then(res => res.text())
      .then(html => document.body.innerHTML = html)
      .then(() => {
        document.getElementById("postForm").onsubmit = createPost;
      });
  } else if (path.startsWith("/post/")) {
    fetch("/post.html")
      .then(res => res.text())
      .then(html => document.body.innerHTML = html)
      .then(() => {
        const id = path.split("/post/")[1];
        fetch(`/api/posts/${id}`)
          .then(res => res.json())
          .then(data => {
            document.getElementById("postDetail").innerHTML = `
              <h2>${data.title}</h2>
              <p>${data.content}</p>
            `;
          });
      });
  }
}

function loadPosts() {
  fetch("/api/posts")
    .then(res => res.json())
    .then(posts => {
      const container = document.getElementById("posts");
      container.innerHTML = "";
      posts.forEach(post => {
        const link = document.createElement("a");
        link.href = `/post/${post.id}`;
        link.textContent = post.title;
        link.onclick = navigate;
        container.appendChild(link);
        container.appendChild(document.createElement("br"));
      });
    });
}

function createPost(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  }).then(() => {
    window.history.pushState({}, "", "/");
    handleRoute();
  });
}

window.onload = handleRoute;
