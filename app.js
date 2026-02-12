
const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

root.setAttribute("data-theme", initialTheme);
if (themeToggle) {
	themeToggle.addEventListener("click", () => {
		const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
		root.setAttribute("data-theme", nextTheme);
		localStorage.setItem("theme", nextTheme);
	});
}

const roleCopy = {
	researcher: {
		title: "AI Researcher",
		copy: "I design vision-first AI pipelines powered by VLMs and LLM-based retrieval systems that learn and improve from real-world feedback."
	},
	engineer: {
		title: "AI Engineer",
		copy: "I deploy production AI systems with observability, evaluation frameworks, and latency-aware inference pipelines."
	}
};

const roleButtons = document.querySelectorAll("[data-role-switcher] button");
const heroTitle = document.querySelector("[data-hero-title]");
const heroCopy = document.querySelector("[data-hero-copy]");

roleButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const role = button.dataset.role;
		roleButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
		if (heroTitle && heroCopy && roleCopy[role]) {
			heroTitle.textContent = roleCopy[role].title;
			heroCopy.textContent = roleCopy[role].copy;
		}
	});
});

const cards = document.querySelectorAll("[data-card]");
cards.forEach((card) => {
	const toggle = card.querySelector(".card-toggle");
	if (!toggle) {
		return;
	}
	toggle.addEventListener("click", (event) => {
		event.stopPropagation();
		card.classList.toggle("is-open");
		toggle.textContent = card.classList.contains("is-open") ? "Hide" : "Details";
	});
	card.addEventListener("click", () => {
		card.classList.toggle("is-open");
		toggle.textContent = card.classList.contains("is-open") ? "Hide" : "Details";
	});
});

const revealItems = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("show");
			}
		});
	},
	{ threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const navLinks = document.querySelectorAll("[data-nav-link]");
const sections = Array.from(navLinks)
	.map((link) => document.querySelector(link.getAttribute("href")))
	.filter(Boolean);

const sectionObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				return;
			}
			navLinks.forEach((link) => {
				link.classList.toggle(
					"nav-active",
					link.getAttribute("href") === `#${entry.target.id}`
				);
			});
		});
	},
	{ threshold: 0.5 }
);

sections.forEach((section) => sectionObserver.observe(section));

const repoGrid = document.querySelector("[data-repo-grid]");

if (repoGrid) {
	const username = repoGrid.dataset.githubUser || "abrarahmd";
	const perPage = 100;

	const fetchAllRepos = async () => {
		let page = 1;
		let allRepos = [];
		while (true) {
			const response = await fetch(
				`https://api.github.com/users/${username}/repos?per_page=${perPage}&sort=updated&page=${page}`
			);
			const repos = await response.json();
			if (!Array.isArray(repos)) {
				return null;
			}
			allRepos = allRepos.concat(repos);
			if (repos.length < perPage) {
				break;
			}
			page += 1;
		}
		return allRepos;
	};

	fetchAllRepos()
		.then((repos) => {
			if (!Array.isArray(repos)) {
				repoGrid.innerHTML = "<div class=\"repo-card\">GitHub repos are unavailable.</div>";
				return;
			}
			const cardsMarkup = repos
				.map((repo) => {
					const description = repo.description ? repo.description.trim() : "";
					const language = repo.language || "Mixed";
					const stars = repo.stargazers_count || 0;
					const forks = repo.forks_count || 0;
					const issues = repo.open_issues_count || 0;
					const updated = repo.updated_at
						? new Date(repo.updated_at).toLocaleDateString("en-US", {
							month: "short",
							year: "numeric"
						})
						: "";
					const metaText = stars > 0
						? `${language} · ${stars} stars`
						: `${language}${updated ? ` · Updated ${updated}` : ""}`;
					const starBadge = stars > 0 ? `<span class=\"repo-badge\">★ ${stars}</span>` : "";
					return `
						<div class="repo-card">
							<div class="repo-title">${repo.name}</div>
							${description ? `<p class=\"repo-desc\">${description}</p>` : ""}
							<div class="repo-badges">
								<span class="repo-badge">${language}</span>
								${updated ? `<span class=\"repo-badge\">Updated ${updated}</span>` : ""}
								<span class="repo-badge">Forks ${forks}</span>
								<span class="repo-badge">Issues ${issues}</span>
								${starBadge}
							</div>
							<div class="repo-meta">${metaText}</div>
							<a class="repo-link" href="${repo.html_url}" target="_blank" rel="noreferrer">View repo</a>
						</div>
					`;
				})
				.join("");
			repoGrid.innerHTML = cardsMarkup || "<div class=\"repo-card\">No public repos found.</div>";
		})
		.catch(() => {
			repoGrid.innerHTML = "<div class=\"repo-card\">GitHub repos are unavailable.</div>";
		});
}

const snakeCanvas = document.querySelector("[data-snake-canvas]");
const snakeStart = document.querySelector("[data-snake-start]");
const snakePause = document.querySelector("[data-snake-pause]");
const snakeScore = document.querySelector("[data-snake-score]");
const snakeBest = document.querySelector("[data-snake-best]");
const snakeSpeed = document.querySelector("[data-snake-speed]");
const snakeMessage = document.querySelector("[data-snake-message]");
const snakeOverlay = document.querySelector("[data-snake-overlay]");

const gridSize = 20;
const tileSize = 13;
const baseSpeed = 140;
let snakeLoop = null;
let direction = "right";
let queuedDirection = "right";
let snake = [];
let food = { x: 10, y: 10 };
let score = 0;
let speedLevel = 1;
let running = false;
let best = Number(localStorage.getItem("snakeBest") || 0);

function randomFood() {
	let position;
	do {
		position = {
			x: Math.floor(Math.random() * gridSize),
			y: Math.floor(Math.random() * gridSize)
		};
	} while (snake.some((segment) => segment.x === position.x && segment.y === position.y));
	food = position;
}

function resetSnake() {
	snake = [
		{ x: 6, y: 10 },
		{ x: 5, y: 10 },
		{ x: 4, y: 10 }
	];
	direction = "right";
	queuedDirection = "right";
	score = 0;
	speedLevel = 1;
	randomFood();
	updateSnakeUi();
}

function updateSnakeUi() {
	if (snakeScore) {
		snakeScore.textContent = `${score}`;
	}
	if (snakeBest) {
		snakeBest.textContent = `${best}`;
	}
	if (snakeSpeed) {
		snakeSpeed.textContent = `${speedLevel}x`;
	}
}

function drawSnake() {
	if (!snakeCanvas) {
		return;
	}
	const ctx = snakeCanvas.getContext("2d");
	if (!ctx) {
		return;
	}
	const headColor = "#111827";
	const bodyColor = "#1f2937";
	const foodColor = "#f59e0b";
	ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
	snake.forEach((segment, index) => {
		ctx.fillStyle = index === 0 ? headColor : bodyColor;
		ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
	});
	ctx.fillStyle = foodColor;
	ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function setDirection(next) {
	const opposites = {
		up: "down",
		down: "up",
		left: "right",
		right: "left"
	};
	if (opposites[next] === direction) {
		return;
	}
	queuedDirection = next;
}

function stepSnake() {
	if (!running) {
		return;
	}
	direction = queuedDirection;
	const head = { ...snake[0] };
	if (direction === "up") head.y -= 1;
	if (direction === "down") head.y += 1;
	if (direction === "left") head.x -= 1;
	if (direction === "right") head.x += 1;

	if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
		return endSnake("Wall hit. Try again.");
	}
	if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
		return endSnake("Self collision. Try again.");
	}

	snake.unshift(head);
	if (head.x === food.x && head.y === food.y) {
		score += 1;
		if (score % 4 === 0) {
			speedLevel += 1;
			resetSnakeLoop();
		}
		randomFood();
		if (snakeMessage) {
			snakeMessage.textContent = "Nice! Keep going.";
		}
	} else {
		snake.pop();
	}

	if (score > best) {
		best = score;
		localStorage.setItem("snakeBest", String(best));
	}
	updateSnakeUi();
	drawSnake();
}

function resetSnakeLoop() {
	clearInterval(snakeLoop);
	const nextSpeed = Math.max(60, baseSpeed - speedLevel * 10);
	snakeLoop = setInterval(stepSnake, nextSpeed);
}

function startSnake() {
	resetSnake();
	running = true;
	if (snakeOverlay) {
		snakeOverlay.classList.add("hidden");
	}
	if (snakeMessage) {
		snakeMessage.textContent = "Arrow keys or buttons to move.";
	}
	resetSnakeLoop();
	drawSnake();
}

function pauseSnake() {
	running = !running;
	if (snakeMessage) {
		snakeMessage.textContent = running ? "Back in motion." : "Paused.";
	}
}

function endSnake(message) {
	running = false;
	clearInterval(snakeLoop);
	if (snakeOverlay) {
		snakeOverlay.classList.remove("hidden");
	}
	if (snakeMessage) {
		snakeMessage.textContent = message;
	}
}

snakeStart?.addEventListener("click", () => {
	if (!running) {
		startSnake();
	}
});

snakePause?.addEventListener("click", () => {
	if (snakeLoop) {
		pauseSnake();
	}
});

document.addEventListener("keydown", (event) => {
	const keys = {
		ArrowUp: "up",
		ArrowDown: "down",
		ArrowLeft: "left",
		ArrowRight: "right"
	};
	const next = keys[event.key];
	if (next) {
		event.preventDefault();
		setDirection(next);
	}
});

if (snakeBest) {
	snakeBest.textContent = `${best}`;
}

const expCards = document.querySelectorAll("[data-exp-card]");
expCards.forEach((card) => {
	const toggle = card.querySelector("[data-exp-toggle]");
	const body = card.querySelector("[data-exp-body]");
	if (!toggle || !body) {
		return;
	}
	toggle.addEventListener("click", () => {
		card.classList.toggle("open");
	});
});

const skillFilters = document.querySelectorAll("[data-skill-filter]");
const skillCards = document.querySelectorAll("[data-skill-card]");

skillFilters.forEach((button) => {
	button.addEventListener("click", () => {
		const filter = button.dataset.skillFilter;
		skillFilters.forEach((btn) => btn.classList.toggle("active", btn === button));
		skillCards.forEach((card) => {
			const category = card.dataset.skillCategory;
			const show = filter === "all" || filter === category;
			card.style.display = show ? "block" : "none";
		});
	});
});

const skillToggles = document.querySelectorAll("[data-skill-toggle]");
skillToggles.forEach((toggle) => {
	const card = toggle.closest("[data-skill-card]");
	if (!card) {
		return;
	}
	toggle.addEventListener("click", () => {
		card.classList.toggle("open");
	});
});

const copyButtons = document.querySelectorAll("[data-copy]");
const copyStatus = document.querySelector("[data-copy-status]");

copyButtons.forEach((button) => {
	button.addEventListener("click", async () => {
		const value = button.dataset.copy || "";
		if (!value) {
			return;
		}
		try {
			await navigator.clipboard.writeText(value);
			button.textContent = "Copied";
			if (copyStatus) {
				copyStatus.textContent = "Copied to clipboard.";
			}
		} catch (error) {
			button.textContent = "Copy";
			if (copyStatus) {
				copyStatus.textContent = "Copy failed. Tap to select.";
			}
		}
		setTimeout(() => {
			button.textContent = "Copy";
			if (copyStatus) {
				copyStatus.textContent = "Ready for new projects.";
			}
		}, 2000);
	});
});

