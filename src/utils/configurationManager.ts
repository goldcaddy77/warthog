export function getDatabaseName(): string {
  return process.env.WARTHOG_DB_DATABASE ? process.env.WARTHOG_DB_DATABASE : '';
}

export function getDatabaseType(): string {
  return process.env.WARTHOG_DB_DATABASE_TYPE || process.env.WARTHOG_DB_CONNECTION || 'postgres';
}

export function getDatabaseHost(): string {
  return process.env.WARTHOG_DB_HOST || 'localhost';
}

export function shouldSchronizeDatabaseSchema(): boolean {
  return process.env.WARTHOG_DB_SYNCHRONIZE === 'true';
}

export function getDatabaseLoggingLevel() {
  return process.env.WARTHOG_DB_LOGGING || 'all';
}

export function getDatabaseEntityPaths(): string[] {
  return process.env.WARTHOG_DB_ENTITIES
    ? process.env.WARTHOG_DB_ENTITIES.split(',')
    : ['src/**/*.model.ts'];
}

export function getDatabaseMigrationPaths(): string[] {
  return process.env.WARTHOG_DB_MIGRATIONS
    ? process.env.WARTHOG_DB_MIGRATIONS.split(',')
    : ['src/migration/**/*.ts'];
}

export function getDatabaseSubscriberPaths(): string[] {
  return process.env.WARTHOG_DB_SUBSCRIBERS
    ? process.env.WARTHOG_DB_SUBSCRIBERS.split(',')
    : ['src/**/*.model.ts'];
}

export function getDatabaseUsername(): string | undefined {
  return process.env.WARTHOG_DB_USERNAME;
}

export function getDatabasePassword(): string | undefined {
  return process.env.WARTHOG_DB_PASSWORD;
}

export function getDatabasePort(): number {
  return parseInt(process.env.WARTHOG_DB_PORT || '', 10) || 5432;
}
