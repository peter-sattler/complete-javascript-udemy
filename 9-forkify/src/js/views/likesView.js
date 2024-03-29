import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikesButton = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    //NOTE: CSS selector gets 'use' child element only!!!
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = nbrOfLikes => {
    elements.likesMenu.style.visibility = nbrOfLikes > 0 ? 'visible' : 'hidden';
};

export const renderLikeMenu = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>`;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const targetElement = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (targetElement)
        targetElement.parentElement.removeChild(targetElement);
};
