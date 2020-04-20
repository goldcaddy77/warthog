import 'reflect-metadata';

import { Container } from 'typedi';
import { useContainer as typeOrmUseContainer } from 'typeorm';

import { Config } from '../';
import { setTestServerEnvironmentVariables } from '../test/server-vars';

typeOrmUseContainer(Container);

setTestServerEnvironmentVariables();
new Config({ container: Container });

// console.log('config', config.get());
