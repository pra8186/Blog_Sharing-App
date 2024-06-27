import {model, Schema} from 'mongoose';

const AdminUserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        resetToken: {
            type: String,
        },
        expireToken: {
            type: String
        }
    }
);

const AdminUser = model('AdminUser', AdminUserSchema);
export default AdminUser;