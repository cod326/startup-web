let search_box = document.getElementById("search_box");
let search_btn = document.getElementById("search_btn");
let loader = document.querySelector(".loader");

window.onload = function() {
    // Set loader to be visible on page load
    loader.style.display = "block";

    if (!sessionStorage.getItem('hasRefreshed')) {
        sessionStorage.setItem('hasRefreshed', 'true');
        window.location.reload();
    } else {
        // Hide loader after the page has fully loaded
        loader.style.display = "none";
    }
};

search_btn.onclick = function(event) {
    event.preventDefault();
    if (search_box.value !== "") {
        loader.style.display = "block";

        let query = search_box.value;
        if (!search_box.value.includes(' ') && search_box.value.includes('.')) {
            if (!query.startsWith('http://') && !query.startsWith('https://')) {
                query = 'https://' + query; 
            }
            window.location.href = query;
        } else {
            let search_result = "https://www.google.com/search?q=" + encodeURIComponent(search_box.value);
            window.location.href = search_result;
        }
        search_box.value = "";
    }
};

function loadShortcuts() {
    const shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
    const allShortcutContainer = document.querySelector("#all_shortcut_icons");
    
    allShortcutContainer.innerHTML = '';
    shortcuts.forEach(shortcut => {
        const shortcutElement = document.createElement("div");
        shortcutElement.innerHTML = `<a href="${shortcut.url}" target="_blank" class="link"><div class="shortcutName"><div class="shortcutFirstval">${shortcut.name[0]}</div><div class="shortcutValue">${shortcut.name}</div></div></a>`;
        shortcutElement.className = 'shortcut1';
        allShortcutContainer.appendChild(shortcutElement);
    });
}

function saveShortcuts(shortcuts) {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
}

function shortcut_btn() {
    let add = document.querySelector("#add");
    let bg = document.querySelector("#bg");
    let add_link_box = document.querySelector("#add_link_box");
    let add_btn = document.querySelector("#add_btn");
    let shortcutName = document.querySelector("#name");
    let shortcutUrl = document.querySelector("#url");
    let allShortcutContainer = document.querySelector("#all_shortcut_icons");

    loadShortcuts();

    add.onclick = function() {
        bg.style.display = "block";
        add_link_box.style.display = "inline";
        add_link_box.style.justifySelf = "center";
        add_link_box.style.marginTop = "200px";
    }

    bg.onclick = function() {
        bg.style.display = "none";
        add_link_box.style.display = "none";
        shortcutName.value = "";
        shortcutUrl.value = "";
    }

    add_btn.onclick = () => {
        const name = shortcutName.value.trim();
        const url = shortcutUrl.value.trim();

        if (!name || !url) {
            alert("Please fill in both fields.");
            return;
        }

        const newShortcut = { name: name, url: url };
        
        const shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
        shortcuts.push(newShortcut);
        saveShortcuts(shortcuts);
        
        loadShortcuts();
        bg.style.display = "none";
        add_link_box.style.display = "none";

        shortcutName.value = '';
        shortcutUrl.value = '';
    }

    allShortcutContainer.addEventListener('contextmenu', function(event) {
        const shortcutElement = event.target.closest('.shortcut1');
        if (shortcutElement) {
            event.preventDefault();

            shortcutElement.remove();

            const shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
            const updatedShortcuts = shortcuts.filter(shortcut1 => {
                return shortcut1.name !== shortcutElement.querySelector('.shortcutValue').textContent;
            });
            saveShortcuts(updatedShortcuts);
        }
    });
}

shortcut_btn();
