import {convertDateToUnix, convertToLowerCase, generateRandomString, initializeTrie} from "../utils/HelperFunctions.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import BlogSubscriber from "../models/BlogSubscriber.js";

let trie = null

export const getBlogs = async (req, res, next) => {
    try {
        const currentTime = convertDateToUnix(new Date())
        const blogs = await Blog.find({})
        const filteredBlogs = blogs.filter((blog) => {
            return blog.scheduledTime <= currentTime
        })
        return res.status(200).json({blogs: filteredBlogs})
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const getScheduledBlogs = async (req, res, next) => {
    try {
        const currentTime = convertDateToUnix(new Date())
        const blogs = await Blog.find({})
        const filteredBlogs = blogs.filter((blog) => {
            return blog.scheduledTime > currentTime
        })
        return res.status(200).json({blogs: filteredBlogs})
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const addBlog = async (req, res, next) => {
    try {
        const {
            title,
            content,
            metaTitle,
            metaDesc,
            pic,
            author,
            authorPic,
            tags,
            readMinutes,
            scheduled,
            scheduledTime
        } = req.body

        let blog = new Blog({
            title,
            content,
            metaTitle,
            metaDesc,
            pic,
            author,
            authorPic,
            tags,
            readMinutes,
            scheduled,
            scheduledTime
        })
        await blog.save()

        if (trie !== null) {
            trie.insert(blog.title, blog._id)
        }

        return res.status(200).json({blog})
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const updateBlog = async (req, res, next) => {
    try {
        const {
            id,
            title,
            content,
            metaTitle,
            metaDesc,
            pic,
            author,
            authorPic,
            tags,
            readMinutes,
            scheduled,
            scheduledTime
        } = req.body
        const blog = await Blog.findById(id)

        if (!blog) {
            return res.json({error: "Blog not found!"})
        }

        if (title) blog.title = title
        if (content) blog.content = content
        if (metaTitle) blog.metaTitle = metaTitle
        if (metaDesc) blog.metaDesc = metaDesc
        if (pic) blog.pic = pic
        if (author) blog.author = author
        if (authorPic) blog.authorPic = authorPic
        if (tags) blog.tags = tags
        if (readMinutes) blog.readMinutes = readMinutes
        if (scheduled) blog.scheduled = scheduled
        if (scheduledTime) blog.scheduledTime = scheduledTime

        await blog.save()

        if (trie !== null) {
            trie.insert(blog.title, id)
        }

        return res.status(200).json({blog})
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const deleteBlog = async (req, res, next) => {
    try {
        const {id} = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.json({error: "Blog not found!"});
        }

        if (trie !== null) {
            trie.remove(blog.title, blog._id)
        }

        const result = await Blog.deleteOne({_id: id});
        if (result.deletedCount === 0) {
            return res.json({error: "Blog not found!"});
        }

        return res.status(200).json({message: "Blog deleted successfully"});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const deleteAllBlogs = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        if (username !== 'admin' || password !== 'admin12345') {
            return res.json({error: "Invalid username or password"});
        }

        const deleteResult = await Blog.deleteMany({});
        if (deleteResult.deletedCount === 0) {
            return res.json({message: "No blogs found"});
        }

        return res.status(200).json({message: "All blogs deleted successfully"});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const getBlogById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.json({error: "Blog not found!"});
        }

        return res.status(200).json({blog});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const addBlogSubscriber = async (req, res, next) => {
    try {
        const {email} = req.body
        let subscriber = new BlogSubscriber({email})
        await subscriber.save()
        return res.status(200).json({subscriber})
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const addBlogComment = async (req, res, next) => {
    try {
        const {blogId, comment} = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({error: 'Blog not found'});
        }

        const name = 'user-' + generateRandomString(16)
        const newComment = new Comment({
            name,
            comment,
        })
        await newComment.save()

        blog.comments.push({_id: newComment.id})
        await blog.save()

        return res.status(200).json({comment: newComment});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const getCommentsByBlogId = async (req, res, next) => {
    try {
        const blogId = req.params.blogId

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({error: 'Blog not found'});
        }

        const blogComments = await Blog.findById(blogId).populate('comments')
        return res.status(200).json({comments: blogComments.comments})
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const updateBlogClickCount = async (req, res, next) => {
    try {
        const {id} = req.body
        const blog = await Blog.findById(id)

        if (!blog) {
            return res.json({error: "Blog not found!"})
        }

        blog.allTimeClickCount += 1
        blog.last24hClickCount += 1

        await blog.save()
        return res.status(200).json({blog})
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const resetLast24hClickCounts = async (req, res, next) => {
    try {
        await Blog.updateMany({}, {$set: {last24hClickCount: 0}});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const getAllTimeTrendingBlogs = async (req, res, next) => {
    try {
        const topBlogs = await Blog.find({}).sort({allTimeClickCount: -1}).limit(4)
        return res.status(200).json({blogs: topBlogs})
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const getDailyTrendingBlogs = async (req, res, next) => {
    try {
        const topBlogs = await Blog.find({}).sort({last24hClickCount: -1}).limit(5)
        return res.status(200).json({blogs: topBlogs})
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}

export const getSearchSuggestions = async (req, res, next) => {
    try {
        if (!trie) {
            trie = await initializeTrie()
        }

        const suggestions = trie.recommend(convertToLowerCase(req.params.prefix))

        return res.status(200).json({suggestions: suggestions})
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
}