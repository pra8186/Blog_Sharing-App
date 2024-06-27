import express from "express";
import {
    addBlog, addBlogComment,
    addBlogSubscriber,
    deleteAllBlogs,
    deleteBlog, getAllTimeTrendingBlogs,
    getBlogById,
    getBlogs, getCommentsByBlogId, getDailyTrendingBlogs,
    getScheduledBlogs, getSearchSuggestions,
    updateBlog, updateBlogClickCount
} from "../controllers/BlogController.js";

const blogRouter = express.Router()

blogRouter.get('/getBlogs', getBlogs)
blogRouter.get('/getScheduledBlogs', getScheduledBlogs)
blogRouter.post('/addBlog', addBlog)
blogRouter.put('/updateBlog', updateBlog)
blogRouter.delete('/deleteBlog/:id', deleteBlog)
blogRouter.get('/getBlog/:id', getBlogById)
blogRouter.post('/addBlogSubscriber', addBlogSubscriber)
blogRouter.post('/addBlogComment', addBlogComment)
blogRouter.get('/getBlogComments/:blogId', getCommentsByBlogId)
blogRouter.post('/updateBlogClickCount', updateBlogClickCount)
blogRouter.get('/getAllTimeTrendingBlogs', getAllTimeTrendingBlogs)
blogRouter.get('/getDailyTrendingBlogs', getDailyTrendingBlogs)
blogRouter.get('/getSearchSuggestions/:prefix', getSearchSuggestions)
blogRouter.post('/deleteAllBlogs', deleteAllBlogs)

export default blogRouter