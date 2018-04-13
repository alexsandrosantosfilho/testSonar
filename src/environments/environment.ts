// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  version: "1.7.0",
  services: {
    auth: {
      path: 'http://auth-dev.sgt2.com.br',
    },
    sgt2: {
      path: 'http://back-dev.sgt2.com.br/back_office'
    },
    filemanager: {
      path: 'http://java-back-dev.sgt2.com.br/filemanager.v2-web/rest',
      allowedExtensions: [ 'doc', 'txt', 'xls', 'zip', 'pdf', 'dwg', 'kml' ],
      fileMaxSize: 10000000
    }
  }
};
