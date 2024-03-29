// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    path: 'http://127.0.0.1', // Connection to locale
    port: 4202,
    optionalLayer: '',

    // path: 'http://192.168.1.8',    // Connection to LAN server
    // path: 'http://wrk.applehome.it',  // Connection to WAN server
    // port: undefined,
    // optionalLayer: '/api',
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
