function loadCategory() {
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
        .then(res => res.json())
        .then(data => displayCategory(data.categories))
}

function displayCategory(data) {
    console.log(data);
    const categoriesNav = document.getElementById('categories');

    for (const categories of data) {
        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML = `
        <button class="btn category-btn" id="btn-${categories.category_id}" onclick="loadCategoryVedio(${categories.category_id})">
            ${categories.category}
        </button>`;
        categoriesNav.appendChild(buttonContainer);
    }
}

function loadVedio(search = "", sortByViews = false) {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${search}`)
        .then(res => res.json())
        .then(data => {
            let videos = data.videos;

            // If sortByViews is true, sort the videos array by views
            if (sortByViews) {
                videos = videos.sort((a, b) => {
                    const viewsA = parseViews(a.others.views);
                    const viewsB = parseViews(b.others.views);
                    return viewsA - viewsB; // Sort descending
                });
            }

            displayVedio(videos);
        })
        .catch(error => console.error("Error loading videos:", error));
}


function loadCategoryVedio(id) {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then(res => res.json())
        .then(data => {
            const activeBtn = document.getElementById(`btn-${id}`)
            const allButtons = document.querySelectorAll('.category-btn');
            for(const btn of allButtons){
                btn.classList.remove('active');
            }
            activeBtn.classList.add("active")
            displayVedio(data.category)})
}

function convertToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

function loadDetails(vedio_id){
    fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${vedio_id}`)
        .then(res => res.json())
        .then(data => displayDetails(data.video))
}

function displayDetails(vedio){
    console.log(vedio)
    const detailsContainer = document.getElementById("modal-content");
    detailsContainer.innerHTML =`
    <img src=${vedio.thumbnail}>
    <p>${vedio.description}`

    // way -1
    // document.getElementById("showModalData").click();
    // way -2
    document.getElementById("customModal").showModal();
}

function displayVedio(data) {
    const vedioSection = document.getElementById("vedios");
    vedioSection.innerHTML = "";
    if (data.length === 0) {
        vedioSection.classList.remove("grid")
        vedioSection.innerHTML = `
        <div class="min-h-[300px] flex flex-col items-center justify-center">
            <img src="./assets/Icon.png" alt="Icon">
            <p>Oops! Sorry</p>
            <p>There is no content</p>
        </div>
        `
        return;
    } else {
        vedioSection.classList.add("grid")
    }
    for (const vedios of data) {
        // console.log(vedios);
        const card = document.createElement("div");
        card.classList = "card card-compact bg-base-100"
        card.innerHTML = `
        <figure class="h-[200px] relative">
        <img
        src=${vedios.thumbnail}
        class="h-full w-full object-cover"
        alt="Shoes" />
        ${vedios.others.posted_date.length === 0 ? "" : `<span class="absolute right-0 bottom-0 text-white">${convertToTime(vedios.others.posted_date)}</span>`}
        </figure>
        
        <div class="px-0 py-2 flex gap-2">
            <div>
                <img src=${vedios.authors[0].profile_picture} class="h-10 w-10 rounded-full object-cover" />
            </div>
            <div>
                <h2>${vedios.title}</h2>
                <div class="flex gap-2 items-center">
                    <p>${vedios.authors[0].profile_name}</p>
                    ${vedios.authors[0].verified === true ? `<img src="./assets/Group.png" />` : ""}
                </div>
                <p>${vedios.others.views}</p>
            </div>
            
        </div>
        <div>
            <p>
                <button class="btn btn-sm btn-error" onclick=loadDetails('${vedios.video_id}')>
                details
                </button>
            </p>
        </div>
`
        vedioSection.appendChild(card)
    }
}

document.getElementById("inputSearch").addEventListener('keyup',function(event){
    loadVedio(event.target.value);
})

function parseViews(viewsString) {
    if (!viewsString) return 0; // Handle empty or invalid views
    const numberPart = viewsString.toLowerCase().replace(/[^0-9.km]/g, ''); // Remove unwanted characters
    let multiplier = 1;

    if (numberPart.endsWith('k')) {
        multiplier = 1000;
        return parseFloat(numberPart) * multiplier;
    } else if (numberPart.endsWith('m')) {
        multiplier = 1000000;
        return parseFloat(numberPart) * multiplier;
    }

    return parseInt(numberPart, 10) || 0; // Default to integer parsing
}
document.querySelector('.sort button').addEventListener('click', function () {
    const inputSearch = document.getElementById("inputSearch").value; // Get current search query
    loadVedio(inputSearch, true); // Load videos with sorting
});
loadCategory();
loadVedio();