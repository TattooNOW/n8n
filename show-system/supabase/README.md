# Supabase Integration for TattooNOW Weekly Show

Complete guide for setting up Supabase as the database backend for episode data, guest management, and analytics.

## Table of Contents

1. [Setup](#setup)
2. [Database Schema](#database-schema)
3. [API Usage](#api-usage)
4. [n8n Integration](#n8n-integration)
5. [Real-Time Features](#real-time-features)

---

## Setup

### 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Wait for database provisioning (~2 minutes)
4. Note your:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon/Public Key: `eyJhbGc...` (safe for client-side)
   - Service Role Key: `eyJhbGc...` (SECRET - server-side only!)

### 2. Run Database Schema

1. Open Supabase SQL Editor
2. Copy contents of `schema.sql`
3. Run the SQL script
4. Verify tables created:
   - `episodes`
   - `guests`
   - `segments`
   - `analytics`
   - `social_posts`

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

---

## Database Schema

### Tables Overview

#### `episodes`
Main episode data: title, air date, host, QR codes, social descriptions

```sql
SELECT * FROM episodes WHERE episode_number = 1;
```

#### `guests`
Guest artists and interviewees with portfolios

```sql
SELECT * FROM guests WHERE instagram = 'sarahchen.ink';
```

#### `segments`
Episode segments (3 per episode): interview or education type

```sql
SELECT * FROM segments WHERE episode_id = 'uuid-here';
```

#### `analytics`
Post-show metrics: viewers, engagement, QR scans

```sql
SELECT * FROM analytics WHERE episode_id = 'uuid-here';
```

#### `social_posts`
Social media countdown posts with Placid graphics

```sql
SELECT * FROM social_posts WHERE episode_id = 'uuid-here';
```

---

## API Usage

### Fetch Episode Data

**From React App:**

```javascript
import { getEpisode } from '../lib/supabase';

const { data, error } = await getEpisode(5); // Episode 5

if (error) {
  console.error('Error:', error);
} else {
  console.log('Episode:', data);
}
```

**Direct Supabase Query:**

```javascript
import { supabase } from '../lib/supabase';

const { data, error } = await supabase
  .from('episodes')
  .select('*, segments(*, guest:guests(*))')
  .eq('episode_number', 5)
  .single();
```

**Using Helper Function:**

```javascript
const { data, error } = await supabase.rpc('get_episode_full', {
  episode_num: 5
});
```

### Insert Guest (from HighLevel Form)

```javascript
const { data, error } = await supabase
  .from('guests')
  .insert({
    name: 'Sarah Chen',
    bio: 'Award-winning watercolor artist...',
    style: 'Watercolor & Botanical',
    location: 'Portland, OR',
    instagram: 'sarahchen.ink',
    portfolio_images: [
      { url: 'https://...', description: '...' }
    ],
    highlevel_contact_id: 'hl_contact_123'
  })
  .select()
  .single();

console.log('Guest created:', data.id);
```

### Create Episode with Segments

```javascript
// 1. Create episode
const { data: episode } = await supabase
  .from('episodes')
  .insert({
    episode_number: 5,
    title: 'Building Your Digital Presence',
    air_date: '2026-02-20T19:00:00Z',
    host: 'Ryan Pierce',
    qr_code_url: 'https://tattoonow.com/book',
    status: 'scheduled'
  })
  .select()
  .single();

// 2. Create segments
const { data: segments } = await supabase
  .from('segments')
  .insert([
    {
      episode_id: episode.id,
      segment_number: 1,
      segment_type: 'interview',
      guest_id: 'guest-uuid-here',
      discussion_topics: ['Journey into tattooing', 'Signature style']
    },
    {
      episode_id: episode.id,
      segment_number: 2,
      segment_type: 'education',
      slides: [
        {
          title: 'Why Your Website Matters',
          keyPoints: ['80% research online', '7-second rule'],
          stats: [{ value: '3x', label: 'More bookings' }]
        }
      ]
    }
  ]);
```

---

## n8n Integration

### Workflow: HighLevel Form → Supabase

**Trigger:** HighLevel webhook (form submission)

**Steps:**

1. **Webhook Receive** - Get form data
2. **Process Images** - Download portfolio images
3. **Insert Guest** - Create guest record in Supabase
4. **Create Episode** - Create episode with segments
5. **Notify** - Send Slack/email notification

**n8n Nodes:**

```
HighLevel Webhook
    ↓
Set Variables (extract form data)
    ↓
HTTP Request (download images to S3/Cloudinary)
    ↓
Supabase Insert (guests table)
    ↓
Supabase Insert (episodes table)
    ↓
Supabase Insert (segments table)
    ↓
Slack Notification
```

**Supabase Node Configuration:**

```json
{
  "url": "{{ $env.VITE_SUPABASE_URL }}/rest/v1/guests",
  "method": "POST",
  "headers": {
    "apikey": "{{ $env.SUPABASE_SERVICE_ROLE_KEY }}",
    "Authorization": "Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  "body": {
    "name": "{{ $json.guest_name }}",
    "instagram": "{{ $json.instagram }}",
    "portfolio_images": "{{ $json.images }}"
  }
}
```

---

## Real-Time Features

### Subscribe to Episode Updates (Future)

For live feed capability during shows:

```javascript
import { subscribeToEpisode } from '../lib/supabase';

const unsubscribe = subscribeToEpisode(5, (payload) => {
  console.log('Episode updated:', payload.new);
  // Update React state, trigger slide refresh, etc.
});

// Cleanup
unsubscribe();
```

### Update QR Code Mid-Show

```javascript
await supabase
  .from('episodes')
  .update({ qr_code_url: 'https://tattoonow.com/special-offer' })
  .eq('episode_number', 5);

// Slideshow will receive real-time update if subscribed
```

---

## Security Best Practices

### Row Level Security (RLS)

RLS is enabled on all tables:

- **Public read access**: Anyone can view episodes/guests/segments
- **Authenticated write**: Only authenticated users (n8n with service key) can insert/update

### API Keys

- **Anon key**: Safe to use in React app (client-side)
- **Service role key**: SECRET! Only use in n8n (server-side)

### Environment Variables

Never commit `.env` file. Always use `.env.example` template.

---

## Backup & Recovery

### Export Data

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or via SQL Editor
SELECT * FROM episodes;
-- Copy results
```

### Restore Data

```bash
psql $DATABASE_URL < backup.sql
```

---

## Testing

### Sample Data Insert

```sql
-- Insert test episode
INSERT INTO episodes (episode_number, title, air_date, host)
VALUES (999, 'Test Episode', '2026-12-31T19:00:00Z', 'Test Host')
RETURNING *;

-- Verify
SELECT * FROM get_episode_full(999);
```

### Test API from Browser Console

```javascript
fetch('https://your-project.supabase.co/rest/v1/episodes?episode_number=eq.1', {
  headers: {
    'apikey': 'your-anon-key',
    'Authorization': 'Bearer your-anon-key'
  }
})
.then(r => r.json())
.then(console.log);
```

---

## Troubleshooting

### "Failed to fetch episode"

1. Check `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Verify tables exist in Supabase SQL Editor
3. Check RLS policies allow public read access
4. Check browser console for CORS errors

### "PGRST116: The result contains 0 rows"

Episode doesn't exist. Insert sample data or check episode number.

### n8n can't insert data

1. Verify using `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
2. Check RLS policies allow authenticated writes
3. Verify JSON payload matches table schema

---

## Next Steps

1. ✅ Run `schema.sql` in Supabase
2. ✅ Configure `.env` with credentials
3. ✅ Test `getEpisode(1)` in React app
4. ⬜ Build n8n workflow (HighLevel → Supabase)
5. ⬜ Add sample episode data
6. ⬜ Test slideshow with Supabase data
