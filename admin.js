/*=========================================
ADMIN PAGE LOGIC
(this file is only loaded on admin.html,
so it never runs on any other page)
=========================================*/

if (
    typeof window.supabase === "undefined" ||
    !window.SUPABASE_URL ||
    !window.SUPABASE_ANON_KEY ||
    window.SUPABASE_URL === "YOUR_SUPABASE_URL"
) {

    alert(
        "Supabase isn't configured yet. Add your SUPABASE_URL and " +
        "SUPABASE_ANON_KEY at the top of admin.html."
    );

} else {

    const sb = window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
    );

    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("dashboard");
    const loginError = document.getElementById("loginError");

    /*=========================================
    AUTH
    =========================================*/

    async function checkSession() {

        const { data: { session } } = await sb.auth.getSession();

        if (session) {

            showDashboard();

        } else {

            loginScreen.classList.remove("admin-hidden");
            dashboard.classList.add("admin-hidden");

        }

    }

    function showDashboard() {

        loginScreen.classList.add("admin-hidden");
        dashboard.classList.remove("admin-hidden");

        loadArtworks();
        loadEnquiries();

    }

    document.getElementById("loginBtn").addEventListener("click", async () => {

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        loginError.textContent = "";

        if (!email || !password) {

            loginError.textContent = "Please enter your email and password.";
            return;

        }

        const { error } = await sb.auth.signInWithPassword({ email, password });

        if (error) {

            loginError.textContent = "Incorrect email or password.";
            return;

        }

        showDashboard();

    });

    document.getElementById("logoutBtn").addEventListener("click", async () => {

        await sb.auth.signOut();

        loginScreen.classList.remove("admin-hidden");
        dashboard.classList.add("admin-hidden");

    });

    /*=========================================
    TABS
    =========================================*/

    document.querySelectorAll(".admin-tab-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            document.querySelectorAll(".admin-panel").forEach(p => p.classList.add("admin-hidden"));
            document.getElementById(btn.dataset.tab).classList.remove("admin-hidden");

        });

    });

    /*=========================================
    ARTWORKS: LOAD + RENDER
    =========================================*/

    const artworkGrid = document.getElementById("artworkGrid");

    async function loadArtworks() {

        artworkGrid.innerHTML = "<p>Loading artworks...</p>";

        const { data, error } = await sb
            .from("artworks")
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) {

            artworkGrid.innerHTML = "<p class='admin-status-msg error'>Could not load artworks.</p>";
            console.error(error);
            return;

        }

        artworkGrid.innerHTML = "";

        data.forEach(art => artworkGrid.appendChild(buildArtworkCard(art)));

    }

    function buildArtworkCard(art) {

        const card = document.createElement("div");
        card.className = "admin-art-card";

        card.innerHTML = `
            <img src="${escapeAttr(art.image_url)}" alt="${escapeAttr(art.title)}"
                 onerror="this.src='';this.style.background='#eee';">

            <label>Title</label>
            <input type="text" class="f-title" value="${escapeAttr(art.title)}">

            <label>Price (GH₵)</label>
            <input type="number" class="f-price" value="${art.price}">

            <label>Image URL</label>
            <input type="text" class="f-image" value="${escapeAttr(art.image_url)}">

            <label>Category</label>
            <select class="f-category">
                <option value="painting" ${art.category === "painting" ? "selected" : ""}>Painting</option>
                <option value="drawing" ${art.category === "drawing" ? "selected" : ""}>Drawing</option>
                <option value="mixed" ${art.category === "mixed" ? "selected" : ""}>Mixed Media</option>
            </select>

            <label>Description</label>
            <textarea class="f-description" rows="3">${escapeHtml(art.description)}</textarea>

            <div class="admin-card-actions">
                <button class="save-btn"><i class="fa-solid fa-floppy-disk"></i> Save</button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>

            <p class="admin-status-msg"></p>
        `;

        const imgEl = card.querySelector("img");
        const imageInput = card.querySelector(".f-image");
        const statusEl = card.querySelector(".admin-status-msg");

        imageInput.addEventListener("input", () => {

            imgEl.src = imageInput.value;

        });

        card.querySelector(".save-btn").addEventListener("click", async () => {

            statusEl.textContent = "Saving...";
            statusEl.className = "admin-status-msg";

            const { error } = await sb
                .from("artworks")
                .update({
                    title: card.querySelector(".f-title").value.trim(),
                    price: parseFloat(card.querySelector(".f-price").value) || 0,
                    image_url: card.querySelector(".f-image").value.trim(),
                    category: card.querySelector(".f-category").value,
                    description: card.querySelector(".f-description").value.trim()
                })
                .eq("id", art.id);

            if (error) {

                statusEl.textContent = "Failed to save. Try again.";
                statusEl.className = "admin-status-msg error";
                console.error(error);
                return;

            }

            statusEl.textContent = "Saved!";
            statusEl.className = "admin-status-msg success";

            setTimeout(() => { statusEl.textContent = ""; }, 2500);

        });

        card.querySelector(".delete-btn").addEventListener("click", async () => {

            const sure = confirm(`Delete "${art.title}"? This can't be undone.`);

            if (!sure) return;

            const { error } = await sb.from("artworks").delete().eq("id", art.id);

            if (error) {

                statusEl.textContent = "Failed to delete.";
                statusEl.className = "admin-status-msg error";
                console.error(error);
                return;

            }

            card.remove();

        });

        return card;

    }

    /*=========================================
    ARTWORKS: ADD NEW
    =========================================*/

    document.getElementById("addArtworkBtn").addEventListener("click", async () => {

        const statusEl = document.getElementById("addArtworkStatus");

        const title = document.getElementById("newTitle").value.trim();
        const price = parseFloat(document.getElementById("newPrice").value) || 0;
        const image_url = document.getElementById("newImageUrl").value.trim();
        const category = document.getElementById("newCategory").value;
        const description = document.getElementById("newDescription").value.trim();

        if (!title || !image_url) {

            statusEl.textContent = "Please add at least a title and an image URL.";
            statusEl.className = "admin-status-msg error";
            return;

        }

        statusEl.textContent = "Adding...";
        statusEl.className = "admin-status-msg";

        const { data, error } = await sb
            .from("artworks")
            .insert([{ title, price, image_url, category, description }])
            .select();

        if (error) {

            statusEl.textContent = "Failed to add artwork.";
            statusEl.className = "admin-status-msg error";
            console.error(error);
            return;

        }

        artworkGrid.appendChild(buildArtworkCard(data[0]));

        document.getElementById("newTitle").value = "";
        document.getElementById("newPrice").value = "";
        document.getElementById("newImageUrl").value = "";
        document.getElementById("newDescription").value = "";

        statusEl.textContent = "Artwork added!";
        statusEl.className = "admin-status-msg success";

        setTimeout(() => { statusEl.textContent = ""; }, 2500);

    });

    /*=========================================
    MESSAGES / SMS
    =========================================*/

    const enquiryList = document.getElementById("enquiryList");
    const selectAllBox = document.getElementById("selectAllEnquiries");
    const selectedCountEl = document.getElementById("selectedCount");
    const smsMessage = document.getElementById("smsMessage");
    const smsCharCount = document.getElementById("smsCharCount");
    const smsStatus = document.getElementById("smsStatus");

    let enquiries = [];

    async function loadEnquiries() {

        const { data, error } = await sb
            .from("enquiries")
            .select("*")
            .order("submitted_at", { ascending: false });

        if (error) {

            console.error(error);
            return;

        }

        enquiries = data;

        document.querySelectorAll(".enquiry-row").forEach(row => row.remove());

        enquiries.forEach(en => {

            const row = document.createElement("div");
            row.className = "enquiry-row";

            const date = new Date(en.submitted_at).toLocaleDateString();

            row.innerHTML = `
                <input type="checkbox" class="enquiry-check" data-phone="${escapeAttr(en.phone)}">
                <div class="enquiry-info">
                    <strong>${escapeHtml(en.name)}</strong>
                    <div class="enquiry-meta">${escapeHtml(en.phone)} &middot; ${escapeHtml(en.email)} &middot; ${date}</div>
                    <p>${escapeHtml(en.message)}</p>
                </div>
            `;

            enquiryList.appendChild(row);

        });

        wireCheckboxes();

    }

    function wireCheckboxes() {

        document.querySelectorAll(".enquiry-check").forEach(cb => {

            cb.addEventListener("change", updateSelectedCount);

        });

    }

    function updateSelectedCount() {

        const count = document.querySelectorAll(".enquiry-check:checked").length;
        selectedCountEl.textContent = count;

    }

    selectAllBox.addEventListener("change", () => {

        document.querySelectorAll(".enquiry-check").forEach(cb => {

            cb.checked = selectAllBox.checked;

        });

        updateSelectedCount();

    });

    smsMessage.addEventListener("input", () => {

        smsCharCount.textContent = smsMessage.value.length;

    });

    document.getElementById("sendSmsBtn").addEventListener("click", async () => {

        const selectedPhones = Array.from(
            document.querySelectorAll(".enquiry-check:checked")
        ).map(cb => cb.dataset.phone);

        const message = smsMessage.value.trim();

        if (selectedPhones.length === 0) {

            smsStatus.textContent = "Select at least one person to message.";
            smsStatus.className = "admin-status-msg error";
            return;

        }

        if (!message) {

            smsStatus.textContent = "Write a message first.";
            smsStatus.className = "admin-status-msg error";
            return;

        }

        smsStatus.textContent = "Sending...";
        smsStatus.className = "admin-status-msg";

        const { data: { session } } = await sb.auth.getSession();

        try {

            const res = await fetch(`${window.SUPABASE_URL}/functions/v1/send-sms`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`,
                    "apikey": window.SUPABASE_ANON_KEY
                },
                body: JSON.stringify({ to: selectedPhones, message })
            });

            const result = await res.json();

            if (!res.ok) {

                throw new Error(result.error || "Send failed");

            }

            smsStatus.textContent = `Sent to ${selectedPhones.length} recipient(s).`;
            smsStatus.className = "admin-status-msg success";
            smsMessage.value = "";
            smsCharCount.textContent = "0";

        } catch (err) {

            console.error(err);
            smsStatus.textContent =
                "Couldn't send. Make sure the send-sms function is deployed " +
                "with your Twilio details (see SMS_SETUP.md).";
            smsStatus.className = "admin-status-msg error";

        }

    });

    /*=========================================
    HELPERS
    =========================================*/

    function escapeHtml(str) {

        const div = document.createElement("div");
        div.textContent = str ?? "";
        return div.innerHTML;

    }

    function escapeAttr(str) {

        return (str ?? "").replace(/"/g, "&quot;");

    }

    checkSession();

}
