export interface GetResponse {
  statusCode: number;
  body: string;
}

// Custom http `get` without dependencies
export function get(url: string): Promise<GetResponse> {
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response: any) => {
      // temporary data holder
      const body: string[] = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk: string) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        return resolve({
          statusCode: response.statusCode,
          body: body.join('')
        });
      });
    });
    // handle connection errors of the request
    request.on('error', (err: Error) => reject(err));
  });
}
