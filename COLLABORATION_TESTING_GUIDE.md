# 🧪 Collaboration Module Testing Guide

## Prerequisites

1. **Backend Server**: Ensure your Spring Boot backend is running on `http://localhost:8081`
2. **Frontend Server**: The dev server should be running (usually on `http://localhost:5173` or `http://localhost:3000`)
3. **Browser**: Open your browser and navigate to the frontend URL

---

## 📋 Step-by-Step Testing Instructions

### **STEP 1: Access the Collaboration Page**

1. Open your browser and go to: `http://localhost:5173` (or your frontend URL)
2. Navigate to the Collaboration page:
   - **Option A**: Type `/collaboration` in the address bar
   - **Option B**: If you have a navigation menu, click on "Collaboration"
3. **Expected Result**: 
   - You should see the Collaboration Feed page
   - Dark background with gradient
   - Search bar at the top
   - Filter options (Category, Skill filter)
   - "Create Post" button (if logged in) or no button (if not logged in)
   - Grid of collaboration post cards (if any exist)

---

### **STEP 2: Test Public Feed View (No Login Required)**

1. **View All Posts**:
   - You should see all open collaboration posts displayed as cards
   - Each card shows: Title, Status badge, Category, Description preview, Skills, Duration, Posted date

2. **Test Search Functionality**:
   - Type a keyword in the search box (e.g., "React", "project")
   - **Expected**: Posts matching the keyword in title or description should appear
   - Clear the search to see all posts again

3. **Test Category Filter**:
   - Click the "Category" dropdown
   - Select "Project", "Competition", or "Event"
   - **Expected**: Only posts of that category should be displayed
   - Select "All Categories" to reset

4. **Test Skill Filter**:
   - Type a skill name in the "Filter by skill" input (e.g., "JavaScript", "Python")
   - **Expected**: Only posts requiring that skill should appear
   - Clear the filter

5. **Test Combined Filters**:
   - Apply both category and skill filters
   - **Expected**: Posts matching both criteria should appear

6. **Test Post Card Click**:
   - Click on any post card
   - **Expected**: Navigate to the post detail page showing full post information

---

### **STEP 3: Test Post Detail View (Public)**

1. **View Post Details**:
   - Click on any post card from the feed
   - **Expected**: 
     - Full post title
     - Status badge (OPEN/CLOSED/FILLED)
     - Category, Duration, Posted date
     - Full description
     - All required skills displayed as badges
     - "Back to Feed" button

2. **Test Apply Button (Without Login)**:
   - If you're NOT logged in, click "Apply to This Collaboration"
   - **Expected**: 
     - Modal opens showing "Please log in to apply" message
     - "Go to Login" button appears
     - Clicking it redirects to login page

---

### **STEP 4: Test User Registration/Login**

1. **Register a New User** (if needed):
   - Navigate to `/register`
   - Fill in the registration form
   - Submit and complete profile if required

2. **Login**:
   - Navigate to `/login`
   - Enter your email and password
   - Click "Login"
   - **Expected**: Redirected to dashboard or profile creation

3. **Verify Authentication**:
   - Check that you're logged in (user icon/profile menu visible)
   - Navigate back to `/collaboration`

---

### **STEP 5: Test Creating a Collaboration Post**

1. **Open Create Post Modal**:
   - On the Collaboration Feed page, click "Create Post" button
   - **Expected**: Modal opens with form fields

2. **Fill in Post Details**:
   - **Title**: Enter a title (e.g., "React Web App Development Project")
   - **Category**: Select from dropdown (Project/Competition/Event)
   - **Description**: Enter detailed description (e.g., "Looking for team members to build a React-based e-commerce platform...")
   - **Duration**: Enter duration (e.g., "2 weeks", "1 month")
   - **Required Skills**: 
     - Type a skill (e.g., "React")
     - Press Enter or click "Add"
     - Add multiple skills (e.g., "JavaScript", "Node.js", "MongoDB")
     - Remove a skill by clicking the "×" button on the skill badge

3. **Submit the Post**:
   - Click "Create Post" button
   - **Expected**: 
     - Success toast notification appears
     - Modal closes
     - Automatically navigates to the new post detail page
     - Post appears in the feed

4. **Verify Post Creation**:
   - Go back to feed (`/collaboration`)
   - **Expected**: Your new post appears in the list
   - Click on it to verify all details are correct

---

### **STEP 6: Test Applying to a Post**

1. **Navigate to a Post**:
   - Go to `/collaboration` feed
   - Click on any post (preferably one you didn't create)

2. **Open Apply Modal**:
   - Click "Apply to This Collaboration" button
   - **Expected**: Apply modal opens

3. **Fill Application Form**:
   - **Message** (Optional): Enter a message explaining why you're interested
   - Character counter shows (e.g., "50/500 characters")

4. **Submit Application**:
   - Click "Submit Application"
   - **Expected**: 
     - Success toast: "Application submitted successfully!"
     - Modal closes
     - Post detail page refreshes

5. **Verify Application** (as Post Owner):
   - If you created the post, you should see a notification
   - Navigate to your post detail page
   - Scroll to "Applications Management" section
   - **Expected**: Your application appears in the list with status "PENDING"

---

### **STEP 7: Test Owner Panel Features**

**Prerequisites**: You must be logged in as the post creator

1. **View Applications**:
   - Navigate to a post you created
   - Scroll to "Applications Management" section
   - **Expected**: 
     - List of all applications
     - Each shows: Applicant ID, Status badge, Message (if provided), Applied date
     - Accept/Reject buttons for PENDING applications

2. **Accept an Application**:
   - Find a PENDING application
   - Click "Accept" button
   - **Expected**: 
     - Success toast: "Application accepted successfully"
     - Application status changes to "ACCEPTED" (green badge)
     - Post status may change to "FILLED" if applicable
     - Applicant receives a notification

3. **Reject an Application**:
   - Find another PENDING application
   - Click "Reject" button
   - **Expected**: 
     - Success toast: "Application rejected successfully"
     - Application status changes to "REJECTED" (red badge)
     - Applicant receives a notification

4. **Close a Post**:
   - In the "Post Actions" section, click "Close Post"
   - **Expected**: 
     - Success toast: "Post closed successfully"
     - Post status changes to "CLOSED"
     - "Apply" button disappears for other users
     - Post no longer appears in open posts feed

5. **Delete a Post**:
   - Click "Delete Post" button
   - **Expected**: 
     - Confirmation modal appears: "Delete Post?"
     - Warning message about permanent deletion
   - Click "Delete" in confirmation
   - **Expected**: 
     - Success toast: "Post deleted successfully"
     - Redirected back to feed
     - Post no longer exists

---

### **STEP 8: Test Notifications Integration**

1. **Create a Post** (as User A):
   - Login as User A
   - Create a collaboration post
   - **Expected**: Other users receive notifications about new post

2. **Apply to Post** (as User B):
   - Login as User B (different account)
   - Apply to User A's post
   - **Expected**: 
     - User A receives notification: "New collaboration application"
     - Notification appears in notification drawer

3. **Accept/Reject Application** (as User A):
   - User A accepts/rejects User B's application
   - **Expected**: 
     - User B receives notification: "Your application was accepted/rejected"
     - Notification appears in User B's notification drawer

4. **Check Notification Types**:
   - Open notification drawer
   - **Expected**: Collaboration-related notifications show with proper types:
     - "New collaboration post" (CONNECT type)
     - "New collaboration application" (NEW_REQUEST type)
     - "Application accepted" (REQUEST_ACCEPTED type)
     - "Application rejected" (REQUEST_REJECTED type)

---

### **STEP 9: Test Error Handling**

1. **Apply Without Login**:
   - Logout (clear token)
   - Try to apply to a post
   - **Expected**: Redirected to login page

2. **Apply to Closed Post**:
   - Try to apply to a post with status "CLOSED"
   - **Expected**: Apply button should not be visible or should show error

3. **Apply Twice to Same Post**:
   - Apply to a post
   - Try to apply again
   - **Expected**: Error message: "You already applied to this post"

4. **Access Owner Panel (Not Owner)**:
   - Try to access applications for a post you didn't create
   - **Expected**: Owner panel should not be visible

5. **Network Error**:
   - Disconnect internet or stop backend
   - Try to create a post
   - **Expected**: Error toast with appropriate message

---

### **STEP 10: Test Responsive Design**

1. **Desktop View**:
   - Test on full screen (1920x1080 or similar)
   - **Expected**: 
     - Grid layout with multiple columns
     - All elements properly spaced
     - Modals centered and properly sized

2. **Tablet View**:
   - Resize browser to tablet size (768px width)
   - **Expected**: 
     - Grid adjusts to 2 columns
     - Cards remain readable
     - Modals still accessible

3. **Mobile View**:
   - Resize browser to mobile size (375px width)
   - **Expected**: 
     - Single column layout
     - Cards stack vertically
     - Search and filters stack properly
     - Modals are full-width or scrollable

---

## ✅ Checklist of Features to Verify

- [ ] Collaboration feed loads and displays posts
- [ ] Search functionality works
- [ ] Category filter works
- [ ] Skill filter works
- [ ] Combined filters work
- [ ] Post cards are clickable and navigate correctly
- [ ] Post detail page displays all information
- [ ] Create post modal opens and closes
- [ ] Post creation form validates inputs
- [ ] Post creation succeeds and navigates correctly
- [ ] Apply modal shows login prompt for unauthenticated users
- [ ] Apply modal works for authenticated users
- [ ] Application submission succeeds
- [ ] Owner panel appears only for post creators
- [ ] Applications list displays correctly
- [ ] Accept application works
- [ ] Reject application works
- [ ] Close post works
- [ ] Delete post works with confirmation
- [ ] Notifications are received for collaboration events
- [ ] Error handling works for various scenarios
- [ ] Responsive design works on different screen sizes
- [ ] All toast notifications appear correctly
- [ ] Loading states display during API calls
- [ ] Back navigation works correctly

---

## 🐛 Common Issues and Solutions

### Issue: "Failed to load posts"
**Solution**: 
- Check if backend is running on port 8081
- Check browser console for CORS errors
- Verify API endpoint: `http://localhost:8081/api/collaborations`

### Issue: "Unauthorized" errors
**Solution**: 
- Check if token is stored in localStorage
- Verify token is valid (not expired)
- Re-login if needed

### Issue: "Post not found"
**Solution**: 
- Verify post ID in URL is correct
- Check if post was deleted
- Refresh the page

### Issue: Modals not opening
**Solution**: 
- Check browser console for errors
- Verify all imports are correct
- Check if z-index conflicts exist

### Issue: Notifications not appearing
**Solution**: 
- Verify backend notification service is working
- Check notification drawer is properly integrated
- Verify notification types are registered

---

## 📝 Notes

- All collaboration endpoints require authentication except:
  - `GET /api/collaborations` (list all open posts)
  - `GET /api/collaborations/{postId}` (get single post)

- The frontend automatically handles:
  - JWT token injection via axios interceptor
  - Redirecting to login for protected actions
  - Error handling and user feedback

- Notifications are automatically sent by the backend when:
  - New post is created
  - Application is submitted
  - Application is accepted/rejected
  - Post is closed/deleted

---

## 🎉 Success Criteria

Your collaboration module is working correctly if:
1. ✅ All features listed above work as expected
2. ✅ No console errors in browser
3. ✅ All API calls succeed
4. ✅ Notifications are received correctly
5. ✅ UI is responsive and matches design
6. ✅ Error handling works properly
7. ✅ Authentication flow works correctly

---

**Happy Testing! 🚀**
