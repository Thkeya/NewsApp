const apiKey = process.env.NEWS_API_KEY;
const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

// Global variables to keep track of the current page and total articles
let currentPage = 1;
const articlesPerPage = 6; // Number of articles to display per page

async function fetchNews(page) {
  try {
    const response = await fetch(`${url}&page=${page}`);
    const data = await response.json();
    console.log(data);
    displayNews(data.articles);

  } catch (error) {
    console.error("There was an error!", error);
  }
}

fetchNews(currentPage);

function isRemoved(article) {
  // You can define your conditions here to check if the article is removed
  return !(
    article.title &&
    article.description &&
    article.urlToImage &&
    article.url
  );

}


function displayNews(articles) {
  const newsDiv = document.querySelector('#news');
  newsDiv.innerHTML = ''; // Clear previous articles

  // Create a row to contain the cards
  const row = document.createElement('div');
  row.classList.add('row', 'row-cols-1', 'row-cols-md-3', 'g-4'); // Ensure each row has 1 column on extra small screens, and 3 columns on medium screens

  // Loop through the articles and create cards
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (!isRemoved (article)){
    const card = createCard(article);
    row.appendChild(card);
  }
}

  // Append the row to the newsDiv
  newsDiv.appendChild(row);

  // Add margin between the news and pagination
  newsDiv.style.marginTop = '20px';

  // Add previous and next page buttons
  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('pagination', 'd-flex', 'justify-content-around'); // Updated classes

  //Add margin to Pagination
  paginationDiv.style.marginTop = '40px';

  const prevButton = createButton('Previous', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchNews(currentPage);
    }
  });
  paginationDiv.appendChild(prevButton);

  const nextButton = createButton('Next', () => {
    const totalPages = Math.ceil(articles.length / articlesPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      fetchNews(currentPage);
    }
  });

  // Disable the next button if there are no more articles to display
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  if (currentPage === totalPages) {
    nextButton.disabled = true;
  }

  paginationDiv.appendChild(nextButton);
  newsDiv.appendChild(paginationDiv);
}
  

function createCard(article) {
  const card = document.createElement('div');
  card.classList.add('col');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card', 'h-100');
  
  // Check if the article has an image
  if (article.urlToImage) {
    const image = document.createElement('img');
    image.classList.add('card-img-top');
    image.src = article.urlToImage;
    image.alt = article.title;
    cardBody.appendChild(image);
  }
  const title = document.createElement('h5');
  title.classList.add('card-title');
  title.textContent = article.title;

  const description = document.createElement('p');
  description.classList.add('card-text');
  description.textContent = truncateDescription(article.description); // Truncate the description

  const readMoreLink = document.createElement('a');
  readMoreLink.href = article.url;
  readMoreLink.classList.add('btn', 'btn-primary');
  readMoreLink.textContent = 'Read More';

  cardBody.appendChild(title);
  cardBody.appendChild(description);
  cardBody.appendChild(readMoreLink);

  card.appendChild(cardBody);

  return card;
}

function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.classList.add('btn', 'btn-primary', 'mx-1');
  button.addEventListener('click', onClick);
  return button;
}

function truncateDescription(description) {
  const maxLength = 100; // Maximum length of the description text
  if (description.length > maxLength) {
    return description.slice(0, maxLength) + '...'; // Truncate the description if it exceeds the maximum length
  }
  return description;
}
