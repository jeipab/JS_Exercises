const fetchBtn = document.getElementById("fetchBtn");
const output = document.getElementById("output");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");

fetchBtn.addEventListener("click", async () => {
    console.log("Button clicked");

    output.classList.add("hidden");
    loader.classList.remove("hidden");
    errorBox.classList.add("hidden");
    errorBox.textContent = "";

    const postId = document.getElementById("postId").value || 1;
    const userId = document.getElementById("userId").value || null;

    try {
        const [postRes, userRes] = await Promise.all([
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`),
            fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        ]);

        const errors =[];

        let postData = null;
        let userData = null;

        if (!postRes.ok) {
            errors.push("Failed to fetch post data.");
        } else {
            postData = await postRes.json();
        }

        if (!userRes.ok) {
            errors.push("Failed to fetch user data.");
        } else {
            userData = await userRes.json();
        }
        
        if (errors.length === 0 && postData && userData) {
            if (postData.userId != userData.id) {
                errors.push("The post does not belong to the selected user.");
            }
        }

        if (errors.length > 0) {
            throw new Error(errors.join(" "));
        }

        output.innerHTML = `
            <h3 class="section-title">Post Info</h3>
            ${renderPostInfo(postData)}
            <h3 class="section-title">Author Info</h3>
            ${renderUserInfo(userData)}
        `;

        output.classList.remove("hidden");
    } catch (err) {
        const messages = err.message.split(/(?=\bFailed|\bThe\b)/);
        errorBox.innerHTML = messages.map(msg => `<div>${msg.trim()}</div>`).join("");
        errorBox.classList.remove("hidden");
    } finally {
        loader.classList.add("hidden");
    }
});

function renderPostInfo(post) {
    return `
        <div class="card">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        </div>
    `;
}

function renderUserInfo(user) {
    return `
        <div class="card">
            <h3>${user.name} <span style="color: #888">(@${user.username})</span></h3>
            
            <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${user.phone}">${user.phone}</a></p>
            <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
            
            <p><strong>Company:</strong><br />
            ${user.company.name}<br />
            <em>"${user.company.catchPhrase}"</em><br />
            <small style="color: #555;">(${user.company.bs})</small></p>
            
            <p><strong>Address:</strong><br />
            ${user.address.street}, ${user.address.suite}<br />
            ${user.address.city}, ${user.address.zipcode}<br />
            Lat: ${user.address.geo.lat}, Lng: ${user.address.geo.lng}</p>
        </div>
    `;
}