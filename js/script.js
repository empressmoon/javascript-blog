'use strict';

  const opts = {
    tagSizes: {
      count: 5,
      classPrefix: 'tag-size-',
    },
  };

  const select = {
    all: {
      articles: '.post',
      titles: '.post-title',
      linksTo: {
        tags: 'a[href^="#tag-"]',
        authors: 'a[href^="#author-"]',
      },
    },
    article: {
      tags: '.post-tags .list',
      author: '.post-author',
    },
    listOf: {
      titles: '.titles',
      tags: '.tags.list',
      authors: '.authors.list',
    },
  };

// SHOW ARTICLE OF THE CLICKED LINK -------------------------------------------------------------------

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');

  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);

  targetArticle.classList.add('active');
}

// GENERATE TITLE LINKS IN LEFT COLUMN-----------------------------------------------------------------

function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(select.listOf.titles);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(select.all.articles + customSelector);
  let html = '';

  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(select.all.titles).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }

  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

// TAG CLOUD ------------------------------------------------------------------------------------------

function calculateTagsParams(tags){
  const params = {
    max: 0,
    min: 99999,
  };
  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min,
    normalizedMax = params.max  - params.min,
    percentage = normalizedCount / normalizedMax,
    classNumber = Math.floor( percentage * (opts.tagSizes.count - 1) + 1 );

  return opts.tagSizes.classPrefix + classNumber;
}

// GENERATE TAGS --------------------------------------------------------------------------------------

function generateTags(){
  let allTags = {};
  const articles = document.querySelectorAll(select.all.articles);

  for(let article of articles){
    const tagWrapper = article.querySelector(select.article.tags);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');

    for(let tag of articleTagsArray){
      const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      html = html + linkHTML;
      if(!allTags.hasOwnProperty(tag)){
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagWrapper.innerHTML = html;
  }

  const tagList = document.querySelector(select.listOf.tags),
    tagsParams = calculateTagsParams(allTags);

  let allTagsHTML = '';

  for(let tag in allTags){
    const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '"><span>' + tag + '</span></a></li>';
    allTagsHTML += tagLinkHTML;
  }
  tagList.innerHTML = allTagsHTML;
}

function tagClickHandler(event){
  event.preventDefault();

  const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    tag = href.replace('#tag-', ''),
    activeTagLinks = document.querySelectorAll('a[href^="#tag-"]');

  for(let activeTagLink of activeTagLinks){
    activeTagLink.classList.remove('.active');
  }

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  for(let tagLink of tagLinks){
    tagLink.classList.add('.active');
  }
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  const tagLinks = document.querySelectorAll(select.all.linksTo.tags)

  for(let tagLink of tagLinks){
    tagLink.addEventListener('click', tagClickHandler);
  }
}

// GENERATE AUTHORS -----------------------------------------------------------------------------------

function generateAuthors(){
  let allAuthors = {};
  const articles = document.querySelectorAll(select.all.articles);

  for(let article of articles){
    const authorWrapper = article.querySelector(select.article.author);
    let html = '';
    const articleAuthor = article.getAttribute('data-author');
    const linkHTML = 'by ' + '<a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a>';

      html = html + linkHTML;

      if(!allAuthors.hasOwnProperty(articleAuthor)){
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

    authorWrapper.innerHTML = html;
  }

  const authorList = document.querySelector(select.listOf.authors);
  let allAuthorsHTML = '';

  for(let author in allAuthors){
    const authorLinkHTML = '<li><a href="#author-' + author + '"><span>' + author + '</span></a> ' + '(' + allAuthors[author] + ')' + '</span></li>';
    allAuthorsHTML += authorLinkHTML;
  }

  authorList.innerHTML = allAuthorsHTML
}

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    author = href.replace('#author-', ''),
    activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  for(let activeAuthorLink of activeAuthorLinks){
    activeAuthorLink.classList.remove('.active');
  }

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  for(let authorLink of authorLinks){
    authorLink.classList.add('.active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  const authorLinks = document.querySelectorAll(select.all.linksTo.authors)

  for(let authorLink of authorLinks){
    authorLink.addEventListener('click', authorClickHandler);
  }
}

generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();
