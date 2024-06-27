import {model, Schema} from 'mongoose';

const CommentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true
        }
    },

    {
        timestamps: true,
    }
);

const Comment = model('Comment', CommentSchema);
export default Comment;