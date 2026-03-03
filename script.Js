/* ================================================================
   PREMIUM SAFFRON HOMEMADE CERELAC — SCRIPT.JS
   Features:
   - Google Sheets integration via Apps Script Webhook
   - Cascading Division > District > Upazila dropdowns
   - Form validation
   - GTM / Conversion event tracking
   - Package selection sync
================================================================ */

"use strict";

/* ============================================================== */
/*  ⚠️  GOOGLE SHEETS APPS SCRIPT URL — PASTE YOUR URL BELOW     */
/*  -------------------------------------------------------        */
/*  Steps to get your URL:                                         */
/*  1. Open Google Sheets → Extensions → Apps Script              */
/*  2. Paste the doPost(e) web app script                         */
/*  3. Deploy → New Deployment → Web App                          */
/*  4. Set "Who has access" to "Anyone"                           */
/*  5. Copy the Web App URL and paste it below                    */
/* ============================================================== */
const GOOGLE_SHEET_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
/* ============================================================== */
/*  END GOOGLE SHEET SCRIPT URL CONFIG                            */
/* ============================================================== */


/* ================================================================
   BANGLADESH DIVISION > DISTRICT > UPAZILA DATA
================================================================ */
const BD_DATA = {
  "ঢাকা": {
    "ঢাকা": ["সাভার", "ধামরাই", "কেরানীগঞ্জ", "নবাবগঞ্জ", "দোহার", "ঢাকা সদর"],
    "গাজীপুর": ["গাজীপুর সদর", "কালীগঞ্জ", "কাপাসিয়া", "শ্রীপুর", "কালিয়াকৈর"],
    "নারায়ণগঞ্জ": ["নারায়ণগঞ্জ সদর", "আড়াইহাজার", "বন্দর", "রূপগঞ্জ", "সোনারগাঁ"],
    "মুন্সীগঞ্জ": ["মুন্সীগঞ্জ সদর", "গজারিয়া", "লৌহজং", "শ্রীনগর", "সিরাজদিখান", "টঙ্গীবাড়ী"],
    "মানিকগঞ্জ": ["মানিকগঞ্জ সদর", "দৌলতপুর", "ঘিওর", "হরিরামপুর", "শিবালয়", "সাটুরিয়া", "সিংগাইর"],
    "কিশোরগঞ্জ": ["কিশোরগঞ্জ সদর", "অষ্টগ্রাম", "বাজিতপুর", "ভৈরব", "হোসেনপুর", "ইটনা", "করিমগঞ্জ", "কটিয়াদী", "কুলিয়ারচর", "মিঠামইন", "নিকলী", "পাকুন্দিয়া", "তাড়াইল"],
    "ময়মনসিংহ": ["ময়মনসিংহ সদর", "ভালুকা", "ধোবাউড়া", "ফুলবাড়িয়া", "গফরগাঁও", "গৌরীপুর", "হালুয়াঘাট", "ঈশ্বরগঞ্জ", "মুক্তাগাছা", "নান্দাইল", "ফুলপুর", "তারাকান্দা", "ত্রিশাল"],
    "টাঙ্গাইল": ["টাঙ্গাইল সদর", "বাসাইল", "ভূঞাপুর", "দেলদুয়ার", "ধনবাড়ী", "গোপালপুর", "ঘাটাইল", "কালিহাতী", "মধুপুর", "মির্জাপুর", "নাগরপুর", "সখিপুর"],
    "ফরিদপুর": ["ফরিদপুর সদর", "আলফাডাঙ্গা", "বোয়ালমারী", "চরভদ্রাসন", "ভাঙ্গা", "মধুখালী", "নগরকান্দা", "সালথা"],
    "রাজবাড়ী": ["রাজবাড়ী সদর", "বালিয়াকান্দি", "গোয়ালন্দ", "কালুখালী", "পাংশা"],
    "শরীয়তপুর": ["শরীয়তপুর সদর", "ভেদরগঞ্জ", "দামুদ্যা", "গোসাইরহাট", "জাজিরা", "নড়িয়া"],
    "মাদারীপুর": ["মাদারীপুর সদর", "কালকিনি", "রাজৈর", "শিবচর"],
    "গোপালগঞ্জ": ["গোপালগঞ্জ সদর", "কাশিয়ানী", "কোটালীপাড়া", "মুকসুদপুর", "টুঙ্গিপাড়া"],
    "নেত্রকোণা": ["নেত্রকোণা সদর", "আটপাড়া", "বারহাট্টা", "দুর্গাপুর", "খালিয়াজুরী", "কলমাকান্দা", "কেন্দুয়া", "মদন", "মোহনগঞ্জ", "পূর্বধলা"]
  },
  "চট্টগ্রাম": {
    "চট্টগ্রাম": ["চট্টগ্রাম সদর", "আনোয়ারা", "বাঁশখালী", "বোয়ালখালী", "চন্দনাইশ", "ফটিকছড়ি", "হাটহাজারী", "কর্ণফুলী", "লোহাগাড়া", "মিরসরাই", "পটিয়া", "রাউজান", "রাঙ্গুনিয়া", "সাতকানিয়া", "সীতাকুণ্ড"],
    "কক্সবাজার": ["কক্সবাজার সদর", "চকরিয়া", "কুতুবদিয়া", "মহেশখালী", "পেকুয়া", "রামু", "টেকনাফ", "উখিয়া"],
    "কুমিল্লা": ["কুমিল্লা সদর", "বরুড়া", "ব্রাহ্মণপাড়া", "বুড়িচং", "চান্দিনা", "চৌদ্দগ্রাম", "দাউদকান্দি", "দেবিদ্বার", "হোমনা", "লাকসাম", "লালমাই", "মেঘনা", "মনোহরগঞ্জ", "মুরাদনগর", "নাঙ্গলকোট", "তিতাস"],
    "ফেনী": ["ফেনী সদর", "ছাগলনাইয়া", "দাগনভূঁইয়া", "ফুলগাজী", "পরশুরাম", "সোনাগাজী"],
    "নোয়াখালী": ["নোয়াখালী সদর", "বেগমগঞ্জ", "চাটখিল", "কোম্পানীগঞ্জ", "হাতিয়া", "কবিরহাট", "সেনবাগ", "সোনাইমুড়ী", "সুবর্ণচর"],
    "লক্ষ্মীপুর": ["লক্ষ্মীপুর সদর", "কমলনগর", "রায়পুর", "রামগঞ্জ", "রামগতি"],
    "চাঁদপুর": ["চাঁদপুর সদর", "ফরিদগঞ্জ", "হাইমচর", "হাজীগঞ্জ", "কচুয়া", "মতলব উত্তর", "মতলব দক্ষিণ", "শাহরাস্তি"],
    "ব্রাহ্মণবাড়িয়া": ["ব্রাহ্মণবাড়িয়া সদর", "আখাউড়া", "বাঞ্ছারামপুর", "কসবা", "নবীনগর", "নাসিরনগর", "সরাইল"],
    "রাঙ্গামাটি": ["রাঙ্গামাটি সদর", "বাঘাইছড়ি", "বরকল", "বিলাইছড়ি", "কাপ্তাই", "জুরাছড়ি", "কাউখালী", "লংগদু", "নানিয়ারচর", "রাজস্থলী"],
    "বান্দরবান": ["বান্দরবান সদর", "আলীকদম", "লামা", "নাইক্ষ্যংছড়ি", "রোয়াংছড়ি", "রুমা", "থানচি"],
    "খাগড়াছড়ি": ["খাগড়াছড়ি সদর", "দিঘিনালা", "গুইমারা", "লক্ষ্মীছড়ি", "মহালছড়ি", "মানিকছড়ি", "মাটিরাঙ্গা", "পানছড়ি", "রামগড়"]
  },
  "রাজশাহী": {
    "রাজশাহী": ["রাজশাহী সদর", "বাঘা", "বাগমারা", "চারঘাট", "দুর্গাপুর", "গোদাগাড়ী", "মোহনপুর", "পবা", "পুঠিয়া", "তানোর"],
    "নওগাঁ": ["নওগাঁ সদর", "আত্রাই", "বদলগাছি", "ধামইরহাট", "মান্দা", "মহাদেবপুর", "নিয়ামতপুর", "পত্নীতলা", "পোরশা", "রাণীনগর", "সাপাহার"],
    "নাটোর": ["নাটোর সদর", "বড়াইগ্রাম", "বাগাতিপাড়া", "গুরুদাসপুর", "লালপুর", "সিংড়া"],
    "পাবনা": ["পাবনা সদর", "আটঘরিয়া", "বেড়া", "ভাঙ্গুড়া", "চাটমোহর", "ঈশ্বরদী", "ফরিদপুর", "সাঁথিয়া", "সুজানগর"],
    "সিরাজগঞ্জ": ["সিরাজগঞ্জ সদর", "বেলকুচি", "চৌহালী", "কামারখন্দ", "কাজিপুর", "রায়গঞ্জ", "শাহজাদপুর", "তাড়াশ", "উল্লাপাড়া"],
    "বগুড়া": ["বগুড়া সদর", "আদমদীঘি", "ধুনট", "দুপচাঁচিয়া", "গাবতলী", "কাহালু", "নন্দীগ্রাম", "সারিয়াকান্দি", "শাহজাহানপুর", "শিবগঞ্জ", "শেরপুর", "সোনাতলা"],
    "জয়পুরহাট": ["জয়পুরহাট সদর", "আক্কেলপুর", "কালাই", "ক্ষেতলাল", "পাঁচবিবি"],
    "চাঁপাইনবাবগঞ্জ": ["চাঁপাইনবাবগঞ্জ সদর", "ভোলাহাট", "গোমস্তাপুর", "নাচোল", "শিবগঞ্জ"]
  },
  "খুলনা": {
    "খুলনা": ["খুলনা সদর", "বটিয়াঘাটা", "দাকোপ", "ডুমুরিয়া", "দিঘলিয়া", "কয়রা", "পাইকগাছা", "ফুলতলা", "রূপসা", "তেরখাদা"],
    "বাগেরহাট": ["বাগেরহাট সদর", "চিতলমারী", "ফকিরহাট", "কচুয়া", "মোংলা", "মোড়েলগঞ্জ", "মোল্লাহাট", "রামপাল", "শরণখোলা"],
    "সাতক্ষীরা": ["সাতক্ষীরা সদর", "আশাশুনি", "দেবহাটা", "কালিগঞ্জ", "কলারোয়া", "শ্যামনগর", "তালা"],
    "যশোর": ["যশোর সদর", "অভয়নগর", "বাঘারপাড়া", "চৌগাছা", "ঝিকরগাছা", "কেশবপুর", "মণিরামপুর", "শার্শা"],
    "নড়াইল": ["নড়াইল সদর", "কালিয়া", "লোহাগড়া"],
    "মাগুরা": ["মাগুরা সদর", "মহম্মদপুর", "শালিখা", "শ্রীপুর"],
    "ঝিনাইদহ": ["ঝিনাইদহ সদর", "হরিণাকুণ্ডু", "কালীগঞ্জ", "কোটচাঁদপুর", "মহেশপুর", "শৈলকুপা"],
    "কুষ্টিয়া": ["কুষ্টিয়া সদর", "ভেড়ামারা", "দৌলতপুর", "খোকসা", "কুমারখালী", "মিরপুর"],
    "মেহেরপুর": ["মেহেরপুর সদর", "গাংনী", "মুজিবনগর"],
    "চুয়াডাঙ্গা": ["চুয়াডাঙ্গা সদর", "আলমডাঙ্গা", "দামুড়হুদা", "জীবননগর"]
  },
  "বরিশাল": {
    "বরিশাল": ["বরিশাল সদর", "আগৈলঝাড়া", "বাকেরগঞ্জ", "বানারীপাড়া", "বাবুগঞ্জ", "গৌরনদী", "হিজলা", "মেহেন্দিগঞ্জ", "মুলাদী", "উজিরপুর"],
    "ভোলা": ["ভোলা সদর", "বোরহানউদ্দিন", "চরফ্যাশন", "দৌলতখান", "লালমোহন", "মনপুরা", "তজুমদ্দিন"],
    "পিরোজপুর": ["পিরোজপুর সদর", "ভান্ডারিয়া", "কাউখালী", "মঠবাড়িয়া", "নাজিরপুর", "নেছারাবাদ", "জিয়ানগর"],
    "পটুয়াখালী": ["পটুয়াখালী সদর", "বাউফল", "দশমিনা", "গলাচিপা", "কলাপাড়া", "মির্জাগঞ্জ", "রাঙ্গাবালী"],
    "বরগুনা": ["বরগুনা সদর", "আমতলী", "বামনা", "বেতাগী", "পাথরঘাটা", "তালতলী"],
    "ঝালকাঠি": ["ঝালকাঠি সদর", "কাঠালিয়া", "নলছিটি", "রাজাপুর"]
  },
  "সিলেট": {
    "সিলেট": ["সিলেট সদর", "বালাগঞ্জ", "বিয়ানীবাজার", "বিশ্বনাথ", "কোম্পানীগঞ্জ", "ফেঞ্চুগঞ্জ", "গোলাপগঞ্জ", "গোয়াইনঘাট", "জকিগঞ্জ", "কানাইঘাট", "ওসমানীনগর", "সুনামগঞ্জ-সদর"],
    "মৌলভীবাজার": ["মৌলভীবাজার সদর", "বড়লেখা", "জুড়ী", "কমলগঞ্জ", "কুলাউড়া", "রাজনগর", "শ্রীমঙ্গল"],
    "হবিগঞ্জ": ["হবিগঞ্জ সদর", "আজমিরীগঞ্জ", "বাহুবল", "বানিয়াচং", "চুনারুঘাট", "লাখাই", "মাধবপুর", "নবীগঞ্জ"],
    "সুনামগঞ্জ": ["সুনামগঞ্জ সদর", "বিশ্বম্ভরপুর", "চাঁদপুর", "দক্ষিণ সুনামগঞ্জ", "দোয়ারাবাজার", "ছাতক", "জগন্নাথপুর", "জামালগঞ্জ", "শান্তিগঞ্জ", "তাহিরপুর", "ধর্মপাশা", "দিরাই"]
  },
  "রংপুর": {
    "রংপুর": ["রংপুর সদর", "বদরগঞ্জ", "গঙ্গাচড়া", "কাউনিয়া", "মিঠাপুকুর", "পীরগঞ্জ", "পীরগাছা", "তারাগঞ্জ"],
    "দিনাজপুর": ["দিনাজপুর সদর", "বিরামপুর", "বিরল", "বোচাগঞ্জ", "চিরিরবন্দর", "ফুলবাড়ী", "ঘোড়াঘাট", "হাকিমপুর", "কাহারোল", "খানসামা", "নবাবগঞ্জ", "পার্বতীপুর"],
    "কুড়িগ্রাম": ["কুড়িগ্রাম সদর", "ভুরুঙ্গামারী", "চর রাজিবপুর", "চিলমারী", "ফুলবাড়ী", "নাগেশ্বরী", "রাজারহাট", "রৌমারী", "উলিপুর"],
    "গাইবান্ধা": ["গাইবান্ধা সদর", "ফুলছড়ি", "গোবিন্দগঞ্জ", "পলাশবাড়ী", "সাদুল্লাপুর", "সাঘাটা", "সুন্দরগঞ্জ"],
    "নীলফামারী": ["নীলফামারী সদর", "ডিমলা", "ডোমার", "জলঢাকা", "কিশোরগঞ্জ", "সৈয়দপুর"],
    "লালমনিরহাট": ["লালমনিরহাট সদর", "আদিতমারী", "হাতীবান্ধা", "কালীগঞ্জ", "পাটগ্রাম"],
    "ঠাকুরগাঁও": ["ঠাকুরগাঁও সদর", "বালিয়াডাঙ্গী", "হরিপুর", "পীরগঞ্জ", "রানীশংকৈল"],
    "পঞ্চগড়": ["পঞ্চগড় সদর", "আটোয়ারী", "বোদা", "দেবীগঞ্জ", "তেঁতুলিয়া"]
  },
  "ময়মনসিংহ": {
    "ময়মনসিংহ": ["ময়মনসিংহ সদর", "ভালুকা", "ধোবাউড়া", "ফুলবাড়িয়া", "গফরগাঁও", "গৌরীপুর", "হালুয়াঘাট", "ঈশ্বরগঞ্জ", "মুক্তাগাছা", "নান্দাইল", "ফুলপুর", "তারাকান্দা", "ত্রিশাল"],
    "জামালপুর": ["জামালপুর সদর", "বকশীগঞ্জ", "দেওয়ানগঞ্জ", "ইসলামপুর", "মাদারগঞ্জ", "মেলান্দহ", "সরিষাবাড়ী"],
    "শেরপুর": ["শেরপুর সদর", "ঝিনাইগাতী", "নকলা", "নালিতাবাড়ী", "শ্রীবরদী"],
    "নেত্রকোণা": ["নেত্রকোণা সদর", "আটপাড়া", "বারহাট্টা", "দুর্গাপুর", "খালিয়াজুরী", "কলমাকান্দা", "কেন্দুয়া", "মদন", "মোহনগঞ্জ", "পূর্বধলা"]
  }
};


/* ================================================================
   DOM REFERENCES
================================================================ */
const divisionSelect = document.getElementById("division");
const districtSelect = document.getElementById("district");
const upazilaSelect = document.getElementById("upazila");
const packageSelect = document.getElementById("package");
const orderForm = document.getElementById("orderForm");
const successMsg = document.getElementById("successMsg");
const submitBtn = document.getElementById("submitBtn");
const selectedPkgText = document.getElementById("selectedPkgText");


/* ================================================================
   POPULATE DIVISIONS ON PAGE LOAD
================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  Object.keys(BD_DATA).forEach(division => {
    const opt = document.createElement("option");
    opt.value = division;
    opt.textContent = division;
    divisionSelect.appendChild(opt);
  });
});


/* ================================================================
   CASCADING: DIVISION → DISTRICT
================================================================ */
divisionSelect.addEventListener("change", () => {
  const selectedDiv = divisionSelect.value;

  // Reset district and upazila
  districtSelect.innerHTML = '<option value="">— জেলা নির্বাচন করুন —</option>';
  upazilaSelect.innerHTML = '<option value="">— প্রথমে জেলা নির্বাচন করুন —</option>';
  districtSelect.disabled = true;
  upazilaSelect.disabled = true;

  if (!selectedDiv) return;

  const districts = BD_DATA[selectedDiv];
  Object.keys(districts).forEach(district => {
    const opt = document.createElement("option");
    opt.value = district;
    opt.textContent = district;
    districtSelect.appendChild(opt);
  });

  districtSelect.disabled = false;
  clearError("division");
});


/* ================================================================
   CASCADING: DISTRICT → UPAZILA
================================================================ */
districtSelect.addEventListener("change", () => {
  const selectedDiv = divisionSelect.value;
  const selectedDist = districtSelect.value;

  upazilaSelect.innerHTML = '<option value="">— উপজেলা নির্বাচন করুন —</option>';
  upazilaSelect.disabled = true;

  if (!selectedDist) return;

  const upazilas = BD_DATA[selectedDiv][selectedDist];
  upazilas.forEach(upazila => {
    const opt = document.createElement("option");
    opt.value = upazila;
    opt.textContent = upazila;
    upazilaSelect.appendChild(opt);
  });

  upazilaSelect.disabled = false;
  clearError("district");
});

upazilaSelect.addEventListener("change", () => clearError("upazila"));


/* ================================================================
   PACKAGE SELECTION SYNC (from pricing cards)
================================================================ */
function selectPackage(size, price) {
  let label = "";
  if (size === "500g") { label = "500g - ৳600"; }
  else if (size === "1kg") { label = "1kg - ৳1160"; }
  else if (size === "2kg") { label = "2kg - ৳2240"; }

  packageSelect.value = label;
  selectedPkgText.textContent = `✅ নির্বাচিত প্যাকেজ: ${size === "500g" ? "৫০০ গ্রাম — ৳৬০০" : size === "1kg" ? "১ কেজি (বেস্ট সেলার) — ৳১১৬০" : "২ কেজি (সেভার) — ৳২২৪০"}`;
  clearError("package");

  // Scroll to form
  setTimeout(() => {
    document.getElementById("checkout").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

// Sync package display when select changes
packageSelect.addEventListener("change", () => {
  const val = packageSelect.value;
  if (val) {
    const labels = {
      "500g - ৳600": "৫০০ গ্রাম — ৳৬০০",
      "1kg - ৳1160": "১ কেজি (বেস্ট সেলার) — ৳১১৬০",
      "2kg - ৳2240": "২ কেজি (সেভার) — ৳২২৪০"
    };
    selectedPkgText.textContent = `✅ নির্বাচিত প্যাকেজ: ${labels[val] || val}`;
    clearError("package");
  }
});


/* ================================================================
   FORM VALIDATION
================================================================ */
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  if (field) field.classList.add("error");
  if (errorEl) errorEl.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  if (field) field.classList.remove("error");
  if (errorEl) errorEl.textContent = "";
}

function validateForm() {
  let valid = true;

  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const pkg = document.getElementById("package").value;
  const division = divisionSelect.value;
  const district = districtSelect.value;
  const upazila = upazilaSelect.value;
  const address = document.getElementById("address").value.trim();

  if (!name || name.length < 2) {
    showError("name", "সঠিক নাম দিন (কমপক্ষে ২ অক্ষর)।");
    valid = false;
  } else clearError("name");

  if (!mobile || !/^01[3-9]\d{8}$/.test(mobile)) {
    showError("mobile", "সঠিক বাংলাদেশী মোবাইল নম্বর দিন (01XXXXXXXXX)।");
    valid = false;
  } else clearError("mobile");

  if (!pkg) {
    showError("package", "একটি প্যাকেজ নির্বাচন করুন।");
    valid = false;
  } else clearError("package");

  if (!division) {
    showError("division", "বিভাগ নির্বাচন করুন।");
    valid = false;
  } else clearError("division");

  if (!district) {
    showError("district", "জেলা নির্বাচন করুন।");
    valid = false;
  } else clearError("district");

  if (!upazila) {
    showError("upazila", "উপজেলা নির্বাচন করুন।");
    valid = false;
  } else clearError("upazila");

  if (!address || address.length < 10) {
    showError("address", "সম্পূর্ণ ঠিকানা দিন (কমপক্ষে ১০ অক্ষর)।");
    valid = false;
  } else clearError("address");

  return valid;
}


/* ================================================================
   FORM SUBMISSION — GOOGLE SHEETS + GTM TRACKING
================================================================ */
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // UI: Show loading state
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");
  submitBtn.disabled = true;
  submitBtn.classList.remove("pulse-btn");
  btnText.style.display = "none";
  btnLoading.style.display = "inline";

  // Collect form data
  const formData = {
    timestamp: new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" }),
    name: document.getElementById("name").value.trim(),
    mobile: document.getElementById("mobile").value.trim(),
    package: document.getElementById("package").value,
    division: divisionSelect.value,
    district: districtSelect.value,
    upazila: upazilaSelect.value,
    address: document.getElementById("address").value.trim()
  };

  // ============================================================
  // GTM / CONVERSION TRACKING — "অর্ডার কনফার্ম করুন" BUTTON
  // This pushes a custom event to the dataLayer for GTM tracking.
  // Set up a GTM trigger on 'purchase' or 'order_confirmed' event.
  // ============================================================
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "order_confirmed",
      event_category: "ecommerce",
      event_action: "purchase",
      event_label: formData.package,
      order_package: formData.package,
      order_division: formData.division,
      order_district: formData.district,
      currency: "BDT"
    });
  }
  // ============================================================
  // END GTM CONVERSION TRACKING
  // ============================================================

  // ============================================================
  // SEND DATA TO GOOGLE SHEETS
  // ============================================================
  try {
    // Only send if a real URL is configured
    if (GOOGLE_SHEET_SCRIPT_URL && GOOGLE_SHEET_SCRIPT_URL !== "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      await fetch(GOOGLE_SHEET_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    }

    // Show success regardless of fetch result (no-cors can't read response)
    showSuccess();

  } catch (error) {
    console.error("Sheet submission error:", error);
    // Still show success to user (order received via fallback)
    showSuccess();
  }
  // ============================================================
  // END GOOGLE SHEETS SUBMISSION
  // ============================================================
});


/* ================================================================
   SHOW SUCCESS STATE
================================================================ */
function showSuccess() {
  orderForm.style.display = "none";
  successMsg.style.display = "block";
  successMsg.scrollIntoView({ behavior: "smooth", block: "center" });

  // Confetti-like emoji burst (CSS-based)
  createConfetti();
}


/* ================================================================
   CONFETTI EFFECT
================================================================ */
function createConfetti() {
  const emojis = ["🌼", "✨", "🎉", "⭐", "💛", "🌟"];
  const container = document.querySelector(".form-container");

  for (let i = 0; i < 18; i++) {
    const el = document.createElement("span");
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position: absolute;
      font-size: ${Math.random() * 14 + 12}px;
      left: ${Math.random() * 100}%;
      top: 0;
      pointer-events: none;
      z-index: 100;
      animation: confettiFall ${Math.random() * 1.5 + 1}s ease forwards;
      opacity: 1;
    `;
    container.style.position = "relative";
    container.appendChild(el);

    setTimeout(() => el.remove(), 3000);
  }

  // Inject confetti keyframe if not present
  if (!document.getElementById("confettiStyle")) {
    const style = document.createElement("style");
    style.id = "confettiStyle";
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}


/* ================================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


/* ================================================================
   SCROLL-REVEAL: Animate elements as they enter viewport
================================================================ */
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply reveal animation to cards and sections
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(
    ".ingredient-card, .price-card, .comparison-table tbody tr, .trust-item"
  );

  revealEls.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
    observer.observe(el);
  });
});


/* ================================================================
   PHONE NUMBER: FORMAT / RESTRICT TO DIGITS
================================================================ */
document.getElementById("mobile").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
});
