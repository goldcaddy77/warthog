/* eslint-disable no-console */

import 'reflect-metadata';
import { getBindingError, logger } from '../../../src';
import { Binding } from '../generated/binding';
import { getServer } from './server';

const server = getServer({}, { logging: false });
let binding: Binding;
let key;

beforeAll(async done => {
  await server.start();
  try {
    binding = ((await server.getBinding()) as unknown) as Binding; // TODO: clean this up
  } catch (error) {
    console.error(error);
  }

  key = new Date().getTime();

  done();
});

afterAll(async done => {
  await server.stop();
  done();
});

describe('Users', () => {
  test('Sets customGeographyPoint', async done => {
    let user = null;
    const geoPoint = {
      latitude: 100,
      longitude: 0
    };

    try {
      user = await binding.mutation.createUser(
        {
          data: {
            customGeographyPoint: geoPoint
          }
        },
        `{ id customGeographyPoint }`
      );
    } catch (err) {
      const error = getBindingError(err);
      logger.logObject(error);
      throw error;
    }

    expect(user.customGeographyPoint).toEqual(geoPoint);

    user = await binding.query.user({ where: { id: user?.id } });
    // TODO: we should pass these numbers as strings so that precision is not lost in javascript
    // expect(typeof user.customGeographyPoint?.latitude).toEqual('string');
    expect(user.customGeographyPoint).toEqual(geoPoint);

    done();
  });
  test('Sets customGeometryPoint', async done => {
    let user = null;
    const geoPoint = {
      latitude: 100,
      longitude: 0
    };

    try {
      user = await binding.mutation.createUser(
        {
          data: {
            customGeometryPoint: geoPoint
          }
        },
        `{ id customGeometryPoint }`
      );
    } catch (err) {
      const error = getBindingError(err);
      logger.logObject(error);
      throw error;
    }

    expect(user.customGeometryPoint).toEqual(geoPoint);

    user = await binding.query.user({ where: { id: user?.id } });
    // TODO: we should pass these numbers as strings so that precision is not lost in javascript
    // expect(typeof user.customGeometryPoint?.latitude).toEqual('string');
    expect(user.customGeometryPoint).toEqual(geoPoint);

    done();
  });

  test('Sets geographyPoint', async done => {
    let user = null;
    const geoPoint = {
      latitude: 100,
      longitude: 0
    };

    try {
      user = await binding.mutation.createUser(
        {
          data: {
            geographyPoint: geoPoint
          }
        },
        `{ id geographyPoint }`
      );
    } catch (err) {
      const error = getBindingError(err);
      logger.logObject(error);
      throw error;
    }

    expect(user.geographyPoint).toEqual(geoPoint);

    user = await binding.query.user({ where: { id: user?.id } });
    // TODO: we should pass these numbers as strings so that precision is not lost in javascript
    // expect(typeof user.geographyPoint?.latitude).toEqual('string');
    expect(user.geographyPoint).toEqual(geoPoint);

    done();
  });

  test('Sets geometryPoint', async done => {
    let user = null;
    const geoPoint = {
      latitude: 100,
      longitude: 0
    };

    try {
      user = await binding.mutation.createUser(
        {
          data: {
            geometryPoint: geoPoint
          }
        },
        `{ id geometryPoint }`
      );
    } catch (err) {
      const error = getBindingError(err);
      logger.logObject(error);
      throw error;
    }

    expect(user.geometryPoint).toEqual(geoPoint);

    user = await binding.query.user({ where: { id: user?.id } });
    // TODO: we should pass these numbers as strings so that precision is not lost in javascript
    // expect(typeof user.geometryPoint?.latitude).toEqual('string');
    expect(user.geometryPoint).toEqual(geoPoint);

    done();
  });
});

/* eslint-enable no-console */
