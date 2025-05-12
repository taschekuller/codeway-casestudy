declare module 'firebase-functions' {
  namespace https {
    function onRequest(
      handler: (request: any, response: any) => void | Promise<void>,
    ): any;
  }
}
