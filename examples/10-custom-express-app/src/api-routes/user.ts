import { Request, Response } from 'express';

import { Container } from 'typedi';
import { UserService } from '../user.service';

module.exports = () => {
  const userService: UserService = (Container as any).get(UserService);
  const doc = {
    GET: async (req: Request, res: Response) => {
      const user = await userService.userById(req.params.userId);
      res.status(200).json({ user });
    }
  };

  (doc.GET as any).apiDoc = {
    summary: 'Users endpoints for Warthog Example #10',
    tags: ['warthog-example-10'],
    parameters: [
      {
        in: 'path',
        name: 'userId',
        schema: {
          type: 'string'
        },
        required: true,
        description: 'ID of the user to get'
      }
    ],
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['user'],
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        },
        description: 'Successful request to /user/id/:userId'
      },
      default: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BaseError'
            }
          }
        },
        description: 'Unexpected error from /user/id/:userId'
      }
    }
  };
  return doc;
};
