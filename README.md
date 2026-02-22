# GYM Tenant Application

The primary application used by gym organizations, their staff, and members. Built with React, Vite, and a feature-module architecture.

---

## Feature Module Architecture

Each feature is a self-contained folder with its own pages, services, and API URL definitions:

```
src/features/
├── auth/                          # Authentication
│   ├── authSlice.js               # Redux: user, token, isAuthenticated
│   ├── pages/
│   │   ├── LoginPage.jsx          # Email/password login form
│   │   └── RegisterPage.jsx       # New user registration (admin creates gym users)
│   └── services/
│       ├── authService.js         # login(), register(), getProfile()
│       └── authUrls.js            # API URL constants (/api/auth/*)
│
├── dashboard/                     # Home Dashboard
│   ├── pages/
│   │   └── DashboardPage.jsx      # KPI cards: total members, active, expiring, revenue
│   └── services/
│       ├── dashboardService.js    # getDashboardStats()
│       └── dashboardUrls.js
│
├── members/                       # Member Management (CRM Core)
│   ├── pages/
│   │   └── MembersPage.jsx        # DataTable with CRUD, search, expiry flags
│   └── services/
│       ├── memberService.js       # getAll(), create(), update(), delete(), getById()
│       └── memberUrls.js
│
├── membership/                    # Membership Packages
│   ├── pages/
│   │   └── MembershipsPage.jsx    # Package list with duration/price/features
│   └── services/
│       ├── membershipService.js   # CRUD for MembershipPackage model
│       └── membershipUrls.js
│
├── attendance/                    # Check-in & Attendance Tracking
│   ├── pages/
│   │   └── AttendancePage.jsx     # Daily log, check-in/out buttons
│   └── services/
│       ├── attendanceService.js   # checkIn(), checkOut(), getByDate(), getByMember()
│       └── attendanceUrls.js
│
├── payments/                      # Member Payments & Billing
│   ├── pages/
│   │   └── PaymentsPage.jsx       # Payment list, record payment, receipt
│   └── services/
│       ├── paymentService.js      # create(), getAll(), getByMember()
│       └── paymentUrls.js
│
├── trainers/                      # Trainer Management
│   └── TrainersPage.jsx           # Trainer listing + member assignment
│
├── workout/                       # Workout & Diet Plans + BMI
│   ├── pages/
│   │   ├── WorkoutsPage.jsx       # Trainer assigns workout/diet to members
│   │   └── BMIPage.jsx            # BMI calculator using MemberProfile height/weight
│   └── services/
│       ├── workoutService.js      # CRUD for WorkoutPlan
│       └── workoutUrls.js
│
├── floors/                        # VR Floor Management
│   ├── pages/
│   │   └── FloorManagement.jsx    # Floor CRUD, panorama upload, hotspot editor
│   └── services/
│       ├── floorService.js        # CRUD for Floor model
│       └── floorUrls.js
│
├── vr/                            # 3D/VR Gym Tour (Three.js)
│   ├── vrThemeSlice.js            # Redux: VR visual preferences
│   └── (components in components/threejs/)
│       ├── GymScene.jsx           # Main Three.js canvas + scene setup
│       ├── PanoramaViewer.jsx     # 360° sphere with panorama texture
│       ├── HotspotMarker.jsx      # Clickable 3D markers on the panorama
│       ├── FloorSelector.jsx      # UI to switch between gym floors
│       └── VRThemePanel.jsx       # Visual settings for the VR experience
│
└── notifications/                 # Push Notifications
    ├── notificationSlice.js       # Redux: notifications[], unreadCount
    ├── pages/
    │   └── NotificationsPage.jsx  # Notification list with read/unread
    └── services/
        ├── notificationService.js # getAll(), markAsRead(), getUnreadCount()
        └── notificationUrls.js
```

---

## Data Flow Per Feature

### Member Management Flow
```
MembersPage.jsx
  → memberService.getAll()
    → GET /api/members
      → memberController.getAllMembers()
        → MemberProfile.find().populate("userId membershipPlan trainerId")
          → Returns: [{ userId.name, height, weight, bmi(virtual), status, expiryDate, trainerId.name, ... }]
```

### Attendance Flow
```
AttendancePage.jsx → "Check In" button click
  → attendanceService.checkIn(memberId)
    → POST /api/attendance { memberId, method: "manual" }
      → attendanceController.markAttendance()
        → Creates Attendance { memberId, date: today, checkIn: now, method }
        → If member.expiryDate < today → returns warning "Membership expired"
```

### Payment Flow
```
PaymentsPage.jsx → "Record Payment" form submit
  → paymentService.create({ memberId, amount, method, packageId })
    → POST /api/payments
      → paymentController.createPayment()
        → Creates Payment document
        → Updates MemberProfile.expiryDate += package.duration months
        → Creates Notification { type: "payment_due", message: "Payment received" }
```

### VR Tour Flow
```
FloorManagement.jsx → Admin uploads 360° panorama + adds hotspots
  → floorService.create({ name, panoramaImage, hotspots[] })
    → POST /api/floors
      → floorController.createFloor()
        → Creates Floor document with hotspot coordinates

GymScene.jsx → Member views the VR tour
  → floorService.getAll()
    → Renders PanoramaViewer with texture from floor.panoramaImage
    → Places HotspotMarker components at each hotspot's (x,y,z) coordinates
    → FloorSelector allows switching between floors
```

### Workout Plan Flow
```
WorkoutsPage.jsx → Trainer creates plan
  → workoutService.create({ memberId, title, type: "workout", exercises[] })
    → POST /api/workouts
      → workoutController.create()
        → Creates WorkoutPlan { trainerId: req.user.id, memberId, exercises }
        → Creates Notification { userId: memberId, type: "workout_assigned" }

BMIPage.jsx → Auto-calculates from MemberProfile virtuals
  → memberService.getById(memberId)
    → Response includes: { bmi: 24.3, bmiCategory: "Normal", age: 28 }
```

---

## Subscription Restriction Logic (Frontend Side)

### Feature Flag Checks
```javascript
// In any component that needs feature gating:
const plan = useSelector(state => state.auth.plan);

if (!plan?.features?.vrEnabled) {
  return <UpgradePrompt feature="VR Module" requiredPlan="Premium" />;
}
```

### Subscription Expiry Handling
```javascript
// Axios response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403 && error.response?.data?.message?.includes("Subscription")) {
      // Redirect to subscription expired page
      window.location.href = "/subscription-expired";
    }
    return Promise.reject(error);
  }
);
```

---

## Layout Components

### AppLayout (`components/layout/AppLayout.jsx`)
The shell wrapper providing:
- **Sidebar** — Collapsible navigation with role-based menu filtering
- **TopBar** — User avatar, notification bell (badge count), search, logout

### Sidebar (`components/layout/Sidebar.jsx`)
Menu items are role-filtered:
- **Admin:** Dashboard, Members, Memberships, Attendance, Payments, Trainers, Workouts, Floors, Notifications, VR Tour
- **Trainer:** Dashboard, Members (assigned), Workouts, Attendance
- **Member:** Dashboard, My Profile, My Workouts, VR Tour

---

## State Management (Redux Toolkit)

### `authSlice`
```javascript
{
  user:  { id, name, email, role },
  token: String,
  plan:  { features, branchLimit, memberLimitPerBranch },
  isAuthenticated: Boolean
}
```

### `vrThemeSlice`
```javascript
{
  ambientLight:    Number,     // intensity
  backgroundColor: String,    // hex
  hotspotColor:    String,    // hex
  showLabels:      Boolean
}
```

### `notificationSlice`
```javascript
{
  notifications: [],
  unreadCount:   Number
}
```

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| State | Redux Toolkit |
| Routing | React Router v6 |
| HTTP | Axios (interceptors for JWT + 403 handling) |
| 3D/VR | Three.js (panoramic viewer, 3D hotspots) |
| Styling | Tailwind CSS + MUI components |
| Charts | Recharts |

---

## Setup
```bash
npm install
npm run dev    # typically runs on http://localhost:5174
```
Ensure `GYM_Backend` is running on port 5000.