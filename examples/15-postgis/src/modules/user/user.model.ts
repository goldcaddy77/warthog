// Typeorm example: https://github.com/typeorm/typeorm/blob/master/test/functional/spatial/postgres/entity/Post.ts

// import type { Point } from 'geojson';
import { BaseModel, CustomField, GeoJsonPoint, GeoPoint, LatLng, Model } from '../../../../../src';

@Model()
export class User extends BaseModel {
  @GeoPoint({ dataType: 'geometry', nullable: true })
  geometryPoint?: LatLng;

  @GeoPoint({ nullable: true }) // Defaults to 'geography'
  geographyPoint?: LatLng;

  @CustomField({
    api: { type: 'json', nullable: true },
    db: {
      type: 'geometry',
      spatialFeatureType: 'Point',
      nullable: true,
      transformer: {
        to: (latLng: LatLng) => {
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
  })
  customGeometryPoint?: LatLng;

  @CustomField({
    api: { type: 'json', nullable: true },
    db: {
      type: 'geography',
      spatialFeatureType: 'Point',
      nullable: true,
      transformer: {
        to: (latLng: LatLng) => {
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
  })
  customGeographyPoint?: LatLng;

  // @Column("blob", {
  //   transformer: {
  //     to: (v: Point) => eval(`ST_GeomFromGeoJSON(${JSON.stringify(v)})`),
  //     from: (v: any) => { return {type: "Point", coordinates: [ v.x, v.y ] } as Point }
  //   }
  // })
  // location: Point;

  // import { Point } from 'geojson';
  // ...

  // @Column("blob", {
  //   transformer: {
  //     to: (v: Point) => {
  //       return function () { return `ST_GeomFromGeoJSON(${JSON.stringify(v)})` }
  //     }
  //   }
  // })
  // location: Point;

  ///////////

  //   .orderBy({"place.location": {
  //     distance: {
  //       type: "Point",
  //       coordinates: [lon, lat]
  //     },
  //     order: 'ASC',
  //     nulls: 'NULLS LAST'
  // }})
  // As @mojodna also said elsewhere, this should work also:

  // .orderBy("ST_Distance(post.geom, ST_GeomFromGeoJSON(:origin))", "DESC")
  // .setParameters({ origin: JSON.stringify(origin) })

  // TypeORM tests
  // https://github.com/typeorm/typeorm/blob/master/test/functional/spatial/postgres/spatial-postgres.ts

  // All wired up
  // https://stackoverflow.com/questions/67435650/storing-geojson-points-and-finding-points-within-a-given-distance-radius-nodej/67557083#67557083
}
