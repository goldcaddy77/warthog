export function validateAllResponses(req: any, res: any, next: Function) {
  const strictValidation = req.apiDoc['x-express-openapi-validation-strict'] ? true : false;
  if (typeof res.validateResponse === 'function') {
    const send = res.send;
    res.send = function expressOpenAPISend(...args: any[]) {
      const onlyWarn = !strictValidation;
      if (res.get('x-express-openapi-validation-error-for') !== undefined) {
        return send.apply(res, args);
      }
      let body = args[0];
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      let validation = res.validateResponse(res.statusCode, body);
      let validationMessage;
      if (validation === undefined) {
        validation = { message: undefined, errors: undefined };
      }
      if (validation.errors) {
        const errorList = Array.from(validation.errors)
          .map((error: any) => error.message)
          .join(',');
        validationMessage = `Invalid response for status code ${res.statusCode}: ${errorList}`;
        // Set to avoid a loop, and to provide the original status code
        res.set('x-express-openapi-validation-error-for', res.statusCode.toString());
      }
      if (onlyWarn || !validation.errors) {
        return send.apply(res, args);
      } else {
        return res.status(500).json({ error: validationMessage });
      }
    };
  }
  next();
}
