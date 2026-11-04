// ============================================================
//  CONTENT: edit this file to make a new film.
//  Both layouts (index.html 16:9, vertical.html 9:16) read it.
//  Keep string lengths close to the originals so layouts still fit.
// ============================================================
window.CONTENT = {
  brand: {
    // CSS colour tokens
    paper: '#f3ede8', grid: '#e6ddd4', board: '#fbf9f6',
    accent: '#fe883d',      // flood colour, tags, plan blocks
    accentDeep: '#ff6410',  // final plan block
    ink: '#0c0c0c', alert: '#e0452f',
    wordmark: 'assets/wordmark.png', // transparent PNG/SVG of the name
    audio: 'audio.m4a',              // music + SFX bed, 30s
  },

  // S1: hook
  intro: ['This is', 'launch week.'],

  // S2: chaos board
  chaosBoard: { title: 'Launch week', week: 'WEEK 41', dates: 'OCT 5–9', requests: 26, conflicts: 9 },
  days: ['MON 5', 'TUE 6', 'WED 7', 'THU 8', 'FRI 9'],
  // Notifications in order of appearance (positions live in each layout file)
  notifications: [
    { title: 'Investor',   body: 'Can we see the new deck by Friday?', icon: 'I', color: '#4a7cc4' },
    { title: 'Agency',     body: 'Discovery workshop #4 is booked',    icon: 'A', color: '#8a7566' },
    { title: 'Freelancer', body: 'Out of office until the 14th',       icon: 'F', color: '#8a6fd0' },
    { title: '#launch',    body: '14 new messages',                    icon: '#', color: '#4f9a6c' },
    { title: 'Calendar',   body: 'Site launch overlaps Demo day',      icon: '!', color: '#e0452f' },
  ],
  captions: ['Busy', 'weeks.', 'Nothing', 'ships.'],

  // S3: the stat
  statTag: 'SHIPPED',
  stat: { number: '0', words: 'launches', tail: ' this quarter.' },

  // S4: logo reveal
  tagline: 'THE WEEKLY CREATIVE ENGINE FOR FOUNDERS',

  // S5: the fix
  planBoard: { title: 'Ship Week', week: 'WEEK 41', dates: 'OCT 5–9 · ONE OUTCOME', meterLabel: 'SHIPPED' },
  prompt: {
    placeholder: 'Ask MyDesigner…',
    text: 'Ship our launch page by Friday.',
    working: 'Orbiting 26 requests…',
    planning: 'Planning the week…',
    done: 'Done · Shipped by Friday',
  },
  // One block per day, Mon–Fri, 9:00–12:00
  planBlocks: [
    ['Brief', 'DIRECTION SET'], ['Design', 'UI + BRAND'], ['Build', 'WEBFLOW / FRAMER'],
    ['QA', 'REVIEWED'], ['Ship', 'LIVE BY FRIDAY'],
  ],
  planTime: '9:00–12:00',
  proofTags: ['+1 LAUNCH SHIPPED', '24–72H TURNAROUND'],

  // S7: end card. endLine words drop one by one; the last is italic.
  endLine: ['Monday,', 'brief.', 'Friday,', 'shipped.'],
  endUrl: 'MYDESIGNER.GG · START NEXT MONDAY',

  // Calendar cards: [id, day 0–4, hour (9 = 9AM), colour, name, time, tallPx?, xNudge?]
  // colours: green peach blue purple yellow pink grey
  cards: [
    ['mon-standup',0,9.4,'green','Standup','9:00'],['mon-deck',0,9.95,'purple','Deck review','10:30'],['mon-approval',0,10.5,'grey','Approval meeting','10:30'],
    ['mon-social',0,11.0,'yellow','Social assets','11:00'],['mon-agency',0,13.9,'grey','Agency sync #4','2:00'],['mon-landing',0,14.4,'peach','Landing page v7','2:30',62],
    ['mon-brand',0,15.3,'purple','Brand audit','3:30'],
    ['tue-standup',1,9.0,'green','Standup','9:00'],['tue-logo',1,9.45,'peach','Logo feedback','9:30'],['tue-kickoff',1,9.9,'blue','Kickoff call','10:00'],
    ['tue-stake',1,13.4,'pink','Stakeholder review','2:00',48],['tue-free',1,13.95,'grey','Freelancer brief','2:30'],
    ['wed-hiring',2,9.3,'grey','Hiring: designer #3','9:30'],['wed-pitch',2,8.95,'purple','Pitch deck','9:15'],['wed-investor',2,9.75,'blue','Investor update','10:00'],
    ['wed-qa',2,10.9,'green','QA pass?','11:30'],['wed-pricing',2,11.35,'peach','Pricing page','11:45'],['wed-rebrand',2,12.0,'pink','Rebrand??','12:30',56],
    ['thu-copy',3,9.15,'yellow','Copy rewrite','10:00'],['thu-feedback',3,9.25,'blue','Feedback call','10:00',null,14],['thu-lunch',3,10.9,'yellow','Lunch & learn','12:00',46],
    ['thu-board',3,12.3,'pink','Board prep','2:00',72],
    ['fri-standup',4,8.75,'green','Standup','9:00'],['fri-asset',4,9.2,'peach','Asset export','9:30'],['fri-rev',4,9.8,'pink','Revisions, round 4','11:00'],
    ['fri-onboard',4,12.8,'green','Onboarding flow','3:00'],
  ],
  // Where kept cards land on the plan board: id -> [day, hour, xNudge?, tallPx?]
  // Any card NOT listed here is thrown off the board as noise.
  finalSlots: {
    'mon-standup':[0,16.53],'tue-standup':[1,16.53],'fri-standup':[4,16.53],'tue-kickoff':[0,13.03],'mon-deck':[0,13.53],'mon-social':[0,14.03],
    'mon-landing':[0,14.55,8,50],'mon-brand':[0,15.53],'tue-logo':[1,13.03],'tue-stake':[1,13.55,0,50],'wed-investor':[2,13.03,8],'wed-pricing':[2,13.53],
    'wed-pitch':[2,14.03,8],'thu-lunch':[3,12.04,0,50],'thu-copy':[3,13.03],'thu-board':[3,13.6,0,70],'fri-asset':[4,13.03],'fri-onboard':[4,15.03],
  },
};
