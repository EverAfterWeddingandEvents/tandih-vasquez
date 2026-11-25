/**
 * Tandih – Vasquez Wedding · RSVP collector
 *
 * Receives the RSVP form from the wedding website and adds one row per reply
 * to the Google Sheet this script is attached to.
 *
 * SETUP (once)
 *  1. Create a Google Sheet (any name, e.g. "Wedding RSVPs").
 *  2. In the Sheet: Extensions → Apps Script. Delete what is there, paste this whole file, Save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Click Deploy and approve the permissions Google asks for.
 *  4. Copy the "Web app URL" (it ends in /exec) and paste it into
 *     CONFIG.rsvpEndpoint at the top of js/main.js on the website.
 *
 * AFTER EDITING THIS FILE: Deploy → Manage deployments → pencil icon → Version: "New version" → Deploy.
 * (Saving alone does not update the live web app. The URL stays the same.)
 */

// ---- Settings ---------------------------------------------------------------
var SHEET_NAME = 'RSVPs';        // tab that receives the replies (created automatically)
var NOTIFY_EMAIL = '';           // optional: an address to email on every RSVP, e.g. 'you@example.com'
var MAX_GUESTS = 10;             // largest party size accepted from one reply
var HEADERS = ['Received', 'Name', 'Attending', 'Guests', 'Message'];
// -----------------------------------------------------------------------------

/** Handles the form submission from the website. */
function doPost(e) {
  try {
    var p = (e && e.parameter) || {};

    // Honeypot: real guests never see or fill this field, bots usually do.
    if (clean_(p.website)) return json_({ ok: true });

    var name = clean_(p.name).slice(0, 120);
    var attending = clean_(p.attending).toLowerCase();
    var message = clean_(p.message).slice(0, 1000);

    if (!name) return json_({ ok: false, error: 'Please tell us your name.' });
    if (attending !== 'yes' && attending !== 'no') {
      return json_({ ok: false, error: 'Please let us know if you can make it.' });
    }

    var guests = 0;
    if (attending === 'yes') {
      guests = parseInt(p.guests, 10);
      if (isNaN(guests) || guests < 1) guests = 1;
      if (guests > MAX_GUESTS) guests = MAX_GUESTS;
    }

    // One writer at a time, so two guests sending at the same moment never share a row.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = getSheet_();
      sheet.appendRow([
        new Date(),
        safeCell_(name),
        attending === 'yes' ? 'Yes' : 'No',
        guests,
        safeCell_(message)
      ]);
    } finally {
      lock.releaseLock();
    }

    notify_(name, attending, guests, message);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Something went wrong saving your RSVP. Please try again.' });
  }
}

/** Opening the web app URL in a browser shows this, which confirms the deployment is live. */
function doGet() {
  return json_({ ok: true, service: 'Tandih – Vasquez RSVP', status: 'ready' });
}

/** Run this once from the editor (Run ▸ setup) if you want the sheet tab created before the first RSVP. */
function setup() {
  getSheet_();
}

/** Run from the editor to add a sample row and check everything is wired up. */
function testRsvp() {
  var res = doPost({ parameter: { name: 'Test Guest', attending: 'yes', guests: '2', message: 'Just testing!' } });
  console.log(res.getContent());
}

// ---- Helpers ----------------------------------------------------------------

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Open this script from a Google Sheet: Extensions → Apps Script.');
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.setColumnWidth(2, 220);
    sheet.setColumnWidth(5, 420);
  }
  return sheet;
}

function clean_(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
}

/** Stops a reply that starts with = + - or @ from being run as a spreadsheet formula. */
function safeCell_(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function notify_(name, attending, guests, message) {
  if (!NOTIFY_EMAIL) return;
  try {
    var coming = attending === 'yes';
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'RSVP: ' + name + (coming ? ' is coming (' + guests + ')' : ' can\'t make it'),
      body: 'Name: ' + name + '\n' +
            'Attending: ' + (coming ? 'Yes' : 'No') + '\n' +
            'Guests: ' + guests + '\n' +
            'Message: ' + (message || '—')
    });
  } catch (err) {
    console.error('RSVP saved, but the notification email failed: ' + err);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
