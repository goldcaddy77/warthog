// Hasura operators: https://hasura.io/blog/native-support-for-postgis-topology-operators-now-in-graphql-engine/
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
    api: { type: 'json', nullable: true, sort: false, filter: false },
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
    api: { type: 'json', nullable: true, sort: false, filter: false },
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

  ///////////
  //   .orderBy({"place.location": {
  //     distance: {
  //       type: "Point",
  //       coordinates: [lon, lat]
  //     },
  //     order: 'ASC',
  //     nulls: 'NULLS LAST'
  // }})
  ///////////
  //   const posts1 = await connection.manager
  //   .createQueryBuilder(Post, "post")
  //   .where("ST_Distance(post.geom, ST_GeomFromGeoJSON(:origin)) > 0")
  //   .orderBy({
  //       "ST_Distance(post.geom, ST_GeomFromGeoJSON(:origin))": {
  //           order: "ASC",
  //           nulls: "NULLS FIRST"
  //       }
  //   })
  //   .setParameters({ origin: JSON.stringify(origin) })
  //   .getMany();

  // const posts2 = await connection.manager
  //   .createQueryBuilder(Post, "post")
  //   .orderBy("ST_Distance(post.geom, ST_GeomFromGeoJSON(:origin))", "DESC")
  //   .setParameters({ origin: JSON.stringify(origin) })
  //   .getMany();
  ///////////

  // TypeORM tests
  // https://github.com/typeorm/typeorm/blob/master/test/functional/spatial/postgres/spatial-postgres.ts

  // All wired up
  // https://stackoverflow.com/questions/67435650/storing-geojson-points-and-finding-points-within-a-given-distance-radius-nodej/67557083#67557083
}
