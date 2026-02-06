# 🚀 How to Run in VS Code - Complete Guide

## ✅ Yes! All Files Are Updated on Your Computer

The CORS fixes have been saved to your local files:
- ✅ `backend/src/main/java/com/university/skilllink/config/CorsConfig.java`
- ✅ `backend/src/main/java/com/university/skilllink/controller/AuthController.java`

---

## 📋 Step-by-Step: Running in VS Code

### **STEP 1: Open Project in VS Code**

1. **Open VS Code**
2. **File → Open Folder** (or `Ctrl + K, Ctrl + O`)
3. **Navigate to:** `C:\Users\Chankavi\OneDrive\Desktop\SkillLink\skilllink-platform`
4. **Click "Select Folder"**

You should see the project structure in the left sidebar:
```
skilllink-platform/
├── backend/
├── frontend/
└── ...
```

---

### **STEP 2: Open Integrated Terminal**

**Option A: Use Menu**
- Go to: **Terminal → New Terminal** (or `Ctrl + Shift + `` ` ``)

**Option B: Use Keyboard**
- Press: `Ctrl + `` ` `` (backtick key, usually above Tab)

You'll see a terminal at the bottom of VS Code.

---

### **STEP 3: Start Backend Server (Terminal 1)**

1. **In the terminal**, type:
   ```powershell
   cd backend
   ```

2. **Verify you're in the right place:**
   ```powershell
   dir pom.xml
   ```
   (Should show `pom.xml`)

3. **Start the backend:**
   ```powershell
   mvn spring-boot:run
   ```

4. **Wait for this message:**
   ```
   Started SkilllinkApplication in X.XXX seconds
   ```

5. **Keep this terminal running!** Don't close it.

---

### **STEP 4: Open Second Terminal (For Frontend)**

1. **Click the "+" button** next to the terminal tab (or press `Ctrl + Shift + `` ` `` again)

2. **You'll see a new terminal tab**

3. **In the new terminal**, type:
   ```powershell
   cd frontend
   ```

4. **Verify:**
   ```powershell
   dir package.json
   ```
   (Should show `package.json`)

5. **Start the frontend:**
   ```powershell
   npm run dev
   ```

6. **Wait for:**
   ```
   VITE v7.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```
   (Or it might show port 5176)

7. **Keep this terminal running too!**

---

### **STEP 5: Test in Browser**

1. **Open your browser** (Chrome, Firefox, Edge)

2. **Go to the URL shown in the frontend terminal:**
   - Usually: `http://localhost:5173/collaboration`
   - Or: `http://localhost:5176/collaboration` (if Vite used a different port)

3. **You should see the Collaboration Feed page!**

---

## 🎯 Quick Visual Guide

### VS Code Layout:

```
┌─────────────────────────────────────┐
│  VS Code Window                      │
│  ┌───────────┬──────────────────┐  │
│  │           │                  │  │
│  │  File     │   Editor         │  │
│  │  Explorer │   (Your Code)    │  │
│  │           │                  │  │
│  └───────────┴──────────────────┘  │
│  ┌────────────────────────────────┐ │
│  │  Terminal 1 (Backend)         │ │
│  │  $ cd backend                   │ │
│  │  $ mvn spring-boot:run         │ │
│  │  Started SkilllinkApplication...│ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │  Terminal 2 (Frontend)         │ │
│  │  $ cd frontend                  │ │
│  │  $ npm run dev                  │ │
│  │  ➜ Local: http://localhost:5173│ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🔧 Using VS Code Tasks (Alternative Method)

I've created a VS Code tasks file for you! You can use it to start servers easily:

### **Method 1: Using Command Palette**

1. **Press:** `Ctrl + Shift + P`
2. **Type:** `Tasks: Run Task`
3. **Select:** `Start Backend Server` (for backend)
4. **Or select:** `Start Frontend Server` (for frontend)
5. **Or select:** `Start Both Servers` (to start both!)

### **Method 2: Using Terminal Menu**

1. **Terminal → Run Task**
2. **Select the task you want**

---

## 📝 Terminal Management Tips

### **Switch Between Terminals:**
- Click on the terminal tabs at the bottom
- Or use: `Ctrl + PageUp` / `Ctrl + PageDown`

### **Split Terminal:**
- Right-click terminal tab → "Split Terminal"
- Or: `Ctrl + Shift + 5`

### **Kill Terminal:**
- Click the trash icon on the terminal tab
- Or right-click → "Kill Terminal"

### **Clear Terminal:**
- Right-click in terminal → "Clear"
- Or type: `cls` (PowerShell) or `clear` (bash)

---

## ✅ Verification Checklist

After starting both servers, verify:

- [ ] **Backend Terminal** shows: `Started SkilllinkApplication`
- [ ] **Frontend Terminal** shows: `Local: http://localhost:XXXX`
- [ ] **Browser** opens to collaboration page
- [ ] **No CORS errors** in browser console (F12)
- [ ] **Can login** without errors

---

## 🐛 Troubleshooting in VS Code

### **Backend Won't Start:**
```powershell
# Make sure you're in backend directory
cd backend

# Check if Maven is installed
mvn --version

# If not installed, install Maven first
# Or use: ./mvnw spring-boot:run (Windows wrapper)
```

### **Frontend Won't Start:**
```powershell
# Make sure you're in frontend directory
cd frontend

# Install dependencies if needed
npm install

# Then start
npm run dev
```

### **Port Already in Use:**
- Backend (8081): Check if another instance is running
- Frontend (5173/5176): Vite will auto-use next available port

### **CORS Still Showing:**
1. **Stop backend** (Ctrl + C in backend terminal)
2. **Restart backend** (`mvn spring-boot:run`)
3. **Hard refresh browser** (Ctrl + Shift + R)

---

## 🎯 Next Steps After Servers Start

1. ✅ **Test Collaboration Feed:**
   - Go to: `http://localhost:5173/collaboration`
   - Should see the feed page

2. ✅ **Test Login:**
   - Click login (if not logged in)
   - Login should work without CORS errors

3. ✅ **Test Creating Post:**
   - Click "Create Post"
   - Fill form and submit

4. ✅ **Test Applying:**
   - Click on a post
   - Click "Apply"
   - Submit application

---

## 📚 Additional VS Code Tips

### **Useful Extensions:**
- **Java Extension Pack** (for backend)
- **ES7+ React/Redux/React-Native snippets** (for frontend)
- **Prettier** (code formatting)
- **ESLint** (code linting)

### **Keyboard Shortcuts:**
- `Ctrl + `` ` `` - Toggle terminal
- `Ctrl + Shift + P` - Command palette
- `Ctrl + B` - Toggle sidebar
- `F5` - Start debugging

---

## 🎉 You're All Set!

**Summary:**
1. ✅ Files are updated on your computer
2. ✅ You can run everything in VS Code
3. ✅ Use integrated terminals (2 terminals)
4. ✅ Backend on port 8081
5. ✅ Frontend on port 5173 (or 5176)
6. ✅ Open browser and test!

**If you need help, just ask!** 🚀
