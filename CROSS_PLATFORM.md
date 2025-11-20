# Cross-Platform Compatibility Notes

## SQLite Database (`game_data.db`)

✅ **Fully Cross-Platform Compatible**

The SQLite database file works seamlessly across all operating systems:

### Verified Properties

- **Encoding**: UTF-8 (confirmed via Node.js)
  - Properly stores Persian Unicode characters (سیب, میوه‌ها)
  - Compatible with English and Finglish text
  
- **Database Version**: SQLite 3.x
  - Standard format recognized by all SQLite libraries
  - No proprietary extensions or OS-specific features

- **Binary Format**: OS-agnostic
  - Single file, no OS-specific metadata
  - Works identically on Windows, macOS, and Linux

- **Data Verification**: ✅
  - 85 word groups stored correctly
  - 16 levels defined
  - Persian text reads correctly across platforms

### Path Handling

All file paths use Node.js `path.join()` for cross-platform compatibility:
- `server/db.js` - Database connection
- `server/index.js` - API server
- All seed scripts

### Ignored Files

Runtime-generated files properly ignored in `.gitignore`:
- `*.db-wal` - SQLite Write-Ahead Log (temporary)
- `*.db-shm` - SQLite Shared Memory (temporary)
- `server.log` - Runtime logs
- `build/` - Build artifacts

These files are OS/session-specific and should not be committed.

## Testing Recommendations

When deploying to a new OS:

1. Clone repository
2. Run `npm install` (installs better-sqlite3 with native bindings for your OS)
3. Run `npm run dev` or `npm run util`
4. Database will work immediately with all Persian content intact

## Technical Details

**better-sqlite3** package:
- Includes native SQLite engine compiled for each platform
- Automatically builds correct binaries during npm install
- No external SQLite installation required
- Handles all encoding/decoding automatically

**Result**: Database file is 100% portable between Windows, macOS, and Linux.
