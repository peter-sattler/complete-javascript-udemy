export default class Likes {
    constructor() {
        this.likes = [];
    }
    addLike(id, title, author, img) {
        const newLike = { id, title, author, img };
        this.likes.push(newLike);
        this.persistData();             //Persist to local storage
        return newLike;
    }
    removeLike(id) {
        const index = this.likes.findIndex(element => element.id === id);
        this.likes.splice(index, 1);    //Delete one item
        this.persistData();             //Persist to local storage
    }
    isLiked(id) {
        return this.likes.findIndex(element => element.id === id) !== -1;
    }
    getNbrOfLikes() {
        return this.likes.length;
    }
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    restoreData() {
        const likesStorage = JSON.parse(localStorage.getItem('likes'));
        if (likesStorage)
            this.likes = likesStorage;  //Restore from local storage
    }
}