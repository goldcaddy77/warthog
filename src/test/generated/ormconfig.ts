import {Container} from 'typedi';
import { Database } from '../../';
Container.import([Database]);
const database = Container.get('Database') as Database;

module.exports = database.getBaseConfig();    
