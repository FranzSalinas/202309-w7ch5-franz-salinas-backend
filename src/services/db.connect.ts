import mongoose from 'mongoose';
import 'dotenv/config';

export const dbConnect = () => {
  const user = process.env.USER_DB;
  const password = process.env.PASSWORD;
  const connectString = `mongodb+srv://${user}:${password}@cluster0.op2hxxb.mongodb.net/?retryWrites=true&w=majority`;

  return mongoose.connect(connectString);
};
