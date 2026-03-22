# Hope Oncology - Cancer Doctor Appointment Reminder System

## Concept & Vision

A warm, reassuring cancer treatment clinic website that instills confidence and hope. The design balances medical professionalism with emotional comfort—patients and their families should feel they're in capable, caring hands. The integrated Google Calendar system and multi-channel reminder platform ensures patients never miss critical appointments during their treatment journey.

## Design Language

### Aesthetic Direction
**Healing Modern** — Soft, organic shapes meet clean medical precision. Think Mayo Clinic meets a boutique wellness retreat. Warm neutrals with strategic teal accents convey trust and calm.

### Color Palette
- **Primary**: `#0D7377` (Healing Teal)
- **Secondary**: `#14919B` (Soft Teal)
- **Accent**: `#FF6B6B` (Hope Coral - for CTAs and urgency)
- **Background**: `#FAFBFC` (Clean White)
- **Surface**: `#FFFFFF` (Pure White)
- **Text Primary**: `#1A2B3C` (Deep Navy)
- **Text Secondary**: `#5A6B7C` (Muted Slate)
- **Success**: `#10B981` (Recovery Green)
- **Warning**: `#F59E0B` (Amber Alert)

### Typography
- **Headings**: Source Serif 4 (warmth with authority)
- **Body**: DM Sans (modern, highly readable)
- **Monospace**: JetBrains Mono (for appointment times, codes)

### Spatial System
- Base unit: 8px
- Section padding: 80px vertical, 24px horizontal
- Card padding: 32px
- Border radius: 16px (cards), 8px (buttons), 24px (hero elements)

### Motion Philosophy
- Gentle fade-ins on scroll (300ms ease-out)
- Subtle hover lifts on cards (translateY -4px, 200ms)
- Pulsing animation on reminder status indicators
- Smooth page transitions with fade

### Visual Assets
- Lucide icons throughout (medical-friendly)
- Abstract gradient orbs for decorative backgrounds
- Soft shadows for depth (0 4px 20px rgba(13,115,119,0.1))

## Layout & Structure

### Pages

1. **Home** (`/`)
   - Hero with doctor introduction and trust indicators
   - Services grid (chemotherapy, radiation, immunotherapy, consultations)
   - Statistics section (years experience, patients treated, survival rate)
   - Testimonials carousel
   - CTA for appointment booking

2. **About** (`/about`)
   - Doctor biography with credentials
   - Team members
   - Clinic facilities gallery
   - Certifications and awards

3. **Services** (`/services`)
   - Detailed treatment options
   - What to expect guides
   - Preparation instructions

4. **Appointments** (`/appointments`)
   - Calendar view of upcoming appointments
   - Appointment booking form
   - Appointment details modal

5. **Patient Portal** (`/portal`)
   - Login/Registration
   - Upcoming appointments list
   - Reminder preferences management
   - Contact information update

6. **Contact** (`/contact`)
   - Contact form
   - Emergency contact information
   - Location with map placeholder
   - Office hours

### Admin Dashboard (`/admin`)
- Google Calendar sync status
- Appointment list with reminder status
- Reminder queue management
- Patient notification history
- Settings for reminder thresholds

## Features & Interactions

### Core Features

#### 1. Google Calendar Integration
- OAuth2 authentication with Google
- Read appointments from connected calendar
- Parse appointment details (patient name, type, time, contact)
- Auto-create reminder queue entries
- Sync status indicator in admin

#### 2. Multi-Channel Reminder System
- **SMS**: Via Twilio - appointment confirmations, 24hr and 2hr reminders
- **Voice Calls**: Via Twilio - personalized voice messages for important appointments
- **Email**: Via SendGrid - detailed appointment information, preparation instructions

#### 3. Reminder Scheduling
- Configurable reminder intervals (e.g., 7 days, 24 hours, 2 hours before)
- Different reminder channels per appointment type
- Escalation path (if SMS fails, try voice, then email)
- Do-not-disturb hours respect

#### 4. Patient Preferences
- Choose preferred reminder channels
- Set quiet hours
- Update contact information
- Opt-out of specific channels

### Interaction Details

**Appointment Card Hover**: Lift effect, shadow deepens, "View Details" appears
**Reminder Status**: Animated dots for pending, checkmark for sent, warning for failed
**Calendar Sync**: Rotating icon during sync, checkmark on success, retry button on failure
**Form Validation**: Inline validation on blur, green checkmarks for valid fields
**Empty States**: Friendly illustrations with clear CTAs

### Error Handling
- Network errors: Toast notification with retry option
- API failures: Graceful degradation with cached data display
- Invalid inputs: Red border with inline error message
- Calendar sync failures: Warning banner with manual retry

## Component Inventory

### Navigation
- Sticky header with blur backdrop
- Logo left, nav links center, CTA button right
- Mobile: hamburger menu with slide-out drawer
- States: default, scrolled (compact), mobile-open

### Hero Section
- Full-width gradient background with floating orbs
- Large heading with gradient text
- Subheading and dual CTAs
- Trust badges row

### Service Card
- Icon in colored circle
- Title and description
- Hover: lift and border glow
- Click: navigate to service detail

### Appointment Card
- Date/time prominently displayed
- Appointment type badge
- Patient name
- Reminder status indicator (dots)
- Actions: View, Edit, Send Reminder Now

### Reminder Status Badge
- Pending: Amber pulsing dot
- Sent: Green checkmark
- Failed: Red X with retry tooltip
- Scheduled: Blue clock icon

### Form Inputs
- Floating labels
- Focus: teal border glow
- Error: red border, error message below
- Success: green checkmark icon

### Modal
- Centered with backdrop blur
- Slide-up animation
- Close button top-right
- Action buttons bottom

### Toast Notifications
- Slide in from top-right
- Auto-dismiss after 5s
- Manual dismiss button
- Types: success (green), error (red), warning (amber), info (teal)

## Technical Approach

### Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM (simple, no external DB needed)
- **Authentication**: NextAuth.js for admin accounts
- **Calendar**: Google Calendar API (googleapis npm package)
- **SMS/Voice**: Twilio SDK
- **Email**: SendGrid SDK
- **Job Queue**: Custom in-memory queue with setTimeout (or Bull for production)

### API Design

#### Calendar Endpoints
```
GET  /api/calendar/auth        - Initiate Google OAuth
GET  /api/calendar/callback    - OAuth callback
GET  /api/calendar/appointments - Fetch appointments
POST /api/calendar/sync        - Trigger manual sync
```

#### Appointment Endpoints
```
GET  /api/appointments         - List all appointments
GET  /api/appointments/:id     - Get appointment details
POST /api/appointments         - Create appointment
PUT  /api/appointments/:id     - Update appointment
DELETE /api/appointments/:id   - Delete appointment
```

#### Reminder Endpoints
```
GET  /api/reminders            - List reminders
POST /api/reminders/send       - Send reminder immediately
PUT  /api/reminders/:id/preferences - Update patient preferences
GET  /api/reminders/queue      - View reminder queue
```

#### Patient Endpoints
```
POST /api/patients/register    - Register new patient
GET  /api/patients/:id         - Get patient details
PUT  /api/patients/:id         - Update patient info
```

### Data Model

```prisma
model Patient {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  phone         String
  smsOptIn      Boolean  @default(true)
  voiceOptIn    Boolean  @default(true)
  emailOptIn    Boolean  @default(true)
  quietHoursStart String? // "22:00"
  quietHoursEnd   String? // "08:00"
  appointments  Appointment[]
  createdAt     DateTime @default(now())
}

model Appointment {
  id            String   @id @default(cuid())
  patientId     String
  patient       Patient  @relation(fields: [patientId], references: [id])
  googleEventId String?  @unique
  title         String
  type          String   // "chemotherapy", "consultation", "radiation", "followup"
  startTime     DateTime
  endTime       DateTime
  notes         String?
  reminders     Reminder[]
  createdAt     DateTime @default(now())
}

model Reminder {
  id            String   @id @default(cuid())
  appointmentId String
  appointment   Appointment @relation(fields: [appointmentId], references: [id])
  channel       String   // "sms", "voice", "email"
  scheduledFor  DateTime
  status        String   @default("pending") // "pending", "sent", "failed"
  sentAt        DateTime?
  error         String?
  createdAt     DateTime @default(now())
}
```

### Environment Variables Required
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
SENDGRID_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### Cron Job Configuration
- Check for due reminders every minute
- Sync Google Calendar every 15 minutes
- Clean up old reminders weekly

## Content

### Doctor Profile
- **Name**: Dr. Sarah Mitchell, MD, PhD
- **Title**: Board-Certified Oncologist
- **Specialties**: Breast Cancer, Lung Cancer, Immunotherapy
- **Experience**: 20+ years
- **Credentials**: Stanford Medical School, Memorial Sloan Kettering Fellowship

### Sample Services
1. **Chemotherapy** - Personalized chemotherapy plans with latest protocols
2. **Radiation Therapy** - Precise targeting with state-of-the-art linear accelerators
3. **Immunotherapy** - Cutting-edge immune checkpoint inhibitors
4. **Targeted Therapy** - Genetic testing guided treatment
5. **Clinical Trials** - Access to promising new treatments
6. **Supportive Care** - Symptom management and quality of life focus

### Contact Information
- Phone: (555) 234-5678
- Emergency: (555) 234-9999
- Email: appointments@hopeoncology.com
- Hours: Mon-Fri 8am-6pm, Sat 9am-1pm
