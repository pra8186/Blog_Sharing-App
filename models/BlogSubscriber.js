import {model, Schema} from 'mongoose';

const BlogSubscriberSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
    },

    {
        timestamps: true,
    }
);

const BlogSubscriber = model('BlogSubscriber', BlogSubscriberSchema);
export default BlogSubscriber;