# CardGuru Development - Quick Reference

## 🚀 Server URLs
- **Frontend**: http://localhost:5174/
- **Backend API**: http://localhost:3000/

## 🔧 Development Setup

### Start Frontend
```bash
cd frontend
npm run dev
# or
npx vite
```
**Expected Output**: Server ready on http://localhost:5174/

### Start Backend
```bash
cd cardguru
npm start
```
**Expected Output**: API server running on port 3000

## ⚠️ IMPORTANT: Port Configuration

**Always use port 5174 for frontend development**
- Port 5173 has persistent conflicts in this environment
- This is configured in `vite.config.ts` with `port: 5174`
- Do NOT change back to 5173 - it will cause 404 errors

## 🔍 Troubleshooting

### If Frontend Shows 404:
1. Check if using correct port (5174, not 5173)
2. Verify vite.config.ts has `port: 5174`
3. Kill all Node processes: `taskkill /F /IM node.exe`
4. Restart with `npx vite`

### Quick Health Check:
```bash
# Test frontend
curl http://localhost:5174/

# Test backend  
curl http://localhost:3000/api/cards
```

## 📁 Project Structure
```
cardguru/
├── frontend/          # React app (port 5174)
│   ├── src/
│   ├── vite.config.ts # Port configuration
│   └── package.json
├── src/               # Backend API (port 3000)  
├── prisma/            # Database schema
└── README.md
```

## 📚 Documentation
- `FRONTEND-404-RESOLVED.md` - Complete troubleshooting history
- `SPRINT2-PROGRESS.md` - Current development status
- `gemini.md` - Full project specification

---
**Last Updated**: July 31, 2025  
**Status**: Fully operational ✅
