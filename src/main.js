let currentPage = 1;
let currentQuery = '';
const perPage = 40;

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    currentQuery = document.getElementById('search-input').value;
    currentPage = 1;
    searchImages(currentQuery, currentPage);
});

document.getElementById('load-more').addEventListener('click', function() {
    currentPage++;
    searchImages(currentQuery, currentPage);
});

async function searchImages(query, page) {
    const API_KEY = '44858240-c00958abcea8d05c4a140bab8'; 
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
    
    showLoader();

    try {
        const response = await axios.get(URL);
        const data = response.data;

        if (page === 1) {
            document.getElementById('gallery').innerHTML = '';
        }

        if (data.hits.length === 0) {
            alert('No images found.');
            hideLoader();
            return;
        }
    
        displayImages(data.hits);

        if (data.totalHits > page * perPage) {
            document.getElementById('load-more').style.display = 'block';
        } else {
            document.getElementById('load-more').style.display = 'none';
            alert("We're sorry, but you've reached the end of search results.");
        }

        smoothScroll();
    } catch (error) {
        console.error('Error fetching images:', error);
    } finally {
        hideLoader();
    }
}

function displayImages(images) {
    const gallery = document.getElementById('gallery');
    
    images.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const imgLink = document.createElement('a');
        imgLink.href = image.largeImageURL;
        imgLink.dataset.lightbox = 'gallery';
        
        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;
        
        imgLink.appendChild(img);
        
        const info = document.createElement('div');
        info.classList.add('info');
        
        const likes = document.createElement('p');
        likes.textContent = `Likes ${image.likes}`;
        
        const views = document.createElement('p');
        views.textContent = `Views ${image.views}`;
        
        const comments = document.createElement('p');
        comments.textContent = `Comments ${image.comments}`;
        
        info.appendChild(likes);
        info.appendChild(views);
        info.appendChild(comments);
        
        card.appendChild(imgLink);
        card.appendChild(info);
        
        gallery.appendChild(card);
    });

    new SimpleLightbox('.gallery a');
}

function showLoader() {
    document.getElementById('loader-container').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader-container').style.display = 'none';
}

function smoothScroll() {
    const { height: cardHeight } = document.querySelector('.card').getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}



