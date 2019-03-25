export function getDatabaseName(): string {
  return process.env.TYPEORM_DATABASE ? process.env.TYPEORM_DATABASE : '';
}

export function getDatabaseType(): string {
  return process.env.TYPEORM_DATABASE_TYPE ? process.env.TYPEORM_DATABASE_TYPE : 'postgres';
}

export function getDatabaseHost(): string {
  return process.env.TYPEORM_HOST || 'localhost';
}

export function shouldSchronizeDatabaseSchema(): boolean {
  return process.env.TYPEORM_SYNCHRONIZE === 'true';
}

export function getDatabaseLoggingLevel() {
  return process.env.TYPEORM_LOGGING || 'all';
}

export function getDatabaseEntityPaths(): string[] {
  return process.env.TYPEORM_ENTITIES
    ? process.env.TYPEORM_ENTITIES.split(',')
    : ['src/**/*.model.ts'];
}

export function getDatabaseMigrationPaths(): string[] {
  return process.env.TYPEORM_MIGRATIONS
    ? process.env.TYPEORM_MIGRATIONS.split(',')
    : ['src/migration/**/*.ts'];
}

export function getDatabaseSubscriberPaths(): string[] {
  return process.env.TYPEORM_SUBSCRIBERS
    ? process.env.TYPEORM_SUBSCRIBERS.split(',')
    : ['src/**/*.model.ts'];
}

export function getDatabaseUsername(): string | undefined {
  return process.env.TYPEORM_USERNAME;
}

export function getDatabasePassword(): string | undefined {
  return process.env.TYPEORM_PASSWORD;
}

export function getDatabasePort(): number {
  return parseInt(process.env.TYPEORM_PORT || '', 10) || 5432;
}
