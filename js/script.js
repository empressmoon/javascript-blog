'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  allAuthorsLinks: Handlebars.compile(document.querySelector('#template-all-authors-link').innerHTML),
}

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
  const clickedElement = this,
    activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');

  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href'),
    targetArticle = document.querySelector(articleSelector);

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
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
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
    const tagWrapper = article.querySelector(select.article.tags),
      articleTags = article.getAttribute('data-tags'),
      articleTagsArray = articleTags.split(' ');
    let html = '';

    for(let tag of articleTagsArray){
      const linkHTMLData = {id: tag, tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);

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

  const allTagsData = {tags: []};

  for(let tag in allTags){
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

function tagClickHandler(event){
  event.preventDefault();

  const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    tag = href.replace('#tag-', ''),
    activeTagLinks = document.querySelectorAll(select.all.linksTo.tags);

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
    const authorWrapper = article.querySelector(select.article.author),
      articleAuthor = article.getAttribute('data-author'),
      linkHTMLData = {id: articleAuthor, name: articleAuthor},
      linkHTML = templates.authorLink(linkHTMLData);

    let html = '';

    html = html + linkHTML;

    if(!allAuthors.hasOwnProperty(articleAuthor)){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    authorWrapper.innerHTML = html;
  }

  const authorList = document.querySelector(select.listOf.authors),
    allAuthorsData = {authors: []};

  for(let author in allAuthors){
    allAuthorsData.authors.push({
      name: author,
      count: allAuthors[author],
    })
  }

  authorList.innerHTML = templates.allAuthorsLinks(allAuthorsData);
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
