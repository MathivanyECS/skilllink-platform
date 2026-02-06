# 🚀 How to Start Both Servers

## ⚠️ IMPORTANT: You were running Maven from the wrong directory!

You were in: `C:\Users\Chankavi\OneDrive\Desktop\SkillLink`
You need to be in: `C:\Users\Chankavi\OneDrive\Desktop\SkillLink\skilllink-platform\backend`

---

## 📋 Step-by-Step Instructions

### **STEP 1: Start Backend Server**

1. **Open a NEW PowerShell terminal** (or use your current one)

2. **Navigate to the backend directory:**
   ```powershell
   cd C:\Users\Chankavi\OneDrive\Desktop\SkillLink\skilllink-platform\backend
   ```

3. **Verify you're in the right place:**
   ```powershell
   dir pom.xml
   ```
   You should see `pom.xml` listed.

4. **Start the Spring Boot server:**
   ```powershell
   mvn spring-boot:run
   ```

5. **Wait for this message:**
   ```
   Started SkilllinkApplication in X.XXX seconds
   ```
   
   ✅ **Backend is now running on:** `http://localhost:8081`

6. **Keep this terminal open** - don't close it!

---

### **STEP 2: Start Frontend Server**

1. **Open a SECOND PowerShell terminal** (keep the backend terminal running!)

2. **Navigate to the frontend directory:**
   ```powershell
   cd C:\Users\Chankavi\OneDrive\Desktop\SkillLink\skilllink-platform\frontend
   ```

3. **Verify you're in the right place:**
   ```powershell
   dir package.json
   ```
   You should see `package.json` listed.

4. **Start the frontend dev server:**
   ```powershell
   npm run dev
   ```

5. **Wait for this message:**
   ```
   VITE v7.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

   ✅ **Frontend is now running on:** `http://localhost:5173`

6. **Keep this terminal open** - don't close it!

---

### **STEP 3: Test in Browser**

1. **Open your web browser** (Chrome, Firefox, or Edge)

2. **Navigate to:**
   ```
   http://localhost:5173/collaboration
   ```

3. **You should see:**
   - Dark background with gradient
   - Search bar at the top
   - Filter options
   - "Create Post" button (if logged in)
   - Grid of collaboration posts (if any exist)

---

## ✅ Quick Verification

### Check Backend:
- Open: `http://localhost:8081/api/collaborations`
- Should return JSON (empty array `[]` if no posts, or list of posts)

### Check Frontend:
- Open: `http://localhost:5173/collaboration`
- Should see the Collaboration Feed page

---

## 🐛 Troubleshooting

### Backend Error: "No plugin found for prefix 'spring-boot'"
**Solution:** You're in the wrong directory!
```powershell
# Make sure you're here:
cd C:\Users\Chankavi\OneDrive\Desktop\SkillLink\skilllink-platform\backend

# Verify pom.xml exists:
dir pom.xml

# Then run:
mvn spring-boot:run
```

### Frontend Error: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Port Already in Use:
**Backend (8081):**
```powershell
# Find what's using port 8081:
netstat -ano | findstr :8081

# Kill the process (replace PID with actual process ID):
taskkill /PID <PID> /F
```

**Frontend (5173):**
- Vite will automatically use the next available port
- Or change port in `vite.config.ts`

### CORS Errors:
- Make sure backend is running on port 8081
- Make sure frontend is running on port 5173
- Check backend `CorsConfig.java` allows `http://localhost:5173`

---

## 📝 Summary

**You need TWO terminals running:**

**Terminal 1 (Backend):**
```powershell
cd skilllink-platform\backend
mvn spring-boot:run
```

**Terminal 2 (Frontend):**
```powershell
cd skilllink-platform\frontend
npm run dev
```

**Then open browser:**
```
http://localhost:5173/collaboration
```

---

## 🎯 Next Steps After Servers Start

1. ✅ Test viewing the feed (no login required)
2. ✅ Test creating a post (requires login)
3. ✅ Test applying to a post
4. ✅ Test managing applications (as owner)

See `QUICK_START.md` or `COLLABORATION_TESTING_GUIDE.md` for detailed testing instructions.

---

**Good luck! 🚀**
