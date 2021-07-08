import { DecoratorCommonOptions } from '../metadata';
import { LatLng, LatLngInput } from '../tgql';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

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
    fieldType: 'lat-lng',
    warthogColumnMeta: options,
    gqlFieldType: LatLng,
    dbType: options.dataType || 'geography',
    dbColumnOptions: {
      ...nullableOption,
      ...defaultOption,
      spatialFeatureType: 'Point',
      transformer: {
        to: (latLng: LatLngInput) => {
          // console.log(`In decorator transformer 'to': ${JSON.stringify(latLng, null, 2)}`);
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
          // console.log(`In decorator transformer 'from': ${JSON.stringify(geoJsonPoint, null, 2)}`);
          if (!geoJsonPoint || !geoJsonPoint.coordinates) {
            return null;
          }
          return {
            latitude: geoJsonPoint.coordinates[0],
            longitude: geoJsonPoint.coordinates[1]
          } as LatLngInput;
        }
      }
    }
  });

  return composeMethodDecorators(...factories);
}
