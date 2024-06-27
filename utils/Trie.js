class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.titlesAndIds = [];
    }
}

export class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(title, id) {
        let node = this.root;
        for (let char of title) {
            if ("A" <= char && char <= "Z") char = char.toLowerCase();
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEndOfWord = true;
        node.titlesAndIds.push({title, id});
    }

    remove(title, id) {
        let node = this.root;
        for (let char of title) {
            if ("A" <= char && char <= "Z") char = char.toLowerCase();
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEndOfWord = false;
        node.titlesAndIds.remove({title, id});
    }

    recommend(prefix) {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children.has(char)) {
                return [];
            }
            node = node.children.get(char);
        }
        return this.getAllBlogsFromNode(node, prefix);
    }

    getAllBlogsFromNode(node, prefix) {
        const words = [];
        if (node.isEndOfWord) {
            words.push(...node.titlesAndIds);
        }
        for (const [char, childNode] of node.children) {
            const childWords = this.getAllBlogsFromNode(childNode, prefix + char);
            words.push(...childWords);
        }
        return words;
    }
}