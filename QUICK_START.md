# 🚀 Quick Start Guide - Collaboration Module Testing

## ✅ Step 1: Start Backend Server

**Open a NEW terminal window** and run:

```powershell
cd skilllink-platform\backend
mvn spring-boot:run
```

**Wait for this message:**
```
Started SkilllinkApplication in X.XXX seconds
```

**Backend will run on:** `http://localhost:8081`

---

## ✅ Step 2: Start Frontend Server

**Open ANOTHER terminal window** and run:

```powershell
cd skilllink-platform\frontend
npm run dev
```

**Wait for this message:**
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

**Frontend will run on:** `http://localhost:5173`

---

## ✅ Step 3: Open Browser

1. Open your browser (Chrome, Firefox, or Edge)
2. Go to: **http://localhost:5173/collaboration**

---

## 🧪 Quick Test Sequence

### Test 1: View Feed (No Login Required)
- ✅ You should see the Collaboration Feed page
- ✅ Dark background with search bar
- ✅ Filter options visible
- ✅ Post cards displayed (if any exist)

### Test 2: Create a Post (Requires Login)
1. Click **"Create Post"** button (top right)
2. If not logged in, you'll be redirected to login
3. **Login** with your credentials
4. Return to `/collaboration`
5. Click **"Create Post"** again
6. Fill in:
   - Title: "Test Collaboration Post"
   - Category: "Project"
   - Description: "This is a test post for collaboration"
   - Duration: "2 weeks"
   - Skills: Type "React", press Enter, add "JavaScript"
7. Click **"Create Post"**
8. ✅ Should see success toast and navigate to new post

### Test 3: View Post Details
1. Click on any post card
2. ✅ Should see full post details
3. ✅ Skills displayed as badges
4. ✅ Status badge visible

### Test 4: Apply to Post
1. Click **"Apply to This Collaboration"** button
2. Enter optional message: "I'm interested in this project"
3. Click **"Submit Application"**
4. ✅ Should see success toast

### Test 5: Manage Applications (As Owner)
1. Go to a post YOU created
2. Scroll down to **"Applications Management"** section
3. ✅ Should see all applications
4. Click **"Accept"** or **"Reject"** on a pending application
5. ✅ Status should update

### Test 6: Close/Delete Post
1. On your post, scroll to **"Post Actions"**
2. Click **"Close Post"**
3. ✅ Post status changes to CLOSED
4. Click **"Delete Post"**
5. Confirm deletion
6. ✅ Post deleted, redirected to feed

---

## 🔍 What to Check

### Visual Checks:
- [ ] Dark theme matches dashboard design
- [ ] Green accent color (#38AE56) used consistently
- [ ] Cards have hover effects
- [ ] Modals open and close smoothly
- [ ] Toast notifications appear (top-right)

### Functional Checks:
- [ ] Search filters posts
- [ ] Category filter works
- [ ] Skill filter works
- [ ] Post cards are clickable
- [ ] Create post works
- [ ] Apply works
- [ ] Owner panel appears for post creators
- [ ] Accept/Reject works
- [ ] Close/Delete works

### Error Handling:
- [ ] Try applying without login → redirects to login
- [ ] Try creating post without login → redirects to login
- [ ] Check browser console (F12) for errors

---

## 🐛 Troubleshooting

### Backend Not Starting?
```powershell
# Make sure you're in the backend directory
cd skilllink-platform\backend

# Try cleaning and rebuilding
mvn clean install
mvn spring-boot:run
```

### Frontend Not Starting?
```powershell
# Make sure you're in the frontend directory
cd skilllink-platform\frontend

# Install dependencies if needed
npm install

# Start dev server
npm run dev
```

### CORS Errors?
- Check backend is running on port 8081
- Check frontend is running on port 5173
- Verify CORS config in backend allows frontend origin

### API Errors?
- Open browser console (F12)
- Check Network tab for failed requests
- Verify backend logs for errors

### Authentication Issues?
- Clear browser localStorage: `localStorage.clear()` in console
- Re-login
- Check token exists: `localStorage.getItem("token")`

---

## 📝 Testing Checklist

Complete this checklist as you test:

**Feed & Navigation:**
- [ ] Feed page loads
- [ ] Search works
- [ ] Category filter works
- [ ] Skill filter works
- [ ] Post cards clickable
- [ ] Back navigation works

**Post Creation:**
- [ ] Create button visible (when logged in)
- [ ] Modal opens
- [ ] Form validation works
- [ ] Post creation succeeds
- [ ] Redirects to new post

**Post Details:**
- [ ] All post info displays
- [ ] Skills shown as badges
- [ ] Status badge correct
- [ ] Apply button visible (for non-owners)

**Application:**
- [ ] Apply modal opens
- [ ] Login prompt shows (if not logged in)
- [ ] Application submission works
- [ ] Success toast appears

**Owner Features:**
- [ ] Owner panel visible (for post creators)
- [ ] Applications list displays
- [ ] Accept works
- [ ] Reject works
- [ ] Close post works
- [ ] Delete post works (with confirmation)

**Notifications:**
- [ ] Notifications received for new applications
- [ ] Notifications received for accept/reject
- [ ] Notification drawer shows collaboration types

**Error Handling:**
- [ ] Unauthorized actions redirect to login
- [ ] Error messages display correctly
- [ ] Loading states show during API calls

---

## 🎯 Expected Results

### Success Indicators:
✅ No console errors (F12 → Console tab)  
✅ All API calls return 200/201 status  
✅ Toast notifications appear  
✅ UI matches dashboard design  
✅ All buttons and modals work  
✅ Responsive on different screen sizes  

### If Everything Works:
🎉 **Your collaboration module is fully functional!**

---

## 📚 Full Testing Guide

For detailed step-by-step instructions, see:
**`COLLABORATION_TESTING_GUIDE.md`**

---

## 🆘 Need Help?

1. **Check browser console** (F12) for errors
2. **Check backend terminal** for server errors
3. **Check Network tab** (F12 → Network) for API failures
4. **Verify both servers are running** (backend on 8081, frontend on 5173)

---

**Happy Testing! 🚀**
