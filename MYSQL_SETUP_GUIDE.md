# MySQL Setup Guide
## Rental Fleet UAE - Programmatic SEO System

This guide will help you set up MySQL for the programmatic SEO entity management system.

---

## 📋 Prerequisites

- MySQL 5.7+ or MySQL 8.0+ installed
- Node.js 18+ installed
- Access to create databases

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install MySQL

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

**Windows:**
Download from: https://dev.mysql.com/downloads/mysql/

### Step 2: Secure MySQL Installation

```bash
mysql_secure_installation
```

Follow the prompts to:
- Set root password
- Remove anonymous users
- Disallow remote root login
- Remove test database

### Step 3: Create Database and User

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE rental_fleet_uae CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (replace 'your_password' with a secure password)
CREATE USER 'rental_fleet'@'localhost' IDENTIFIED BY 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON rental_fleet_uae.* TO 'rental_fleet'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### Step 4: Run Database Migrations (Knex)

```bash
# Apply migrations (creates tables/views)
npm run db:migrate:knex
```

### Step 5: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your database credentials
nano .env
```

Update these values in `.env`:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=rental_fleet
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=rental_fleet_uae
```

### Step 6: Install MySQL npm Package

```bash
npm install mysql2
```

### Step 7: Migrate Data from JSON to MySQL

```bash
# Run migration script
npx ts-node scripts/migrate-json-to-mysql.ts
```

Expected output:
```
============================================================
Data Migration: JSON to MySQL
============================================================

Testing database connection...
✓ Database connection successful

Migrating emirate.json...
Found 3 entities
  ✓ Success: 3, Failed: 0

Migrating vehicle.json...
Found 10 entities
  ✓ Success: 10, Failed: 0

Migrating service.json...
Found 5 entities
  ✓ Success: 5, Failed: 0

Migrating intent.json...
Found 5 entities
  ✓ Success: 5, Failed: 0

============================================================
Migration Summary
============================================================
Total entities: 23
Successful: 23
Failed: 0

Entity counts by type:
  emirate: 3
  intent: 5
  service: 5
  vehicle: 10

✓ Migration completed successfully!
```

### Step 8: Switch to MySQL-based Entity System

Update your `lib/programmatic/entities.ts` to use MySQL instead of JSON:

```typescript
// Replace the import at the top
import {
  getEntitiesByType,
  getEntityById,
  getEntityBySlug,
  getRelatedEntities,
  generatePageCombinations,
  getEntitiesByPriority,
  searchEntities,
  getPopularEntities,
  getEntityStatistics,
  clearEntityCache
} from '../database/entities-repository';

// Now all entity functions will query MySQL instead of JSON files
```

### Step 9: Test the System

```bash
# Build the project
npm run build

# Run development server
npm run dev

# Visit test pages
# http://localhost:3000/dubai
# http://localhost:3000/dubai/sedan
```

---

## 📊 Database Schema Overview

### Main Tables

#### `entities`
Stores all programmatic entities (emirates, vehicles, services, intents)

**Key Fields:**
- `id` - Unique identifier
- `type` - Entity type (emirate, vehicle, service, intent)
- `slug` - URL-friendly identifier
- `priority` - Build priority (1-10)
- `content_*` - Content fields (description, benefits, features, FAQs)
- `metadata` - JSON field for flexible entity-specific data
- `seo_*` - SEO templates and configuration

#### `entity_relationships`
Many-to-many relationships between entities

**Key Fields:**
- `entity_id` - Source entity
- `related_entity_id` - Target entity
- `relationship_type` - Type of relationship (parent, child, related, sibling)
- `weight` - Relationship strength (1-10)

#### `generated_pages_cache`
Optional cache for generated page content

**Key Fields:**
- `slug` - Page URL
- `page_type` - Type of page (hub, spoke, comparison)
- `content_sections` - Generated content
- `uniqueness_score` - Content quality metric

---

## 🔧 Common Commands

### Check Database Status
```bash
# MySQL status
mysql -u rental_fleet -p -e "USE rental_fleet_uae; SHOW TABLES;"
```

### View Entity Count
```bash
mysql -u rental_fleet -p rental_fleet_uae -e "SELECT type, COUNT(*) as count FROM entities GROUP BY type;"
```

### Backup Database
```bash
mysqldump -u rental_fleet -p rental_fleet_uae > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -u rental_fleet -p rental_fleet_uae < backup_20260127.sql
```

### Clear Entity Cache (if needed)
```bash
mysql -u rental_fleet -p rental_fleet_uae -e "TRUNCATE TABLE generated_pages_cache;"
```

---

## 🐛 Troubleshooting

### Error: "Can't connect to MySQL server"

**Solution:**
```bash
# Check if MySQL is running
brew services list  # macOS
sudo systemctl status mysql  # Linux

# Start MySQL if not running
brew services start mysql  # macOS
sudo systemctl start mysql  # Linux
```

### Error: "Access denied for user"

**Solution:**
```bash
# Reset user password
mysql -u root -p -e "ALTER USER 'rental_fleet'@'localhost' IDENTIFIED BY 'new_password'; FLUSH PRIVILEGES;"

# Update .env with new password
```

### Error: "Table doesn't exist"

**Solution:**
```bash
# Re-import schema
mysql -u rental_fleet -p rental_fleet_uae < lib/database/schema.sql
```

### Error: "Too many connections"

**Solution:**
```sql
-- Increase max connections
SET GLOBAL max_connections = 200;

-- Or edit my.cnf
[mysqld]
max_connections = 200
```

### Migration Fails

**Solution:**
```bash
# Check JSON files exist
ls -la data/entities/

# Verify database connection
mysql -u rental_fleet -p rental_fleet_uae -e "SELECT 1;"

# Re-run migration with verbose output
npx ts-node scripts/migrate-json-to-mysql.ts
```

---

## 🎯 Performance Optimization

### Indexes
The schema includes optimized indexes for:
- Entity type and priority lookups
- Slug-based queries
- Relationship traversal
- Full-text search (optional)

### Connection Pooling
The `lib/database/mysql.ts` uses connection pooling:
- Default: 10 connections
- Adjust in mysql.ts if needed

### Query Caching
Entity results are cached for 5 minutes:
- Reduces database load
- Configurable in `entities-repository.ts`

---

## 📈 Scaling Considerations

### For 1,000 Entities
- Current setup works perfectly
- No changes needed

### For 10,000 Entities
- Consider read replicas
- Enable query caching
- Index optimization

### For 100,000+ Entities
- Implement sharding
- Use Redis for caching layer
- Consider read-write split

---

## 🔒 Security Best Practices

1. **Never commit .env file**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use strong passwords**
   - Minimum 16 characters
   - Mix of letters, numbers, symbols

3. **Limit database user privileges**
   ```sql
   -- Only grant necessary privileges
   GRANT SELECT, INSERT, UPDATE, DELETE ON rental_fleet_uae.* TO 'rental_fleet'@'localhost';
   ```

4. **Enable SSL for production**
   ```sql
   REQUIRE SSL;
   ```

5. **Regular backups**
   ```bash
   # Automated daily backup
   0 2 * * * mysqldump -u rental_fleet -p rental_fleet_uae > /backups/daily_$(date +\%Y\%m\%d).sql
   ```

---

## ✅ Verification Checklist

- [ ] MySQL installed and running
- [ ] Database `rental_fleet_uae` created
- [ ] Schema imported successfully
- [ ] User `rental_fleet` created with correct privileges
- [ ] `.env` file configured with correct credentials
- [ ] `mysql2` npm package installed
- [ ] Migration script ran successfully
- [ ] Test queries work
- [ ] Build completes without errors
- [ ] Dev server runs and pages load

---

## 📞 Support

If you encounter issues:

1. Check error logs: `mysql_error.log`
2. Verify connection: `mysql -u rental_fleet -p`
3. Review schema: `SHOW CREATE TABLE entities;`
4. Test queries directly in MySQL

---

## 🎉 Success!

Once setup is complete, your programmatic SEO system will:

✅ Query entities from MySQL instead of JSON files
✅ Support dynamic content updates without rebuilds
✅ Scale to 100,000+ pages efficiently
✅ Enable real-time entity management
✅ Provide better performance through caching

**Next Steps:**
1. Build and test locally
2. Deploy to production
3. Monitor performance
4. Scale as needed
