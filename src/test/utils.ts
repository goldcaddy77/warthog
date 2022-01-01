import { stringify } from 'flatted';
import { GraphQLError } from 'graphql';
import { getBindingError } from '../';

export interface APIError {
  message: string;
  path?: string[];
  extensions: {
    code: string;
    exception?: {
      stacktrace: string[];
    };
  };
}

// Calls our API returning the error object if encountered
// Use this if you want to test errors
export async function callAPI<E>(promise: Promise<E>): Promise<E | APIError> {
  try {
    return (await promise) as E;
  } catch (error) {
    return getBindingError(error) as APIError;
  }
}

// Calls our API, throwing an error if encountered
// Use this if a failed API call should fail our test
// This allows us to write more succinct code in our tests because we don't need to
// Type guard around potentially failed error reponses
export async function callAPISuccess<E>(promise: Promise<E>): Promise<E> {
  const response = await callAPI<E>(promise);

  if (isError(response)) {
    throw new Error(toErrorString(response, 'expected a successful API call'));
  }

  return response;
}

// Calls our API, throwing an error if encountered
// Use this if a failed API call should fail our test
// This allows us to write more succinct code in our tests because we don't need to
// Type guard around potentially failed error reponses
export async function callAPIError<E>(promise: Promise<E>): Promise<APIError> {
  const response = await callAPI<E>(promise);

  if (!isError(response)) {
    throw new Error(toErrorString(response, 'expected a failed API call'));
  }

  // The binding coerces errors of type GraphQL Error into an actual error object
  // instead of the raw JSON, so we need special handling
  if (response instanceof GraphQLError) {
    return {
      message: response.message,
      extensions: {
        code: 'GRAPHQL_ERROR'
      }
    };
  }

  return response;
}

// Checks to see if API response is an error by going through extensions node
export function isError<E>(response: E | APIError): response is APIError {
  // TODO: for some reason the binding returns GraphQLErrors differently
  // Hide this in the future
  if (response instanceof GraphQLError) {
    return true;
  }

  const extensions = (response as APIError).extensions;
  return extensions && extensions.code !== undefined;
}

function toErrorString(obj: unknown, msg: string): string {
  let error;
  if (typeof obj === 'string') {
    error = `${msg}: ${obj}`;
  } else {
    error = `${msg}: ${stringify(obj)}`;
  }

  console.error();
  return error;
}
