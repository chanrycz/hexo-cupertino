(() => {
	var navEl = document.getElementById("theme-nav");

	if (document.body.attributes["data-rainbow-banner"]) {
		var shown = false;
		switch (document.body.attributes["data-rainbow-banner-shown"].value) {
			case "always":
				shown = true;
				break;
			case "auto":
				shown = new Date().getMonth() + 1 == parseInt(document.body.attributes["data-rainbow-banner-month"].value, 10);
				break;
			case "never":
				break;
			default:
				break;
		}
		if (shown) {
			var banner = document.createElement("div");

			banner.style.setProperty("--gradient", `linear-gradient(90deg, ${document.body.attributes["data-rainbow-banner-colors"].value})`);
			banner.classList.add("rainbow-banner");

			navEl.after(banner);
		}
	}

	var rainbowEl = document.getElementsByClassName("rainbow-banner")[0];

	navEl.addEventListener("click", (e) => {
		if (window.innerWidth <= 600) {
			document.body.style.setProperty("--nav-open-height", 48 + document.querySelector("#theme-nav .nav-items").clientHeight + "px");
			navEl.classList.toggle("open");
			if (rainbowEl !== null) {
				rainbowEl.classList.toggle("nav-open");
			}
		} else {
			if (navEl.classList.contains("open")) {
				navEl.classList.remove("open");
				if (rainbowEl !== null) {
					rainbowEl.classList.remove("nav-open");
				}
			}
		}
	});
	window.addEventListener("resize", (e) => {
		document.body.style.setProperty("--nav-open-height", 48 + document.querySelector("#theme-nav .nav-items").clientHeight + "px");
		if (window.innerWidth > 600) {
			if (navEl.classList.contains("open")) {
				navEl.classList.remove("open");
				if (rainbowEl !== null) {
					rainbowEl.classList.remove("nav-open");
				}
			}
		}
	});

	const StorageHelper = new (class {
		get(key, fallback) {
			if (localStorage.hasOwnProperty(key)) {
				if (localStorage.getItem(key)) {
					return localStorage.getItem(key);
				} else {
					return fallback;
				}
			} else {
				return fallback;
			}
		}

		set(key, value) {
			localStorage.setItem(key, value);
		}
	})();

	const ColorScheme = new (class {
		constructor() {
			window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
				this.updateCurrent(StorageHelper.get("english-lp-theme", "auto"));
			});
		}
		get() {
			const stored = StorageHelper.get("english-lp-theme", "auto");
			this.updateCurrent(stored);
			return stored;
		}
		set(value) {
			bodyEl.setAttribute("data-color-scheme", value);
			StorageHelper.set("english-lp-theme", value);
			this.updateCurrent(value);
			return value;
		}
		updateCurrent(value) {
			var current = "light";
			if (value == "auto") {
				if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
					current = "dark";
				}
			} else {
				current = value;
			}
			document.body.setAttribute("data-current-color-scheme", current);
		}
	})();

	if (document.getElementById("theme-color-scheme-toggle")) {
		var bodyEl = document.body;
		var themeColorSchemeToggleEl = document.getElementById("theme-color-scheme-toggle");
		var options = themeColorSchemeToggleEl.getElementsByTagName("input");

		if (ColorScheme.get()) {
			bodyEl.setAttribute("data-color-scheme", ColorScheme.get());
		}

		for (const option of options) {
			if (option.value == bodyEl.getAttribute("data-color-scheme")) {
				option.checked = true;
			} else {
				option.checked = false;
			}

			option.addEventListener("change", (ev) => {
				var value = ev.target.value;
				ColorScheme.set(value);
				for (const o of options) {
					if (o.value != value) {
						o.checked = false;
					}
				}
			});
		}
	}

	window.addEventListener("load", () => {
		if (document.body.attributes["data-toc"]) {
			const content = document.getElementsByClassName("content")[0];

			if (content !== null) {
				const maxDepth = document.body.attributes["data-toc-max-depth"].value;

				var headingSelector = "";
				for (var i = 1; i <= maxDepth; i++) {
					headingSelector += "h" + i + ",";
				}
				headingSelector = headingSelector.slice(0, -1);
				const headings = content.querySelectorAll(headingSelector);

				if (headings.length > 3) {
					var source = [];
					headings.forEach((heading) => {
						source.push({
							html: heading.innerHTML,
							href: heading.getElementsByClassName("headerlink")[0].attributes["href"].value,
							tagName: heading.tagName,
						});
					});

					const toc = document.createElement("div");
					toc.classList.add("toc");
					for (const i in source) {
						const item = document.createElement("p");
						const link = document.createElement("a");
						link.href = source[i].href;
						link.innerHTML = source[i].html;
						item.classList.add(source[i].tagName);
						link.removeChild(link.getElementsByClassName("headerlink")[0]);
						item.appendChild(link);
						toc.appendChild(item);
					}

					if (toc.children.length != 0) {
						document.getElementsByClassName("post")[0].getElementsByClassName("divider")[0].after(toc);
						const divider = document.createElement("div");
						divider.classList.add("divider");
						toc.after(divider);
					}
				}
			}
		}
	});

	var heroColors = {
		"#F54EA2": "#FF7676",
		"#17EAD9": "#6078EA",
		"#7117EA": "#EA6060",
		"#42E695": "#3BB2B8",
		"#F02FC2": "#6094EA",
		"#5B247A": "#1Bcedf",
		"#F5AF19": "#FF0844",
		"#FF00D4": "#00DDFF",
		"#00AEEF": "#2D388A",
		"#00A1FF": "#00FF8F",
		"#F6EA41": "#F048C6",
		"#9600FF": "#AEBAF8",
	};
	var heroColorsKeys = Object.keys(heroColors);
	var minuteCount = Math.floor(new Date() / (60 * 1000));
	var randomHeroColor = heroColorsKeys[minuteCount % heroColorsKeys.length];
	document.body.style.setProperty("--hero-random-1", randomHeroColor);
	document.body.style.setProperty("--hero-random-2", heroColors[randomHeroColor]);
})();