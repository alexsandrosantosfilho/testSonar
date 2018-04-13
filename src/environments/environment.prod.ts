export const environment = {
  production: true,
  services: {
    auth: {
      path: 'http://auth-dev.sgt2.com.br',
    },
    sgt2: {
      path: 'http://back-dev.sgt2.com.br/back_office'
    },
    filemanager: {
      path: 'http://192.168.0.22:8080/filemanager.v2-web/rest',
      allowedExtensions: [ 'doc', 'txt', 'xls', 'zip', 'pdf', 'dwg', 'kml' ],
      fileMaxSize: 10000000
    }
  }
};
