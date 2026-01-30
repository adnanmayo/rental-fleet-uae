/**
 * MySQL Database Connection
 * Provides connection pooling and query utilities for entity management
 */

import mysql from 'mysql2/promise';

function getConnectionLimit(): number {
  const fromEnv = Number(process.env.MYSQL_CONNECTION_LIMIT);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return Math.floor(fromEnv);
  // Next.js build uses multiple workers (separate processes). Keep the per-process pool small
  // so we don't exceed MySQL max_connections during prerender.
  return process.env.NODE_ENV === "production" ? 2 : 10;
}

// Database configuration from environment variables
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'rental_fleet_uae',
  waitForConnections: true,
  connectionLimit: getConnectionLimit(),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create connection pool
let pool: mysql.Pool | null = null;

/**
 * Get or create database connection pool
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * Execute a query with automatic connection management
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    // Avoid noisy logs during build/dev when DB isn't configured yet.
    if (process.env.DB_LOG_ERRORS === 'true') {
      console.error('Database query error:', error);
    }
    throw error;
  }
}

/**
 * Execute a query and return a single row
 */
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Begin a transaction
 */
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Check if database connection is working
 */
export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

/**
 * Close all database connections
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Escape values for safe SQL queries
 */
export function escape(value: any): string {
  return mysql.escape(value);
}

/**
 * Escape identifiers (table names, column names)
 */
export function escapeId(identifier: string): string {
  return mysql.escapeId(identifier);
}
