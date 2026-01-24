# NA Step Guide - 12 Steps

A compassionate, privacy-first web companion for working through the Narcotics Anonymous Twelve Steps.

## Features

### ✧ All Twelve Steps
- Complete step text, themes, principles, and key questions
- Guided exploration with framework integration
- Progress tracking across all 12 steps

### 🎯 Multiple Approaches
- **Traditional NA** - NA literature focused
- **Integrated** - NA + IFS, EFT, Stoicism, Buddhism, Schema Therapy, Jungian Psychology, Existentialism
- **Adaptive** - Start traditional, introduce frameworks when helpful

### 📚 Framework Integration
Each step includes psychological frameworks:
- **IFS** (Internal Family Systems) - Parts work and Self-energy
- **EFT** (Emotionally Focused Therapy) - Attachment and connection
- **Schema Therapy** - Core beliefs and healing modes
- **Stoicism** - Virtue and what's in your control
- **Buddhism** - Suffering, mindfulness, and awakening
- **Jungian** (Step 4) - Shadow work and integration
- **Existentialism** (Step 3) - Radical responsibility

### 🌙 Daily Practice
Quick maintenance check-ins (Step 10) with:
- Morning intentions connected to your current step
- Evening reviews of the day
- Simple, grounded questions

### 🔒 Privacy First - Your Data Stays With You
**All data is stored locally on your device.** Nothing is sent to servers.

**Your data includes:**
- Profile information
- Step progress
- Conversation history
- Preferences

**Manage your backups:**
- **Export** - Download all your data as a JSON file to your computer
- **Import** - Restore from a backup file
- Store backups on Google Drive, Dropbox, or anywhere you want

This means:
- ✅ Complete privacy
- ✅ You own your data
- ✅ Works offline (except AI responses)
- ✅ No data breaches, no tracking, no ads

## Deployment

### Prerequisites
- Node.js 18+
- An Anthropic API key (https://console.anthropic.com)

### Steps

1. **Extract the files**
   ```bash
   unzip na-step-guide-full-12-steps.zip
   cd na-step-guide-full
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

4. **Run locally (development)**
   ```bash
   npm run dev
   ```
   
   Visit http://localhost:3000

5. **Deploy to Vercel** (recommended for sharing)
   ```bash
   npm install -g vercel
   vercel
   ```
   
   Then add your `ANTHROPIC_API_KEY` in Vercel's environment variables.

## Usage

### First Time
1. Enter your name
2. Share what brought you here
3. What you hope to get from this
4. Your step work experience
5. Your preferred approach (Traditional/Integrated/Adaptive)

### Main Menu
Choose:
- **Step Work** - Deep exploration of a specific step (all 12 available)
- **Daily Practice** - Quick check-in for daily maintenance

### During Step Work
- Change steps anytime (buttons at top)
- Ask questions, share, reflect
- Notice themes you're exploring (tracked below step selector)

### Managing Your Data
- **↓ Export** - Download your data as a JSON backup
- **↑ Import** - Restore from a backup
- Backups include all your profile info, conversations, and progress

## The Steps

| Step | Theme | Principle |
|------|-------|-----------|
| 1 | Powerlessness | Honesty |
| 2 | Hope | Faith |
| 3 | Decision | Surrender |
| 4 | Inventory | Courage |
| 5 | Admission | Vulnerability |
| 6 | Readiness | Willingness |
| 7 | Asking | Humility |
| 8 | Listing Harm | Responsibility |
| 9 | Making Amends | Integrity |
| 10 | Daily Inventory | Perseverance |
| 11 | Prayer & Meditation | Spirituality |
| 12 | Service | Gratitude |

## Technology

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Storage**: Browser localStorage (private, no servers)
- **Deployment**: Vercel (optional, for sharing)

## Important Notes

### Privacy & Data
- Your data never leaves your device unless you explicitly export it
- No tracking, no analytics, no ads
- You can always export your data and delete the app
- Backups are just JSON files you control completely

### API Usage
- The only thing sent to servers is your current conversation (to Claude for responses)
- Your profile/preferences stay local
- Your API key never leaves your device (proxied securely through Vercel)

### Limitations
- Data doesn't sync between devices (by design for privacy)
- Export/import manually if you use multiple devices
- Works on phones but no native app

## Troubleshooting

### "ANTHROPIC_API_KEY not found"
Make sure `.env.local` has your API key and you've restarted the dev server.

### Data not loading after import
- Check that the JSON file comes from this app's export
- Try exporting current data first, then importing the older backup

### AI responses failing
- Check your API key is valid (go to https://console.anthropic.com)
- Check your Anthropic account has credits/quota

## Sharing

This is designed for people in NA who want a private, compassionate guide for step work.

**Share the URL** (if deployed to Vercel):
- Each person gets their own private local data
- No account needed
- No central database

**For offline use:**
- Deploy locally and share the URL on your local network
- Or have people deploy their own copy

## Support & Feedback

This is a companion tool, not a replacement for:
- Your sponsor
- NA meetings
- Professional mental health support

If you're in crisis:
- Call 988 (Suicide & Crisis Lifeline)
- Text "HELLO" to 741741 (Crisis Text Line)
- Call your sponsor or a trusted person

## Future Features

- [ ] Voice input/output
- [ ] Journal/reflection storage
- [ ] Step completion tracking
- [ ] Progress analytics
- [ ] Multi-device sync (encrypted, user-controlled)
- [ ] Offline support

## License

Created for the recovery community. Use freely.

---

**Your recovery, your data, your way.**
