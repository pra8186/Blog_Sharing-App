import mongoose, {model, Schema} from 'mongoose';
import {convertDateToUnix} from "../utils/HelperFunctions.js";

const BlogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        metaTitle: {
            type: String,
            required: true,
        },
        metaDesc: {
            type: String,
            required: true,
        },
        pic: {
            type: String,
            required: true,
            default:
                'https://www.hindustantimes.com/ht-img/img/2023/04/10/550x309/Why-do-doctors-oppose-such-Acts--Why-would-they-no_1681127776786.jpg',
        },
        author: {
            type: String,
            required: true
        },
        authorPic: {
            type: String,
            required: true,
            default: 'https://i.stack.imgur.com/l60Hf.png'
        },
        tags: {
            type: Array,
            required: true,
        },
        readMinutes: {
            type: Number,
            required: true,
            default: 0
        },
        scheduled: {
            type: Boolean,
            default: false
        },
        scheduledTime: {
            type: Number,
            default: function () {
                return convertDateToUnix(this.createdAt)
            }
        },
        last24hClickCount: {
            type: Number,
            default: 0,
        },
        allTimeClickCount: {
            type: Number,
            default: 0,
        },
        comments: [{
            type: mongoose.Types.ObjectId,
            ref: 'Comment',
            required: true
        }],
    },

    {
        timestamps: true,
    }
);

const Blog = model('Blog', BlogSchema);
export default Blog;