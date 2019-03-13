'use strict';

// SHOW ARTICLE OF THE CLICKED LINK

function titleClickHandler(event){
  /* prevent default action for this event */

  event.preventDefault();

  const clickedElement = this;
  //console.log('Link was clicked!');

  /* remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */

  //console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /*  get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  //console.log(articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  //onsole.log(targetArticle);

  /* add class 'active' to the correct article */

  //console.log('Active article:', targetArticle);
  targetArticle.classList.add('active');
}


// GENERATE TITLE LINKS IN LEFT COLUMN

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors.list';


function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);

  titleList.innerHTML = '';

  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  //console.log(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles){

    /* get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element and get the title from the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */

    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    //console.log(linkHTML);-+

    /* insert link into titleList */

    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  //Event

  const links = document.querySelectorAll('.titles a');
  //console.log(links);

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

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

      //console.log(tag + ' is used ' + tags[tag] + ' times');
  }

  return params;
}

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;

  const normalizedMax = params.max  - params.min;

  const percentage = normalizedCount / normalizedMax;

  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

  return optCloudClassPrefix + classNumber;

}


// GENERATE TAGS --------------------------------------------------------------------------------------

function generateTags(){

  /* [NEW] create a new variable allTags with an empty object */

  let allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */

  for(let article of articles){

    /* find tags wrapper */

    const tagWrapper = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

     const articleTags = article.getAttribute('data-tags');
     //console.log(articleTags);

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */

    for(let tag of articleTagsArray){
      //console.log(tag);

      /* generate HTML of the link */

      const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      //console.log(linkHTML);

      /* add generated code to html variable */

      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */

      if(!allTags.hasOwnProperty(tag)){

        /* [NEW] add tag to allTags object */

        allTags[tag] = 1;
      } else {
        allTags[tag]++;
    }

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */

    tagWrapper.innerHTML = html;

  /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */

  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] create variable for all links HTML code */

  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams:', tagsParams);

  let allTagsHTML = '';

  /* [NEW] START LOOP for each tag in allTags: */

  for(let tag in allTags){

    //const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a><span> ' + '(' + allTags[tag] + ')' + '</span></li>';
    const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '"><span>' + tag + '</span></a></li>';
    //console.log('tagLinkHTML:', tagLinkHTML);

    //console.log(linkHTML);

    /* [NEW] generate code of a link and add it to allTagsHTML */

    //allTagsHTML += tag + ' (' + allTags[tag] + ') ';
    allTagsHTML += tagLinkHTML;

    /* [NEW] END LOOP: for each tag in allTags: */
  }

  /* [NEW] add html from allTagsHTML to tag */

  tagList.innerHTML = allTagsHTML;

}

generateTags();


function tagClickHandler(event){
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;
  //console.log('tag was clicked!');

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  //console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');
  //console.log(tag);

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a[href^="#tag-"]');
 //console.log(activeTagLinks);

  /* START LOOP: for each active tag link */

  for(let activeTagLink of activeTagLinks){

    /* remove class active */

    activeTagLink.classList.remove('.active');
    //console.log(activeTagLink);

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  //console.log(tagLinks);

  /* START LOOP: for each found tag link */

  for(let tagLink of tagLinks){

    /* add class active */

    tagLink.classList.add('.active');
    //console.log(tagLink);

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');

}


function addClickListenersToTags(){
  /* find all links to tags */

  const tagLinks = document.querySelectorAll('a[href^="#tag-"]')

  /* START LOOP: for each link */

  for(let tagLink of tagLinks){

    /* add tagClickHandler as event listener for that link */

    tagLink.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();


// GENERATE AUTHORS -----------------------------------------------------------------------------------

function generateAuthors(){
  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */

  for(let article of articles){

    /* find author wrapper */

    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    /* make html variable with empty string */

    let html = '';

    /* get author name from data-tags attribute */

     const articleAuthor = article.getAttribute('data-author');
     //console.log(articleAuthor);


      /* generate HTML of the link */

      const linkHTML = 'by ' + '<a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a>';
      //console.log(linkHTML);

      /* add generated code to html variable */

      html = html + linkHTML;

    /* insert HTML of all the links into the tags wrapper */

    authorWrapper.innerHTML = html;

  /* END LOOP: for every article: */
  }
}

generateAuthors();


function authorClickHandler(event){
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;
  //console.log('author was clicked!');

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  //console.log(href);

  /* make a new constant "author" and extract author name from the "href" constant */

  const author = href.replace('#author-', '');
  //console.log(author);

  /* find all author links with class active */

  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  //console.log(activeAuthorLinks);

  /* START LOOP: for each active author link */

  for(let activeAuthorLink of activeAuthorLinks){

    /* remove class active */

    activeAuthorLink.classList.remove('.active');
    //console.log(activeTagLink);

  /* END LOOP: for each active tag link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  //console.log(authorLinks);

  /* START LOOP: for each found author link */

  for(let authorLink of authorLinks){

    /* add class active */

    authorLink.classList.add('.active');
    //console.log(tagLink);

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-author="' + author + '"]');

}


function addClickListenersToAuthors(){
  /* find all links to authors */

  const authorLinks = document.querySelectorAll('a[href^="#author-"]')

  /* START LOOP: for each link */

  for(let authorLink of authorLinks){

    /* add authorClickHandler as event listener for that link */

    authorLink.addEventListener('click', authorClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
