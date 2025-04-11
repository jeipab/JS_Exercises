const form = $('#postForm');
const loader = $('#loader');
const errorBox = $('#error');
const output = $('#output');
const submittedPosts = $('#submittedPosts');

form.on('submit', function (e) {
    e.preventDefault();

    errorBox.addClass('hidden');
    output.addClass('hidden');
    loader.removeClass('hidden');

    const title = $('#title').val().trim();
    const body = $('#body').val().trim();
    const userId = $('#userId').val().trim();
    const email = $('#email').val().trim();

    if (!title || !body || !userId || !email || !/^\S+@\S+\.\S+$/.test(email)) {
        loader.addClass('hidden');
        errorBox.text('Please fill out all fields with valid information.').removeClass('hidden');
        return;
    }

    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            title: title,
            body: body,
            userId: userId,
            email: email
        }),
        success: function (response) {
            loader.addClass('hidden'); // hide spinner first
        
            setTimeout(() => {
                alert(`Post Submitted! ID: ${response.id}`); // alert shows second
                createPostCard(response.title, response.body, email); // then post is added
                form[0].reset(); // and form is cleared
            }, 50);
        },        
        error: function() {
            loader.addClass('hidden');
            errorBox.text('Something went wrong. Please try again.').removeClass('hidden');
        }
    });
});

function createPostCard(title, body, email) {
    const card = $(`
        <div class="post-card">
        <h3 class="post-title">${title}</h3>
        <p class="post-body">${body}</p>
        <small><strong>Email:</strong> <span class="post-email">${email}</span></small>
        <button class="edit-btn">Edit</button>
        </div>
    `);

    card.find('.edit-btn').on('click', function () {
        enterEditMode(card);
    });

    submittedPosts.append(card);
}

function enterEditMode(card) {
    const title = card.find('.post-title').text();
    const body = card.find('.post-body').text();
    const email = card.find('.post-email').text();

    const editForm = $(`
        <div class="edit-mode" style="display: flex; flex-direction: column; gap: 12px;">
            <div class="input-group">
                <label>Title:</label>
                <input type="text" class="edit-title" value="${title}" />
            </div>
            <div class="input-group">
                <label>Body:</label>
                <textarea class="edit-body">${body}</textarea>
            </div>
            <div class="input-group">
                <label>Email:</label>
                <input type="email" class="edit-email" value="${email}" />
            </div>
            <div class="local-error hidden" style="
                color: #dc3545;
                background: #f8d7da;
                padding: 10px;
                border-left: 4px solid #dc3545;
                border-radius: 6px;
                font-size: 0.95rem;
            "></div>
            <div style="display: flex; gap: 10px;">
                <button class="save-btn">Save</button>
                <button class="delete-btn" style="background-color: #dc3545;">Delete</button>
            </div>
        </div>
    `);

    card.html(editForm);

    const localErrorBox = editForm.find('.local-error');

    editForm.find('.save-btn').on('click', function () {
        const newTitle = editForm.find('.edit-title').val().trim();
        const newBody = editForm.find('.edit-body').val().trim();
        const newEmail = editForm.find('.edit-email').val().trim();

        if (!newTitle || !newBody || !newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
            localErrorBox.text('Please fill out all fields with valid information.').removeClass('hidden');
            return;
        }

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts/1',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                title: newTitle,
                body: newBody,
                email: newEmail,
            }),
            success: function (response) {
                card.html(`
                    <h3 class="post-title">${response.title}</h3>
                    <p class="post-body">${response.body}</p>
                    <small><strong>Email:</strong> <span class="post-email">${response.email}</span></small>
                    <button class="edit-btn">Edit</button>
                `);
        
                card.find('.edit-btn').on('click', function () {
                    enterEditMode(card);
                });
            },
            error: function () {
                localErrorBox.text('Failed to update the post. Please try again.').removeClass('hidden');
            }
        });        

        card.find('.edit-btn').on('click', function () {
            enterEditMode(card);
        });
    });

    editForm.find('.delete-btn').on('click', function () {
        const confirmed = confirm("Are you sure you want to delete this post?");
        if (confirmed) {
            card.remove();
        }
    });
}