document.addEventListener("DOMContentLoaded", () => {
	initThemeControl();
	initReadingProgressBar();
	initCommentForm();
	initCategoryToggle();
});

/* =========================
   1. Theme Control
========================= */
function initThemeControl() {
	const toggleButton = document.getElementById("theme-toggle");
	if (!toggleButton) return;

	const activeTheme = localStorage.getItem("afriblog-theme") || "light";
	setThemeState(activeTheme);

	toggleButton.addEventListener("click", () => {
		const currentTheme = document.body.classList.contains("dark-mode")
			? "dark"
			: "light";
		setThemeState(currentTheme === "dark" ? "light" : "dark");
	});

	function setThemeState(theme) {
		if (theme === "dark") {
			document.body.classList.add("dark-mode");
			document.body.classList.remove("light-mode");
			toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
			localStorage.setItem("afriblog-theme", "dark");
		} else {
			document.body.classList.add("light-mode");
			document.body.classList.remove("dark-mode");
			toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
			localStorage.setItem("afriblog-theme", "light");
		}
	}
}

/* =========================
   2. Reading Progress Bar
========================= */
function initReadingProgressBar() {
	const progressBar = document.getElementById("scroll-progress-bar");
	if (!progressBar) return;

	window.addEventListener("scroll", () => {
		const winScroll = document.documentElement.scrollTop;
		const height =
			document.documentElement.scrollHeight -
			document.documentElement.clientHeight;

		progressBar.style.width =
			height > 0 ? `${(winScroll / height) * 100}%` : "0%";
	});
}

/* =========================
   3. Comment Form (AJAX)
========================= */
function initCommentForm() {
	const commentForm = document.getElementById("client-comment-form");
	const domCommentsList = document.getElementById("dom-comments-list");
	const dialogueHeader = document.querySelector(".comments-container h3");

	if (!commentForm || !domCommentsList) return;

	commentForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const inputName = document.getElementById("comment-name")?.value.trim();
		const inputEmail = document.getElementById("comment-email")?.value.trim();
		const inputBody = document.getElementById("comment-body")?.value.trim();

		if (!inputName || !inputEmail || !inputBody) return;

		const formData = new FormData(commentForm);
		const csrfToken = commentForm.querySelector(
			"[name=csrfmiddlewaretoken]",
		)?.value;

		const submitBtn = commentForm.querySelector('button[type="submit"]');

		if (!submitBtn) return;

		submitBtn.disabled = true;
		submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';

		fetch(window.location.pathname, {
			method: "POST",
			headers: {
				"X-CSRFToken": csrfToken,
			},
			body: formData,
		})
			.then((response) => {
				if (response.ok) {
					const dateString = new Date().toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					});

					appendCommentToDOM(inputName, inputBody, dateString);

					if (dialogueHeader) {
						const count =
							domCommentsList.querySelectorAll(".comment-bubble").length;

						dialogueHeader.textContent = `Dialogue (${count})`;
					}

					commentForm.reset();
					showSuccessNotice(commentForm);
				} else {
					showErrorNotice(commentForm);
				}
			})
			.catch(() => {
				showErrorNotice(commentForm);
			})
			.finally(() => {
				submitBtn.disabled = false;
				submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Post Comment';
			});
	});

	function appendCommentToDOM(name, body, date) {
		const bubble = document.createElement("div");

		bubble.className = "comment-bubble slide-up";

		bubble.innerHTML = `
            <div class="comment-meta">
                <i class="fas fa-user-circle"></i>
                <strong>${escapeHTML(name)}</strong>
                <small>
                    <i class="fas fa-clock"></i> ${date}
                </small>
            </div>
            <p>${escapeHTML(body)}</p>
        `;

		domCommentsList.appendChild(bubble);
	}

	function showSuccessNotice(form) {
		removeNotice();

		const notice = document.createElement("p");
		notice.id = "comment-notice";
		notice.className = "comment-notice-success";
		notice.textContent = "Your reply has been added to the dialogue.";

		form.parentNode.insertBefore(notice, form);

		setTimeout(removeNotice, 4000);
	}

	function showErrorNotice(form) {
		removeNotice();

		const notice = document.createElement("p");
		notice.id = "comment-notice";
		notice.className = "comment-notice-error";
		notice.textContent = "Something went wrong. Please try again.";

		form.parentNode.insertBefore(notice, form);

		setTimeout(removeNotice, 4000);
	}

	function removeNotice() {
		const existing = document.getElementById("comment-notice");

		if (existing) {
			existing.remove();
		}
	}

	function escapeHTML(str) {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}
}

/* =========================
   4. New Category Toggle
========================= */
function initCategoryToggle() {
	const toggleBtn = document.getElementById("toggle-new-category");
	const wrapper = document.getElementById("new-category-input-wrapper");
	const newInput = document.getElementById("new-category-input");
	const categorySelect = document.getElementById("id_category");

	if (!toggleBtn || !wrapper || !newInput || !categorySelect) return;

	toggleBtn.addEventListener("click", () => {
		const isHidden = getComputedStyle(wrapper).display === "none";

		wrapper.style.display = isHidden ? "block" : "none";

		toggleBtn.innerHTML = isHidden
			? '<i class="fas fa-times-circle"></i> Cancel new category'
			: '<i class="fas fa-plus-circle"></i> Add new category';

		if (!isHidden) {
			newInput.value = "";
		}
	});

	newInput.addEventListener("input", () => {
		if (newInput.value.trim()) {
			categorySelect.value = "";
		}
	});
}
