// Typeorm example: https://github.com/typeorm/typeorm/blob/master/test/functional/spatial/postgres/entity/Post.ts

// import type { Point } from 'geojson';
import { BaseModel, CustomField, Model } from '../../../../../src';

type Longitude = number;
type Latitude = number;
type LatLng = {
  latitude: Latitude;
  longitude: Longitude;
};

type Position = number[];
type Point = {
  type: 'Point';
  coordinates: Position;
};

@Model()
export class User extends BaseModel {
  @CustomField({
    api: { type: 'json', nullable: true },
    db: {
      type: 'geometry',
      spatialFeatureType: 'Point',
      nullable: true,
      transformer: {
        to: (latLng: LatLng) => {
          console.log(`In transformer 'to': ${JSON.stringify(latLng, null, 2)}`);
          if (
            !latLng ||
            typeof latLng.latitude == 'undefined' ||
            typeof latLng.longitude == 'undefined'
          ) {
            return;
          }
          return {
            type: 'Point',
            coordinates: [latLng.latitude, latLng.longitude]
          };
        },
        from: (geoJsonPoint: Point) => {
          console.log(`In transformer 'from': ${JSON.stringify(geoJsonPoint, null, 2)}`);
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
          console.log(`In transformer 'to': ${JSON.stringify(latLng, null, 2)}`);
          if (
            !latLng ||
            typeof latLng.latitude == 'undefined' ||
            typeof latLng.longitude == 'undefined'
          ) {
            return;
          }
          return {
            type: 'Point',
            coordinates: [latLng.latitude, latLng.longitude]
          };
        },
        from: (geoJsonPoint: Point) => {
          console.log(`In transformer 'from': ${JSON.stringify(geoJsonPoint, null, 2)}`);
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

  // Column({
  //   type: 'geometry',
  //   srid: 4326,
  //   nullable: true,
  //   spatialFeatureType: 'Point',
  //   transformer: {
  //     to: (v: Point) => {
  //       console.log(v);
  //       console.log(JSON.stringify(v));
  //       return eval(
  //         `ST_GeomFromGeoJSON('{"type":"Point","coordinates":[39.807222,-76.984722]}')`,
  //       );
  //     },
  //     from: (v: any) => {
  //       return v;
  //     },
  //   },
  // })
  // current_location: string;

  // TypeORM tests
  // https://github.com/typeorm/typeorm/blob/master/test/functional/spatial/postgres/spatial-postgres.ts

  // All wired up
  // https://stackoverflow.com/questions/67435650/storing-geojson-points-and-finding-points-within-a-given-distance-radius-nodej/67557083#67557083
}
