// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');
import { DecoratorCommonOptions } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

export type Longitude = number;
export type Latitude = number;
export type LatLng = {
  latitude: Latitude;
  longitude: Longitude;
};

export type Position = number[];
export type GeoJsonPoint = {
  type: 'Point';
  coordinates: Position;
};

interface GeoPointOptions extends DecoratorCommonOptions {
  dataType?: 'geometry' | 'geography';
  default?: LatLng;
  // filter?: ???
}

// V3: Deprecate this usage in favor of DateTimeField
export function GeoPoint(options: GeoPointOptions = {}): any {
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};

  const factories = getCombinedDecorator({
    fieldType: 'json', // Should be geo-point
    warthogColumnMeta: options,
    gqlFieldType: GraphQLJSONObject, // Should be LatLng
    dbType: options.dataType || 'geography',
    dbColumnOptions: {
      ...nullableOption,
      ...defaultOption,
      spatialFeatureType: 'Point',
      transformer: {
        to: (latLng: LatLng) => {
          console.log(`In decorator transformer 'to': ${JSON.stringify(latLng, null, 2)}`);
          if (
            !latLng ||
            typeof latLng.latitude == 'undefined' ||
            typeof latLng.longitude == 'undefined'
          ) {
            return null;
          }
          return {
            type: 'Point',
            coordinates: [latLng.latitude, latLng.longitude]
          };
        },
        from: (geoJsonPoint: GeoJsonPoint) => {
          console.log(`In decorator transformer 'from': ${JSON.stringify(geoJsonPoint, null, 2)}`);
          if (!geoJsonPoint || !geoJsonPoint.coordinates) {
            return null;
          }
          return {
            latitude: geoJsonPoint.coordinates[0],
            longitude: geoJsonPoint.coordinates[1]
          } as LatLng;
        }
      }
    }
  });

  return composeMethodDecorators(...factories);
}
