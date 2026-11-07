# ⚡ Zap

**A real-time messaging app built with plain HTML, CSS and JavaScript on top of Firebase. It installs like an app and works on phones, tablets and desktops.**

[**Open Zap**](https://Sam3360.github.io/Zap/) · [User Policy](https://Sam3360.github.io/Zap/UserPolicyZap.html) · Latest version: **v11**

![Zap Banner](ZapBanner.png)

Zap started as a project to learn web development. The goal was to build a chat platform people would actually use, not another demo. It has since grown into a full messaging app with groups, roles, moderation and more, with no framework and no backend server.

---

## Features

### Chatting
- Real-time messages in **General** and **Support & Bugs**, plus private **direct messages**
- **Replies and threads**: reply to any message and open a thread to see the whole conversation
- **Forwarding** messages to any room, group or DM
- **Reactions**, message **editing**, **deleting** and **pinning**
- **@mentions** with autocomplete and a 🔔 inbox that works across every chat
- **Images**, **voice notes**, **GIFs** (powered by GIPHY) and **polls**
- **Disappearing messages**: choose 1 hour, 14 hours, 24 hours, 7 days or 14 days per chat
- Typing indicators, unread counts, and "Seen" status in DMs
- Chat history loads newest-first, with **Load earlier messages** for older ones

### Groups
- Create your own groups with a name and icon
- **Unique join codes**, shareable **invite links** and **QR codes**
- Roles: **owner**, **admin** and **member**. Admins can kick members, delete messages and set the disappearing timer. The owner can also promote admins, regenerate the code and delete the group.
- Group **description**, **rules** and a **welcome message** shown to new members

### People
- Google sign-in with **unique usernames**
- Profile photo, bio and status (online, away, do not disturb, invisible)
- Tap anyone's name or photo to open their **profile card**
- **Block** users and **report** messages

### Moderation (app admins)
- 🛡️ **Admin panel** with open reports, every group, and every user
- Delete reported messages, delete groups, and **ban or unban** accounts

### App experience
- Responsive layout designed for phones first, with swipe gestures and a bottom navigation bar
- Dark and light themes
- Installable as a **Progressive Web App** on mobile and desktop

---

## Tech

| | |
|---|---|
| Front end | HTML, CSS, vanilla JavaScript (no framework, no build step) |
| Backend | Firebase Authentication and Cloud Firestore, accessed from the browser |
| Hosting | GitHub Pages |
| GIFs | GIPHY API |
| Invite QR codes | qrcodejs |

## Project structure

```
index.html                  Login page
dashboard.html              The app
manifest.json               PWA manifest
firebase-messaging-sw.js    Service worker
icon-192.png, icon-512.png  App icons
firestore.rules             Firestore security rules (paste into Firebase, not served by the site)
UserPolicyZap.html          User policy
```

---

## Run your own copy

1. **Fork or clone** this repo.
2. **Create a Firebase project** and register a web app.
3. **Enable Authentication → Google** as a sign-in provider.
4. **Create a Firestore database.**
5. **Paste your Firebase config** into `index.html`, `dashboard.html` and `firebase-messaging-sw.js`.
6. In Firebase go to **Firestore → Rules**, paste the contents of `firestore.rules`, and publish.
7. In Firebase go to **Authentication → Settings → Authorized domains** and add your site's domain, for example `yourname.github.io`.
8. **Deploy with GitHub Pages**. Use a GitHub Actions workflow, or serve from a branch.

### Optional setup
- **Become an app admin:** copy your User UID from Firebase Authentication → Users. In Firestore, create a collection named `appAdmins` and add a document whose ID is that UID, with any field. A 🛡️ button then appears in the app.
- **Turn on GIFs:** get a free key at developers.giphy.com. In the app, tap **GIF** as an admin and paste the key.
- **Auto-delete expired messages:** in Firestore, add a Time-to-live policy on the field `expiresAt` for the collection group `messages`. Expired messages already disappear from the app without this.

---

## Security notes

- Firebase web API keys are meant to be public. Access is controlled by the **Firestore security rules** in `firestore.rules`, so publish them before sharing your app.
- Direct messages are readable only by the two people in them. Group messages are readable only by members. App admins can delete messages and groups but cannot read DMs.
- Username uniqueness and some limits are enforced by the app, not the database, which is fine for a community app but not for high-stakes use.

## Known limitations

- Notifications arrive only while Zap is open. Alerts with the app closed need Firebase Cloud Functions on the paid plan.
- Search covers the chat you are in, not every chat at once.
- Unread counts for rooms and groups are remembered per device.
- Firebase's free plan has daily read and write limits. Heavy usage may need an upgrade.

---

## Made by

**Samarth Chugh** · [GitHub @Sam3360](https://github.com/Sam3360)

Found a bug or have an idea? Open an issue, or post in **Support & Bugs** inside the app. Contributions are welcome.
