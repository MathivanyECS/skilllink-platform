# 🎯 How to View Your Collaboration Page - Step by Step

## ✅ Step 1: Make Sure Both Servers Are Running

### **Check Backend Server:**

1. **Look at your VS Code terminal** (or PowerShell where backend is running)
2. **You should see:**
   ```
   Started SkilllinkApplication in X.XXX seconds
   ```
3. **If you DON'T see this:**
   - Stop it: Press `Ctrl + C`
   - Restart: 
     ```powershell
     cd skilllink-platform\backend
     mvn spring-boot:run
     ```
   - Wait for "Started SkilllinkApplication" message

### **Check Frontend Server:**

1. **Look at your VS Code terminal** (or PowerShell where frontend is running)
2. **You should see:**
   ```
   VITE v7.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```
   (Or it might show port 5176 or another port)

3. **If you DON'T see this:**
   - Stop it: Press `Ctrl + C`
   - Restart:
     ```powershell
     cd skilllink-platform\frontend
     npm run dev
     ```
   - Wait for the "Local: http://localhost:XXXX" message

---

## ✅ Step 2: Open Your Browser

1. **Open any browser** (Chrome, Firefox, Edge, etc.)

2. **Look at the frontend terminal** - note the URL it shows
   - Usually: `http://localhost:5173`
   - Or: `http://localhost:5176`
   - Or: `http://localhost:XXXX` (whatever port Vite assigned)

---

## ✅ Step 3: Navigate to Collaboration Page

### **Method 1: Direct URL (Easiest)**

1. **Click in the browser address bar**
2. **Type:**
   ```
   http://localhost:5173/collaboration
   ```
   (Replace `5173` with your actual frontend port if different)

3. **Press Enter**

### **Method 2: From Home Page**

1. **Go to:** `http://localhost:5173` (or your frontend URL)
2. **If there's a navigation menu**, click on "Collaboration"
3. **Or manually type:** `/collaboration` after the base URL

### **Method 3: If You Have a Dashboard**

1. **Login first** (if not logged in)
2. **Look for "Collaboration" link** in navigation
3. **Click it**

---

## ✅ Step 4: What You Should See

When you open `/collaboration`, you should see:

### **Collaboration Feed Page:**

```
┌─────────────────────────────────────────┐
│  [Logo]  [Search Bar]  [🔔] [👤] [Create]│
├─────────────────────────────────────────┤
│  Filter by: [Category ▼] [Skill...]    │
│  Showing X of Y posts                   │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Post 1   │  │ Post 2   │  │ Post 3 ││
│  │ Title    │  │ Title    │  │ Title  ││
│  │ Skills   │  │ Skills   │  │ Skills ││
│  │ [OPEN]   │  │ [OPEN]   │  │ [OPEN] ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
```

**Features visible:**
- ✅ Dark background with gradient
- ✅ Search bar at the top
- ✅ Filter options (Category, Skill)
- ✅ "Create Post" button (if logged in)
- ✅ Grid of collaboration post cards
- ✅ Each card shows: Title, Status, Category, Description preview, Skills

---

## ✅ Step 5: Test All Features

### **Test 1: View Feed (No Login Required)**

1. **You should see the feed page** ✅
2. **Try searching:**
   - Type a keyword in the search box
   - Posts should filter in real-time

3. **Try filtering:**
   - Select a category from dropdown
   - Type a skill in skill filter
   - Posts should filter

4. **Click on a post card:**
   - Should navigate to post detail page
   - Shows full post information

---

### **Test 2: View Post Details**

1. **Click any post card** from the feed
2. **You should see:**
   - Full post title
   - Status badge (OPEN/CLOSED/FILLED)
   - Category, Duration, Posted date
   - Full description
   - All required skills as badges
   - "Back to Feed" button
   - "Apply to This Collaboration" button (if not owner)

3. **Click "Back to Feed":**
   - Should return to feed page

---

### **Test 3: Create a Post (Requires Login)**

1. **If not logged in:**
   - Click "Create Post" button
   - Should redirect to login page
   - Login with your credentials
   - Return to `/collaboration`

2. **Click "Create Post" button** (top right)

3. **Fill in the form:**
   - **Title:** "Test Collaboration Post"
   - **Category:** Select "Project" (or Competition/Event)
   - **Description:** "This is a test post for collaboration features"
   - **Duration:** "2 weeks"
   - **Skills:** 
     - Type "React"
     - Press Enter (or click "Add")
     - Type "JavaScript"
     - Press Enter
     - You should see skill badges appear

4. **Click "Create Post"**

5. **Expected:**
   - ✅ Success toast notification (top-right)
   - ✅ Modal closes
   - ✅ Automatically navigates to your new post detail page
   - ✅ Post appears in the feed

---

### **Test 4: Apply to a Post**

1. **Go back to feed:** Click "Back to Feed" or navigate to `/collaboration`

2. **Click on a post** you didn't create

3. **Click "Apply to This Collaboration" button**

4. **If not logged in:**
   - Modal shows "Please log in to apply"
   - Click "Go to Login"
   - Login and return

5. **Fill application form:**
   - **Message (Optional):** "I'm interested in this collaboration because..."
   - Character counter shows (e.g., "50/500 characters")

6. **Click "Submit Application"**

7. **Expected:**
   - ✅ Success toast: "Application submitted successfully!"
   - ✅ Modal closes
   - ✅ Post detail page refreshes

---

### **Test 5: Manage Applications (As Owner)**

**Prerequisites:** You must be logged in as the post creator

1. **Navigate to a post YOU created**

2. **Scroll down** to "Applications Management" section

3. **You should see:**
   - List of all applications
   - Each shows: Applicant ID, Status badge, Message, Applied date
   - "Accept" and "Reject" buttons for PENDING applications

4. **Accept an application:**
   - Click "Accept" button on a PENDING application
   - **Expected:**
     - ✅ Success toast: "Application accepted successfully"
     - ✅ Status changes to "ACCEPTED" (green badge)
     - ✅ Applicant receives notification

5. **Reject an application:**
   - Click "Reject" button on another PENDING application
   - **Expected:**
     - ✅ Success toast: "Application rejected successfully"
     - ✅ Status changes to "REJECTED" (red badge)
     - ✅ Applicant receives notification

---

### **Test 6: Close/Delete Post (As Owner)**

1. **On your post**, scroll to "Post Actions" section

2. **Close Post:**
   - Click "Close Post" button
   - **Expected:**
     - ✅ Success toast: "Post closed successfully"
     - ✅ Post status changes to "CLOSED"
     - ✅ "Apply" button disappears for other users
     - ✅ Post no longer appears in open posts feed

3. **Delete Post:**
   - Click "Delete Post" button
   - **Expected:**
     - ✅ Confirmation modal appears: "Delete Post?"
     - ✅ Warning message about permanent deletion
   - Click "Delete" in confirmation
   - **Expected:**
     - ✅ Success toast: "Post deleted successfully"
     - ✅ Redirected back to feed
     - ✅ Post no longer exists

---

## 🎯 Quick Navigation Guide

### **URLs to Remember:**

- **Feed Page:** `http://localhost:5173/collaboration`
- **Post Detail:** `http://localhost:5173/collaboration/{postId}`
- **Login:** `http://localhost:5173/login`
- **Dashboard:** `http://localhost:5173/dashboard`

### **Keyboard Shortcuts:**

- `Ctrl + R` - Refresh page
- `Ctrl + Shift + R` - Hard refresh (clear cache)
- `F12` - Open browser developer tools
- `Ctrl + L` - Focus address bar

---

## ✅ Checklist: What to Verify

As you test, check these:

**Visual:**
- [ ] Dark theme matches dashboard design
- [ ] Green accent color (#38AE56) used consistently
- [ ] Cards have hover effects
- [ ] Modals open and close smoothly
- [ ] Toast notifications appear (top-right)

**Functional:**
- [ ] Feed page loads
- [ ] Search works
- [ ] Category filter works
- [ ] Skill filter works
- [ ] Post cards are clickable
- [ ] Post detail page shows all info
- [ ] Create post works (logged in)
- [ ] Apply works (logged in)
- [ ] Owner panel appears (for post creators)
- [ ] Accept/Reject works
- [ ] Close/Delete works

**Error Handling:**
- [ ] Try applying without login → redirects to login
- [ ] Check browser console (F12) → no errors
- [ ] Check Network tab → API calls succeed

---

## 🐛 Troubleshooting

### **Page Not Loading?**

1. **Check frontend server is running:**
   - Look at terminal for "VITE ready" message
   - Check the URL it shows

2. **Check backend server is running:**
   - Look at terminal for "Started SkilllinkApplication"
   - Try: `http://localhost:8081/api/collaborations`

3. **Check browser console (F12):**
   - Look for errors
   - Check Network tab for failed requests

### **CORS Errors?**

1. **Make sure backend restarted** after CORS fix
2. **Clear browser cache:** `Ctrl + Shift + R`
3. **Check backend terminal:** Should see "Started SkilllinkApplication"

### **Can't See Posts?**

- If feed is empty, that's normal if no posts exist yet
- Create a post first to see it in the feed

---

## 🎉 Success!

If you can:
- ✅ See the collaboration feed page
- ✅ Create posts
- ✅ Apply to posts
- ✅ Manage applications (as owner)
- ✅ See toast notifications
- ✅ No console errors

**Then everything is working perfectly! 🚀**

---

## 📚 Next Steps

1. **Test all features** using the steps above
2. **Create multiple posts** to populate the feed
3. **Test with multiple users** (different accounts)
4. **Check notifications** when applications are submitted/accepted

**Enjoy your collaboration module! 🎊**
