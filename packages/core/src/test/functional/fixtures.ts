// import * as Faker from 'faker';

// import * as fs from 'fs';

// const results = [];

// for (let index = 0; index < 100; index++) {
//   const random = new Date()
//     .getTime()
//     .toString()
//     .substring(8, 13);

//   const lorem = Faker.lorem.words(2);
//   const name = Faker.name.firstName();
//   const last = Faker.name.lastName();
//   const string = Faker.random.arrayElement([
//     lorem,
//     lorem.toUpperCase(),
//     lorem.toLowerCase(),
//     name,
//     name.toUpperCase(),
//     name.toLowerCase(),
//     last,
//     last.toUpperCase(),
//     last.toLowerCase()
//   ]);

//   results.push({
//     dateField: Faker.date.between('2000-01-01', '2020-01-01').toISOString(),
//     stringField: string,
//     emailField: `${Faker.lorem.word()}-${random}@${Faker.lorem.word()}.com`,
//     integerField: Faker.random.number({ min: -100, max: 100 }),
//     booleanField: Faker.random.arrayElement([true, false]),
//     floatField: parseFloat(Faker.random.number({ min: -2, max: 2, precision: 0.0001 }).toFixed(4))
//   });
// }

// fs.writeFileSync('./sinks.json', JSON.stringify(results, undefined, 2));

export const KITCHEN_SINKS = [
  {
    dateField: '2000-03-26T19:39:08.597Z',
    stringField: 'Trantow',
    emailField: 'consequuntur-94489@a.com',
    integerField: 41,
    booleanField: false,
    floatField: -1.3885
  },
  {
    dateField: '2018-06-09T17:19:07.764Z',
    stringField: 'BOSCO',
    emailField: 'consequuntur-94490@odit.com',
    integerField: -77,
    booleanField: false,
    floatField: 1.2352
  },
  {
    dateField: '2010-06-15T02:46:13.288Z',
    stringField: 'SCHOEN',
    emailField: 'deleniti-94490@voluptate.com',
    integerField: 59,
    booleanField: false,
    floatField: -1.6309
  },
  {
    dateField: '2015-09-20T05:30:11.138Z',
    stringField: 'VOLUPTATUM NULLA',
    emailField: 'vitae-94490@dolore.com',
    integerField: -70,
    booleanField: false,
    floatField: -1.9273
  },
  {
    dateField: '2007-11-02T14:52:54.467Z',
    stringField: 'Wisoky',
    emailField: 'illum-94490@et.com',
    integerField: 60,
    booleanField: false,
    floatField: 0.0425
  },
  {
    dateField: '2019-11-07T04:11:01.926Z',
    stringField: 'SCHINNER',
    emailField: 'nihil-94490@laboriosam.com',
    integerField: 72,
    booleanField: true,
    floatField: 1.9199
  },
  {
    dateField: '2006-12-02T23:23:07.874Z',
    stringField: 'maximillia',
    emailField: 'voluptas-94490@dolores.com',
    integerField: -73,
    booleanField: false,
    floatField: 0.6969
  },
  {
    dateField: '2013-07-23T13:06:48.326Z',
    stringField: 'koelpin',
    emailField: 'facere-94490@eius.com',
    integerField: -10,
    booleanField: false,
    floatField: 0.4273
  },
  {
    dateField: '2000-01-12T09:14:05.317Z',
    stringField: 'DELENITI SUNT',
    emailField: 'voluptatem-94490@quisquam.com',
    integerField: 60,
    booleanField: false,
    floatField: 1.9735
  },
  {
    dateField: '2013-04-12T16:21:23.172Z',
    stringField: 'inventore velit',
    emailField: 'unde-94490@quis.com',
    integerField: 60,
    booleanField: true,
    floatField: -1.7707
  },
  {
    dateField: '2007-12-19T04:35:25.042Z',
    stringField: 'QUAM CULPA',
    emailField: 'porro-94490@voluptatem.com',
    integerField: -28,
    booleanField: true,
    floatField: 0.7448
  },
  {
    dateField: '2019-05-03T15:48:00.387Z',
    stringField: 'SCHIMMEL',
    emailField: 'at-94490@culpa.com',
    integerField: -40,
    booleanField: true,
    floatField: 0.3528
  },
  {
    dateField: '2010-08-26T05:32:14.613Z',
    stringField: 'Madeline',
    emailField: 'nulla-94490@quia.com',
    integerField: -88,
    booleanField: true,
    floatField: 1.9475
  },
  {
    dateField: '2008-06-23T01:50:57.367Z',
    stringField: 'NAKIA',
    emailField: 'maiores-94490@quia.com',
    integerField: 20,
    booleanField: true,
    floatField: 0.3992
  },
  {
    dateField: '2009-06-05T09:17:38.251Z',
    stringField: 'nakia',
    emailField: 'illum-94490@odit.com',
    integerField: 36,
    booleanField: false,
    floatField: 1.0651
  },
  {
    dateField: '2013-03-07T16:28:03.213Z',
    stringField: 'Nakia',
    emailField: 'fugit-94490@doloremque.com',
    integerField: 37,
    booleanField: false,
    floatField: -1.4664
  },
  {
    dateField: '2010-03-21T16:34:30.420Z',
    stringField: 'sed praesentium',
    emailField: 'illo-94490@aut.com',
    integerField: -18,
    booleanField: false,
    floatField: -1.9525
  },
  {
    dateField: '2019-03-15T10:02:32.875Z',
    stringField: 'LUEILWITZ',
    emailField: 'ipsa-94490@animi.com',
    integerField: -34,
    booleanField: true,
    floatField: 1.7865
  },
  {
    dateField: '2002-04-13T06:42:01.063Z',
    stringField: 'BERENICE',
    emailField: 'sapiente-94490@quia.com',
    integerField: 72,
    booleanField: true,
    floatField: -0.1031
  },
  {
    dateField: '2015-11-13T18:10:22.996Z',
    stringField: 'amber',
    emailField: 'ducimus-94490@occaecati.com',
    integerField: -38,
    booleanField: true,
    floatField: 0.9494
  },
  {
    dateField: '2003-10-28T14:00:51.027Z',
    stringField: 'JEROMY',
    emailField: 'sit-94490@facilis.com',
    integerField: -85,
    booleanField: true,
    floatField: -0.6478
  },
  {
    dateField: '2017-07-08T05:55:21.859Z',
    stringField: 'RYLEIGH',
    emailField: 'qui-94490@exercitationem.com',
    integerField: -77,
    booleanField: true,
    floatField: 1.4488
  },
  {
    dateField: '2004-03-05T21:41:32.408Z',
    stringField: 'delfinaz',
    emailField: 'et-94490@in.com',
    integerField: 21,
    booleanField: true,
    floatField: -1.1396
  },
  {
    dateField: '2016-02-16T00:51:08.515Z',
    stringField: 'SHEMAR',
    emailField: 'officia-94490@officia.com',
    integerField: -64,
    booleanField: false,
    floatField: -1.869
  },
  {
    dateField: '2015-11-16T20:13:42.749Z',
    stringField: 'Wilmer',
    emailField: 'eligendi-94490@mollitia.com',
    integerField: 1,
    booleanField: true,
    floatField: 1.4152
  },
  {
    dateField: '2001-12-22T04:20:50.000Z',
    stringField: 'stark',
    emailField: 'qui-94490@placeat.com',
    integerField: 93,
    booleanField: false,
    floatField: -1.076
  },
  {
    dateField: '2000-10-24T14:17:23.329Z',
    stringField: 'elda',
    emailField: 'nostrum-94490@ex.com',
    integerField: 31,
    booleanField: true,
    floatField: -0.771
  },
  {
    dateField: '2011-07-27T20:53:06.011Z',
    stringField: 'Damien',
    emailField: 'consectetur-94490@maiores.com',
    integerField: 14,
    booleanField: true,
    floatField: 0.2581
  },
  {
    dateField: '2012-06-19T19:25:51.258Z',
    stringField: 'earum nesciunt',
    emailField: 'rerum-94490@voluptatem.com',
    integerField: 38,
    booleanField: false,
    floatField: 0.6917
  },
  {
    dateField: '2007-01-23T16:37:38.001Z',
    stringField: 'illum atque',
    emailField: 'nemo-94490@quis.com',
    integerField: 80,
    booleanField: false,
    floatField: -0.7094
  },
  {
    dateField: '2009-10-01T13:30:44.281Z',
    stringField: 'horowitz',
    emailField: 'ab-94490@expedita.com',
    integerField: -7,
    booleanField: false,
    floatField: -0.4361
  },
  {
    dateField: '2013-06-11T14:11:47.706Z',
    stringField: 'schowalter',
    emailField: 'autem-94490@ea.com',
    integerField: -55,
    booleanField: false,
    floatField: -1.1803
  },
  {
    dateField: '2002-03-26T22:04:29.419Z',
    stringField: 'MAIORES ADIPISCI',
    emailField: 'aperiam-94490@consequatur.com',
    integerField: 19,
    booleanField: false,
    floatField: -0.2365
  },
  {
    dateField: '2002-12-07T20:12:25.832Z',
    stringField: 'devin',
    emailField: 'officiis-94490@repellat.com',
    integerField: -30,
    booleanField: false,
    floatField: 1.1463
  },
  {
    dateField: '2015-06-06T19:51:16.479Z',
    stringField: 'VELIT ADIPISCI',
    emailField: 'repellat-94490@qui.com',
    integerField: 47,
    booleanField: true,
    floatField: 0.6576
  },
  {
    dateField: '2002-03-22T12:13:38.674Z',
    stringField: 'AMET QUI',
    emailField: 'sint-94490@quia.com',
    integerField: -87,
    booleanField: false,
    floatField: -1.1504
  },
  {
    dateField: '2012-11-07T20:20:21.500Z',
    stringField: 'maiores praesentium',
    emailField: 'et-94490@velit.com',
    integerField: -83,
    booleanField: false,
    floatField: 0.7952
  },
  {
    dateField: '2006-06-24T23:17:19.558Z',
    stringField: 'rerum et',
    emailField: 'laudantium-94490@illo.com',
    integerField: 50,
    booleanField: true,
    floatField: 1.7105
  },
  {
    dateField: '2003-06-16T03:09:06.824Z',
    stringField: 'erling',
    emailField: 'non-94490@corrupti.com',
    integerField: -73,
    booleanField: false,
    floatField: 1.5513
  },
  {
    dateField: '2019-01-25T19:47:42.092Z',
    stringField: 'KAELYN',
    emailField: 'vero-94490@qui.com',
    integerField: 24,
    booleanField: true,
    floatField: -0.4497
  },
  {
    dateField: '2019-08-01T03:49:51.824Z',
    stringField: 'alias sint',
    emailField: 'modi-94490@animi.com',
    integerField: 62,
    booleanField: true,
    floatField: 1.5469
  },
  {
    dateField: '2009-01-09T09:22:12.609Z',
    stringField: 'molestiae praesentium',
    emailField: 'error-94490@eveniet.com',
    integerField: -22,
    booleanField: false,
    floatField: -1.5727
  },
  {
    dateField: '2003-05-03T23:37:31.552Z',
    stringField: 'Okuneva',
    emailField: 'sed-94490@dolores.com',
    integerField: -93,
    booleanField: false,
    floatField: 0.1316
  },
  {
    dateField: '2013-01-05T06:08:23.118Z',
    stringField: 'hartmann',
    emailField: 'non-94490@perspiciatis.com',
    integerField: -39,
    booleanField: true,
    floatField: 0.4536
  },
  {
    dateField: '2006-12-21T16:26:17.369Z',
    stringField: 'raquel',
    emailField: 'necessitatibus-94490@quia.com',
    integerField: -35,
    booleanField: false,
    floatField: -0.3465
  },
  {
    dateField: '2008-02-09T14:54:40.128Z',
    stringField: 'quas fugit',
    emailField: 'a-94490@a.com',
    integerField: -66,
    booleanField: true,
    floatField: -1.8619
  },
  {
    dateField: '2006-02-27T00:18:17.121Z',
    stringField: 'ODIO ID',
    emailField: 'totam-94490@rem.com',
    integerField: -90,
    booleanField: true,
    floatField: 1.827
  },
  {
    dateField: '2001-02-07T13:01:49.310Z',
    stringField: 'iste in',
    emailField: 'et-94491@sed.com',
    integerField: -24,
    booleanField: false,
    floatField: -0.5139
  },
  {
    dateField: '2012-05-08T03:31:01.786Z',
    stringField: 'quia et',
    emailField: 'inventore-94491@quos.com',
    integerField: 60,
    booleanField: true,
    floatField: -0.8093
  },
  {
    dateField: '2009-01-16T13:52:39.606Z',
    stringField: 'HOPPE',
    emailField: 'officia-94491@dolorum.com',
    integerField: 87,
    booleanField: false,
    floatField: 1.7151
  },
  {
    dateField: '2003-09-29T06:20:32.429Z',
    stringField: 'korey',
    emailField: 'dolores-94491@excepturi.com',
    integerField: 1,
    booleanField: false,
    floatField: 0.3781
  },
  {
    dateField: '2012-05-12T13:46:41.150Z',
    stringField: 'VON',
    emailField: 'facere-94491@blanditiis.com',
    integerField: -8,
    booleanField: false,
    floatField: 1.0037
  },
  {
    dateField: '2008-10-03T07:03:20.899Z',
    stringField: 'neque tempore',
    emailField: 'sint-94491@sunt.com',
    integerField: 0,
    booleanField: true,
    floatField: -0.753
  },
  {
    dateField: '2011-11-11T14:15:49.472Z',
    stringField: 'ut consequatur',
    emailField: 'et-94491@minus.com',
    integerField: -18,
    booleanField: true,
    floatField: -0.9532
  },
  {
    dateField: '2006-03-23T09:17:56.199Z',
    stringField: 'fermin',
    emailField: 'doloremque-94491@aliquid.com',
    integerField: 82,
    booleanField: true,
    floatField: 0.6261
  },
  {
    dateField: '2005-04-20T12:50:32.785Z',
    stringField: 'eum reiciendis',
    emailField: 'officia-94491@sit.com',
    integerField: -96,
    booleanField: true,
    floatField: -1.9195
  },
  {
    dateField: '2010-07-11T22:23:16.212Z',
    stringField: 'iusto perspiciatis',
    emailField: 'hic-94491@praesentium.com',
    integerField: -72,
    booleanField: true,
    floatField: 0.87
  },
  {
    dateField: '2018-07-16T01:22:41.394Z',
    stringField: 'HAMILL',
    emailField: 'suscipit-94491@temporibus.com',
    integerField: 13,
    booleanField: true,
    floatField: -1.2896
  },
  {
    dateField: '2006-07-08T19:12:18.422Z',
    stringField: "o'reilly",
    emailField: 'dolorem-94491@dolorem.com',
    integerField: 74,
    booleanField: true,
    floatField: 1.2316
  },
  {
    dateField: '2009-02-22T14:33:33.660Z',
    stringField: 'LABORE CULPA',
    emailField: 'commodi-94491@adipisci.com',
    integerField: 5,
    booleanField: false,
    floatField: -0.0592
  },
  {
    dateField: '2014-05-23T17:56:47.416Z',
    stringField: 'VERITATIS EIUS',
    emailField: 'aut-94491@culpa.com',
    integerField: -54,
    booleanField: false,
    floatField: 0.8332
  },
  {
    dateField: '2008-06-13T19:50:17.111Z',
    stringField: 'billie',
    emailField: 'aut-94491@debitis.com',
    integerField: 71,
    booleanField: false,
    floatField: -0.5285
  },
  {
    dateField: '2012-03-04T04:26:12.703Z',
    stringField: 'winston',
    emailField: 'ipsum-94491@reprehenderit.com',
    integerField: -84,
    booleanField: false,
    floatField: 0.4247
  },
  {
    dateField: '2008-03-01T12:47:24.590Z',
    stringField: 'HELGA',
    emailField: 'qui-94491@illum.com',
    integerField: -77,
    booleanField: true,
    floatField: 1.106
  },
  {
    dateField: '2003-04-15T10:12:41.904Z',
    stringField: 'ipsum voluptas',
    emailField: 'totam-94491@eos.com',
    integerField: -94,
    booleanField: false,
    floatField: -1.2852
  },
  {
    dateField: '2008-06-18T10:28:28.356Z',
    stringField: 'luettgen',
    emailField: 'optio-94491@voluptas.com',
    integerField: 4,
    booleanField: true,
    floatField: -0.7963
  },
  {
    dateField: '2013-06-19T13:12:38.556Z',
    stringField: 'dietrich',
    emailField: 'necessitatibus-94491@natus.com',
    integerField: 87,
    booleanField: false,
    floatField: -1.9018
  },
  {
    dateField: '2018-03-05T11:05:35.164Z',
    stringField: 'DOVIE',
    emailField: 'omnis-94491@dolore.com',
    integerField: 74,
    booleanField: true,
    floatField: -1.5775
  },
  {
    dateField: '2011-08-25T12:17:02.677Z',
    stringField: 'linnea',
    emailField: 'delectus-94491@quia.com',
    integerField: 55,
    booleanField: true,
    floatField: -0.5746
  },
  {
    dateField: '2003-01-04T16:15:21.008Z',
    stringField: 'madison',
    emailField: 'quae-94491@aspernatur.com',
    integerField: -6,
    booleanField: true,
    floatField: -0.328
  },
  {
    dateField: '2010-10-31T21:19:02.009Z',
    stringField: 'NUMQUAM ALIQUAM',
    emailField: 'odit-94491@dolor.com',
    integerField: 14,
    booleanField: true,
    floatField: -1.6389
  },
  {
    dateField: '2016-08-25T11:53:41.092Z',
    stringField: 'macy',
    emailField: 'qui-94491@maiores.com',
    integerField: -80,
    booleanField: true,
    floatField: -0.7988
  },
  {
    dateField: '2009-01-13T18:03:41.540Z',
    stringField: 'GERLACH',
    emailField: 'in-94491@amet.com',
    integerField: 8,
    booleanField: false,
    floatField: 1.1804
  },
  {
    dateField: '2011-02-27T02:39:55.805Z',
    stringField: 'padberg',
    emailField: 'consequatur-94491@corporis.com',
    integerField: 76,
    booleanField: true,
    floatField: 1.169
  },
  {
    dateField: '2015-07-25T12:02:55.232Z',
    stringField: 'ENIM DICTA',
    emailField: 'est-94491@quasi.com',
    integerField: -47,
    booleanField: false,
    floatField: 0.8532
  },
  {
    dateField: '2004-11-09T21:46:40.870Z',
    stringField: 'amalia',
    emailField: 'sequi-94491@quibusdam.com',
    integerField: 37,
    booleanField: false,
    floatField: 0.7813
  },
  {
    dateField: '2015-04-07T13:16:25.215Z',
    stringField: 'QUAS PERSPICIATIS',
    emailField: 'et-94491@nesciunt.com',
    integerField: -48,
    booleanField: false,
    floatField: -1.3683
  },
  {
    dateField: '2019-03-12T06:06:42.021Z',
    stringField: 'OMNIS ERROR',
    emailField: 'illum-94491@quam.com',
    integerField: 32,
    booleanField: true,
    floatField: -0.0507
  },
  {
    dateField: '2007-03-20T05:22:37.593Z',
    stringField: 'Williamson',
    emailField: 'quia-94491@ducimus.com',
    integerField: -2,
    booleanField: false,
    floatField: 0.7467
  },
  {
    dateField: '2013-05-18T19:08:26.697Z',
    stringField: 'schamberger',
    emailField: 'impedit-94491@asperiores.com',
    integerField: -20,
    booleanField: true,
    floatField: -0.0223
  },
  {
    dateField: '2008-12-02T19:29:26.187Z',
    stringField: 'Jared',
    emailField: 'aut-94491@et.com',
    integerField: -27,
    booleanField: false,
    floatField: 0.8873
  },
  {
    dateField: '2018-05-01T02:05:33.699Z',
    stringField: 'QUIDEM FUGIAT',
    emailField: 'corrupti-94491@vel.com',
    integerField: 30,
    booleanField: false,
    floatField: -0.5086
  },
  {
    dateField: '2002-02-16T10:44:45.995Z',
    stringField: 'MAGNAM REICIENDIS',
    emailField: 'aut-94491@aspernatur.com',
    integerField: 32,
    booleanField: false,
    floatField: 0.707
  },
  {
    dateField: '2018-01-23T15:15:00.879Z',
    stringField: 'DESTIN',
    emailField: 'non-94491@beatae.com',
    integerField: -33,
    booleanField: true,
    floatField: -0.566
  },
  {
    dateField: '2013-11-05T10:53:37.270Z',
    stringField: 'Block',
    emailField: 'veniam-94491@officiis.com',
    integerField: -98,
    booleanField: false,
    floatField: 0.3233
  },
  {
    dateField: '2006-08-12T21:38:30.945Z',
    stringField: 'jaskolski',
    emailField: 'tenetur-94491@sit.com',
    integerField: -59,
    booleanField: true,
    floatField: -1.2778
  },
  {
    dateField: '2013-06-03T03:27:45.308Z',
    stringField: 'BAUCH',
    emailField: 'repudiandae-94491@quae.com',
    integerField: 75,
    booleanField: true,
    floatField: 1.2883
  },
  {
    dateField: '2017-03-24T03:26:25.419Z',
    stringField: 'Wisoky',
    emailField: 'dolorem-94491@et.com',
    integerField: 92,
    booleanField: false,
    floatField: -0.7888
  },
  {
    dateField: '2014-03-15T22:36:04.533Z',
    stringField: 'paucek',
    emailField: 'suscipit-94491@qui.com',
    integerField: -99,
    booleanField: false,
    floatField: -0.8793
  },
  {
    dateField: '2011-01-30T04:08:46.682Z',
    stringField: 'sed quod',
    emailField: 'rerum-94491@totam.com',
    integerField: 94,
    booleanField: false,
    floatField: 1.4452
  },
  {
    dateField: '2004-04-18T05:25:16.045Z',
    stringField: 'kuhic',
    emailField: 'delectus-94491@veniam.com',
    integerField: 29,
    booleanField: true,
    floatField: -0.155
  },
  {
    dateField: '2007-01-12T22:16:15.486Z',
    stringField: 'WITTING',
    emailField: 'expedita-94491@et.com',
    integerField: -32,
    booleanField: true,
    floatField: 1.8227
  },
  {
    dateField: '2018-01-10T18:22:09.406Z',
    stringField: 'VOLUPTATE ATQUE',
    emailField: 'fuga-94491@quia.com',
    integerField: -52,
    booleanField: true,
    floatField: 0.2288
  },
  {
    dateField: '2010-05-18T02:18:18.985Z',
    stringField: 'placeat voluptate',
    emailField: 'distinctio-94491@quod.com',
    integerField: -56,
    booleanField: false,
    floatField: -1.0476
  },
  {
    dateField: '2016-05-17T05:10:53.438Z',
    stringField: 'SIT ODIO',
    emailField: 'architecto-94491@assumenda.com',
    integerField: -48,
    booleanField: true,
    floatField: -1.9699
  },
  {
    dateField: '2015-08-15T07:07:17.217Z',
    stringField: 'pagac',
    emailField: 'ipsam-94491@suscipit.com',
    integerField: -31,
    booleanField: false,
    floatField: 0.4011
  },
  {
    dateField: '2019-08-01T09:40:01.190Z',
    stringField: 'eius necessitatibus',
    emailField: 'itaque-94491@enim.com',
    integerField: -91,
    booleanField: true,
    floatField: 1.253
  },
  {
    dateField: '2005-06-06T18:49:01.780Z',
    stringField: 'RICE',
    emailField: 'in-94491@et.com',
    integerField: -43,
    booleanField: false,
    floatField: -1.2905
  },
  {
    dateField: '2002-12-21T01:03:05.343Z',
    stringField: 'Mortimer',
    emailField: 'est-94491@illo.com',
    integerField: -90,
    booleanField: false,
    floatField: 0.7536
  },
  {
    dateField: '2014-10-25T23:56:54.458Z',
    stringField: 'EX POSSIMUS',
    emailField: 'est-94491@aperiam.com',
    integerField: -63,
    booleanField: true,
    floatField: -0.78
  }
];
