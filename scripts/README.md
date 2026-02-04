# Deployment Scripts

## check-headers.js

A deployment guard script that prevents MIME type errors by verifying that JavaScript modules are served with the correct `text/javascript` content-type.

### Usage

```bash
# Check a specific URL
node scripts/check-headers.js https://consoltech.shop/assets/index-abc123.js

# Check using environment variable
CHECK_JS_URL=https://consoltech.shop/assets/index-abc123.js node scripts/check-headers.js

# Auto-detect from manifest (in CI)
DEPLOY_URL=https://consoltech.shop node scripts/check-headers.js
```

### What it checks

1. ✅ HTTP status is 200
2. ✅ Content-Type contains "text/javascript" or "application/javascript"
3. ❌ Fails if MIME type is "application/octet-stream" or other incorrect types

### CI Integration

The script is designed to run in CI pipelines after deployment to catch MIME type misconfigurations before they cause user-facing errors.

If the check fails, it means:
- Server configuration needs updating (.htaccess)
- CDN cache needs purging
- Build output may be malformed

### Exit codes

- `0` - Success (correct MIME type)
- `1` - Failure (wrong MIME type or network error)