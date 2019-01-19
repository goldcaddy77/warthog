// This subscriber will log all CUD operations (left off "read" as it would be too noisy)
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

import { logger } from './../core/logger';

@EventSubscriber()
export class EverythingSubscriber implements EntitySubscriberInterface {
  /**
   * Called before entity insertion.
   */
  beforeInsert(event: InsertEvent<any>) {
    logger.info(`Before Insert: `, event.entity);
  }

  /**
   * Called before entity update.
   */
  beforeUpdate(event: UpdateEvent<any>) {
    logger.info(`BEFORE ENTITY UPDATED: `, event.entity);
  }

  /**
   * Called before entity deletion.
   */
  beforeRemove(event: RemoveEvent<any>) {
    logger.info(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
  }

  /**
   * Called after entity insertion.
   */
  afterInsert(event: InsertEvent<any>) {
    logger.info(`AFTER ENTITY INSERTED: `, event.entity);
  }

  /**
   * Called after entity update.
   */
  afterUpdate(event: UpdateEvent<any>) {
    logger.info(`AFTER ENTITY UPDATED: `, event.entity);
  }

  /**
   * Called after entity deletion.
   */
  afterRemove(event: RemoveEvent<any>) {
    logger.info('Deleted', event.entity, 'with ID', event.entityId);
  }
}
