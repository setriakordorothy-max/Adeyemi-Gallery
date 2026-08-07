/*=========================================
GALLERY LOADER
(only runs on gallery.html, guarded by the
presence of #galleryGrid, so it never
touches any other page)
=========================================*/

const galleryGrid = document.getElementById("galleryGrid");

if (galleryGrid) {

    if (
        typeof window.supabase === "undefined" ||
        !window.SUPABASE_URL ||
        !window.SUPABASE_ANON_KEY ||
        window.SUPABASE_URL === "YOUR_SUPABASE_URL"
    ) {

        galleryGrid.innerHTML =
            "<p>Gallery isn't connected yet — add your Supabase URL and key in gallery.html.</p>";

    } else {

        const sb = window.supabase.createClient(
            window.SUPABASE_URL,
            window.SUPABASE_ANON_KEY
        );

        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");

        loadGallery();

        async function loadGallery() {

            const { data, error } = await sb
                .from("artworks")
                .select("*")
                .order("sort_order", { ascending: true });

            if (error || !data || data.length === 0) {

                galleryGrid.innerHTML = "<p>No artworks to show yet.</p>";
                console.error(error);
                return;

            }

            galleryGrid.innerHTML = "";

            data.forEach(art => galleryGrid.appendChild(buildCard(art)));

            wireFilterButtons();

        }

        function buildCard(art) {

            const card = document.createElement("div");

            /* No "reveal" class here on purpose: that class starts
               elements invisible until script.js's scroll-triggered
               observer flips them to "active" — but that observer only
               ever sees elements that existed on the page at load time,
               so artwork cards added afterwards (like these) would stay
               invisible forever. Skipping "reveal" just shows them
               normally instead. */

            card.className = `art-card ${art.category}`;

            card.innerHTML = `
                <img src="${art.image_url}" alt="${art.title}">
                <div class="art-info">
                    <h3>${art.title}</h3>
                    <p>${art.description}</p>
                    <div class="price">GH₵ ${art.price}</div>
                    <button class="buy-btn">
                        <i class="fa-solid fa-cart-shopping"></i>
                        Enquire
                    </button>
                </div>
            `;

            const img = card.querySelector("img");

            img.addEventListener("click", () => {

                if (!lightbox || !lightboxImg) return;

                lightbox.classList.add("show");
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                document.body.style.overflow = "hidden";

            });

            const buyBtn = card.querySelector(".buy-btn");

            buyBtn.addEventListener("click", () => {

                window.location.href = "contact.html";

            });

            return card;

        }

        function wireFilterButtons() {

            const filterButtons = document.querySelectorAll(".gallery-filter button");
            const cards = galleryGrid.querySelectorAll(".art-card");

            filterButtons.forEach(button => {

                button.addEventListener("click", () => {

                    filterButtons.forEach(btn => btn.classList.remove("active"));
                    button.classList.add("active");

                    const filter = button.dataset.filter;

                    cards.forEach(card => {

                        if (filter === "all" || card.classList.contains(filter)) {

                            card.style.display = "block";
                            card.style.opacity = "1";
                            card.style.transform = "scale(1)";

                        } else {

                            card.style.opacity = "0";
                            card.style.transform = "scale(.8)";

                            setTimeout(() => { card.style.display = "none"; }, 250);

                        }

                    });

                });

            });

        }

    }

}
