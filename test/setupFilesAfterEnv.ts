import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.load({ path: path.join(__dirname, './.env.test') });
