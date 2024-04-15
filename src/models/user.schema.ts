import mongoose from 'mongoose';
import { IUser } from '~/interface/models';

const User = new mongoose.Schema({
     id: {
          type: String,
          required: true,
     },

     name: {
          type: String,
          required: false,
     },

     age: {
          type: Number,
          required: false,
     },

     adress: {
          type: String,
          required: String,
     },

     is_deleted: {
          type: Boolean,
          required: false,
          default: false,
     },
});

const Users = mongoose.model<IUser>('Users', User);
export default Users;
