# 🔧 CORS Fix Applied!

## ✅ What I Fixed

I updated the CORS configuration to allow your frontend port (5176):

1. **CorsConfig.java** - Added `http://localhost:5176` to allowed origins
2. **AuthController.java** - Added `http://localhost:5176` to allowed origins

## 🚨 IMPORTANT: Restart Backend Server!

The changes won't take effect until you restart the backend server.

### Steps to Fix:

1. **Stop the backend server** (in the terminal where it's running):
   - Press `Ctrl + C` to stop it

2. **Restart the backend server:**
   ```powershell
   cd skilllink-platform\backend
   mvn spring-boot:run
   ```

3. **Wait for:**
   ```
   Started SkilllinkApplication in X.XXX seconds
   ```

4. **Refresh your browser** (or clear cache: `Ctrl + Shift + R`)

5. **Try logging in again** - CORS error should be gone!

---

## ✅ What Changed

**Before:**
- Only allowed: `http://localhost:3000` and `http://localhost:5173`
- Your frontend on `http://localhost:5176` was blocked

**After:**
- Now allows: `http://localhost:3000`, `http://localhost:5173`, and `http://localhost:5176`
- Your frontend should work now!

---

## 🧪 Test After Restart

1. Open browser: `http://localhost:5176/collaboration`
2. Try to login
3. Check browser console (F12) - CORS errors should be gone!

---

## 📝 Note

If Vite uses a different port in the future, you can add it to:
- `backend/src/main/java/com/university/skilllink/config/CorsConfig.java`
- Line 13: Add the new port to `allowedOrigins()`

---

**After restarting the backend, the CORS error should be fixed! 🎉**
