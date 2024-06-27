import {Trie} from "./Trie.js";
import Blog from "../models/Blog.js";

export function convertDateToUnix (date) {
    return Math.round(date.getTime() / 1000)
}

export const initializeTrie = async () => {
    const trie = new Trie()
    const blogs = await Blog.find({});
    for (let i = 0; i < blogs.length; i++) {
        trie.insert(blogs[i].title, blogs[i]._id);
    }
    return trie;
}

export function convertToLowerCase (text) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char >= "A" && char <= "Z") {
            result += char.toLowerCase();
        } else {
            result += char;
        }
    }
    return result;
}

export function generateRandomString (length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}