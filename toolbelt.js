/* Studio phone showroom (Oct 12 2026, Anthony: "I don't want that message in the apps... one message outside the phones for all"). When this system is shown inside another page, the LIVE SHOWROOM ribbon does not draw; the Studio says it once, under the phones. Opened on its own, nothing changes. */
(function(){try{if(window.self!==window.top){var s=document.createElement("style");s.textContent=".ribbon{display:none!important}";(document.head||document.documentElement).appendChild(s);}}catch(e){}})();
/* ============================================================================
   TOOLBELT OS — SHOWROOM ENGINE
   Field Service / Trades OS · Accelerated Operating Systems · Accelerated Experiences LLC

   BROWSER-ONLY. Business data lives in this browser's localStorage.

   Vertical grounding — what makes the trades different:
     • The unit of work is a JOB with a truck attached to it. Travel time is real
       cost, and the second job of the day is cheaper to serve than the fifth.
     • One job carries THREE money lines that behave differently: labor (marked
       up over the tech's cost), parts (marked up over supply-house cost), and a
       trip/diagnostic fee. Generic invoicing flattens them and hides the margin.
     • WARRANTY CALLBACKS are the silent killer — you pay full cost and bill zero.
       Most shops never measure them. This one does, by tech and by cause.
     • Licences are dispatch-blocking. An expired journeyman card or EPA 608 means
       that tech legally cannot take that job, and permit work needs a permit
       number before it can close.
     • The phone is used in a crawlspace, in gloves, often with no signal.

   Benchmarks ship SOURCED-OR-BLANK (Art. IV).
   ============================================================================ */
(function (global) {
  "use strict";

  var KEY = "toolbelt_os_v1";
  var STORE = (function(){ try{ localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return localStorage; }catch(e){ return sessionStorage; } })();
  /* LOCAL noon — a UTC-midnight date reads as the previous day west of Greenwich,
     and a dispatch board off by one day is worse than no dispatch board. */
  /* TODAY IS THE REAL TODAY. The sample book was written as the week of Sun Jul 26 2026, seen on Monday the 27th (PIN).
     Its week is laid onto the current week: every literal date moves by the same whole number of weeks (SHIFT), so
     each job, visit or class keeps its weekday and "due Wednesday", "three days over" and "this week" read as
     designed; dates computed from TODAY already follow it. A book saved in an earlier week is moved the same way
     when it loads (rebase), so a returning visitor's story stays intact. Holidays and birthdays stay put.
     On a Monday the showroom reads exactly as written; on a day the business is closed, today is quiet. */
  var PIN = new Date("2026-07-27T12:00:00");
  var TODAY = (function(){ var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate(), 12, 0, 0); })();
  function iso10(d){ return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function weekSunday(d){ var x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); x.setDate(x.getDate() - x.getDay()); return x; }
  function weeksBetween(a, b){ return Math.round((weekSunday(b) - weekSunday(a)) / 604800000); }
  var SHIFT_DAYS = 7 * weeksBetween(PIN, TODAY);
  function SHIFT(s, n){ n = n === undefined ? SHIFT_DAYS : n; if (!n || typeof s !== "string") return s;
    var m = /^(\d{4})-(\d{2})-(\d{2})(.*)$/.exec(s); if (!m) return s;
    var d = new Date(+m[1], +m[2] - 1, +m[3], 12); d.setDate(d.getDate() + n); return iso10(d) + m[4]; }
  function rebase(o, n){
    if (Array.isArray(o)) { for (var i = 0; i < o.length; i++) o[i] = rebase(o[i], n); return o; }
    if (o && typeof o === "object") { Object.keys(o).forEach(function (k) { if (k !== "holidays" && k !== "dob" && k !== "born") o[k] = rebase(o[k], n); }); return o; }
    return typeof o === "string" && /^\d{4}-\d{2}-\d{2}(T[\d:.]+Z?)?$/.test(o) ? SHIFT(o, n) : o; }
  window.AOS_SHIFT = SHIFT;
  var __read0 = read, __write0 = write, THIS_WEEK = iso10(weekSunday(TODAY));
  read = function () { var d = __read0(); if (d && d._wk !== THIS_WEEK) {
      var n = 7 * weeksBetween(d._wk ? new Date(d._wk + "T12:00:00") : PIN, TODAY);
      if (n) rebase(d, n); d._wk = THIS_WEEK; delete d._day;
      try { (typeof STORE !== "undefined" ? STORE : localStorage).setItem(KEY, JSON.stringify(d)); } catch (e) {} }
    return d; };
  write = function (d) { if (d && !d._wk) d._wk = THIS_WEEK; return __write0.apply(this, arguments); };

  function now(){ return Date.now(); }
  function iso(d){ var m=d.getMonth()+1, day=d.getDate();
    return d.getFullYear()+"-"+(m<10?"0":"")+m+"-"+(day<10?"0":"")+day; }
  function addDays(d,n){ var x=new Date(d.getTime()); x.setDate(x.getDate()+n); return x; }
  function addMonths(d,n){ var x=new Date(d.getTime()); x.setMonth(x.getMonth()+n); return x; }
  function read(){ try{ var d=JSON.parse(STORE.getItem(KEY)); return d||null; }catch(e){ return null; } }
  function write(d){ d._t=now(); try{ STORE.setItem(KEY, JSON.stringify(d)); }catch(e){} }
  function clone(a){ return JSON.parse(JSON.stringify(a)); }
  var WEEK_START = (function(){ var d=new Date(TODAY.getTime()); d.setDate(d.getDate()-d.getDay()); return d; })();

  function fresh(){
    return { _t:now(), started:now(), sample:true, tier:"grandsuite", adds:[], offs:[],
      shop:clone(SEED.shop), techs:clone(SEED.techs), customers:clone(SEED.customers),
      jobs:clone(SEED.jobs), calls:clone(SEED.calls), trucks:clone(SEED.trucks), memberships:clone(SEED.memberships), parts:clone(SEED.parts), applicants:clone(SEED.applicants),
      referrers:clone(SEED.referrers), estimates:clone(SEED.estimates), drylogs:clone(SEED.drylogs), table:clone(SEED.table), claims:clone(SEED.claims), equipment:clone(SEED.equipment), mold:clone(SEED.mold), radon:clone(SEED.radon), packout:clone(SEED.packout), oncall:clone(SEED.oncall),
      documents:clone(SEED.documents), systems:clone(SEED.systems),
      approvals:clone(SEED.approvals), bus:[], seq:1 };
  }
  function emptyBook(){ var d=fresh(); d.sample=false;
    d.techs=[]; d.customers=[]; d.jobs=[]; d.applicants=[]; d.referrers=[]; d.calls=[]; d.trucks=[]; d.memberships=[];
    d.estimates=[]; d.documents=[]; d.approvals=[]; d.bus=[]; return d; }
  function goLive(){ var d=emptyBook(); write(d); return d; }
  function isSample(){ return db().sample !== false; }
  function db(){ var d=read(); if(!d){ d=fresh(); write(d); return d; }
    if(!d.calls){ d.calls = d.sample===false ? [] : clone(SEED.calls); write(d); }
    if(!d.trucks){ d.trucks = d.sample===false ? [] : clone(SEED.trucks); write(d); }
    if(!d.memberships){ d.memberships = d.sample===false ? [] : clone(SEED.memberships); write(d); }
    if(d.sample!==false && !d.techs.some(function(t){return t.id==="t9";})){ SEED.techs.filter(function(t){return t.trade==="Restoration";}).forEach(function(t){ d.techs.push(clone(t)); });
      SEED.jobs.filter(function(j){return j.trade==="Restoration";}).forEach(function(j){ var c=clone(j); c.id="r"+c.id; d.jobs.push(c); }); write(d); }
    ["claims","equipment","mold","radon","packout"].forEach(function(k){ if(!d[k]){ d[k] = d.sample===false ? [] : clone(SEED[k]); write(d); } });
    if(!d.oncall){ d.oncall = d.sample===false ? { callbackMin:15, onsiteHrs:2, rota:[], calls:[] } : clone(SEED.oncall); write(d); }
    if(!d.drylogs){ d.drylogs = d.sample===false ? [] : clone(SEED.drylogs); write(d); }
    if(!d.table){ d.table = d.sample===false ? { name:"", meets:"", where:"", members:[], referrals:[], rotations:[] } : clone(SEED.table); write(d); }
    return d; }
  function save(mut){ var d=db(); mut(d); write(d); return d; }

  /* ====================================================================
     INDUSTRY CANON
     ==================================================================== */
  var TRADES = [
    { k:"HVAC",         color:"#e4832b", note:"Heating, cooling, ductwork, heat pumps." },
    { k:"Plumbing",     color:"#2f7d8c", note:"Supply, drain, fixtures, water heaters." },
    { k:"Electrical",   color:"#e4a62b", note:"Panels, circuits, fixtures, service upgrades." },
    { k:"Refrigeration",color:"#7a5aa8", note:"Commercial refrigeration and ice machines." },
    { k:"Drain",        color:"#8a6d3b", note:"Cabling, hydro-jetting, camera inspection." },
    { k:"Appliance",    color:"#c0568f", note:"In-home appliance diagnosis and repair." },
    { k:"Restoration",  color:"#2f6fb5", note:"Water, flood, mold, fire and radon." }
  ];
  function tradeColor(k){ var t=TRADES.filter(function(x){return x.k===k;})[0]; return t?t.color:"#8391a0"; }

  /* ====================================================================
     THE TRADE SWITCH (Nov 15 2026). Anthony: "turn this into a HVAC, Plumbing,
     Electrician, Restoration OS all called toolbelt... You switch the module with
     a toggle." Same pattern as Truss OS: one core every trade shop shares
     (dispatch, trucks, time clock, quotes, invoicing, payroll, licenses, paper),
     and a MODULE per trade for the part that is different. Flip the switch and
     the shop re-tools: its job steps, its paperwork, its licenses, its permit
     rules and the board it watches. "All trades" is the multi-trade shop.
     ==================================================================== */
  var TRADE_MODS = {
    all: { k:"all", name:"All trades", ic:"✚", color:"#5b6b7c", trades:null,
      tagline:"HVAC, plumbing and electrical under one roof — the whole board at once.",
      stages:["Call in","Book","Dispatch","On site","Done & signed","Invoiced"],
      paper:["Work order","Customer signature","Invoice"],
      licences:[], permits:[], jobs:[],
      money:"Every trade on one board, one payroll and one set of books.",
      watch:"Open jobs, trucks on site, and money waiting." },
    hvac: { k:"hvac", name:"HVAC", ic:"❄", color:"#e4832b", trades:["HVAC","Refrigeration"],
      tagline:"Heating, cooling, heat pumps and refrigeration.",
      stages:["Call in","Diagnose","Quote & approve","Repair or install","Start-up & test","Service plan"],
      paper:["Equipment record (make, model, serial)","Refrigerant log for EPA 608","Start-up and commissioning sheet","Maintenance checklist"],
      licences:["EPA 608 Universal","NATE certification"],
      permits:["Refrigerant circuit work","Gas line alteration"],
      jobs:["No heat","No cool","Heat pump install","Furnace tune-up","Ductless mini-split","Refrigerant leak"],
      money:"Service plans and seasonal tune-ups carry the slow months; installs are the big tickets.",
      watch:"Callbacks inside thirty days and service-plan visits coming due." },
    plumbing: { k:"plumbing", name:"Plumbing", ic:"⧫", color:"#2f7d8c", trades:["Plumbing","Drain"],
      tagline:"Supply, drain, fixtures, water heaters and sewer lines.",
      stages:["Call in","Locate & camera","Quote & approve","Repair or replace","Pressure test & inspection","Follow-up"],
      paper:["Sewer camera video","Pressure-test record","Backflow test report","Permit and inspection card"],
      licences:["Journeyman plumber","Gas fitter","Backflow tester"],
      permits:["Water heater replacement","Sewer / water service replacement","Backflow assembly test","Gas line alteration"],
      jobs:["Clogged drain","Water heater","Leak under sink","Sewer line","Frozen pipe","Backflow test"],
      money:"Water heaters and sewer lines are the big tickets; drain calls fill the day.",
      watch:"Permits waiting on inspection and backflow tests coming due." },
    electrical: { k:"electrical", name:"Electrical", ic:"ϟ", color:"#d39a1f", trades:["Electrical"],
      tagline:"Panels, circuits, lighting, EV chargers and generators.",
      stages:["Call in","Troubleshoot","Quote & approve","Rough-in","Inspection","Trim-out & power on"],
      paper:["Load calculation","Panel schedule","Permit with rough and final inspection","Arc-fault and ground-fault test"],
      licences:["Journeyman electrician","Master electrician"],
      permits:["Electrical service / panel change","New circuit / rough-in"],
      jobs:["Panel upgrade","EV charger","Generator hookup","Breaker keeps tripping","New circuit","Lighting"],
      money:"Panel upgrades, EV chargers and generators are the big tickets.",
      watch:"Inspections waiting and work only a licensed journeyman may sign." },
    restoration: { k:"restoration", name:"Restoration", ic:"≈", color:"#2f6fb5", trades:["Restoration"],
      tagline:"Water, flood, mold, fire and radon — on call twenty-four hours.",
      stages:["First call (24/7)","On site in hours","Extract & tear-out","Dry & read daily","Dry goal met","Rebuild","Certificate of completion"],
      paper:["Work authorization signed on site","Photo log, room by room","Daily drying log (moisture, humidity, temperature, grains)","Equipment log (air movers, dehumidifiers)","Insurance estimate","Certificate of completion"],
      licences:["IICRC WRT (water)","IICRC ASD (drying)","IICRC AMRT (mold)","IICRC FSRT (fire & smoke)","EPA RRP (lead-safe)"],
      permits:["Mold removal over 10 square feet","Tear-out in a home built before 1978"],
      jobs:["Burst pipe","Flooded basement","Mold in the crawlspace","Kitchen fire","Sewage backup","Radon test"],
      money:"Most of the money comes through insurance claims, and the drying log is what gets the job paid.",
      watch:"Jobs with no drying reading today and claims waiting on the adjuster." }
  };
  var TRADE_ORDER = ["all","hvac","plumbing","electrical","restoration"];
  function tradeMods(){ return TRADE_ORDER.map(function(k){ return TRADE_MODS[k]; }); }
  function tradeMode(){ var k=db().tradeMode; return TRADE_MODS[k] ? k : "all"; }
  function tradeMod(){ return TRADE_MODS[tradeMode()]; }
  function setTradeMode(k){ if(!TRADE_MODS[k]) return db(); return save(function(d){ d.tradeMode=k;
    (d.bus=d.bus||[]).push({ stamp:iso(TODAY), from:"Owner", to:"Shop", body:"Trade switched to "+TRADE_MODS[k].name+"." }); }); }
  /* True when a record of this trade belongs on screen in the current mode. */
  function inMode(trade){ var m=tradeMod(); return !m.trades || m.trades.indexOf(trade)>=0; }

  var JOB_TYPES = ["Service call","Diagnostic","Repair","Install / replace","Maintenance (agreement)","Emergency","Warranty callback","Estimate"];

  /* HOW THE JOB GETS PAID. Each behaves differently and generic invoicing
     flattens them into one line, which is how shops lose money without seeing it. */
  var BILLING = [
    { k:"Time & materials", warranty:false, note:"Labor at the hourly rate + parts at markup + trip fee." },
    { k:"Flat rate",        warranty:false, note:"Book price per task. The customer knows the number before you start." },
    { k:"Maintenance agreement", warranty:false, note:"Prepaid seasonal visits. Revenue is recognised against the agreement, not the visit." },
    { k:"Manufacturer warranty", warranty:true,  note:"The manufacturer reimburses parts and a fixed labor allowance — usually less than your rate." },
    { k:"Our workmanship warranty", warranty:true, note:"We come back for free because something we did failed. Full cost, zero revenue." },
    { k:"New construction / GC", warranty:false, note:"Contract draw against a schedule of values. Slow pay, thin margin, big volume." },
    { k:"Insurance claim", warranty:false, note:"Restoration. Billed to the insurance carrier on an itemized estimate; the drying log and photos are the proof that gets it paid." }
  ];
  function billing(k){ return BILLING.filter(function(b){return b.k===k;})[0] || BILLING[0]; }
  function isWarrantyWork(k){ return !!billing(k).warranty; }

  /* ---------------------------------------------------------------------
     THE DISPATCH GUARDRAIL — the trades' equivalent of a scope boundary.
     Certain work legally requires a licensed journeyman or master AND a pulled
     permit. Dispatching an unlicensed tech, or closing permit work with no
     permit number, is the finding that costs a contractor their licence.
     --------------------------------------------------------------------- */
  var PERMIT_WORK = [
    { k:"Electrical service / panel change", lic:"Journeyman electrician", why:"Service equipment change requires a permit and a licensed electrician on site." },
    { k:"New circuit / rough-in",            lic:"Journeyman electrician", why:"New branch circuits are permitted work in most jurisdictions." },
    { k:"Gas line alteration",               lic:"Gas fitter",             why:"Any gas piping alteration is permitted and pressure-tested." },
    { k:"Water heater replacement",          lic:"Journeyman plumber",     why:"Replacement requires a permit and inspection in most jurisdictions." },
    { k:"Sewer / water service replacement", lic:"Journeyman plumber",     why:"Right-of-way work; permit plus utility locate required." },
    { k:"Refrigerant circuit work",          lic:"EPA 608 Universal",      why:"Federal law: no refrigerant handling without EPA 608 certification." },
    { k:"Backflow assembly test",            lic:"Backflow tester",        why:"Only a certified tester may sign the report the water purveyor accepts." },
    { k:"Mold removal over 10 square feet",  lic:"IICRC AMRT (mold)",      why:"EPA guidance: mold over ten square feet calls for trained remediators and containment." },
    { k:"Tear-out in a home built before 1978", lic:"EPA RRP (lead-safe)", why:"Federal rule: disturbing paint in a pre-1978 home needs an EPA lead-safe certified firm and renovator." }
  ];
  function permitRule(task){ return PERMIT_WORK.filter(function(p){ return p.k===task; })[0] || null; }
  function needsPermit(task){ return !!permitRule(task); }

  /* Ordinary, non-permitted tasks a tech logs on a job. */
  var TASKS = [
    "Diagnose and report","Filter change","Coil clean","Capacitor replacement","Contactor replacement",
    "Thermostat replacement","Condensate line clear","Blower motor replacement","Refrigerant leak search",
    "Drain cable / auger","Hydro-jet line","Camera inspection","Faucet / fixture replacement",
    "Toilet rebuild","Garbage disposal replacement","Shut-off valve replacement",
    "Outlet / switch replacement","Light fixture replacement","GFCI replacement","Breaker replacement",
    "Appliance diagnosis","Seasonal maintenance checklist","Safety inspection","Customer walkthrough",
    "Water extraction and set drying equipment","Daily drying readings","Tear-out of wet drywall","Mold removal over 10 square feet","Contents pack-out","Pull drying equipment"
  ];

  /* LICENCES. A lapsed required licence removes the tech from dispatch. */
  var LICENCES = [
    { k:"Driver's licence",        required:true,  note:"Every tech drives a company truck." },
    { k:"Insurance / MVR",         required:true,  note:"Carrier requires a clean MVR on file." },
    { k:"OSHA 10",                 required:true,  note:"Jobsite safety card." },
    { k:"EPA 608 Universal",       required:false, note:"Federal. No refrigerant work without it." },
    { k:"Journeyman electrician",  required:false, note:"State card. Required for permitted electrical." },
    { k:"Master electrician",      required:false, note:"Pulls permits and supervises journeymen." },
    { k:"Journeyman plumber",      required:false, note:"State card. Required for permitted plumbing." },
    { k:"Gas fitter",              required:false, note:"Required for any gas piping alteration." },
    { k:"Backflow tester",         required:false, note:"Certifies assemblies to the water purveyor." },
    { k:"NATE certification",      required:false, note:"HVAC competency credential customers recognise." },
    { k:"IICRC WRT (water)",       required:false, note:"Water damage restoration technician." },
    { k:"IICRC ASD (drying)",      required:false, note:"Applied structural drying." },
    { k:"IICRC AMRT (mold)",       required:false, note:"Applied microbial remediation — mold." },
    { k:"IICRC FSRT (fire & smoke)",required:false, note:"Fire and smoke restoration." },
    { k:"EPA RRP (lead-safe)",     required:false, note:"Lead-safe work in homes built before 1978." }
  ];
  var LIC_WARN_DAYS = 45;

  var SKILLS = ["Heat pump","Ductless mini-split","Boiler","Commercial rooftop","Ice machine",
                "Tankless water heater","Well pump","Septic","Panel upgrade","EV charger",
                "Generator","Sewer camera","Hydro-jet","Crawlspace comfortable","Attic comfortable"];

  /* MONEY RULES. Draft shop policy — the numbers a contractor actually argues about. */
  var RATES = {
    laborBillPerHr:  145.00,  // what the customer is billed per labor hour
    emergencyMult:   1.5,     // after-hours / weekend / holiday customer multiplier
    tripFee:          89.00,  // diagnostic / trip charge
    partsMarkup:      1.85,   // supply-house cost x this = customer price
    otAfterHours:    40,      // tech hours per week before overtime
    otMultiplier:     1.5,    // PAY side only
    driveePaidPerHr: 24.00,   // paid windshield time between jobs
    mileageRate:      0.70,
    burdenPct:        0.238,  // taxes, comp, truck, insurance, phone — trades burden runs high
    warrantyLaborAllowance: 75.00 // what a manufacturer typically reimburses per labor hour
  };

  var PROOF = { geofenceMeters:200, lateGraceMin:10, noShowMin:30 };

  var ATS_STAGES = ["Applied","Phone screen","Ride-along","Offer","Onboarding","Active","Declined"];
  var REFERRER_TYPES = ["General contractor","Property manager","Realtor","Home warranty company",
                        "Builder","Plumber/Electrician (trade swap)","Supply house","Past customer","Web / search"];
  var ESTIMATE_STAGES = ["Requested","Scheduled","Quoted","Won","Lost"];

  var BENCH = {
    grossMarginPct:  { value:null, note:"Not yet sourced — enter your own target." },
    callbackPct:     { value:null, note:"Not yet sourced. Track your own baseline first." },
    firstTimeFixPct: { value:null, note:"Not yet sourced." },
    techTurnoverPct: { value:null, note:"Not yet sourced." }
  };
  var REPLACES = ["Dispatch & scheduling software","Mobile field app","Estimating / flat-rate book",
                  "Truck inventory spreadsheet","Licence renewal reminders","Customer portal",
                  "E-signature service","Invoicing tool"];

  /* ====================================================================
     SEED — Selkirk Mechanical, Post Falls, Idaho.
     A real-shaped 8-truck shop: HVAC + plumbing + electrical under one roof,
     which is exactly how the successful North Idaho shops actually run.
     ==================================================================== */
  function licOn(monthsOut){ return iso(addMonths(TODAY, monthsOut)); }
  var SEED = {};

  SEED.shop = {
    name:"Selkirk Mechanical", dba:"Selkirk Mechanical, LLC",
    city:"Post Falls", state:"ID",
    licence:"ID-HVA-00000 / ID-PLU-00000 (enter your numbers)",
    owner:"Dale Kirby", phone:"(208) 555-0170",
    lat:47.7180, lng:-116.9516,
    hours:"7:00a – 5:00p, 24/7 emergency",
    holidays:["2026-01-01","2026-05-25","2026-07-04","2026-09-07","2026-11-26","2026-12-25"]
  };

  /* SWITCHBOARD — the phone floor. Simulated sample calls (the ribbon says so):
     real numbers, recordings and IVR are wired to the buyer's line at purchase. */
  SEED.calls = [
    { id:"k1", when:"T 08:42", from:"(208) 555-0214", name:"Gary Pruett", customerId:null,
      reason:"No cooling — upstairs is 84° and climbing", status:"ringing", dur:0, by:null,
      summary:null, jobId:null },
    { id:"k2", when:"T 08:40", from:"(208) 555-0202", name:null, customerId:"c2",
      reason:"Unit 14 — water heater leaking at the base", status:"ringing", dur:0, by:null,
      summary:null, jobId:null },
    { id:"k3", when:"T 08:12", from:"(208) 555-0201", name:null, customerId:"c1",
      reason:"Comfort Club spring visit — wants it before the heat", status:"booked", dur:214, by:"Front desk",
      summary:"Existing member, 2 visits/yr. Prefers mornings, dogs in yard — use gate code on file. Booked as maintenance.", jobId:null },
    { id:"k4", when:"T 07:58", from:"(208) 555-0219", name:"Lena Okafor", customerId:null,
      reason:"Quote — replace 40-gal water heater", status:"booked", dur:311, by:"AI receptionist",
      summary:"New caller, Hayden. Gas 40-gal, 11 yrs old, pilot keeps dropping. Offered first open slot off the live board; caller took it. Estimate flagged for a tankless option.", jobId:null },
    { id:"k5", when:"T 07:31", from:"(208) 555-0223", name:"R. Maldonado", customerId:null,
      reason:"Asked for a price on a panel upgrade", status:"logged", dur:126, by:"AI receptionist",
      summary:"Shopping calls only — wants ballpark for a 200A panel. Gave the visit-fee policy, no booking yet. Set a follow-up touch for Thursday.", jobId:null },
    { id:"k6", when:"T 07:05", from:"(208) 555-0208", name:null, customerId:"c3",
      reason:"Furnace short-cycling again", status:"callback", dur:0, by:null,
      summary:"Missed before open — rang 22s. Auto-queued for callback; history shows a January ignitor replacement under warranty.", jobId:null },
    { id:"y1", when:"Y 16:12", from:"(208) 555-0202", name:null, customerId:"c2",
      reason:"PO for building-6 rooftop work", status:"logged", dur:187, by:"Front desk",
      summary:"PM confirming PO before Thursday rooftop job. PO number recorded to the job record.", jobId:null },
    { id:"y2", when:"Y 11:47", from:"(208) 555-0230", name:"Walk-in referral", customerId:null,
      reason:"Mini-split quote for a garage shop", status:"booked", dur:242, by:"Front desk",
      summary:"Referred by Riverbend's PM. Wants a ductless mini-split in a 600 sq ft shop. Estimate visit booked; referral touch logged.", jobId:null }
  ];

  /* FLEETVIEW — the trucks. Positions are the last GPS ping from the branded
     technician app on each tech's phone; no vehicle hardware is required.
     This floor runs on a simulated sample fleet (the ribbon says so). Optional
     vehicle-level telemetry hardware is wired per buyer at purchase. */
  SEED.trucks = [
    { id:"v1", label:"Truck 1", techId:"t1", plate:"ID 4B–7719", unit:"2021 Ford Transit 250",
      odo:78412, serviceEveryMi:5000, lastServiceMi:75190, lastServiceOn:SHIFT("2026-06-18"),
      ping:{ lat:47.7212, lng:-116.9331, at:"08:56", mph:0, heading:"parked", battery:82 } },
    { id:"v2", label:"Truck 2", techId:"t2", plate:"ID 7K–2204", unit:"2019 RAM ProMaster 1500",
      odo:104880, serviceEveryMi:5000, lastServiceMi:99400, lastServiceOn:SHIFT("2026-04-02"),
      ping:{ lat:47.6931, lng:-116.7842, at:"08:58", mph:0, heading:"parked", battery:61 } },
    { id:"v3", label:"Truck 3", techId:"t3", plate:"ID 2C–5581", unit:"2022 Chevrolet Express 2500",
      odo:41067, serviceEveryMi:5000, lastServiceMi:39900, lastServiceOn:SHIFT("2026-07-09"),
      ping:{ lat:47.7604, lng:-116.7913, at:"08:57", mph:0, heading:"on site", battery:44 } },
    { id:"v4", label:"Truck 4", techId:"t4", plate:"ID 9J–1043", unit:"2020 Ford Transit 350",
      odo:66240, serviceEveryMi:5000, lastServiceMi:62110, lastServiceOn:SHIFT("2026-05-21"),
      ping:{ lat:47.7803, lng:-117.0102, at:"08:41", mph:0, heading:"parked", battery:19 } },
    { id:"v5", label:"Truck 5", techId:"t5", plate:"ID 5N–8827", unit:"2018 Nissan NV2500",
      odo:132904, serviceEveryMi:5000, lastServiceMi:132010, lastServiceOn:SHIFT("2026-07-28"),
      ping:{ lat:47.8104, lng:-116.8938, at:"08:59", mph:41, heading:"S", battery:73 } },
    { id:"v6", label:"Truck 6", techId:"t6", plate:"ID 6R–3390", unit:"2021 RAM ProMaster 2500",
      odo:58733, serviceEveryMi:5000, lastServiceMi:54020, lastServiceOn:SHIFT("2026-06-30"),
      ping:{ lat:47.6742, lng:-116.7661, at:"08:55", mph:0, heading:"parked", battery:88 } },
    { id:"v7", label:"Truck 7", techId:"t7", plate:"ID 8W–6612", unit:"2023 Ford Transit 250",
      odo:19488, serviceEveryMi:5000, lastServiceMi:15100, lastServiceOn:SHIFT("2026-07-15"),
      ping:{ lat:47.6958, lng:-116.7791, at:"08:58", mph:0, heading:"parked", battery:57 } }
  ];

  /* SERVICE PLANS — the maintenance agreements this shop already sells.
     The catalogue and the memberships below line up with the agreements already
     on the customer records; nothing here invents a customer or a number. */
  SEED.plans = [
    { id:"cc",  name:"Comfort Club", kind:"Residential", annual:398, visitsYr:2,
      discount:15, priority:"Front of the line on the day board",
      perks:["Two seasonal visits — heating and cooling","15% off repairs","No after-hours trip fee","Filters carried on the truck"] },
    { id:"ccp", name:"Comfort Club Plus", kind:"Residential", annual:598, visitsYr:3,
      discount:20, priority:"Same-day when a slot exists",
      perks:["Three visits — heating, cooling and a mid-season check","20% off repairs","Diagnostic fee waived","Water heater flush included"] },
    { id:"pri", name:"Priority Commercial", kind:"Commercial", annual:null, visitsYr:null,
      discount:15, priority:"Four-hour response commitment",
      perks:["Quarterly or monthly visits, quoted per site","15% off repairs","Four-hour response","Equipment list kept current"] }
  ];

  /* Memberships carry the state a plan needs that a customer record does not:
     what has been used, when it renews, and whether it renews itself. */
  SEED.memberships = [
    { id:"m1", customerId:"c1",  planId:"cc",  since:SHIFT("2021-04-02"), annual:398,  visitsYr:2,
      visitsUsed:1, lastVisit:SHIFT("2026-07-27"), renewsOn:SHIFT("2026-08-14"), autoRenew:true,  billing:"Annual", status:"Active" },
    { id:"m2", customerId:"c2",  planId:"pri", since:SHIFT("2022-02-18"), annual:7200, visitsYr:12,
      visitsUsed:7, lastVisit:SHIFT("2026-07-20"), renewsOn:SHIFT("2027-02-18"), autoRenew:true,  billing:"Monthly", status:"Active" },
    { id:"m3", customerId:"c4",  planId:"pri", since:SHIFT("2023-06-05"), annual:2400, visitsYr:4,
      visitsUsed:2, lastVisit:SHIFT("2026-06-11"), renewsOn:SHIFT("2026-09-05"), autoRenew:true,  billing:"Monthly", status:"Active" },
    { id:"m4", customerId:"c5",  planId:"cc",  since:SHIFT("2020-09-30"), annual:398,  visitsYr:2,
      visitsUsed:2, lastVisit:SHIFT("2026-07-27"), renewsOn:SHIFT("2026-08-09"), autoRenew:false, billing:"Annual", status:"Active" },
    { id:"m5", customerId:"c8",  planId:"pri", since:SHIFT("2021-11-12"), annual:3600, visitsYr:6,
      visitsUsed:3, lastVisit:SHIFT("2026-07-25"), renewsOn:SHIFT("2026-11-12"), autoRenew:true,  billing:"Monthly", status:"Active" },
    { id:"m6", customerId:"c9",  planId:"cc",  since:SHIFT("2019-05-21"), annual:398,  visitsYr:2,
      visitsUsed:0, lastVisit:SHIFT("2026-02-14"), renewsOn:SHIFT("2026-08-21"), autoRenew:true,  billing:"Annual", status:"Active" }
  ];

  SEED.techs = [
    { id:"t1", name:"Wade Fillmore", trade:"HVAC", phone:"(208) 555-0181", city:"Post Falls",
      lat:47.7150, lng:-116.9400, hired:SHIFT("2019-03-11"), payRate:38.00, status:"Active", rating:4.9,
      truck:"Truck 1", skills:["Heat pump","Ductless mini-split","Commercial rooftop","Attic comfortable"],
      lic:{ "Driver's licence":licOn(26), "Insurance / MVR":licOn(8), "OSHA 10":licOn(14),
            "EPA 608 Universal":"complete", "NATE certification":licOn(19) } },
    { id:"t2", name:"Marisela Ochoa", trade:"Plumbing", phone:"(208) 555-0182", city:"Coeur d'Alene",
      lat:47.6880, lng:-116.7800, hired:SHIFT("2020-07-06"), payRate:36.50, status:"Active", rating:4.8,
      truck:"Truck 2", skills:["Tankless water heater","Sewer camera","Crawlspace comfortable"],
      lic:{ "Driver's licence":licOn(31), "Insurance / MVR":licOn(4), "OSHA 10":licOn(9),
            "Journeyman plumber":licOn(16), "Gas fitter":licOn(11), "Backflow tester":licOn(2) } },
    { id:"t3", name:"Curtis Vandeveer", trade:"Electrical", phone:"(208) 555-0183", city:"Hayden",
      lat:47.7660, lng:-116.7866, hired:SHIFT("2018-01-22"), payRate:41.00, status:"Active", rating:5.0,
      truck:"Truck 3", skills:["Panel upgrade","EV charger","Generator"],
      lic:{ "Driver's licence":licOn(22), "Insurance / MVR":licOn(10), "OSHA 10":licOn(6),
            "Journeyman electrician":licOn(13), "Master electrician":licOn(13) } },
    { id:"t4", name:"Booker Reyes", trade:"HVAC", phone:"(208) 555-0184", city:"Post Falls",
      lat:47.7220, lng:-116.9410, hired:SHIFT("2022-05-16"), payRate:32.00, status:"Active", rating:4.6,
      truck:"Truck 4", skills:["Heat pump","Boiler","Crawlspace comfortable"],
      lic:{ "Driver's licence":licOn(28), "Insurance / MVR":licOn(7), "OSHA 10":licOn(-1),
            "EPA 608 Universal":"complete" } },
    { id:"t5", name:"Junie Halloran", trade:"Plumbing", phone:"(208) 555-0185", city:"Rathdrum",
      lat:47.8121, lng:-116.8960, hired:SHIFT("2021-09-13"), payRate:34.50, status:"Active", rating:4.7,
      truck:"Truck 5", skills:["Hydro-jet","Sewer camera","Well pump","Septic"],
      lic:{ "Driver's licence":licOn(18), "Insurance / MVR":licOn(12), "OSHA 10":licOn(20),
            "Journeyman plumber":licOn(5) } },
    { id:"t6", name:"Desmond Achterberg", trade:"Drain", phone:"(208) 555-0186", city:"Coeur d'Alene",
      lat:47.6720, lng:-116.7640, hired:SHIFT("2024-02-19"), payRate:28.00, status:"Active", rating:4.4,
      truck:"Truck 6", skills:["Hydro-jet","Sewer camera","Crawlspace comfortable"],
      lic:{ "Driver's licence":licOn(33), "Insurance / MVR":licOn(6), "OSHA 10":licOn(11) } },
    { id:"t7", name:"Priya Ranganathan", trade:"Electrical", phone:"(208) 555-0187", city:"Coeur d'Alene",
      lat:47.6930, lng:-116.7770, hired:SHIFT("2023-06-05"), payRate:35.00, status:"Active", rating:4.8,
      truck:"Truck 7", skills:["EV charger","Panel upgrade","Attic comfortable"],
      lic:{ "Driver's licence":licOn(24), "Insurance / MVR":licOn(9), "OSHA 10":licOn(15),
            "Journeyman electrician":licOn(1) } },
    { id:"t8", name:"Toby Lindquist", trade:"HVAC", phone:"(208) 555-0188", city:"Hayden",
      lat:47.7490, lng:-116.7720, hired:SHIFT("2026-06-01"), payRate:24.00, status:"Apprentice", rating:null,
      truck:"rides along", skills:["Attic comfortable"],
      lic:{ "Driver's licence":licOn(29), "Insurance / MVR":licOn(5), "OSHA 10":licOn(17) } },
    /* The restoration crew (Trade Switch, Nov 15 2026) */
    { id:"t9", name:"Rosa Delgado", trade:"Restoration", phone:"(208) 555-0189", city:"Coeur d'Alene",
      lat:47.6810, lng:-116.7900, hired:SHIFT("2022-04-04"), payRate:31.00, status:"Active", rating:4.8,
      truck:"Truck 9", skills:["Water extraction","Structural drying","Mold remediation","Crawlspace comfortable"],
      lic:{ "Driver's licence":licOn(21), "Insurance / MVR":licOn(10), "OSHA 10":licOn(16),
            "IICRC WRT (water)":licOn(19), "IICRC AMRT (mold)":licOn(3), "EPA RRP (lead-safe)":licOn(12) } },
    { id:"t10", name:"Caleb Ostrander", trade:"Restoration", phone:"(208) 555-0190", city:"Post Falls",
      lat:47.7200, lng:-116.9500, hired:SHIFT("2025-01-13"), payRate:25.00, status:"Active", rating:4.5,
      truck:"Truck 10", skills:["Water extraction","Tear-out","Contents pack-out"],
      lic:{ "Driver's licence":licOn(27), "Insurance / MVR":licOn(7), "OSHA 10":licOn(13), "IICRC WRT (water)":licOn(22) } }
  ];

  SEED.customers = [
    { id:"c1", name:"Bev Trawick", kind:"Residential", city:"Coeur d'Alene", lat:47.6890, lng:-116.7710,
      addr:"812 Lakeshore Dr", phone:"(208) 555-0201", since:SHIFT("2021-04-02"),
      equip:"Carrier 3-ton heat pump, 2019 · 50 gal gas water heater",
      agreement:"Comfort Club — 2 visits/yr", agreementAnnual:398, visitsYr:2, notes:"Two dogs. Gate code 4417." },
    { id:"c2", name:"Riverbend Apartments", kind:"Property manager", city:"Post Falls", lat:47.7100, lng:-116.9420,
      addr:"4400 Riverbend Ave", phone:"(208) 555-0202", since:SHIFT("2019-08-15"),
      equip:"48 units · package units on 6 buildings", agreement:"Priority commercial", agreementAnnual:7200, visitsYr:12,
      notes:"Bill to Coeur Property Group. PO required over $500." },
    { id:"c3", name:"Hal Bergstrom", kind:"Residential", city:"Hayden", lat:47.7620, lng:-116.7690,
      addr:"1129 Honeysuckle", phone:"(208) 555-0203", since:SHIFT("2023-11-30"),
      equip:"Lennox 96% furnace, 2023 (under mfr warranty) · A/O Smith tankless",
      agreement:"none", notes:"Installed by us — furnace still under manufacturer parts warranty." },
    { id:"c4", name:"Cedar Ridge Dental", kind:"Commercial", city:"Coeur d'Alene", lat:47.6790, lng:-116.7960,
      addr:"2200 Ironwood Dr", phone:"(208) 555-0204", since:SHIFT("2020-02-11"),
      equip:"2 rooftop units · medical gas · compressor", agreement:"Priority commercial", agreementAnnual:2400, visitsYr:4,
      notes:"Cannot lose cooling during patient hours. After-hours preferred." },
    { id:"c5", name:"Norma Pyle", kind:"Residential", city:"Rathdrum", lat:47.8090, lng:-116.8920,
      addr:"305 Mill St", phone:"(208) 555-0205", since:SHIFT("2018-06-21"),
      equip:"Well pump · 200A panel, 1978", agreement:"Comfort Club — 2 visits/yr", agreementAnnual:398, visitsYr:2,
      notes:"Elderly, hard of hearing. Call before arriving, then knock loudly." },
    { id:"c6", name:"Fairmount Builders", kind:"General contractor", city:"Post Falls", lat:47.7240, lng:-116.9280,
      addr:"c/o site — Prairie Crossing Ph 2", phone:"(208) 555-0206", since:SHIFT("2022-01-10"),
      equip:"14 spec homes in progress", agreement:"Contract — schedule of values",
      notes:"Draws on the 10th. Rough-in inspections Tuesdays." },
    { id:"c7", name:"Sal Whitcomb", kind:"Residential", city:"Post Falls", lat:47.7150, lng:-116.9600,
      addr:"77 Seltice Way", phone:"(208) 555-0207", since:SHIFT("2026-05-19"),
      equip:"Sewer line — clay, 1962", agreement:"none", notes:"Recurring root intrusion. Sold on a liner, not scheduled." },
    { id:"c8", name:"Lakeside Grill", kind:"Commercial", city:"Coeur d'Alene", lat:47.6650, lng:-116.7820,
      addr:"18 Sherman Ave", phone:"(208) 555-0208", since:SHIFT("2021-09-08"),
      equip:"Walk-in cooler · ice machine · 3-comp sink", agreement:"Priority commercial", agreementAnnual:3600, visitsYr:6,
      notes:"Health inspection sensitive. Cooler down = closed." },
    { id:"c9", name:"Dot Kilbride", kind:"Residential", city:"Hayden", lat:47.7710, lng:-116.7950,
      addr:"640 Government Way", phone:"(208) 555-0209", since:SHIFT("2024-03-14"),
      equip:"Ductless mini-split x3, 2024", agreement:"Comfort Club — 2 visits/yr", agreementAnnual:398, visitsYr:2, notes:"" },
    { id:"c10", name:"Owen Brackett", kind:"Residential", city:"Coeur d'Alene", lat:47.6640, lng:-116.7960,
      addr:"91 Fernan Hill Rd", phone:"(208) 555-0210", since:SHIFT("2025-10-02"),
      equip:"Boiler, 1998 · 100A panel", agreement:"none", notes:"Wants a panel upgrade quote." }
  ];

  /* Truck stock — the thing that decides whether a job is a first-time fix or a
     second trip. Second trips are pure margin loss. */
  SEED.parts = [
    { sku:"CAP-45-5",  name:"Dual run capacitor 45/5",  cost:14.20, trade:"HVAC",       stock:{t1:4,t4:3,t8:0} },
    { sku:"CON-2P30",  name:"Contactor 2-pole 30A",     cost:19.80, trade:"HVAC",       stock:{t1:2,t4:2,t8:0} },
    { sku:"TSTAT-PRO", name:"Programmable thermostat",  cost:78.00, trade:"HVAC",       stock:{t1:2,t4:1,t8:0} },
    { sku:"BLW-1/2",   name:"Blower motor 1/2 HP",      cost:212.00,trade:"HVAC",       stock:{t1:1,t4:0,t8:0} },
    { sku:"IGN-HSI",   name:"Hot surface igniter",      cost:31.50, trade:"HVAC",       stock:{t1:3,t4:2,t8:0} },
    { sku:"WH-40G",    name:"40 gal gas water heater",  cost:640.00,trade:"Plumbing",   stock:{t2:1,t5:0} },
    { sku:"VLV-QTR",   name:"Quarter-turn shut-off",    cost:8.40,  trade:"Plumbing",   stock:{t2:12,t5:9} },
    { sku:"WAX-RING",  name:"Wax ring kit",             cost:4.10,  trade:"Plumbing",   stock:{t2:8,t5:6} },
    { sku:"DISP-3/4",  name:"Garbage disposal 3/4 HP",  cost:96.00, trade:"Plumbing",   stock:{t2:2,t5:1} },
    { sku:"GFCI-20",   name:"GFCI receptacle 20A",      cost:16.75, trade:"Electrical", stock:{t3:10,t7:8} },
    { sku:"BRK-20-1P", name:"Breaker 20A single pole",  cost:11.90, trade:"Electrical", stock:{t3:14,t7:11} },
    { sku:"PNL-200A",  name:"200A load center",         cost:385.00,trade:"Electrical", stock:{t3:1,t7:0} },
    { sku:"EVSE-48",   name:"EV charger 48A",           cost:520.00,trade:"Electrical", stock:{t3:0,t7:1} },
    { sku:"CBL-3/8",   name:"Drain cable 3/8 x 75'",    cost:118.00,trade:"Drain",      stock:{t6:1} }
  ];

  /* ---------------------------------------------------------------- jobs
     Three weeks of work: two closed, this one live. Deliberately includes the
     things a dispatcher actually fights — an unassigned emergency, a permit job
     with no permit number, and two warranty callbacks that cost real money. */
  var JOB_SEED = [
    /* [dayOffsetFromWeekStart, customerId, trade, type, billing, start, hrs, techId, task, partsUsed{sku:qty}, note] */
    [1,"c1","HVAC","Maintenance (agreement)","Maintenance agreement","08:00",1.5,"t1","Seasonal maintenance checklist",{"CAP-45-5":0},""],
    [1,"c2","HVAC","Repair","Time & materials","10:30",3.0,"t1","Capacitor replacement",{"CAP-45-5":2,"CON-2P30":1},"Bldg 3 and 5 package units."],
    [1,"c5","Plumbing","Repair","Time & materials","08:00",2.0,"t5","Shut-off valve replacement",{"VLV-QTR":3},""],
    [1,"c10","Electrical","Estimate","Time & materials","13:00",1.0,"t3","Diagnose and report",{},"Panel upgrade quote — 1978 100A."],
    [1,"c8","Refrigeration","Emergency","Time & materials","16:30",2.5,"t1","Refrigerant leak search",{},"Walk-in at 52F. After hours."],
    [2,"c3","HVAC","Warranty callback","Manufacturer warranty","09:00",2.0,"t4","Hot surface igniter",{"IGN-HSI":1},"Lennox igniter — under mfr parts warranty."],
    [2,"c7","Drain","Service call","Time & materials","08:30",2.5,"t6","Drain cable / auger",{},"Root intrusion again. Third time this year."],
    [2,"c4","HVAC","Maintenance (agreement)","Maintenance agreement","07:00",2.0,"t4","Coil clean",{},"Before patient hours."],
    [2,"c6","Plumbing","Install / replace","New construction / GC","09:00",6.0,"t2","Water heater replacement",{"WH-40G":1},"Lot 14 rough-in."],
    [3,"c9","HVAC","Maintenance (agreement)","Maintenance agreement","10:00",1.5,"t1","Seasonal maintenance checklist",{},""],
    [3,"c1","Plumbing","Repair","Flat rate","13:00",1.5,"t2","Garbage disposal replacement",{"DISP-3/4":1},""],
    [3,"c2","Electrical","Repair","Time & materials","08:00",4.0,"t7","GFCI replacement",{"GFCI-20":6},"Six units, laundry rooms."],
    [3,"c8","Refrigeration","Warranty callback","Our workmanship warranty","14:00",3.0,"t1","Refrigerant leak search",{},"Same cooler. Our braze joint failed."],
    [4,"c10","Electrical","Install / replace","Time & materials","08:00",7.0,"t3","Electrical service / panel change",{"PNL-200A":1},"200A upgrade. PERMIT."],
    [4,"c5","Plumbing","Service call","Time & materials","09:00",2.0,"t5","Camera inspection",{},""],
    [4,"c4","Refrigeration","Repair","Time & materials","15:00",2.0,"t1","Diagnose and report",{},""],
    [4,"c6","Electrical","Install / replace","New construction / GC","08:00",8.0,"t7","New circuit / rough-in",{"BRK-20-1P":9},"Lots 12-14. PERMIT."],
    [5,"c9","Electrical","Install / replace","Time & materials","09:00",4.0,null,"EV charger",{"EVSE-48":1},"UNASSIGNED — customer confirmed."],
    [5,"c3","Plumbing","Repair","Time & materials","08:00",2.0,"t2","Faucet / fixture replacement",{},""],
    [5,"c2","Plumbing","Service call","Time & materials","11:00",3.0,null,"Toilet rebuild",{"WAX-RING":2},"UNASSIGNED — 2 units."],
    [5,"c1","HVAC","Repair","Time & materials","14:00",2.0,"t4","Blower motor replacement",{"BLW-1/2":1},""],
    [6,"c8","Refrigeration","Emergency","Time & materials","07:00",3.0,"t1","Diagnose and report",{},"Saturday. Ice machine down."],
    /* restoration (Trade Switch, Nov 15 2026) */
    [1,"c3","Restoration","Emergency","Insurance claim","07:30",4.0,"t9","Water extraction and set drying equipment",{},"Burst supply line. Work authorization signed on site."],
    [2,"c3","Restoration","Service call","Insurance claim","08:00",1.0,"t10","Daily drying readings",{},"Moisture, humidity, temperature. Photos."],
    [3,"c6","Restoration","Install / replace","Insurance claim","09:00",6.0,"t9","Mold removal over 10 square feet",{},"Crawlspace. Containment up."],
    [4,"c3","Restoration","Service call","Insurance claim","08:00",1.0,"t10","Daily drying readings",{},""],
    [5,"c9","Restoration","Emergency","Insurance claim","10:00",5.0,null,"Water extraction and set drying equipment",{},"UNASSIGNED — basement flooded, sump pump failed."]
  ];

  SEED.jobs = (function(){
    var out=[], n=1, todayISO=iso(TODAY);
    for (var wk=-2; wk<=0; wk++){
      for (var i=0;i<JOB_SEED.length;i++){
        var p=JOB_SEED[i];
        var day=addDays(WEEK_START, wk*7+p[0]), dISO=iso(day);
        var cust=SEED.customers.filter(function(c){return c.id===p[1];})[0]; if(!cust) continue;
        if (dISO < cust.since) continue;
        var techId=p[7];
        if (!techId && wk<0) techId=["t2","t7","t5"][i%3];   // prior weeks always got covered
        /* Today is a real working day, not a blank slate: morning jobs are already
           closed, the one running now is on site, the afternoon is still scheduled. */
        var startMin = hhmmToMin(p[5]);
        var status;
        if (dISO < todayISO)       status = techId ? "Closed" : "Missed";
        else if (dISO === todayISO) status = !techId ? "OPEN"
                                           : startMin + Math.round(p[6]*60) <= 12*60 ? "Closed"
                                           : startMin <= 13*60 ? "On site" : "Scheduled";
        else                        status = techId ? "Scheduled" : "OPEN";
        var endMin = hhmmToMin(p[5]) + Math.round(p[6]*60);
        var j = { id:"j"+(n++), customerId:cust.id, techId:techId||null, date:dISO,
          start:p[5], end:minToHhmm(endMin), hours:p[6],
          trade:p[2], type:p[3], billing:p[4], task:p[8],
          parts: JSON.parse(JSON.stringify(p[9]||{})), note:p[10]||"",
          status:status, proof:null, permitNo:"", mileage: 6+((n*7)%22), photos:0 };
        if (status==="Closed"){
          j.proof = { inTs:dISO+"T"+p[5]+":00", inMin:0, outTs:dISO+"T"+minToHhmm(endMin)+":00",
                      inGeo:true, method:"Mobile app (GPS)", tasks:[p[8]], sig:true, note:"" };
          j.photos = 2 + (n%4);
          if (needsPermit(p[8])) j.permitNo = "PF-2026-" + (1400+n);
        } else if (status==="On site"){
          j.proof = { inTs:dISO+"T"+p[5]+":00", inMin:0, outTs:null, inGeo:true,
                      method:"Mobile app (GPS)", tasks:[], sig:false, note:"" };
        }
        out.push(j);
      }
    }
    /* A live week always has exceptions. Place them deliberately. */
    var done = out.filter(function(j){ return j.status==="Closed" && j.proof; });
    [4,17,29,44].forEach(function(i){ if(done[i]) done[i].proof.inMin = 12+(i%9); });     // late arrival
    [9,31].forEach(function(i){ if(done[i]) done[i].proof.inGeo = false; });               // clocked in off-site
    [13,38].forEach(function(i){ if(done[i]) done[i].proof.sig = false; });                // no customer signature
    /* one permitted job closed with no permit number — the audit finding */
    var permitted = out.filter(function(j){ return needsPermit(j.task) && j.status==="Closed"; });
    if (permitted[0]) permitted[0].permitNo = "";
    return out;
  })();

  SEED.estimates = [
    { id:"e1", customerId:"c10", title:"200A service upgrade + EV circuit", trade:"Electrical",
      requested:iso(addDays(TODAY,-9)), stage:"Won", amount:4850, cost:2180,
      note:"Sold. Scheduled Thursday. Permit pulled." },
    { id:"e2", customerId:"c7", title:"Sewer line replacement — 62 ft, pipe burst", trade:"Plumbing",
      requested:iso(addDays(TODAY,-4)), stage:"Quoted", amount:11400, cost:6100,
      note:"Third root callout this year. Quote out, no answer yet." },
    { id:"e3", customerId:"c4", title:"Rooftop unit replacement (1 of 2)", trade:"HVAC",
      requested:iso(addDays(TODAY,-2)), stage:"Scheduled", amount:0, cost:0,
      note:"Site visit Wednesday to measure curb." },
    { id:"e4", customerId:"c9", title:"Whole-home surge protection", trade:"Electrical",
      requested:iso(addDays(TODAY,-16)), stage:"Lost", amount:780, cost:290,
      note:"Went with the cheaper bid. Follow up at next maintenance visit." },
    { id:"e5", customerId:"c2", title:"Replace 6 package units — phased", trade:"HVAC",
      requested:iso(addDays(TODAY,-1)), stage:"Requested", amount:0, cost:0,
      note:"Property manager asked for a phased capital plan." }
  ];

  SEED.applicants = [
    { id:"a1", name:"Reece Mowbray", trade:"HVAC", phone:"(208) 555-0230", city:"Post Falls",
      applied:iso(addDays(TODAY,-1)), stage:"Applied", lic:["EPA 608 Universal"], yrs:6, hasTools:true,
      note:"Currently at a competitor. Wants out of on-call rotation." },
    { id:"a2", name:"Tanya Escobedo", trade:"Electrical", phone:"(208) 555-0231", city:"Coeur d'Alene",
      applied:iso(addDays(TODAY,-3)), stage:"Phone screen", lic:["Journeyman electrician","OSHA 10"], yrs:9, hasTools:true,
      note:"Strong. Journeyman card current. Asking $42." },
    { id:"a3", name:"Cody Reinhart", trade:"Plumbing", phone:"(208) 555-0232", city:"Rathdrum",
      applied:iso(addDays(TODAY,-6)), stage:"Ride-along", lic:["OSHA 10"], yrs:2, hasTools:false,
      note:"Apprentice level. Rides with Junie Thursday." },
    { id:"a4", name:"Marcus Delahoy", trade:"HVAC", phone:"(208) 555-0233", city:"Hayden",
      applied:iso(addDays(TODAY,-12)), stage:"Offer", lic:["EPA 608 Universal","NATE certification"], yrs:11, hasTools:true,
      note:"Offer out at $39. Deciding." },
    { id:"a5", name:"Wyatt Boothe", trade:"Drain", phone:"(208) 555-0234", city:"Post Falls",
      applied:iso(addDays(TODAY,-8)), stage:"Declined", lic:[], yrs:0, hasTools:false,
      note:"No licence, no vehicle, availability does not match." }
  ];

  /* RESTORATION · THE DRYING LOG (Nov 15 2026). A sample book: the readings
     restoration crews take once a day until every wet material reaches its
     dry goal (the reading of the same material in a room that never got wet).
     IICRC S500 asks for it; the insurance adjuster pays on it. */
  SEED.drylogs = [
    { id:"w1", customer:"Hendricks", city:"Coeur d'Alene", loss:"Burst supply line in the hall bathroom",
      category:1, cls:2, started:iso(addDays(TODAY,-2)), carrier:"Homeowner's insurance", claim:"(claim number)",
      airMovers:6, dehus:2, tech:"t4",
      rooms:[ { name:"Hall bathroom", material:"Drywall", goal:12, readings:[38,24,15] },
              { name:"Hallway",       material:"Subfloor",goal:14, readings:[31,22,16] },
              { name:"Bedroom 2",     material:"Carpet pad (pulled)", goal:0, readings:[] } ],
      atmo:[ { rh:68, temp:72, gpp:83 }, { rh:44, temp:76, gpp:61 }, { rh:36, temp:78, gpp:52 } ] },
    { id:"w2", customer:"Ochoa", city:"Post Falls", loss:"Basement flooded — sump pump failed",
      category:2, cls:3, started:iso(addDays(TODAY,-1)), carrier:"Homeowner's insurance", claim:"(claim number)",
      airMovers:10, dehus:3, tech:"t6",
      rooms:[ { name:"Basement family room", material:"Drywall", goal:12, readings:[41] },
              { name:"Basement bedroom",     material:"Drywall", goal:12, readings:[36] } ],
      atmo:[ { rh:74, temp:66, gpp:73 } ] }
  ];
  /* THE TABLE — the weekly referral group. One company per trade sits at the table;
     they meet every week and pass each other work. Realtor offices, property managers
     and insurance programs can also hand jobs out IN TURN (a rotation). Sample names. */
  SEED.table = {
    name:"Thursday Trades Table", meets:"Thursdays · 7:00 AM", where:"Set by the group",
    members:[
      { co:"Selkirk Mechanical", trade:"HVAC, plumbing, electrical", person:"Dale Kirby", us:true },
      { co:"Lakeshore Restoration", trade:"Restoration", person:"(owner)" },
      { co:"Hayden Lake Roofing", trade:"Roofing", person:"(owner)" },
      { co:"North Shore Realty", trade:"Real estate", person:"(agent)" },
      { co:"Kootenai Home Inspections", trade:"Home inspection", person:"(inspector)" },
      { co:"Lake City Insurance", trade:"Insurance agent", person:"(agent)" },
      { co:"Riverbend Property Mgmt", trade:"Property management", person:"(manager)" }
    ],
    referrals:[
      { date:iso(addDays(TODAY,-6)), from:"Lakeshore Restoration", to:"Selkirk Mechanical", customer:"Hendricks", need:"Re-pipe the burst supply line", status:"Booked", value:1850 },
      { date:iso(addDays(TODAY,-5)), from:"Selkirk Mechanical", to:"Lakeshore Restoration", customer:"Ochoa", need:"Flooded basement — dry-out", status:"Working", value:0 },
      { date:iso(addDays(TODAY,-4)), from:"North Shore Realty", to:"Selkirk Mechanical", customer:"Listing on Mullan Ave", need:"Furnace check before closing", status:"Closed", value:240 },
      { date:iso(addDays(TODAY,-3)), from:"Kootenai Home Inspections", to:"Lakeshore Restoration", customer:"Buyer on 4th St", need:"Mold found in the crawlspace", status:"Passed", value:0 },
      { date:iso(addDays(TODAY,-1)), from:"Selkirk Mechanical", to:"Hayden Lake Roofing", customer:"Patel", need:"Roof leak over the furnace closet", status:"Passed", value:0 }
    ],
    rotations:[
      { source:"North Shore Realty office", trade:"HVAC", order:["Selkirk Mechanical","Pine Street Heating","Blue Flame HVAC"], next:1,
        note:"Inspection repairs go to the next company in line." },
      { source:"Riverbend Property Mgmt", trade:"Restoration", order:["Lakeshore Restoration","Summit Restoration"], next:0,
        note:"Water calls go out by turn; answer fast or the turn passes." }
    ]
  };
  /* RESTORATION ROOMS (Nov 16 2026): claim packet, equipment, mold & radon,
     contents pack-out, the 24-hour line. Sample book; every number is the shop's own. */
  SEED.claims = [
    { id:"cl1", job:"w1", customer:"Hendricks", carrier:"Homeowner's insurance", claimNo:"(claim number)", adjuster:"(adjuster name)", deductible:1000,
      status:"Estimate sent", docs:{ auth:true, photos:true, drylog:true, equip:true, estimate:true, cert:false } },
    { id:"cl2", job:"w2", customer:"Ochoa", carrier:"Homeowner's insurance", claimNo:"(claim number)", adjuster:"(adjuster name)", deductible:2500,
      status:"Open", docs:{ auth:true, photos:true, drylog:false, equip:true, estimate:false, cert:false } }
  ];
  SEED.equipment = [
    { id:"am1", type:"Air mover", tag:"AM-01", job:"w1", since:iso(addDays(TODAY,-2)) },
    { id:"am2", type:"Air mover", tag:"AM-02", job:"w1", since:iso(addDays(TODAY,-2)) },
    { id:"am3", type:"Air mover", tag:"AM-03", job:"w1", since:iso(addDays(TODAY,-2)) },
    { id:"am4", type:"Air mover", tag:"AM-04", job:"w2", since:iso(addDays(TODAY,-1)) },
    { id:"am5", type:"Air mover", tag:"AM-05", job:"w2", since:iso(addDays(TODAY,-1)) },
    { id:"am6", type:"Air mover", tag:"AM-06", job:null, since:null },
    { id:"dh1", type:"Dehumidifier", tag:"DH-01", job:"w1", since:iso(addDays(TODAY,-2)) },
    { id:"dh2", type:"Dehumidifier", tag:"DH-02", job:"w2", since:iso(addDays(TODAY,-1)) },
    { id:"dh3", type:"Dehumidifier", tag:"DH-03", job:null, since:null },
    { id:"as1", type:"Air scrubber", tag:"AS-01", job:"m1", since:iso(addDays(TODAY,-3)) },
    { id:"mr1", type:"Moisture meter", tag:"MM-01", job:null, since:null }
  ];
  SEED.mold = [
    { id:"m1", customer:"Buyer on 4th St", city:"Coeur d'Alene", where:"Crawlspace under the kitchen", sqft:60, cause:"Slow leak at the dishwasher supply", status:"Containment up" },
    { id:"m2", customer:"Patel", city:"Hayden", where:"Bathroom ceiling", sqft:6, cause:"No exhaust fan", status:"Assessed" }
  ];
  SEED.radon = [
    { id:"r1", customer:"Listing on Mullan Ave", city:"Post Falls", level:6.2, date:iso(addDays(TODAY,-5)), status:"Mitigation quoted" },
    { id:"r2", customer:"Hendricks", city:"Coeur d'Alene", level:1.4, date:iso(addDays(TODAY,-12)), status:"Below action level" }
  ];
  SEED.packout = [
    { id:"p1", customer:"Kitchen fire — Ruiz", city:"Rathdrum", storage:"Shop bay 2",
      boxes:[ { room:"Kitchen", n:14, cond:"Clean & restore" }, { room:"Living room", n:9, cond:"Clean & restore" },
              { room:"Kitchen", n:4, cond:"Not salvageable — photographed" }, { room:"Primary bedroom", n:6, cond:"Clean & restore" } ],
      status:"In storage" }
  ];
  SEED.oncall = {
    callbackMin:15, onsiteHrs:2,
    rota:[ { who:"t9", from:iso(addDays(TODAY,-3)), to:iso(addDays(TODAY,3)) }, { who:"t10", from:iso(addDays(TODAY,4)), to:iso(addDays(TODAY,10)) } ],
    calls:[ { at:iso(addDays(TODAY,-1))+" 02:14", caller:"Ochoa", what:"Basement flooding, sump pump quit", called:8, onsite:95, by:"t9" },
            { at:iso(addDays(TODAY,-4))+" 23:40", caller:"Hendricks", what:"Water through the hall ceiling", called:11, onsite:70, by:"t9" } ]
  };
  SEED.referrers = [
    { id:"r1", org:"Fairmount Builders", contact:"Jeanette Pruitt", type:"General contractor",
      phone:"(208) 555-0206", city:"Post Falls", lastTouch:iso(addDays(TODAY,-5)), cadenceDays:14,
      ytd:22, converted:19, note:"Our largest new-construction feed. Draws on the 10th." },
    { id:"r2", org:"Coeur Property Group", contact:"Milo Hargrave", type:"Property manager",
      phone:"(208) 555-0202", city:"Coeur d'Alene", lastTouch:iso(addDays(TODAY,-3)), cadenceDays:21,
      ytd:31, converted:28, note:"Riverbend plus 4 other properties. Highest volume." },
    { id:"r3", org:"Selkirk Realty Group", contact:"Andrea Voss", type:"Realtor",
      phone:"(208) 555-0240", city:"Coeur d'Alene", lastTouch:iso(addDays(TODAY,-38)), cadenceDays:30,
      ytd:9, converted:6, note:"OVERDUE. Pre-sale inspections — good margin, easy work." },
    { id:"r4", org:"Northwest Home Shield", contact:"claims desk", type:"Home warranty company",
      phone:"(800) 555-0241", city:"—", lastTouch:iso(addDays(TODAY,-2)), cadenceDays:14,
      ytd:41, converted:41, note:"High volume, LOW margin — they set the labor allowance." },
    { id:"r5", org:"Panhandle Supply", contact:"Russ Bettine", type:"Supply house",
      phone:"(208) 555-0242", city:"Post Falls", lastTouch:iso(addDays(TODAY,-11)), cadenceDays:30,
      ytd:7, converted:5, note:"Counter guys hand out our card. Worth the doughnuts." },
    { id:"r6", org:"Kirby Electric (trade swap)", contact:"Dale's cousin", type:"Plumber/Electrician (trade swap)",
      phone:"(208) 555-0243", city:"Hayden", lastTouch:iso(addDays(TODAY,-19)), cadenceDays:30,
      ytd:12, converted:10, note:"We send them commercial electrical, they send us plumbing." }
  ];

  SEED.systems = [
    { k:"Dispatch & scheduling", state:"Native", note:"This OS. Board, match engine, drag-free assignment." },
    { k:"Mobile field app",      state:"Native", note:"This OS. Arrive/depart, photos, signature, offline capture." },
    { k:"Flat-rate estimating",  state:"Native", note:"This OS. Your own book prices, not a licensed third-party book." },
    { k:"Truck inventory",       state:"Native", note:"This OS. Stock per truck, used per job, reorder flags." },
    { k:"Licence tracking",      state:"Native", note:"This OS. Expiry-dated, dispatch-blocking." },
    { k:"E-signature",           state:"Native", note:"This OS. Work authorisation, change orders, estimate approval." },
    { k:"Customer portal",       state:"Native", note:"This OS." },
    { k:"Permit filing",         state:"Vendor", note:"Permits are pulled through the city or county portal. The OS tracks the number and the inspection; the jurisdiction issues it." },
    { k:"Card & ACH payment",    state:"Vendor", note:"Taking payment needs a licensed processor. The OS computes and authorises; the processor moves funds." },
    { k:"Supply-house pricing",  state:"Vendor", note:"Live catalogue pricing comes from the distributor's own feed (Ferguson, Winsupply, etc.)." },
    { k:"Payroll filing",        state:"Vendor", note:"The OS produces the hours and the stubs; a payroll processor files and pays." }
  ];

  SEED.approvals = [
    { id:"ap_1", title:"Write off the Lakeside Grill callback — 3.0 hrs, our braze joint",
      dept:"Money", why:"The failure was our workmanship. Billing it would cost the account.",
      impact:"-$435 revenue and full cost absorbed. Second callback on Wade this month.",
      stage:"Awaiting Anthony", conf:91, tags:["revenue","quality"] },
    { id:"ap_2", title:"Offer — Marcus Delahoy at $39.00/hr",
      dept:"Recruiting", why:"11 yrs, EPA 608 and NATE current, covers the HVAC gap Toby cannot yet fill.",
      impact:"$1 over band. Frees Wade from the maintenance route.",
      stage:"Awaiting Anthony", conf:84, tags:["payroll"] },
    { id:"ap_3", title:"Send the Whitcomb sewer replacement quote — $11,400",
      dept:"Estimating", why:"Third root callout this year; cabling it again is losing money for both sides.",
      impact:"Largest open quote. 46% margin at quoted cost.",
      stage:"Awaiting Anthony", conf:88, tags:["send"] },
    { id:"ap_4", title:"Raise the trip fee $89 → $99",
      dept:"Money", why:"Fuel and truck cost per stop have moved; the fee has not changed in two years.",
      impact:"Applies to every T&M call. Roughly +$1,100/mo at current call volume.",
      stage:"Awaiting Anthony", conf:73, tags:["revenue"] }
  ];

  SEED.documents = [
    { id:"d1", tpl:"t_auth", title:"Work Authorisation", subject:"Owen Brackett", subjectId:"c10",
      signer:{name:"Owen Brackett", email:"o.brackett@example.com", role:"Homeowner"},
      status:"Signed", created:iso(addDays(TODAY,-6)), sentTs:iso(addDays(TODAY,-6)), token:"TBX-4K7M-2P9Q",
      values:{name:"Owen Brackett", date:iso(addDays(TODAY,-6)), ackScope:true},
      audit:[{ts:iso(addDays(TODAY,-6))+"T10:14:00",who:"Dale Kirby",what:"Document created from template"},
             {ts:iso(addDays(TODAY,-6))+"T10:16:22",who:"Dale Kirby",what:"Signer link minted for Owen Brackett"},
             {ts:iso(addDays(TODAY,-6))+"T18:02:41",who:"Owen Brackett",what:"Opened the signing link"},
             {ts:iso(addDays(TODAY,-6))+"T18:04:10",who:"Owen Brackett",what:"Consented to do business electronically (ESIGN/UETA)"},
             {ts:iso(addDays(TODAY,-6))+"T18:04:33",who:"Owen Brackett",what:"Adopted and applied signature — record frozen"}] },
    { id:"d2", tpl:"t_estimate", title:"Estimate Approval", subject:"Sal Whitcomb", subjectId:"c7",
      signer:{name:"Sal Whitcomb", email:"s.whitcomb@example.com", role:"Homeowner"},
      status:"Sent", created:iso(addDays(TODAY,-4)), sentTs:iso(addDays(TODAY,-4)), token:"TBX-8N3V-6R1D", values:{},
      audit:[{ts:iso(addDays(TODAY,-4))+"T15:31:00",who:"Dale Kirby",what:"Document created from template"},
             {ts:iso(addDays(TODAY,-4))+"T15:33:12",who:"Dale Kirby",what:"Signer link minted for Sal Whitcomb"}] },
    { id:"d3", tpl:"t_change", title:"Change Order", subject:"Fairmount Builders", subjectId:"c6",
      signer:{name:"Jeanette Pruitt", email:"j.pruitt@example.com", role:"GC — project manager"},
      status:"Draft", created:iso(TODAY), sentTs:null, token:"TBX-1H5J-7T4F", values:[],
      audit:[{ts:iso(TODAY)+"T08:12:00",who:"Dale Kirby",what:"Document created from template — Lot 14 scope grew"}] },
    { id:"d4", tpl:"t_employ", title:"Technician Employment Packet", subject:"Marcus Delahoy", subjectId:"a4",
      signer:{name:"Marcus Delahoy", email:"m.delahoy@example.com", role:"Applicant · offer out"},
      status:"Sent", created:iso(addDays(TODAY,-2)), sentTs:iso(addDays(TODAY,-2)), token:"TBX-9W2L-5C8K", values:{},
      audit:[{ts:iso(addDays(TODAY,-2))+"T09:05:00",who:"Dale Kirby",what:"Document created from template"},
             {ts:iso(addDays(TODAY,-2))+"T09:06:40",who:"Dale Kirby",what:"Signer link minted for Marcus Delahoy"}] }
  ];

  /* ====================================================================
     TIME + LOOKUPS
     ==================================================================== */
  function hhmmToMin(s){ var p=String(s).split(":"); return (+p[0])*60 + (+p[1]); }
  function minToHhmm(m){ m=((m%1440)+1440)%1440; var h=Math.floor(m/60), x=m%60;
    return (h<10?"0":"")+h+":"+(x<10?"0":"")+x; }
  function customerById(id){ return db().customers.filter(function(c){return c.id===id;})[0]||null; }
  function techById(id){ return db().techs.filter(function(t){return t.id===id;})[0]||null; }
  function jobById(id){ return db().jobs.filter(function(j){return j.id===id;})[0]||null; }
  function partBySku(s){ return db().parts.filter(function(p){return p.sku===s;})[0]||null; }
  function docById(id){ return db().documents.filter(function(d){return d.id===id;})[0]||null; }
  function docByToken(t){ return db().documents.filter(function(d){return d.token===t;})[0]||null; }
  function techName(id){ var t=techById(id); return t?t.name:"Unassigned"; }
  function weekOf(dISO){ var d=new Date(dISO+"T12:00:00"); return iso(addDays(d,-d.getDay())); }
  function thisWeek(){ return iso(WEEK_START); }
  function lastWeek(){ return iso(addDays(WEEK_START,-7)); }
  function jobsInWeek(wk){ return db().jobs.filter(function(j){ return weekOf(j.date)===(wk||thisWeek()) && inMode(j.trade); }); }
  /* The Trade Switch view: only the records of the trade that is switched on (all of them on "All trades"). */
  function modeJobs(){ return db().jobs.filter(function(j){ return inMode(j.trade); }); }
  function modeTechs(){ return db().techs.filter(function(t){ return inMode(t.trade); }); }
  function modeEstimates(){ return (db().estimates||[]).filter(function(e){ return inMode(e.trade); }); }
  function modePermits(){ var m=tradeMod(); return m.trades ? PERMIT_WORK.filter(function(w){ return m.permits.indexOf(w.k)>=0; }) : PERMIT_WORK; }
  function modeLicences(){ var m=tradeMod(); return m.trades ? LICENCES.filter(function(l){ return l.required || m.licences.indexOf(l.k)>=0; }) : LICENCES; }
  function modeTrades(){ var m=tradeMod(); return m.trades ? m.trades.slice() : TRADES.map(function(t){return t.k;}); }
  function isWeekend(dISO){ var w=new Date(dISO+"T12:00:00").getDay(); return w===0||w===6; }
  function isHoliday(dISO){ return (db().shop.holidays||[]).indexOf(dISO)>=0; }
  function afterHours(j){
    var m=hhmmToMin(j.start);
    return isWeekend(j.date) || isHoliday(j.date) || m < 7*60 || m >= 17*60;
  }

  /* ====================================================================
     THE MONEY ENGINE — three lines that behave differently
     ==================================================================== */
  function partsCost(j){
    var c=0; Object.keys(j.parts||{}).forEach(function(sku){
      var p=partBySku(sku); if(p) c += p.cost * (j.parts[sku]||0); });
    return c;
  }
  function assignedHoursBefore(techId, dISO, jobId){
    var wk=weekOf(dISO);
    return db().jobs.filter(function(j){
      return j.techId===techId && weekOf(j.date)===wk && j.id!==jobId &&
             (j.date < dISO || (j.date===dISO && j.id < jobId)); })
      .reduce(function(a,j){ return a+(j.hours||0); },0);
  }
  function rateFor(job){
    if(!job) return null;
    var R=RATES, t=job.techId?techById(job.techId):null, hrs=job.hours||0;
    var ah=afterHours(job), warranty=isWarrantyWork(job.billing);

    /* --- what the customer is billed */
    var laborRate = R.laborBillPerHr * (ah ? R.emergencyMult : 1);
    var pc = partsCost(job);
    var laborBill=0, partsBill=0, trip=0;
    if (job.billing === "Our workmanship warranty"){
      laborBill=0; partsBill=0; trip=0;                    // we eat all of it
    } else if (job.billing === "Manufacturer warranty"){
      laborBill = R.warrantyLaborAllowance * hrs;           // allowance, not our rate
      partsBill = pc;                                       // parts reimbursed at cost
      trip = 0;
    } else if (job.billing === "Maintenance agreement"){
      /* The visit is prepaid, but the revenue is REAL — it just belongs to the
         agreement, not the visit. Recognise this visit's share of the annual fee,
         otherwise every maintenance call reads as a 100% loss and an owner
         concludes their agreement programme is losing money when it is not. */
      var cust = customerById(job.customerId) || {};
      var perVisit = (cust.agreementAnnual && cust.visitsYr) ? (cust.agreementAnnual / cust.visitsYr) : 0;
      laborBill = perVisit; partsBill = pc * R.partsMarkup; trip = 0;
    } else {
      laborBill = laborRate * hrs;
      partsBill = pc * R.partsMarkup;
      trip = (job.type==="Maintenance (agreement)") ? 0 : R.tripFee;
    }
    var revenue = laborBill + partsBill + trip;

    /* --- what it cost us */
    var payRate = t ? t.payRate : 0;
    var before = t ? assignedHoursBefore(t.id, job.date, job.id) : 0;
    var reg = Math.max(0, Math.min(hrs, R.otAfterHours - before));
    var ot  = Math.max(0, hrs - reg);
    var wages = (reg*payRate) + (ot*payRate*R.otMultiplier);
    var drive = (Number(job.mileage)||0)/30 * R.driveePaidPerHr;   // ~30 mph door to door
    var mileage = (Number(job.mileage)||0) * R.mileageRate;
    var burden = (wages+drive) * R.burdenPct;
    var cost = wages + drive + burden + mileage + pc;

    return { hours:hrs, afterHours:ah, warranty:warranty,
      laborRate:laborRate, laborBill:laborBill, partsCost:pc, partsBill:partsBill, trip:trip,
      revenue:revenue, payRate:payRate, regHrs:reg, otHrs:ot, wages:wages, drive:drive,
      mileage:mileage, burden:burden, cost:cost,
      margin:revenue-cost, marginPct: revenue ? ((revenue-cost)/revenue)*100 : (cost? -100 : 0) };
  }

  function scoped(wk, scope){
    var rows=jobsInWeek(wk||thisWeek());
    if(scope==="closed") return rows.filter(function(j){ return j.status==="Closed"; });
    if(scope==="billable") return rows.filter(function(j){ return j.status==="Closed" && !isWarrantyWork(j.billing); });
    return rows.filter(function(j){ return !!j.techId; });   // assigned
  }
  function weekRevenue(wk,s){ return scoped(wk,s).reduce(function(a,j){ var r=rateFor(j); return a+(r?r.revenue:0); },0); }
  function weekCost(wk,s){ return scoped(wk,s).reduce(function(a,j){ var r=rateFor(j); return a+(r?r.cost:0); },0); }
  function weekMargin(wk,s){ return weekRevenue(wk,s)-weekCost(wk,s); }
  function weekMarginPct(wk,s){ var r=weekRevenue(wk,s); return r?(weekMargin(wk,s)/r)*100:0; }
  function weekHours(wk,s){ return scoped(wk,s).reduce(function(a,j){ return a+(j.hours||0); },0); }
  function openJobs(wk){ return jobsInWeek(wk||thisWeek()).filter(function(j){ return !j.techId; }); }
  function openHours(wk){ return openJobs(wk).reduce(function(a,j){ return a+(j.hours||0); },0); }
  function fillRate(wk){ var all=jobsInWeek(wk||thisWeek()); if(!all.length) return null;
    return (all.filter(function(j){return j.techId;}).length/all.length)*100; }
  function byKey(wk,s,keyFn,valFn){ var m={};
    scoped(wk,s).forEach(function(j){ var r=rateFor(j); if(!r) return; var k=keyFn(j); m[k]=(m[k]||0)+valFn(r); });
    return m; }
  function revenueByTrade(wk,s){ return byKey(wk,s,function(j){return j.trade;},function(r){return r.revenue;}); }
  function revenueByBilling(wk,s){ return byKey(wk,s,function(j){return j.billing;},function(r){return r.revenue;}); }
  function marginPctBy(wk,s,keyFn){
    var rev=byKey(wk,s,keyFn,function(r){return r.revenue;});
    var mar=byKey(wk,s,keyFn,function(r){return r.margin;});
    var out={}; Object.keys(rev).forEach(function(k){ out[k]= rev[k]?(mar[k]/rev[k])*100:0; });
    Object.keys(mar).forEach(function(k){ if(!(k in out)) out[k]= -100; });
    return out; }
  function overtimeHours(wk,s){ return scoped(wk,s).reduce(function(a,j){ var r=rateFor(j); return a+(r?r.otHrs:0); },0); }

  /* THE CALLBACK NUMBER — work redone for free. Most shops never measure it. */
  function callbacks(wk){ return jobsInWeek(wk||thisWeek()).filter(function(j){ return j.billing==="Our workmanship warranty"; }); }
  function callbackCost(wk){ return callbacks(wk).reduce(function(a,j){ var r=rateFor(j); return a+(r?r.cost:0); },0); }
  function callbackRate(wk){
    var all=jobsInWeek(wk||thisWeek()).filter(function(j){ return j.techId; });
    if(!all.length) return null;
    return (callbacks(wk).length/all.length)*100;
  }
  function callbacksByTech(){
    var m={};
    db().jobs.filter(function(j){ return j.billing==="Our workmanship warranty" && j.techId; })
      .forEach(function(j){ m[j.techId]=(m[j.techId]||0)+1; });
    return m;
  }

  /* ====================================================================
     LICENCES + PERMITS — dispatch blocking
     ==================================================================== */
  function daysUntil(dISO){ if(!dISO||dISO==="complete") return null;
    return Math.round((new Date(dISO+"T12:00:00")-TODAY)/86400000); }
  function licStatus(t,key){
    var meta=LICENCES.filter(function(l){return l.k===key;})[0]||{};
    var v=(t.lic||{})[key];
    if(!v) return { state: meta.required?"missing":"n/a", days:null, value:null };
    if(v==="complete") return { state:"complete", days:null, value:"complete" };
    var dd=daysUntil(v);
    if(dd<0) return { state:"expired", days:dd, value:v };
    if(dd<=LIC_WARN_DAYS) return { state:"expiring", days:dd, value:v };
    return { state:"current", days:dd, value:v };
  }
  function licBlockers(t){
    var out=[];
    LICENCES.forEach(function(l){
      if(!l.required) return;
      var st=licStatus(t,l.k);
      if(st.state==="missing") out.push(l.k+" missing");
      else if(st.state==="expired") out.push(l.k+" EXPIRED");
    });
    return out;
  }
  function licIssues(){
    var out=[];
    modeTechs().forEach(function(t){ LICENCES.forEach(function(l){
      var st=licStatus(t,l.k);
      if(st.state==="expired"||st.state==="expiring"||(st.state==="missing"&&l.required))
        out.push({tech:t, lic:l, status:st}); }); });
    var rank={expired:0,missing:1,expiring:2};
    return out.sort(function(a,b){ return (rank[a.status.state]-rank[b.status.state]) || ((a.status.days||0)-(b.status.days||0)); });
  }
  function cannotDispatch(){ return modeTechs().filter(function(t){ return licBlockers(t).length>0; }); }
  function permitGaps(){
    return modeJobs().filter(function(j){ return needsPermit(j.task) && j.status==="Closed" && !j.permitNo; })
      .map(function(j){ return { job:j, rule:permitRule(j.task), customer:customerById(j.customerId), tech:techById(j.techId) }; });
  }
  function dispatchedUnlicensed(wk){
    var out=[];
    jobsInWeek(wk||thisWeek()).forEach(function(j){
      if(!j.techId || j.status==="Closed") return;
      var t=techById(j.techId); if(!t) return;
      var why=licBlockers(t);
      var rule=permitRule(j.task);
      if(rule){ var st=licStatus(t,rule.lic);
        if(st.state!=="current" && st.state!=="complete") why.push("Not licensed for "+rule.k+" ("+rule.lic+")"); }
      if(why.length) out.push({ job:j, tech:t, customer:customerById(j.customerId), why:why });
    });
    return out;
  }

  /* ====================================================================
     THE DISPATCH ENGINE
     ==================================================================== */
  function haversineMi(a,b,c,d){ function r(x){return x*Math.PI/180;} var R=3958.8;
    var dLat=r(c-a), dLng=r(d-b);
    var q=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(r(a))*Math.cos(r(c))*Math.sin(dLng/2)*Math.sin(dLng/2);
    return R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q)); }
  function driveMin(mi){ return Math.round((mi/30)*60); }
  function busyAt(t,job){
    var a=hhmmToMin(job.start), b=hhmmToMin(job.end); if(b<=a) b+=1440;
    return db().jobs.some(function(j){
      if(j.techId!==t.id || j.date!==job.date || j.id===job.id) return false;
      var x=hhmmToMin(j.start), y=hhmmToMin(j.end); if(y<=x) y+=1440;
      return a<y && x<b; });
  }
  function stockFor(techId, parts){
    var have=[], missing=[];
    Object.keys(parts||{}).forEach(function(sku){
      var need=parts[sku]||0; if(!need) return;
      var p=partBySku(sku); if(!p){ missing.push(sku); return; }
      var on=(p.stock||{})[techId]||0;
      (on>=need ? have : missing).push(p.name+(on>=need?"":" ("+on+" of "+need+")"));
    });
    return { have:have, missing:missing };
  }
  function matchFor(jobId){
    var job=jobById(jobId); if(!job) return [];
    var cust=customerById(job.customerId); if(!cust) return [];
    var rule=permitRule(job.task);
    return db().techs.map(function(t){
      var reasons=[], blockers=[], score=0;

      var lb=licBlockers(t); if(lb.length) blockers.push(lb.join(" · "));
      if(t.status!=="Active") blockers.push(t.status);
      if(busyAt(t,job)) blockers.push("Already on another job");
      if(rule){
        var st=licStatus(t,rule.lic);
        if(st.state!=="current" && st.state!=="complete")
          blockers.push("Permit work — needs "+rule.lic);
        else reasons.push("Licensed for "+rule.lic);
      }

      var mi=haversineMi(t.lat,t.lng,cust.lat,cust.lng), dm=driveMin(mi);
      if(mi<=5){ score+=30; } else if(mi<=12){ score+=18; } else if(mi<=20){ score+=8; }
      reasons.push(mi.toFixed(1)+" mi (~"+dm+" min)");

      if(t.trade===job.trade){ score+=25; reasons.push("Primary trade: "+t.trade); }
      else { score-=10; reasons.push("Cross-trade ("+t.trade+" on a "+job.trade+" call)"); }

      var stk=stockFor(t.id, job.parts);
      if(stk.missing.length){ score-=18; reasons.push("Truck missing: "+stk.missing.join(", ")); }
      else if(stk.have.length){ score+=15; reasons.push("Parts on truck: "+stk.have.join(", ")); }

      var prior=db().jobs.filter(function(j){ return j.techId===t.id && j.customerId===cust.id && j.status==="Closed"; }).length;
      if(prior){ score+=Math.min(20,4+prior*3); reasons.push("Has been to this customer "+prior+"×"); }

      var cb=callbacksByTech()[t.id]||0;
      if(cb){ score-=cb*6; reasons.push(cb+" callback"+(cb>1?"s":"")+" on record"); }

      var before=assignedHoursBefore(t.id,job.date,job.id), after=before+(job.hours||0);
      if(after>RATES.otAfterHours){ score-=20; reasons.push("Pushes into overtime (+"+(after-Math.max(before,RATES.otAfterHours)).toFixed(1)+" hrs)"); }
      else reasons.push("Week would be "+after.toFixed(1)+" hrs");

      if(t.rating) score+=(t.rating-4)*10;

      /* BLOCKED and BADLY-SUITED are different things, and conflating them is how
         a dispatcher ends up believing nobody can cover a job. `blocked` is the
         legal/physical gate; `score` is judgement and may legitimately go
         negative on a poor-but-permissible option. Never sort one into the other. */
      return { tech:t, blocked: blockers.length > 0,
               score: blockers.length ? null : Math.round(score),
               miles:mi, driveMin:dm, reasons:reasons, blockers:blockers,
               stock:stk, weekAfter:after };
    }).sort(function(a,b){
      if (a.blocked !== b.blocked) return a.blocked ? 1 : -1;
      return (b.score||0)-(a.score||0);
    });
  }

  /* ====================================================================
     PROOF OF SERVICE
     ==================================================================== */
  function proofState(j){
    if(!j) return "—";
    if(!j.techId) return "Unassigned";
    var p=j.proof;
    if(!p||!p.inTs) return j.status==="Scheduled" ? "Scheduled" : "No arrival logged";
    if(!p.inGeo) return "Arrived off-site";
    if(!p.outTs) return j.status==="On site" ? "On site" : "No departure logged";
    if(!p.sig) return "No signature";
    if((p.inMin||0) > PROOF.lateGraceMin) return "Late";
    return "Verified";
  }
  function proofClean(j){ var s=proofState(j); return s==="Verified"||s==="On site"; }
  var PROOF_WINDOW_DAYS = 14;
  function recentClosed(days){
    var from=iso(addDays(TODAY,-(days||PROOF_WINDOW_DAYS)));
    return modeJobs().filter(function(j){ return j.status==="Closed" && j.date>=from; });
  }
  function proofExceptions(days){
    return recentClosed(days).filter(function(j){
      var s=proofState(j);
      return s==="Arrived off-site"||s==="No departure logged"||s==="No arrival logged"||s==="No signature"||s==="Late";
    }).sort(function(a,b){ return a.date<b.date?1:-1; });
  }
  function proofCompliancePct(days){
    var d=recentClosed(days); if(!d.length) return null;
    return (d.filter(proofClean).length/d.length)*100;
  }
  function arrive(jobId,opts){ opts=opts||{};
    return save(function(d){
      var j=d.jobs.filter(function(x){return x.id===jobId;})[0]; if(!j) return;
      j.proof={ inTs:j.date+"T"+j.start+":00", inMin:opts.lateMin||0, outTs:null,
        inGeo: opts.geo===undefined?true:!!opts.geo, sig:false,
        method: opts.offline?"Mobile app (offline, synced)":"Mobile app (GPS)", tasks:[], note:"" };
      j.status="On site";
      logBus(d,"Field", techName(j.techId)+" arrived at "+(customerById(j.customerId)||{}).name+(opts.geo===false?" — OFF-SITE GPS":"") );
    });
  }
  function depart(jobId, tasks, partsUsed, note, sig){
    /* CHECKPOINTS gate — a job does not close undocumented, and the refusal
       lives here so no screen can route around it. */
    var gate = canClose(jobId);
    if(!gate.ok) return { ok:false, blockers:gate.blockers };
    return save(function(d){
      var j=d.jobs.filter(function(x){return x.id===jobId;})[0]; if(!j||!j.proof) return;
      j.proof.outTs=j.date+"T"+j.end+":00";
      j.proof.tasks=tasks||[]; j.proof.note=note||""; j.proof.sig=!!sig;
      if(partsUsed) j.parts=partsUsed;
      j.status="Closed";
      logBus(d,"Field","Job closed — "+(tasks||[]).length+" task(s), "+((sig)?"signed":"NOT signed")+".");
    });
  }
  function assign(jobId, techId){
    return save(function(d){
      var j=d.jobs.filter(function(x){return x.id===jobId;})[0]; if(!j) return;
      j.techId=techId||null;
      if(!techId) j.status = j.date < iso(TODAY) ? "Missed" : "OPEN";
      else if(j.status==="OPEN"||j.status==="Missed") j.status="Scheduled";
      logBus(d,"Dispatch", techId ? (techName(techId)+" dispatched.") : "Assignment cleared — job is open.");
    });
  }
  function addJob(rec){
    var id="j"+Date.now().toString(36);
    save(function(d){
      var c=d.customers.filter(function(x){return x.id===(rec&&rec.customerId);})[0];
      var st=(rec&&rec.start)||"09:00", hrs=(rec&&rec.hours)||2;
      d.jobs.push(Object.assign({ id:id, customerId:c?c.id:null, techId:null, date:iso(TODAY),
        start:st, end:minToHhmm(hhmmToMin(st)+Math.round(hrs*60)), hours:hrs,
        trade:"HVAC", type:"Service call", billing:"Time & materials", task:"Diagnose and report",
        parts:{}, note:"", status:"OPEN", proof:null, permitNo:"", mileage:8, photos:0 }, rec||{}));
      logBus(d,"Dispatch","Job added"+(c?(" for "+c.name):"")+".");
    });
    return id;
  }
  function removeJob(id){ return save(function(d){ d.jobs=d.jobs.filter(function(j){return j.id!==id;}); }); }
  function setPermit(id,no){ return save(function(d){
    var j=d.jobs.filter(function(x){return x.id===id;})[0]; if(j){ j.permitNo=no||""; logBus(d,"Compliance","Permit number recorded."); } }); }

  /* ====================================================================
     TRUCK STOCK — first-time fix or a second trip
     ==================================================================== */
  function truckStock(techId){
    return db().parts.map(function(p){ return { sku:p.sku, name:p.name, trade:p.trade,
      cost:p.cost, on:(p.stock||{})[techId]||0 }; }).filter(function(x){ return x.on>0 || true; });
  }
  function reorderFlags(){
    var out=[];
    db().parts.forEach(function(p){
      db().techs.forEach(function(t){
        var on=(p.stock||{})[t.id];
        if(on===undefined) return;
        if(on<=0) out.push({ part:p, tech:t, on:on, level:"out" });
        else if(on<=1 && p.cost>=90) out.push({ part:p, tech:t, on:on, level:"low" });
      });
    });
    return out;
  }
  function secondTripRisk(wk){
    return jobsInWeek(wk||thisWeek()).filter(function(j){
      if(!j.techId || j.status==="Closed") return false;
      return stockFor(j.techId, j.parts).missing.length>0;
    });
  }

  /* ====================================================================
     ESTIMATES / ATS / REFERRALS
     ==================================================================== */
  function estimateValue(){ return db().estimates.filter(function(e){ return e.stage==="Quoted"||e.stage==="Scheduled"||e.stage==="Requested"; })
    .reduce(function(a,e){ return a+(e.amount||0); },0); }
  function winRate(){
    var decided=db().estimates.filter(function(e){ return e.stage==="Won"||e.stage==="Lost"; });
    if(!decided.length) return null;
    return (decided.filter(function(e){return e.stage==="Won";}).length/decided.length)*100;
  }
  function moveEstimate(id,stage){ return save(function(d){
    var e=d.estimates.filter(function(x){return x.id===id;})[0]; if(e){ e.stage=stage; logBus(d,"Estimating",e.title+" → "+stage+"."); } }); }
  function addEstimate(rec){ var id="e"+Date.now().toString(36);
    save(function(d){ d.estimates.unshift(Object.assign({id:id,requested:iso(TODAY),stage:"Requested",amount:0,cost:0,note:"",trade:"HVAC"},rec||{}));
      logBus(d,"Estimating","New estimate request logged."); });
    return id; }

  function screenScore(a){
    var reasons=[], s=0;
    var need={}; openJobs(thisWeek()).forEach(function(j){ need[j.trade]=(need[j.trade]||0)+1; });
    if(need[a.trade]){ s+=24; reasons.push("We have "+need[a.trade]+" open "+a.trade+" job(s) this week"); }
    else reasons.push("No open "+a.trade+" work this week");
    (a.lic||[]).forEach(function(){ s+=12; });
    if((a.lic||[]).length) reasons.push("Holds: "+a.lic.join(", "));
    else reasons.push("No licences on file — full onboarding");
    s+=Math.min(24,(a.yrs||0)*3); if(a.yrs) reasons.push((a.yrs)+" yrs in the trade");
    if(a.hasTools){ s+=10; reasons.push("Has own hand tools"); } else reasons.push("No tools");
    var short=db().techs.filter(function(t){return t.trade===a.trade&&t.status==="Active";}).length;
    if(short<=2){ s+=14; reasons.push("Only "+short+" active "+a.trade+" tech(s) on the roster"); }
    return { score:Math.round(s), reasons:reasons };
  }
  function moveApplicant(id,stage){ return save(function(d){
    var a=d.applicants.filter(function(x){return x.id===id;})[0]; if(a){ a.stage=stage; logBus(d,"Recruiting",a.name+" → "+stage+"."); } }); }
  function addApplicant(rec){ var id="a"+Date.now().toString(36);
    save(function(d){ d.applicants.unshift(Object.assign({id:id,applied:iso(TODAY),stage:"Applied",lic:[],yrs:0,hasTools:false,note:"",trade:"HVAC"},rec||{}));
      logBus(d,"Recruiting","New application received."); });
    return applicantById(id); }
  function applicantById(id){ return db().applicants.filter(function(a){return a.id===id;})[0]||null; }
  function pipelineCounts(){ var m={}; ATS_STAGES.forEach(function(s){m[s]=0;});
    db().applicants.forEach(function(a){ m[a.stage]=(m[a.stage]||0)+1; }); return m; }


  /* Drying log math. Day 0 is the day the loss started; a reading is due every day until dry. */
  function dryDay(w){ return Math.max(0, Math.round((new Date(iso(TODAY)+"T12:00:00") - new Date(w.started+"T12:00:00"))/86400000)); }
  function dryRoomState(r){ if(!r.readings.length) return r.goal===0 ? "removed" : "no reading"; var last=r.readings[r.readings.length-1]; return last<=r.goal ? "dry" : "wet"; }
  function dryIsDry(w){ return w.rooms.every(function(r){ var s=dryRoomState(r); return s==="dry"||s==="removed"; }); }
  function dryDueToday(w){ if(dryIsDry(w)) return false; var need=dryDay(w)+1; return w.rooms.some(function(r){ return r.goal>0 && r.readings.length<need; }); }
  function addDryReading(id, values, atmo){ return save(function(d){ var w=(d.drylogs||[]).filter(function(x){return x.id===id;})[0]; if(!w) return;
    w.rooms.forEach(function(r,i){ if(values[i]!==undefined && values[i]!=="" && !isNaN(+values[i])) r.readings.push(+values[i]); });
    if(atmo) w.atmo.push(atmo);
    (d.bus=d.bus||[]).push({ stamp:iso(TODAY), from:"Field", to:"Office", body:"Drying reading logged for "+w.customer+"." }); }); }

  /* EPA guidance on mold area (Mold Remediation in Schools and Commercial Buildings): up to 10 sq ft small,
     10 to 100 medium, over 100 large (full containment). Radon: EPA action level 4.0 pCi/L; consider fixing 2 to 4. */
  function moldBand(sqft){ return sqft<=10 ? { k:"Small", note:"Up to 10 square feet. Clean with care; no containment." }
    : sqft<=100 ? { k:"Medium", note:"10 to 100 square feet. Limited containment and trained workers." }
    : { k:"Large", note:"Over 100 square feet. Full containment, negative air and trained remediators." }; }
  function radonBand(l){ return l>=4 ? { k:"Fix", band:"bad", note:"At or above the EPA action level of 4.0 pCi/L. Mitigate." }
    : l>=2 ? { k:"Consider", band:"watch", note:"Between 2 and 4 pCi/L. EPA suggests considering a fix." }
    : { k:"OK", band:"good", note:"Below 2 pCi/L." }; }
  function equipDays(u){ return u.job && u.since ? Math.max(1, Math.round((new Date(iso(TODAY)+"T12:00:00")-new Date(u.since+"T12:00:00"))/86400000)+1) : 0; }
  function claimDocs(){ return [["auth","Work authorization signed on site"],["photos","Photo log, room by room"],["drylog","Daily drying log"],["equip","Equipment log"],["estimate","Itemized estimate to the carrier"],["cert","Certificate of completion signed"]]; }
  function setStore(key, fn){ return save(function(d){ fn(d[key], d); }); }
  function passReferral(rec){ return save(function(d){ d.table.referrals.unshift(Object.assign({ date:iso(TODAY), status:"Passed", value:0 }, rec)); }); }
  function moveReferral(i, status){ return save(function(d){ var r=d.table.referrals[i]; if(r) r.status=status; }); }
  function referralOverdue(r){ if(!r.cadenceDays) return false;
    return Math.abs(daysUntil(r.lastTouch)||0) > r.cadenceDays; }
  function referralConversion(r){ return r.ytd ? (r.converted/r.ytd)*100 : 0; }
  function topReferrers(){ return db().referrers.slice().sort(function(a,b){ return b.converted-a.converted; }); }
  function logTouch(id,note){ return save(function(d){
    var r=d.referrers.filter(function(x){return x.id===id;})[0]; if(r){ r.lastTouch=iso(TODAY); if(note) r.note=note;
      logBus(d,"Growth","Logged a touch with "+r.org+"."); } }); }

  /* ====================================================================
     NATIVE E-SIGN
     ==================================================================== */
  var ESIGN_CONSENT = "By selecting Adopt and Sign, I agree to do business electronically with {{SHOP}}, " +
    "I agree that my electronic signature is the legal equivalent of my handwritten signature, and I intend " +
    "to sign this record. I may request a paper copy at any time and may withdraw consent to electronic " +
    "records by contacting the office in writing.";
  var DOC_TEMPLATES = [
    { id:"t_auth", title:"Work Authorisation", who:"Customer", body:[
      "AUTHORISATION. I authorise {{SHOP}} to perform the diagnosis and work described for the property at {{ADDR}}.",
      "DIAGNOSTIC / TRIP FEE. A trip fee applies to the visit and is credited toward authorised repairs where applicable.",
      "APPROVAL BEFORE WORK. No repair will be performed until the price has been presented and approved. Any change in scope requires a signed change order.",
      "ACCESS AND CONDITION. I confirm I am authorised to permit work at this property and have disclosed known hazards, pets and access requirements.",
      "PERMITS. Where the work requires a permit, {{SHOP}} will pull it and the work will be inspected by the authority having jurisdiction."],
      fields:[{k:"sig",label:"Signature",type:"signature",required:true},
              {k:"name",label:"Printed name",type:"text",required:true},
              {k:"date",label:"Date",type:"date",required:true},
              {k:"ackScope",label:"I understand no repair happens until I approve the price",type:"check",required:true}] },
    { id:"t_estimate", title:"Estimate Approval", who:"Customer", body:[
      "SCOPE. This approves the estimate presented by {{SHOP}} for the property at {{ADDR}}.",
      "PRICE. The quoted amount is firm for 30 days unless the scope changes or concealed conditions are found.",
      "CONCEALED CONDITIONS. If work uncovers a condition that could not reasonably be seen when quoting, work stops and a change order is presented before continuing.",
      "SCHEDULING. Work is scheduled once this approval and any required deposit are received."],
      fields:[{k:"sig",label:"Signature",type:"signature",required:true},
              {k:"name",label:"Printed name",type:"text",required:true},
              {k:"date",label:"Date",type:"date",required:true}] },
    { id:"t_change", title:"Change Order", who:"Customer or GC", body:[
      "CHANGE. This documents a change to the previously approved scope at {{ADDR}}.",
      "REASON. The change arises from a condition or request described by the technician on site.",
      "PRICE ADJUSTMENT. The adjustment is added to the original contract amount and is due on the same terms.",
      "SCHEDULE. The change may affect the completion date; any impact is noted at signing."],
      fields:[{k:"sig",label:"Signature",type:"signature",required:true},
              {k:"name",label:"Printed name",type:"text",required:true},
              {k:"amount",label:"Change amount ($)",type:"text",required:true},
              {k:"date",label:"Date",type:"date",required:true}] },
    { id:"t_employ", title:"Technician Employment Packet", who:"Technician", body:[
      "OFFER. {{SHOP}} offers employment as a service technician at the rate stated in the offer.",
      "LICENCES. I will keep my driver's licence, insurance, OSHA card and any trade licence current, and I understand I cannot be dispatched if a required credential lapses.",
      "PERMITTED WORK. I will not perform work requiring a licence or permit I do not hold, and I will report any request to do so to the office.",
      "COMPANY VEHICLE. I will operate the company truck lawfully and report any incident the same day.",
      "TRUCK STOCK. I am responsible for the inventory assigned to my truck and for recording parts used on each job."],
      fields:[{k:"sig",label:"Signature",type:"signature",required:true},
              {k:"name",label:"Printed name",type:"text",required:true},
              {k:"date",label:"Date",type:"date",required:true},
              {k:"ackLic",label:"I understand a lapsed licence removes me from dispatch",type:"check",required:true}] }
  ];
  function templateById(id){ return DOC_TEMPLATES.filter(function(t){return t.id===id;})[0]||null; }
  function fillTemplate(s,ctx){ return String(s||"")
    .replace(/\{\{SHOP\}\}/g, ctx.shop||db().shop.name)
    .replace(/\{\{ADDR\}\}/g, ctx.addr||"the service address on file"); }
  function docContext(doc){
    var c=(db().customers||[]).filter(function(x){return x.id===doc.subjectId;})[0];
    return { shop:db().shop.name, addr: c ? (c.addr+", "+c.city) : null };
  }
  function newToken(){ var A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",p=function(n){var s="";for(var i=0;i<n;i++)s+=A[Math.floor(Math.random()*A.length)];return s;};
    return "TBX-"+p(4)+"-"+p(4); }
  function createDoc(tplId,subject,subjectId,signer){
    var tpl=templateById(tplId); if(!tpl) return null;
    var id="d"+Date.now().toString(36);
    save(function(d){ d.documents.unshift({ id:id,tpl:tplId,title:tpl.title,subject:subject,subjectId:subjectId||null,
      signer:signer||{name:"",email:"",role:""}, status:"Draft", created:iso(TODAY), sentTs:null,
      token:newToken(), values:{},
      audit:[{ts:new Date().toISOString().slice(0,19),who:d.shop.owner,what:"Document created from template"}] });
      logBus(d,"Paper","Drafted "+tpl.title+" for "+subject+"."); });
    return docById(id);
  }
  function sendDoc(id){ return save(function(d){
    var doc=d.documents.filter(function(x){return x.id===id;})[0]; if(!doc) return;
    if(!doc.token) doc.token=newToken();
    doc.status="Sent"; doc.sentTs=iso(TODAY);
    doc.audit.push({ts:new Date().toISOString().slice(0,19),who:d.shop.owner,what:"Signer link minted for "+(doc.signer.name||"the signer")}); }); }
  function openDoc(token){ save(function(d){
    var doc=d.documents.filter(function(x){return x.token===token;})[0]; if(!doc||doc.status==="Signed") return;
    doc.status="Viewed";
    doc.audit.push({ts:new Date().toISOString().slice(0,19),who:doc.signer.name||"Signer",what:"Opened the signing link"}); });
    return docByToken(token); }
  function signDoc(token,values,sig,meta){ meta=meta||{};
    return save(function(d){
      var doc=d.documents.filter(function(x){return x.token===token;})[0]; if(!doc||doc.status==="Signed") return;
      doc.values=values||{}; doc.signature=sig||null;
      doc.signedTs=new Date().toISOString().slice(0,19); doc.status="Signed";
      var who=(values&&values.name)||doc.signer.name||"Signer";
      doc.audit.push({ts:doc.signedTs,who:who,what:"Consented to do business electronically (ESIGN/UETA)"});
      doc.audit.push({ts:doc.signedTs,who:who,what:"Adopted and applied signature — record frozen"});
      if(meta.agent) doc.audit.push({ts:doc.signedTs,who:who,what:"Signed from: "+meta.agent});
      logBus(d,"Paper",doc.title+" signed by "+who+"."); }); }
  function docsAwaiting(){ return db().documents.filter(function(d){ return d.status==="Sent"||d.status==="Viewed"; }); }

  /* ====================================================================
     BUS + APPROVALS + KPIs
     ==================================================================== */
  function logBus(d,dept,msg){ d.bus=d.bus||[];
    d.bus.unshift({ts:new Date().toISOString().slice(0,19),dept:dept,msg:msg});
    if(d.bus.length>120) d.bus.length=120; }
  function bus(){ return db().bus||[]; }

  /* ====================================================================
     SWITCHBOARD — calls become jobs
     ==================================================================== */
  function callLabel(w){ if(!w) return ""; var p=String(w).split(" ");
    return (p[0]==="T"?"Today":"Yesterday")+" "+hhmm(p[1]); }
  function calls(){ return db().calls||[]; }
  function callById(id){ return calls().filter(function(c){return c.id===id;})[0]||null; }
  function callStats(){
    var t=calls().filter(function(c){return String(c.when).charAt(0)==="T";});
    var ring=t.filter(function(c){return c.status==="ringing";}).length;
    var booked=t.filter(function(c){return c.status==="booked";}).length;
    var handled=t.filter(function(c){return c.status!=="ringing";}).length;
    var missed=t.filter(function(c){return c.status==="callback";}).length;
    var ai=t.filter(function(c){return c.by==="AI receptionist";}).length;
    return { today:t.length, ringing:ring, booked:booked, handled:handled, missed:missed, ai:ai };
  }
  function answerCall(id){ return save(function(d){
    var c=(d.calls||[]).filter(function(x){return x.id===id;})[0]; if(!c||c.status!=="ringing") return;
    c.status="logged"; c.by="Front desk"; c.dur=90+((d.seq++)%7)*30;
    c.summary="Answered at the desk. Add the outcome — or book it straight onto the board.";
    logBus(d,"Switchboard","Call answered — "+(c.name||((customerById(c.customerId)||{}).name)||c.from)+".");
  }); }
  function bookFromCall(id, rec){
    var jid=null;
    save(function(d){
      var c=(d.calls||[]).filter(function(x){return x.id===id;})[0]; if(!c) return;
      var custId=c.customerId;
      if(!custId){
        custId="c"+Date.now().toString(36);
        d.customers.push({ id:custId, name:c.name||("Caller "+c.from), kind:"Residential",
          city:d.shop.city, lat:d.shop.lat, lng:d.shop.lng, addr:"(address from the call)",
          phone:c.from, since:iso(TODAY), equip:"", agreement:null, agreementAnnual:0, visitsYr:0,
          notes:"Created from a Switchboard call." });
      }
      jid="j"+Date.now().toString(36);
      var st=(rec&&rec.start)||"13:00", hrs=(rec&&rec.hours)||2;
      d.jobs.push(Object.assign({ id:jid, customerId:custId, techId:null, date:iso(TODAY),
        start:st, end:minToHhmm(hhmmToMin(st)+Math.round(hrs*60)), hours:hrs,
        trade:(rec&&rec.trade)||"HVAC", type:(rec&&rec.type)||"Service call",
        billing:"Time & materials", task:c.reason||"Diagnose and report",
        parts:{}, note:"Booked from the Switchboard — call "+c.id,
        status:"OPEN", proof:null, permitNo:"", mileage:8, photos:0 }, {}));
      c.status="booked"; c.jobId=jid;
      if(!c.by) c.by="Front desk";
      if(!c.dur) c.dur=120+((d.seq++)%5)*45;
      if(!c.summary) c.summary="Booked to the board while the caller was on the line.";
      logBus(d,"Switchboard","Call became a job — "+(c.reason||"service call")+" · on the board OPEN.");
    });
    return jid;
  }
  function aiHandleCall(id){
    var jid=null;
    save(function(d){
      var c=(d.calls||[]).filter(function(x){return x.id===id;})[0]; if(!c||c.status!=="ringing") return;
      c.by="AI receptionist";
      logBus(d,"Switchboard","AI receptionist took the call — matching against the live board.");
    });
    jid=bookFromCall(id,{start:"15:00"});
    save(function(d){
      var c=(d.calls||[]).filter(function(x){return x.id===id;})[0]; if(!c) return;
      c.summary="AI receptionist answered the overflow, matched the first workable slot on the live board, and booked it. Flagged for the desk to confirm parts on the truck.";
    });
    return jid;
  }
  function approvals(){ return db().approvals||[]; }
  function decideApproval(id,dec){ return save(function(d){
    var a=d.approvals.filter(function(x){return x.id===id;})[0]; if(!a) return;
    a.stage = dec==="approve" ? "Approved" : "Returned";
    logBus(d,a.dept,a.title+" — "+a.stage.toLowerCase()+"."); }); }

  function kpis(){
    var wk=thisWeek(), lw=lastWeek();
    var booked=weekRevenue(wk,"assigned"), done=weekRevenue(wk,"closed");
    var du=dispatchedUnlicensed(wk), pg=permitGaps(), str=secondTripRisk(wk);
    return [
      { k:"Week booked",       v:money(booked), n:"Every assigned job, if the week runs as scheduled", band:"good" },
      { k:"Closed so far",     v:money(done), n:pct(booked?done/booked*100:0)+" of the week" },
      { k:"Gross margin",      v:pct(weekMarginPct(wk,"assigned"),1), n:"After wages, "+pct(RATES.burdenPct*100,1)+" burden, drive and parts", band: weekMarginPct(wk,"assigned")>=40?"good":"watch" },
      { k:"Callback cost",     v:money(callbackCost(wk)), n:callbacks(wk).length+" job(s) redone free this week", band: callbacks(wk).length?"bad":"good" },
      { k:"Callback rate",     v: callbackRate(wk)==null?"—":pct(callbackRate(wk),1), n:"Of all assigned jobs", band:(callbackRate(wk)||0)>3?"bad":"good" },
      { k:"Unassigned",        v:openHours(wk).toFixed(1)+" hrs", n:openJobs(wk).length+" jobs with nobody on them", band:openJobs(wk).length?"watch":"good" },
      { k:"Fill rate",         v: fillRate(wk)==null?"—":pct(fillRate(wk)), n:"Jobs covered / jobs booked" },
      { k:"Proof clean",       v: proofCompliancePct()==null?"—":pct(proofCompliancePct()), n:proofExceptions().length+" exceptions · last "+PROOF_WINDOW_DAYS+" days", band:(proofCompliancePct()||0)>=95?"good":"watch" },
      { k:"Dispatched unlicensed", v:du.length, n: du.length?"Jobs assigned to a tech who cannot legally do them":"Every dispatch is clear", band: du.length?"bad":"good" },
      { k:"Permit gaps",       v:pg.length, n: pg.length?"Closed permit work with no permit number":"All permit work documented", band: pg.length?"bad":"good" },
      { k:"Second-trip risk",  v:str.length, n: str.length?"Jobs where the truck is missing a part":"Every truck is stocked for its jobs", band: str.length?"watch":"good" },
      { k:"Overtime",          v:overtimeHours(wk,"assigned").toFixed(1)+" hrs", n:"Paid at "+RATES.otMultiplier+"× — the customer is not billed "+RATES.otMultiplier+"×", band: overtimeHours(wk,"assigned")?"watch":"good" },
      { k:"Open estimates",    v:money(estimateValue()), n:(winRate()==null?"—":pct(winRate())+" win rate")+" · quoted and pending" },
      { k:"Techs on the road", v:db().techs.filter(function(t){return t.status==="Active";}).length, n:cannotDispatch().length+" blocked by a licence", band: cannotDispatch().length?"watch":"good" },
      { k:"Signatures out",    v:docsAwaiting().length, n:"Sent, not yet signed" }
    ];
  }

  /* ====================================================================
     THE PRICE BOOK — ⚠ DRAFT. Accelerated Experiences LLC sets live prices.
     The SPINE ships in every tier: Contacts/CRM, Calendar, Records, Connect,
     Command Center, Approval Desk, Owner's Manual, mobile. Tiers differ by SCALE.
     ==================================================================== */
  /* ====================================================================
     FLEETVIEW — live trucks, "on my way", and geofence timesheet stamps.
     Positions come from the technician app's phone GPS. No hardware.
     ==================================================================== */
  function trucks(){ return db().trucks || []; }
  function truckById(id){ return trucks().filter(function(v){return v.id===id;})[0] || null; }
  function truckForTech(techId){ return trucks().filter(function(v){return v.techId===techId;})[0] || null; }

  /* The sample floor runs on a pinned clock, the same way TODAY is pinned, so the
     board reads the same at 3am as it does at noon. A live shop uses the wall clock. */
  var FLEET_CLOCK = "09:05";
  function pingAgeMin(v){
    if(v && v.ping && v.ping.live) return Math.max(0, Math.round((Date.now()-v.ping.ts)/60000));
    if(!v || !v.ping || !v.ping.at) return null;
    var d = hhmmToMin(FLEET_CLOCK) - hhmmToMin(v.ping.at);
    return d < 0 ? 0 : d;
  }

  /* the job a truck is working or heading to right now */
  function currentJobFor(techId){
    var day = iso(TODAY);
    var mine = db().jobs.filter(function(j){ return j.techId===techId && j.date===day; });
    var onsite = mine.filter(function(j){ return j.status==="On site"; })[0];
    if(onsite) return onsite;
    var open = mine.filter(function(j){ return j.status!=="Closed"; })
                   .sort(function(a,b){ return hhmmToMin(a.start)-hhmmToMin(b.start); })[0];
    return open || null;
  }

  /* miles + minutes from the truck's last ping to a job site */
  function etaFor(jobId){
    var j = jobById(jobId); if(!j || !j.techId) return null;
    var v = truckForTech(j.techId); if(v) v = withLive(v); if(!v || !v.ping) return null;
    var c = customerById(j.customerId); if(!c || c.lat===undefined) return null;
    var mi = haversineMi(v.ping.lat, v.ping.lng, c.lat, c.lng);
    return { miles: Math.round(mi*10)/10, minutes: driveMin(mi) };
  }

  /* ---- LIVE TRACKING: real positions from the crews' phones -------------------------------------
     The owner turns it on once. That makes a long random fleet key, kept in this shop's book. Each
     person gets a link that opens the Driver page on their phone; while that page is open and
     sharing, the phone's GPS position goes to the fleet's row on the AE server and this map reads
     it back. A truck with a live phone shows where the phone really is; a truck without one keeps
     its sample position, and the map says which is which. */
  var TRACK_API = (typeof location!=="undefined" && /(^|\.)aexperiences\.studio$/.test(location.hostname)) ? "/api/os-track" : "https://aexperiences.studio/api/os-track";
  var LIVE = {}, LIVE_AT = 0, LIVE_ERR = "";
  function trackOn(){ var t=db().track; return !!(t && t.key); }
  function trackKey(){ var t=db().track; return t && t.key ? t.key : ""; }
  function newKey(){ var a=new Uint8Array(24), out="", abc="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    (global.crypto||global.msCrypto).getRandomValues(a); for(var i=0;i<a.length;i++) out+=abc[a[i]%abc.length];
    return out+Date.now().toString(36); }
  function trackStart(){ if(trackOn()) return trackKey();
    var k=newKey(); save(function(d){ d.track={ key:k, since:localStamp() }; logBus(d,"FleetView","Live tracking turned on"); }); return k; }
  /* turning it off throws the key away: every link that was handed out stops working */
  function trackStop(){ save(function(d){ delete d.track; logBus(d,"FleetView","Live tracking turned off — the old links no longer work"); }); LIVE={}; LIVE_AT=0; }
  function trackLink(techId){ var t=techById(techId); if(!t || !trackOn()) return "";
    var base=location.href.replace(/[?#].*$/,"").replace(/[^\/]*$/,"");
    return base+"drive.html#k="+encodeURIComponent(trackKey())+"&t="+encodeURIComponent(t.id)+"&n="+encodeURIComponent(t.name.split(" ")[0]); }
  function trackPull(done){ if(!trackOn()){ LIVE={}; if(done) done(false); return; }
    fetch(TRACK_API+"?k="+encodeURIComponent(trackKey()),{ cache:"no-store" }).then(function(r){ return r.json().then(function(j){ return { s:r.status, j:j }; }); })
      .then(function(x){ if(!x.j || !x.j.ok){ LIVE_ERR = x.j && x.j.error==="NOT_WIRED" ? "The tracking server is not connected yet." : "The tracking server did not answer."; if(done) done(false); return; }
        var m={}; (x.j.phones||[]).forEach(function(p){ m[p.id]=p; }); LIVE=m; LIVE_AT=Date.now(); LIVE_ERR=""; if(done) done(true); })
      .catch(function(){ LIVE_ERR="No connection to the tracking server."; if(done) done(false); }); }
  function livePhones(){ return Object.keys(LIVE).map(function(k){ return LIVE[k]; }); }
  function liveFor(techId){ return LIVE[techId] || null; }
  function trackStatus(){ return { on:trackOn(), at:LIVE_AT, err:LIVE_ERR, phones:livePhones().length }; }
  function compass(h){ return typeof h!=="number" ? "" : ["N","NE","E","SE","S","SW","W","NW"][Math.round(h/45)%8]; }
  function withLive(v){ var p=liveFor(v.techId); if(!p) return v;
    var d=new Date(p.ts), c={}; Object.keys(v).forEach(function(k){ c[k]=v[k]; });
    c.ping={ lat:p.lat, lng:p.lng, at:pad2(d.getHours())+":"+pad2(d.getMinutes()), mph:p.mph||0,
             heading:(p.mph||0)>3 ? (compass(p.hdg)||"moving") : "parked", battery:p.batt, ts:p.ts, acc:p.acc, live:true };
    c.live=true; return c; }

  function truckState(v){
    v = withLive(v);
    var j = currentJobFor(v.techId);
    var eta = j ? etaFor(j.id) : null;
    var day = iso(TODAY);
    var closedToday = db().jobs.filter(function(x){
      return x.techId===v.techId && x.date===day && x.status==="Closed"; }).length;
    var moving = !!(v.ping && v.ping.mph > 3);
    var st;
    if(j && j.status==="On site")   st = "On site";
    else if(j && moving)            st = "En route";
    else if(j)                      st = "Assigned";
    else if(moving)                 st = "Rolling · unassigned";
    else if(closedToday)            st = "Between jobs";
    else                            st = "Idle · no job today";
    if(pingAgeMin(v) !== null && pingAgeMin(v) > 60) st = "No recent ping";
    return { truck:v, tech:techById(v.techId), job:j, eta:eta, status:st,
             ageMin:pingAgeMin(v), lowBattery: !!(v.ping && v.ping.battery !== undefined && v.ping.battery < 25) };
  }
  function fleetState(){ return trucks().map(truckState); }

  function milesSinceService(v){ return Math.max(0, (v.odo||0) - (v.lastServiceMi||0)); }
  function serviceDue(){
    return trucks().map(function(v){
      var since = milesSinceService(v), every = v.serviceEveryMi || 5000;
      var left = every - since;
      return { truck:v, since:since, every:every, left:left,
               level: left <= 0 ? "bad" : (left <= 500 ? "watch" : "good") };
    });
  }

  /* ---- "on my way": a token'd page the customer opens, no account, no app ---- */
  function omwToken(){ return "omw" + Math.random().toString(36).slice(2,10); }
  function sendOnMyWay(jobId){
    var eta = etaFor(jobId), tok = omwToken();
    save(function(d){
      var j = d.jobs.filter(function(x){return x.id===jobId;})[0]; if(!j) return;
      j.omw = { token:tok, sentAt:FLEET_CLOCK, etaMin: eta?eta.minutes:null, miles: eta?eta.miles:null };
      logBus(d, "Field", techName(j.techId) + " sent an on-my-way to " +
        ((customerById(j.customerId)||{}).name||"the customer") +
        (eta ? " — about " + eta.minutes + " min out." : "."));
    });
    return tok;
  }
  function jobByOmw(tok){
    return db().jobs.filter(function(j){ return j.omw && j.omw.token===tok; })[0] || null;
  }

  /* ---- geofence timesheet stamps: the hours come off the actual jobs ---- */
  function stampsFor(techId, weekStart){
    var wk = weekStart || thisWeek();
    return jobsInWeek(wk).filter(function(j){
      return j.techId===techId && j.proof && j.proof.inTs;
    }).map(function(j){
      var inM = hhmmToMin((j.proof.inTs.split("T")[1]||"00:00").slice(0,5));
      var outM = j.proof.outTs ? hhmmToMin((j.proof.outTs.split("T")[1]||"00:00").slice(0,5)) : null;
      if(outM !== null && outM < inM) outM += 1440;
      return { job:j, date:j.date, inAt:(j.proof.inTs.split("T")[1]||"").slice(0,5),
               outAt: j.proof.outTs ? (j.proof.outTs.split("T")[1]||"").slice(0,5) : null,
               geo: j.proof.inGeo !== false, method: j.proof.method || "",
               minutes: outM===null ? null : (outM - inM) };
    });
  }
  function stampHours(techId, weekStart){
    return stampsFor(techId, weekStart).reduce(function(a,s){
      return a + (s.minutes ? s.minutes/60 : 0); }, 0);
  }
  function stampExceptions(weekStart){
    var out = [];
    (db().techs||[]).forEach(function(t){
      stampsFor(t.id, weekStart).forEach(function(s){
        if(!s.geo) out.push({ tech:t, stamp:s, why:"Stamped outside the job geofence" });
        else if(s.outAt === null && s.job.status !== "On site")
          out.push({ tech:t, stamp:s, why:"Arrived, never departed" });
      });
    });
    return out;
  }




  /* ====================================================================
     BRIAN — the helper (Nov 15 2026). Anthony: "I want the helper...Brian
     to be something that is of huge use...like roz is in nurse next door
     inventory." Say it or type it; Brian answers from this shop's own book
     and lines up what should be done as cards. Nothing happens until the
     person taps "Do it"; then this engine does it. Everything still works
     by hand. Spoken input and read-back use the phone's own speech, where
     the browser has it.
     ==================================================================== */
  var HELP_API = (typeof location!=="undefined" && /(^|\.)aexperiences\.studio$/.test(location.hostname)) ? "/api/os-helper" : "https://aexperiences.studio/api/os-helper";
  function brianBook(){ var d=db(), today=iso(TODAY), money=seesMoney();
    var jobs=(d.jobs||[]).filter(function(j){ return j.date>=iso(addDays(TODAY,-1)) && j.date<=iso(addDays(TODAY,7)); }).slice(0,80).map(function(j){
      var c=customerById(j.customerId)||{}; return { id:j.id, date:j.date, start:j.start, task:j.task, trade:j.trade, customer:c.name, customerId:j.customerId, techId:j.techId||null, tech:j.techId?(techById(j.techId)||{}).name:null, status:j.status }; });
    var low=[]; (d.parts||[]).forEach(function(p){ Object.keys(p.stock||{}).forEach(function(t){ if((p.stock[t]||0)<=0) low.push({ part:p.name, sku:p.sku, techId:t, tech:(techById(t)||{}).name }); }); });
    return { today:today, weekday:TODAY.toLocaleDateString("en-US",{weekday:"long"}), shop:(d.shop||{}).name,
      techs:(d.techs||[]).map(function(t){ var p=openPunch(t.id); return { id:t.id, name:t.name, trade:t.trade, clock:clockState(t.id), inSince:p?p.in.slice(11,16):null }; }),
      jobs:jobs,
      estimates:(d.estimates||[]).filter(function(e){ return e.stage!=="Won" && e.stage!=="Lost"; }).slice(0,40).map(function(e){
        var o={ id:e.id, title:e.title, customer:(customerById(e.customerId)||{}).name, stage:e.stage, requested:e.requested }; if(money) o.amount=e.amount; return o; }),
      reviews:reviewQueue(30).slice(0,20).map(function(j){ return { jobId:j.id, customer:(customerById(j.customerId)||{}).name, task:j.task, date:j.date }; }),
      reviewLinkSet:!!reviewLink(), low:low.slice(0,30), tracking:trackOn(),
      customers:(d.customers||[]).slice(0,80).map(function(c){ return { id:c.id, name:c.name, city:c.city }; }) }; }
  function brianDo(a){ var r;
    switch(a.type){
      case "clock_in": r=clockIn(a.techId,{ kind:a.kind||"Field" }); return r.ok ? techName(a.techId)+" is on the clock." : r.why;
      case "clock_out": r=clockOut(a.techId); return r.ok ? techName(a.techId)+" is clocked out." : r.why;
      case "break_start": r=breakStart(a.techId); return r.ok ? techName(a.techId)+" is on break." : r.why;
      case "break_end": r=breakEnd(a.techId); return r.ok ? techName(a.techId)+" is back on the clock." : r.why;
      case "assign_job": if(!jobById(a.jobId)||!techById(a.techId)) return "That job or person is gone."; assign(a.jobId,a.techId); return techName(a.techId)+" is on "+((jobById(a.jobId)||{}).task||"the job")+".";
      case "send_omw": if(!jobById(a.jobId)) return "That job is gone."; sendOnMyWay(a.jobId); return "On-my-way sent to "+((customerById((jobById(a.jobId)||{}).customerId)||{}).name||"the customer")+".";
      case "move_estimate": moveEstimate(a.estimateId,a.stage); return "Moved to "+a.stage+".";
      case "ask_review": var j=jobById(a.jobId), c=j?customerById(j.customerId):null; if(!j) return "That job is gone.";
        if(!reviewLink()){ location.href="reviews.html"; return "Paste your review link first. Opening Reviews."; }
        var ph=String((c||{}).phone||"").replace(/[^0-9+]/g,""); reviewAsk(a.jobId,"text");
        if(ph) location.href="sms:"+ph+"?&body="+encodeURIComponent(reviewMessage(a.jobId)); return "Opening a text to "+((c||{}).name||"the customer")+".";
      case "draft_estimate": location.href="estimates.html?ai="+encodeURIComponent(a.text||"")+"&c="+encodeURIComponent(a.customerId||"")+"&t="+encodeURIComponent(a.trade||""); return "Opening the AI draft in Estimates.";
      case "open_room": location.href=(a.room==="dashboard"?"dashboard":a.room)+".html"; return "Opening it.";
    } return "I cannot do that one."; }
  function brian(el){
    var hist=[], speak=true, rec=null, busy=false;
    try{ speak=localStorage.getItem("toolbelt_brian_voice")!=="off"; }catch(e){}
    var SR=global.SpeechRecognition||global.webkitSpeechRecognition;
    el.innerHTML='<div class="br-log" id="brLog" aria-live="polite"></div>'+
      '<div class="br-chips" id="brChips"></div>'+
      '<form class="br-form" id="brForm"><input id="brQ" type="text" autocomplete="off" placeholder="Tell Brian…" aria-label="Tell Brian">'+
      (SR?'<button type="button" class="br-mic" id="brMic" aria-label="Hold to talk to Brian">🎤</button>':'')+
      '<button type="submit" class="br-send" aria-label="Send">➤</button></form>'+
      '<label class="br-voice"><input type="checkbox" id="brVoice"'+(speak?' checked':'')+'> Brian reads his answers out loud</label>';
    var log=el.querySelector("#brLog"), q=el.querySelector("#brQ");
    var CH=seesMoney()?["What's on today?","Who's on the clock?","Clock me in","Draft an estimate","Who should I ask for a review?","What's low on the trucks?"]
      :["What's on today?","Clock me in","Start my break","What's low on my truck?","Where's my next job?"];
    el.querySelector("#brChips").innerHTML=CH.map(function(c){ return '<button type="button" class="br-chip">'+esc(c)+'</button>'; }).join("");
    el.querySelectorAll(".br-chip").forEach(function(b){ b.onclick=function(){ ask(b.textContent); }; });
    function line(who,html){ var d=document.createElement("div"); d.className="br-line "+who; d.innerHTML=html; log.appendChild(d); log.scrollTop=log.scrollHeight; return d; }
    function say(t){ if(!speak||!global.speechSynthesis) return; try{ speechSynthesis.cancel(); var u=new SpeechSynthesisUtterance(t); u.rate=1.03; u.lang="en-US";
      var v=brianVoice(); if(v) u.voice=v; speechSynthesis.speak(u); }catch(e){} }
    /* the phone's most natural US man's voice (Nov 15 2026, until Brian's own voice is on the free voice computer):
       the phone's premium and enhanced voices first, then the cloud voices Chrome and Edge carry, then any US voice */
    function brianVoice(){ var vs=(speechSynthesis.getVoices()||[]).filter(function(v){ return /^en[-_]US/i.test(v.lang); }); if(!vs.length) return null;
      var men=/Evan|Nathan|Aaron|Tom|Alex|Fred|Guy|Davis|Andrew|Brian|Christopher|Eric|Roger|Steffan|Male|Google US English/i;
      function score(v){ var n=v.name, s=0; if(/Premium/i.test(n)) s+=40; if(/Enhanced/i.test(n)) s+=30; if(/Natural|Online|Neural/i.test(n)) s+=25;
        if(men.test(n)) s+=20; if(/Google US English/i.test(n)) s+=8; if(v.localService===false) s+=4; if(/Novelty|Bad News|Bells|Bubbles|Cellos|Organ|Whisper|Zarvox|Trinoids|Jester|Superstar|Boing|Wobble|Albert|Ralph|Junior|Grandpa|Rocko|Eddy|Reed|Sandy|Shelley/i.test(n)) s-=100; return s; }
      return vs.slice().sort(function(a,b){ return score(b)-score(a); })[0]; }
    if(global.speechSynthesis && speechSynthesis.onvoiceschanged!==undefined) speechSynthesis.onvoiceschanged=function(){};
    function hello(){ var t=(db().jobs||[]).filter(function(j){ return j.date===iso(TODAY); }).length, h=new Date().getHours();
      var hi=h<12?"Morning.":h<17?"Afternoon.":"Evening.", board=t?(t+" job"+(t===1?"":"s")+" on today\'s board."):"Nothing on today\'s board yet.";
      line("brian",'<b>Brian</b><p>'+hi+' '+board+' Tell me what you need: clock someone in, put a tech on a job, draft an estimate, ask for reviews. I line it up, you tap <strong>Do it</strong>.</p>'); }
    function cards(acts,box){ acts.forEach(function(a){
      var c=document.createElement("div"); c.className="br-card"; c.innerHTML='<span>'+esc(a.label)+'</span><button type="button" class="br-do">Do it</button>';
      c.querySelector(".br-do").onclick=function(){ var b=this; b.disabled=true; var msg=brianDo(a); c.classList.add("done"); b.textContent="Done"; c.querySelector("span").textContent=msg;
        hist.push({ role:"brian", content:"(tapped) "+msg }); toast(msg,"ok"); };
      box.appendChild(c); }); }
    function ask(text){ text=String(text||"").trim(); if(!text||busy) return; busy=true; q.value="";
      line("you",'<p>'+esc(text)+'</p>'); var wait=line("brian",'<b>Brian</b><p class="br-think">Thinking…</p>');
      fetch(HELP_API,{ method:"POST", headers:{ "content-type":"application/json" }, cache:"no-store",
        body:JSON.stringify({ said:text, room:(location.pathname.split("/").pop()||"dashboard").replace(".html",""), seat:seatNow(), money:seesMoney(), history:hist.slice(-6), book:brianBook() }) })
        .then(function(r){ return r.json().then(function(j){ return { s:r.status, j:j }; }); })
        .then(function(x){ busy=false;
          if(!x.j||!x.j.ok){ var m=askManual(text), alt=(Array.isArray(m)&&m.length)?(m[0].t+": "+(m[0].b||m[0].c||"")):"";
            wait.innerHTML='<b>Brian</b><p>'+(x.s===429?"I need a minute; too many questions at once.":"I cannot reach my notes right now.")+(alt?" From the Owner's Manual — "+esc(alt):"")+'</p>'; return; }
          hist.push({ role:"you", content:text }); hist.push({ role:"brian", content:x.j.say });
          wait.innerHTML='<b>Brian</b><p>'+esc(x.j.say)+'</p>'; if((x.j.actions||[]).length) cards(x.j.actions,wait); log.scrollTop=log.scrollHeight; say(x.j.say); })
        .catch(function(){ busy=false; wait.innerHTML='<b>Brian</b><p>No signal. Everything still works by hand; try me again when you have service.</p>'; }); }
    el.querySelector("#brForm").onsubmit=function(e){ e.preventDefault(); ask(q.value); };
    el.querySelector("#brVoice").onchange=function(){ speak=this.checked; try{ localStorage.setItem("toolbelt_brian_voice",speak?"on":"off"); }catch(e){} if(!speak&&global.speechSynthesis) speechSynthesis.cancel(); };
    var mic=el.querySelector("#brMic");
    if(mic){ var start=function(e){ e.preventDefault(); if(rec) return; try{ rec=new SR(); rec.lang="en-US"; rec.interimResults=true; rec.continuous=false;
        var heard=""; mic.classList.add("on"); q.placeholder="Listening…";
        rec.onresult=function(ev){ heard=Array.prototype.map.call(ev.results,function(r){ return r[0].transcript; }).join(" "); q.value=heard; };
        rec.onend=function(){ mic.classList.remove("on"); q.placeholder="Tell Brian…"; rec=null; if(heard.trim()) ask(heard); };
        rec.onerror=function(){ mic.classList.remove("on"); rec=null; q.placeholder="Tell Brian…"; };
        rec.start(); }catch(err){ rec=null; mic.classList.remove("on"); } };
      var stop=function(){ if(rec) try{ rec.stop(); }catch(e){} };
      mic.addEventListener("pointerdown",start); mic.addEventListener("pointerup",stop); mic.addEventListener("pointerleave",stop); }
    hello();
  }

  /* ====================================================================
     REVIEW REQUESTS — after a job closes, ask the customer for a review.
     The shop pastes its own review link once (Google, Facebook, anywhere).
     The message goes out from the office phone or email app; Toolbelt keeps
     who was asked and when, so nobody is asked twice.
     ==================================================================== */
  function reviewLink(){ return (db().shop||{}).reviewLink || ""; }
  function setReviewLink(u){ u=String(u||"").trim();
    if(u && !/^https:\/\/[^\s]+$/i.test(u)) return { ok:false, why:"Paste the full link, starting with https://" };
    save(function(d){ d.shop.reviewLink=u; logBus(d,"Reviews", u?"Review link set":"Review link cleared"); }); return { ok:true }; }
  function reviews(){ var d=db(); if(!d.reviews){ d.reviews=[]; write(d); } return d.reviews; }
  function reviewFor(jobId){ return reviews().filter(function(r){ return r.jobId===jobId; })[0]||null; }
  function reviewQueue(days){ days=days||30; var since=iso(addDays(TODAY,-days)), today=iso(TODAY);
    return (db().jobs||[]).filter(function(j){ return j.status==="Closed" && j.customerId && j.date>=since && j.date<=today && !reviewFor(j.id); })
      .sort(function(a,b){ return a.date<b.date?1:-1; }); }
  function reviewMessage(jobId){ var j=jobById(jobId)||{}, c=customerById(j.customerId)||{}, sh=db().shop||{};
    var first=String(c.name||"").split(" ")[0]||"there", who=(techById(j.techId)||{}).name;
    return "Hi "+first+", thank you for having "+(sh.name||"us")+" out"+(who?" ("+who.split(" ")[0]+" was your tech)":"")+
      ". If we did right by you, would you leave us a quick review? It helps a local shop more than you know: "+reviewLink(); }
  function reviewAsk(jobId, via){ var j=jobById(jobId); if(!j) return { ok:false, why:"That job is gone." };
    if(!reviewLink()) return { ok:false, why:"Paste your review link first." };
    reviews(); save(function(d){ d.reviews.push({ jobId:jobId, customerId:j.customerId, at:localStamp(), via:via||"text" });
      logBus(d,"Reviews","Review asked of "+((customerById(j.customerId)||{}).name||"a customer")+" by "+(via||"text")); });
    return { ok:true }; }
  function reviewSkip(jobId){ var j=jobById(jobId); if(!j) return { ok:false };
    reviews(); save(function(d){ d.reviews.push({ jobId:jobId, customerId:j.customerId, at:localStamp(), via:"skipped" }); }); return { ok:true }; }

  /* ====================================================================
     MEASURE — draw on the aerial photo, get square feet and linear feet.
     Area and length are worked out on the ground (spherical geometry), not
     on the screen, so they hold at any zoom. A roof's pitch multiplies the
     flat footprint into roof surface. Saved to the customer.
     ==================================================================== */
  var PITCH = [["Flat",1],["3/12",1.031],["4/12",1.054],["5/12",1.083],["6/12",1.118],["7/12",1.158],["8/12",1.202],["9/12",1.25],["10/12",1.302],["12/12",1.414]];
  var EARTH_R=6378137, FT=3.28084;
  function geoLenFt(pts){ var t=0; for(var i=1;i<pts.length;i++) t+=hav(pts[i-1],pts[i]); return t*FT; }
  function hav(a,b){ var r=Math.PI/180, dLa=(b[0]-a[0])*r, dLo=(b[1]-a[1])*r, x=Math.sin(dLa/2)*Math.sin(dLa/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dLo/2)*Math.sin(dLo/2);
    return 2*EARTH_R*Math.asin(Math.min(1,Math.sqrt(x))); }
  function geoAreaSqft(pts){ if(pts.length<3) return 0; var r=Math.PI/180, a=0;
    for(var i=0;i<pts.length;i++){ var p=pts[i], q=pts[(i+1)%pts.length]; a+=(q[1]-p[1])*r*(2+Math.sin(p[0]*r)+Math.sin(q[0]*r)); }
    return Math.abs(a*EARTH_R*EARTH_R/2)*FT*FT; }
  function measures(){ var d=db(); if(!d.measures){ d.measures=[]; write(d); } return d.measures; }
  function measuresFor(cid){ return measures().filter(function(m){ return m.customerId===cid; }); }
  function addMeasure(rec){ if(!rec || !rec.pts || rec.pts.length<2) return { ok:false, why:"Tap at least two points." };
    var kind=rec.kind==="line"?"line":"area", pts=rec.pts.map(function(p){ return [+(+p[0]).toFixed(7), +(+p[1]).toFixed(7)]; });
    if(kind==="area" && pts.length<3) return { ok:false, why:"An area needs three points or more." };
    var pitch=PITCH.filter(function(x){ return x[0]===rec.pitch; })[0]||PITCH[0];
    var out={ id:"m"+Date.now().toString(36), customerId:rec.customerId||null, label:String(rec.label||(kind==="area"?"Area":"Length")).slice(0,80),
      kind:kind, pts:pts, at:localStamp(),
      lengthFt: kind==="line" ? geoLenFt(pts) : geoLenFt(pts.concat([pts[0]])),
      sqft: kind==="area" ? geoAreaSqft(pts) : 0, pitch:pitch[0] };
    out.surfaceSqft = out.sqft*pitch[1];
    measures(); save(function(d){ d.measures.unshift(out); logBus(d,"Measure","Measured "+out.label+" — "+(kind==="area"?Math.round(out.surfaceSqft)+" sq ft":Math.round(out.lengthFt)+" ft")); });
    return { ok:true, measure:out }; }
  function deleteMeasure(id){ save(function(d){ d.measures=(d.measures||[]).filter(function(m){ return m.id!==id; }); }); return { ok:true }; }

  /* ====================================================================
     AI DRAFT ESTIMATE — describe the job, get a draft scope.
     The AI only picks from THIS shop's own parts list and guesses labor
     hours. Every dollar is worked out here from the shop's own costs, markup
     and labor rate; the AI never names a price. The office edits and decides.
     ==================================================================== */
  var AI_API = (typeof location!=="undefined" && /(^|\.)aexperiences\.studio$/.test(location.hostname)) ? "/api/os-estimate-ai" : "https://aexperiences.studio/api/os-estimate-ai";
  function techCostPerHr(){ var ts=db().techs||[], n=0, t=0; ts.forEach(function(x){ if(Number(x.payRate)){ t+=Number(x.payRate); n++; } });
    return n ? (t/n)*(1+RATES.burdenPct) : 0; }
  function priceDraft(draft){ var parts=db().parts||[], lines=[], pc=0;
    (draft.parts||[]).forEach(function(x){ var p=parts.filter(function(q){ return q.sku===x.sku; })[0]; if(!p) return;
      var qty=Math.max(1,Math.min(999,Math.round(Number(x.qty)||1))); pc+=p.cost*qty;
      lines.push({ sku:p.sku, name:p.name, qty:qty, cost:p.cost*qty, price:p.cost*qty*RATES.partsMarkup }); });
    var hrs=Math.max(0,Math.min(400,Number(draft.laborHours)||0)), lc=hrs*techCostPerHr(), lp=hrs*RATES.laborBillPerHr;
    var cost=pc+lc, price=pc*RATES.partsMarkup+lp;
    return { lines:lines, hours:hrs, partsCost:pc, laborCost:lc, cost:cost, price:price, laborPrice:lp }; }
  function aiDraftEstimate(text, trade, extra){
    var parts=(db().parts||[]).map(function(p){ return { sku:p.sku, name:p.name, trade:p.trade }; });
    return fetch(AI_API,{ method:"POST", headers:{ "content-type":"application/json" }, cache:"no-store",
      body:JSON.stringify({ text:String(text||"").slice(0,1500), trade:trade||"", extra:String(extra||"").slice(0,400), parts:parts.slice(0,400) }) })
      .then(function(r){ return r.json().then(function(j){ return { s:r.status, j:j }; }); })
      .then(function(x){ if(!x.j || !x.j.ok){ var w = x.s===429 ? "Too many drafts for now. Try again in a little while."
          : x.s===503 ? "The AI helper is not connected right now." : "The AI helper did not answer. Try again.";
          return { ok:false, why:w }; }
        var dr=x.j.draft||{}; return { ok:true, draft:dr, priced:priceDraft(dr) }; })
      .catch(function(){ return { ok:false, why:"No connection. The AI helper needs signal." }; }); }

  /* ====================================================================
     TIME CLOCK — the paid day, not only the job.
     Job stamps (above) prove the visit. Punches are the whole shift: shop
     time, loading, drive, training and breaks, so the week's paid hours are
     the hours the person actually worked. Pay math runs off punches.
     Stamps are local wall-clock strings ("YYYY-MM-DDTHH:MM") so the sample
     week rebases with the rest of the book.
     ==================================================================== */
  var CLOCK = { longDayHrs:12, kinds:["Field","Shop","Drive","Training"], staleOpenHrs:16 };
  function pad2(n){ return (n<10?"0":"")+n; }
  function localStamp(d){ d=d||new Date(); return iso(d)+"T"+pad2(d.getHours())+":"+pad2(d.getMinutes()); }
  function stampMs(s){ return s ? new Date(String(s).slice(0,16)).getTime() : null; }
  function minToStamp(dISO, m){ m=Math.max(0,Math.min(1439,Math.round(m))); return dISO+"T"+pad2(Math.floor(m/60))+":"+pad2(m%60); }
  /* The sample shop's punches are laid over the same jobs the rest of the book shows, so the Time Clock,
     the timesheet stamps and payroll all tell one story. An emptied (real) book starts with none. */
  function clockSeed(d){
    var out=[], n=1, today=iso(TODAY), nowMin=(new Date()).getHours()*60+(new Date()).getMinutes();
    (d.techs||[]).forEach(function(t){
      var days={};
      (d.jobs||[]).forEach(function(j){
        if(j.techId!==t.id || !j.proof || !j.proof.inTs || j.date>today) return;
        var wk=weekOf(j.date); if(wk!==thisWeek() && wk!==lastWeek()) return;
        var a=hhmmToMin((j.proof.inTs.split("T")[1]||"00:00").slice(0,5));
        var b=j.proof.outTs ? hhmmToMin((j.proof.outTs.split("T")[1]||"00:00").slice(0,5)) : null;
        var x=days[j.date]||(days[j.date]={first:a,last:b,open:false});
        if(a<x.first) x.first=a;
        if(b===null) x.open=true; else if(x.last===null||b>x.last) x.last=b;
      });
      Object.keys(days).sort().forEach(function(dISO){
        var x=days[dISO], inM=Math.max(300,x.first-35), isToday=dISO===today;
        if(isToday && inM>nowMin) return;
        var outM = x.last===null ? null : Math.min(1380,x.last+25);
        var stillOn = isToday && (x.open || outM===null || outM>nowMin);
        var p={ id:"p"+(n++), techId:t.id, date:dISO, in:minToStamp(dISO,inM), out:stillOn?null:minToStamp(dISO,outM===null?inM+480:outM),
                kind:"Field", breaks:[], seed:true };
        var endM = stillOn ? nowMin : (outM===null?inM+480:outM);
        if(endM-inM>=360){ var bs=Math.max(inM+180, 720); if(bs+30<=endM) p.breaks.push({ s:minToStamp(dISO,bs), e:minToStamp(dISO,bs+30) }); }
        out.push(p);
      });
    });
    return out;
  }
  function punches(){ var d=db(); if(!d.punches){ d.punches = d.sample===false ? [] : clockSeed(d); write(d); } return d.punches; }
  function punchById(id){ return punches().filter(function(p){ return p.id===id; })[0]||null; }
  function openPunch(techId){ return punches().filter(function(p){ return p.techId===techId && !p.out; })[0]||null; }
  function openBreak(p){ return p ? (p.breaks||[]).filter(function(b){ return !b.e; })[0]||null : null; }
  function clockState(techId){ var p=openPunch(techId); return !p ? "off" : (openBreak(p) ? "break" : "on"); }
  function breakMinutes(p, nowMs){ nowMs=nowMs||Date.now();
    return (p.breaks||[]).reduce(function(a,b){ var s=stampMs(b.s), e=b.e?stampMs(b.e):nowMs; return a+Math.max(0,(e-s)/60000); },0); }
  /* worked minutes = clock-in to clock-out, less unpaid breaks. An open punch runs to now. */
  function punchMinutes(p, nowMs){ nowMs=nowMs||Date.now();
    var s=stampMs(p.in), e=p.out?stampMs(p.out):nowMs; return Math.max(0,(e-s)/60000 - breakMinutes(p,nowMs)); }
  function geoNote(g){ return g && typeof g.lat==="number" ? { lat:+g.lat.toFixed(5), lng:+g.lng.toFixed(5), acc:g.acc?Math.round(g.acc):null } : null; }
  function clockIn(techId, opts){ opts=opts||{}; punches();
    if(!techById(techId)) return { ok:false, why:"Pick a person first." };
    if(openPunch(techId)) return { ok:false, why:techName(techId)+" is already on the clock." };
    var rec; save(function(d){ d.seq=(d.seq||1)+1;
      rec={ id:"p"+Date.now().toString(36)+d.seq, techId:techId, date:iso(new Date()), in:localStamp(), out:null,
            kind:opts.kind||"Field", breaks:[], geoIn:geoNote(opts.geo) };
      d.punches.push(rec); logBus(d,"Time Clock", techName(techId)+" clocked in ("+rec.kind+")"); });
    return { ok:true, punch:rec }; }
  function clockOut(techId, opts){ opts=opts||{}; var p=openPunch(techId);
    if(!p) return { ok:false, why:techName(techId)+" is not on the clock." };
    save(function(d){ var q=d.punches.filter(function(x){ return x.id===p.id; })[0]; var st=localStamp();
      (q.breaks||[]).forEach(function(b){ if(!b.e) b.e=st; });
      q.out=st; q.geoOut=geoNote(opts.geo); if(opts.note) q.note=String(opts.note).slice(0,200);
      logBus(d,"Time Clock", techName(techId)+" clocked out — "+(punchMinutes(q)/60).toFixed(2)+" hrs"); });
    return { ok:true, punch:punchById(p.id) }; }
  function breakStart(techId){ var p=openPunch(techId);
    if(!p) return { ok:false, why:"Clock in first." }; if(openBreak(p)) return { ok:false, why:"Already on break." };
    save(function(d){ var q=d.punches.filter(function(x){ return x.id===p.id; })[0]; q.breaks=q.breaks||[]; q.breaks.push({ s:localStamp(), e:null });
      logBus(d,"Time Clock", techName(techId)+" started a break"); });
    return { ok:true }; }
  function breakEnd(techId){ var p=openPunch(techId), b=openBreak(p);
    if(!b) return { ok:false, why:"Not on a break." };
    save(function(d){ var q=d.punches.filter(function(x){ return x.id===p.id; })[0];
      q.breaks.forEach(function(x){ if(!x.e) x.e=localStamp(); }); logBus(d,"Time Clock", techName(techId)+" is back from break"); });
    return { ok:true }; }
  /* The office can correct a punch. The original is kept on the record with who changed it and why —
     a timesheet that can be edited without a trace is not a timesheet. */
  function editPunch(id, patch, who, why){ var p=punchById(id);
    if(!p) return { ok:false, why:"That punch is gone." };
    if(!why || !String(why).trim()) return { ok:false, why:"Say why the punch is being changed." };
    var nin = patch.in || p.in, nout = patch.out===undefined ? p.out : patch.out;
    if(nout && stampMs(nout) <= stampMs(nin)) return { ok:false, why:"Clock-out has to be after clock-in." };
    if(punchOverlap(p.techId, nin, nout, id)) return { ok:false, why:"That overlaps another punch for the same person." };
    save(function(d){ var q=d.punches.filter(function(x){ return x.id===id; })[0];
      q.edits=q.edits||[]; q.edits.push({ at:localStamp(), by:who||"Office", why:String(why).slice(0,200), was:{ in:q.in, out:q.out } });
      q.in=nin; q.out=nout; q.date=nin.slice(0,10); if(patch.kind) q.kind=patch.kind;
      if(q.out) (q.breaks||[]).forEach(function(b){ if(!b.e) b.e=q.out; });
      logBus(d,"Time Clock", "Punch corrected for "+techName(q.techId)+" by "+(who||"Office")+" — "+String(why).slice(0,80)); });
    return { ok:true }; }
  function addPunch(techId, inS, outS, kind, who, why){
    if(!techById(techId)) return { ok:false, why:"Pick a person first." };
    if(!inS || !outS || stampMs(outS) <= stampMs(inS)) return { ok:false, why:"Clock-out has to be after clock-in." };
    if(!why || !String(why).trim()) return { ok:false, why:"Say why the punch is being added by hand." };
    if(punchOverlap(techId, inS, outS)) return { ok:false, why:"That overlaps another punch for the same person." };
    punches(); save(function(d){ d.seq=(d.seq||1)+1;
      d.punches.push({ id:"p"+Date.now().toString(36)+d.seq, techId:techId, date:inS.slice(0,10), in:inS, out:outS, kind:kind||"Field", breaks:[],
        edits:[{ at:localStamp(), by:who||"Office", why:String(why).slice(0,200), was:null }] });
      logBus(d,"Time Clock", "Punch added by hand for "+techName(techId)+" by "+(who||"Office")); });
    return { ok:true }; }
  /* one person cannot be on the clock twice at once */
  function punchOverlap(techId, inS, outS, skipId){ var a=stampMs(inS), b=outS?stampMs(outS):Date.now();
    return punches().filter(function(p){ if(p.techId!==techId || p.id===skipId) return false;
      var s=stampMs(p.in), e=p.out?stampMs(p.out):Date.now(); return a<e && s<b; })[0]||null; }
  function punchesFor(techId, wk){ wk=wk||thisWeek();
    return punches().filter(function(p){ return p.techId===techId && weekOf(p.date)===wk; })
      .sort(function(a,b){ return a.in<b.in?-1:1; }); }
  /* one person's week: minutes per day, total, regular and overtime hours, and the hours the jobs account for */
  function clockWeek(techId, wk){ wk=wk||thisWeek(); var days={}, tot=0, list=punchesFor(techId,wk);
    list.forEach(function(p){ var m=punchMinutes(p); days[p.date]=(days[p.date]||0)+m; tot+=m; });
    var hrs=tot/60, reg=Math.min(hrs,RATES.otAfterHours), ot=Math.max(0,hrs-RATES.otAfterHours), job=stampHours(techId,wk);
    return { techId:techId, week:wk, days:days, punches:list, hours:hrs, reg:reg, ot:ot, jobHours:job, offJob:Math.max(0,hrs-job) }; }
  /* PAY MATH — gross only. Regular hours at the person's rate, overtime past the shop's weekly line at the
     shop's multiplier. No tax, no deductions, no filing: the office enters these wherever it pays from. */
  function payWeek(techId, wk){ var t=techById(techId)||{}, w=clockWeek(techId,wk), rate=Number(t.payRate)||0;
    var regPay=w.reg*rate, otPay=w.ot*rate*RATES.otMultiplier;
    return { techId:techId, name:t.name||"", week:w.week, hours:w.hours, reg:w.reg, ot:w.ot, rate:rate,
             regPay:regPay, otPay:otPay, gross:regPay+otPay, jobHours:w.jobHours, offJob:w.offJob }; }
  function payrollWeek(wk){ return (db().techs||[]).map(function(t){ return payWeek(t.id,wk); }).filter(function(r){ return r.hours>0; }); }
  function clockExceptions(wk){ wk=wk||thisWeek(); var out=[], nowMs=Date.now();
    punches().forEach(function(p){ if(weekOf(p.date)!==wk) return; var t=techById(p.techId); if(!t) return;
      if(!p.out && (nowMs-stampMs(p.in))/3600000 > CLOCK.staleOpenHrs) out.push({ tech:t, punch:p, why:"Never clocked out" });
      else if(punchMinutes(p)/60 > CLOCK.longDayHrs) out.push({ tech:t, punch:p, why:"Over "+CLOCK.longDayHrs+" hours on one punch" });
      if(p.edits && p.edits.length) out.push({ tech:t, punch:p, why:"Changed by hand — "+p.edits[p.edits.length-1].why });
    });
    return out; }
  function csvCell(v){ v=String(v==null?"":v); return /[",\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v; }
  function payrollCsv(wk){ wk=wk||lastWeek();
    var rows=[["Week of","Employee","Regular hours","Overtime hours","Total hours","Rate","Regular pay","Overtime pay","Gross pay"]];
    payrollWeek(wk).forEach(function(r){ rows.push([wk, r.name, r.reg.toFixed(2), r.ot.toFixed(2), r.hours.toFixed(2), r.rate.toFixed(2),
      r.regPay.toFixed(2), r.otPay.toFixed(2), r.gross.toFixed(2)]); });
    return rows.map(function(r){ return r.map(csvCell).join(","); }).join("\r\n"); }
  function timesheetCsv(wk){ wk=wk||lastWeek();
    var rows=[["Employee","Date","Clock in","Clock out","Break minutes","Paid hours","Kind","Changed by hand"]];
    (db().techs||[]).forEach(function(t){ punchesFor(t.id,wk).forEach(function(p){
      rows.push([t.name, p.date, p.in.slice(11,16), p.out?p.out.slice(11,16):"", Math.round(breakMinutes(p)), (punchMinutes(p)/60).toFixed(2), p.kind||"",
        p.edits&&p.edits.length ? p.edits[p.edits.length-1].by+": "+p.edits[p.edits.length-1].why : ""]); }); });
    return rows.map(function(r){ return r.map(csvCell).join(","); }).join("\r\n"); }
  /* who holds money in this view — the same seat the Birdseye shell is showing */
  function seatNow(){ try{ return localStorage.getItem("birdseye:toolbelt:seat") || "owner"; }catch(e){ return "owner"; } }
  function seesMoney(){ var s=seatNow(); return s==="owner" || s==="office"; }

  /* ====================================================================
     CHECKPOINTS — job-stage checklists with required photos.
     This extends the gates that already exist here (licence, permit): a job
     cannot be closed until the stage items that carry proof are done.
     Already-closed sample jobs derive their state from the record they left
     behind — photos on file and a captured signature — never from invention.
     ==================================================================== */
  var CHECKPOINTS = {
    common: [
      { k:"before",  stage:"On arrival", photo:true,  required:true,
        label:"Photo of the equipment and nameplate before anyone touches it" },
      { k:"confirm", stage:"On arrival", photo:false, required:false,
        label:"Complaint confirmed with the customer in their words" },
      { k:"after",   stage:"Before close", photo:true, required:true,
        label:"Photo of the finished work" },
      { k:"clean",   stage:"Before close", photo:false, required:false,
        label:"Area left clean, old parts hauled or shown to the customer" },
      { k:"walk",    stage:"Before close", photo:false, required:true,
        label:"Customer walked through what was done and what it cost" }
    ],
    byTrade: {
      "HVAC":          [{ k:"tsplit", stage:"During the work", photo:false, required:false,
                          label:"Temperature split and static pressure recorded" }],
      "Plumbing":      [{ k:"shutoff", stage:"During the work", photo:false, required:false,
                          label:"Main shut-off located and shown to the customer" }],
      "Electrical":    [{ k:"deenergize", stage:"During the work", photo:false, required:true,
                          label:"Circuit de-energised and verified dead before work" }],
      "Refrigeration": [{ k:"recovery", stage:"During the work", photo:false, required:false,
                          label:"Recovery cylinder weight logged in and out" }],
      "Drain":         [{ k:"camera", stage:"During the work", photo:true, required:false,
                          label:"Camera still of the line condition" }]
    }
  };
  var CHECK_STAGES = ["On arrival","During the work","Before close"];

  function checkpointsFor(job){
    if(!job) return [];
    var extra = CHECKPOINTS.byTrade[job.trade] || [];
    return CHECKPOINTS.common.slice(0,2)
      .concat(extra)
      .concat(CHECKPOINTS.common.slice(2));
  }

  /* A job closed before Checkpoints existed still has a record. Read it rather
     than pretending the work was undocumented — or that it was documented. */
  function derivedChecks(job){
    var out = {};
    if(job.status !== "Closed" || !job.proof) return out;
    var photos = job.photos || 0;
    if(photos >= 1) out.before = { done:true, photo:true,  src:"record" };
    if(photos >= 2) out.after  = { done:true, photo:true,  src:"record" };
    if(job.proof.sig) out.walk = { done:true, photo:false, src:"record" };
    return out;
  }

  function checkState(job){
    if(!job) return null;
    var items = checkpointsFor(job);
    var stored = job.checks || {};
    var derived = derivedChecks(job);
    var rows = items.map(function(it){
      var v = stored[it.k] || derived[it.k] || null;
      return { item:it, done: !!(v && v.done), photo: !!(v && v.photo),
               src: v ? (v.src || "tech") : null,
               satisfied: !!(v && v.done && (!it.photo || v.photo)) };
    });
    var required = rows.filter(function(r){ return r.item.required; });
    var missing  = required.filter(function(r){ return !r.satisfied; });
    return { job:job, rows:rows,
             done: rows.filter(function(r){ return r.satisfied; }).length,
             total: rows.length,
             requiredTotal: required.length,
             missing: missing,
             blocked: missing.length > 0 };
  }

  function setCheckpoint(jobId, key, done, photo){
    return save(function(d){
      var j=d.jobs.filter(function(x){return x.id===jobId;})[0]; if(!j) return;
      if(!j.checks) j.checks = {};
      if(done === false){ delete j.checks[key]; }
      else j.checks[key] = { done:true, photo: !!photo, src:"tech" };
      logBus(d,"Field", techName(j.techId)+" ticked a checkpoint on "+
        ((customerById(j.customerId)||{}).name||"a job")+(photo?" (photo attached)":""));
    });
  }

  /* the gate itself */
  function checkBlockers(jobId){
    var st = checkState(jobById(jobId));
    if(!st) return [];
    return st.missing.map(function(r){
      return r.item.label + (r.item.photo && !r.photo ? " — a photo is required" : ""); });
  }
  function canClose(jobId){
    var b = checkBlockers(jobId);
    return { ok: b.length===0, blockers: b };
  }

  /* A job nobody has arrived at yet is not "blocked" — it simply has not started.
     Only work that is under way, or that ran past its window, is held. */
  function checkStarted(j){
    return j.status!=="Closed" && (j.status==="On site" || !!(j.proof && j.proof.inTs));
  }
  function checkExceptions(){
    return db().jobs.filter(checkStarted)
      .map(checkState).filter(function(st){ return st && st.blocked; });
  }
  function checkStats(){
    var started = db().jobs.filter(checkStarted);
    var states = started.map(checkState);
    var notStarted = db().jobs.filter(function(j){
      return j.status!=="Closed" && !checkStarted(j); }).length;
    return { started: started.length,
             notStarted: notStarted,
             clear: states.filter(function(s){ return !s.blocked; }).length,
             blocked: states.filter(function(s){ return s.blocked; }).length,
             photosOutstanding: states.reduce(function(a,s){
               return a + s.missing.filter(function(r){ return r.item.photo; }).length; },0) };
  }

  /* ====================================================================
     SERVICE PLANS — memberships that renew themselves.
     Native. No integration, no third-party membership tool.
     ==================================================================== */
  var PLAN_DUE_DAYS = 45;

  function plans(){ return clone(SEED.plans); }
  function planById(id){ return SEED.plans.filter(function(p){return p.id===id;})[0] || null; }
  function memberships(){ return db().memberships || []; }
  function membershipById(id){ return memberships().filter(function(m){return m.id===id;})[0] || null; }
  function membershipFor(customerId){
    return memberships().filter(function(m){
      return m.customerId===customerId && m.status==="Active"; })[0] || null;
  }
  function isMember(customerId){ return !!membershipFor(customerId); }

  /* member pricing, straight into the pricebook */
  function memberDiscount(customerId){
    var m = membershipFor(customerId); if(!m) return 0;
    var p = planById(m.planId); return p ? (p.discount||0) : 0;
  }
  function memberPrice(amount, customerId){
    var d = memberDiscount(customerId);
    return d ? Math.round(amount * (100-d)) / 100 : amount;
  }

  function visitsLeft(m){
    if(m.visitsYr===null || m.visitsYr===undefined) return null;
    return Math.max(0, m.visitsYr - (m.visitsUsed||0));
  }
  /* a plan visit nobody has put on the board yet */
  function planVisitsDue(){
    return memberships().filter(function(m){
      if(m.status!=="Active") return null;
      var left = visitsLeft(m);
      return left === null ? false : left > 0;
    }).map(function(m){
      return { membership:m, plan:planById(m.planId), customer:customerById(m.customerId),
               left:visitsLeft(m), lastVisit:m.lastVisit };
    });
  }
  function renewalsDue(days){
    var win = days || PLAN_DUE_DAYS;
    return memberships().filter(function(m){ return m.status==="Active"; })
      .map(function(m){
        return { membership:m, plan:planById(m.planId), customer:customerById(m.customerId),
                 days: daysUntil(m.renewsOn) };
      })
      .filter(function(r){ return r.days !== null && r.days <= win; })
      .sort(function(a,b){ return a.days - b.days; });
  }

  /* plan revenue on its own ledger line — never blended into service revenue */
  function planRevenue(){
    var act = memberships().filter(function(m){ return m.status==="Active"; });
    var annual = act.reduce(function(a,m){ return a + (m.annual||0); }, 0);
    var byPlan = SEED.plans.map(function(p){
      var mine = act.filter(function(m){ return m.planId===p.id; });
      return { plan:p, count:mine.length,
               annual: mine.reduce(function(a,m){ return a+(m.annual||0); },0) };
    }).filter(function(x){ return x.count; });
    return { active:act.length, annual:annual, mrr: Math.round(annual/12), byPlan:byPlan };
  }

  /* put the next plan visit on the board */
  function schedulePlanVisit(membershipId, date){
    var m = membershipById(membershipId); if(!m) return null;
    var c = customerById(m.customerId); if(!c) return null;
    var when = date || iso(addDays(TODAY, 7));
    var jid = addJob({ customerId:c.id, techId:null, date:when, start:"09:00", end:"10:30",
      trade:"HVAC", type:"Maintenance (agreement)", billing:"Maintenance agreement",
      task:"Seasonal maintenance checklist",
      note:(planById(m.planId)||{}).name+" visit — "+(visitsLeft(m))+" left on the agreement this year" });
    save(function(d){
      logBus(d,"Service Plans", (planById(m.planId)||{}).name+" visit scheduled for "+c.name+" on "+when+".");
    });
    return jid;
  }

  /* The agent org chases renewals. Ghost Mode: it DRAFTS, it does not send. */
  function draftRenewalNudge(membershipId){
    var m = membershipById(membershipId); if(!m) return null;
    var c = customerById(m.customerId), p = planById(m.planId);
    var d0 = daysUntil(m.renewsOn);
    return save(function(d){
      d.approvals = d.approvals || [];
      var id = "ap_plan_" + m.id;
      if(d.approvals.some(function(a){ return a.id===id; })) return;
      d.approvals.push({
        id:id, title:"Renewal nudge — "+(c?c.name:"")+" · "+(p?p.name:""),
        dept:"Service Plans",
        why: m.autoRenew
          ? "Renews itself in "+d0+" days. The nudge is a courtesy so the charge is never a surprise."
          : "Auto-renew is OFF and it lapses in "+d0+" days. Without a call this one walks.",
        impact: "+"+money(m.annual||0)+" a year held" + (m.autoRenew ? "" : " — at risk today"),
        stage:"Awaiting Anthony", conf: m.autoRenew ? 74 : 92,
        tags:["revenue","retention"] });
      logBus(d,"Service Plans","Renewal nudge drafted for "+(c?c.name:"")+" — waiting on the Approval Desk.");
    });
  }
  function renewalsAtRisk(){
    return renewalsDue(90).filter(function(r){ return !r.membership.autoRenew; });
  }

  function enroll(customerId, planId, annual, visitsYr){
    var p = planById(planId); if(!p) return null;
    var id = "m"+Math.random().toString(36).slice(2,8);
    save(function(d){
      d.memberships = d.memberships || [];
      d.memberships.push({ id:id, customerId:customerId, planId:planId, since:iso(TODAY),
        annual: annual!==undefined && annual!==null ? annual : p.annual,
        visitsYr: visitsYr!==undefined && visitsYr!==null ? visitsYr : p.visitsYr,
        visitsUsed:0, lastVisit:null, renewsOn: iso(addDays(TODAY,365)),
        autoRenew:true, billing: p.annual ? "Annual" : "Monthly", status:"Active" });
      logBus(d,"Service Plans",(customerById(customerId)||{}).name+" enrolled in "+p.name+".");
    });
    return id;
  }
  function setAutoRenew(membershipId, on){
    return save(function(d){
      var m=d.memberships.filter(function(x){return x.id===membershipId;})[0]; if(!m) return;
      m.autoRenew = !!on;
      logBus(d,"Service Plans","Auto-renew turned "+(on?"on":"off")+" for "+
        ((customerById(m.customerId)||{}).name||"a member")+".");
    });
  }

  /* ====================================================================
     BANKROLL — financing on the estimate.
     The payment view ships with Estimates at no extra monthly; the partner
     underwriting is wired per buyer at purchase, and the page says so.
     ==================================================================== */
  var FINANCE = {
    minAmount: 1000,
    terms: [ { months:12, apr:0 }, { months:24, apr:7.99 },
             { months:36, apr:9.99 }, { months:60, apr:11.99 } ],
    partner: null   /* set at purchase — never invented here */
  };

  function monthlyPayment(amount, months, apr){
    if(!amount || !months) return null;
    var r = (apr||0)/100/12;
    if(r === 0) return Math.round((amount/months)*100)/100;
    var f = Math.pow(1+r, months);
    return Math.round((amount * r * f / (f-1)) * 100) / 100;
  }
  function financeEligible(amount){ return !!amount && amount >= FINANCE.minAmount; }
  function financeOffers(amount){
    if(!financeEligible(amount)) return [];
    return FINANCE.terms.map(function(t){
      return { months:t.months, apr:t.apr, monthly: monthlyPayment(amount, t.months, t.apr) };
    });
  }
  /* the headline the customer actually reacts to: "or about $X a month" */
  function bestMonthly(amount){
    var o = financeOffers(amount);
    if(!o.length) return null;
    return o.reduce(function(lo,x){ return (!lo || x.monthly < lo.monthly) ? x : lo; }, null);
  }
  function requestFinancing(estimateId, months){
    var e = db().estimates.filter(function(x){return x.id===estimateId;})[0];
    if(!e || !financeEligible(e.amount)) return null;
    var t = FINANCE.terms.filter(function(x){ return x.months===months; })[0] || FINANCE.terms[0];
    var monthly = monthlyPayment(e.amount, t.months, t.apr);
    save(function(d){
      var x=d.estimates.filter(function(y){return y.id===estimateId;})[0]; if(!x) return;
      x.finance = { months:t.months, apr:t.apr, monthly:monthly,
                    requestedOn: iso(TODAY), status:"Demo — partner wired at purchase" };
      logBus(d,"Estimates","Financing view sent with "+x.title+" — "+
        money(x.amount)+" or about "+money(Math.round(monthly))+" a month over "+t.months+".");
    });
    return monthly;
  }

  var ROOMS = {
    dispatch: { label:"Dispatch & Board",     mo:110, build:850,
      why:"The job spine — the day board, the match engine, and one-tap assignment. Everything hangs off it." },
    field:    { label:"Field App & Proof",    mo:95,  build:700,
      why:"Arrive/depart with time and place, photos, customer signature, offline capture in a crawlspace." },
    work:     { label:"Worksheets & Permits", mo:70,  build:500,
      why:"What was actually done — plus the permit gate that stops permitted work closing undocumented." },
    licences: { label:"Licences & Tickets",   mo:60,  build:450,
      why:"Journeyman cards, EPA 608, OSHA, MVR — expiry-dated, and a lapse pulls the tech off dispatch." },
    truck:    { label:"Truck Stock",          mo:70,  build:500,
      why:"What is on each truck, what a job will consume, and which jobs are about to become second trips." },
    estimate: { label:"Estimates & Sales",    mo:80,  build:600,
      why:"Requested → quoted → won, with the margin on the quote before you send it." },
    crm:      { label:"Referral CRM",         mo:75,  build:550,
      why:"GCs, property managers, realtors, home-warranty desks. Cadence, touches, conversion — and which ones actually pay." },
    portal:   { label:"Customer Portal",      mo:70,  build:500,
      why:"Where the tech is, what was done, what it cost, and the photos — without a phone call to the office." },
    recruit:  { label:"Recruiting · ATS",     mo:95,  build:700,
      why:"Your own careers page and a pipeline scored against the trades you are actually short." },
    sign:     { label:"e-Sign",               mo:65,  build:500,
      why:"Work authorisations, change orders and estimate approvals signed in any browser, with an audit trail." },
    docs:     { label:"Documents",            mo:60,  build:450,
      why:"Proposals, change orders, SOPs, safety meetings and price sheets — written here, saved as real Word and Excel files, and filed into Records without anybody retyping them." },
    money:    { label:"Invoicing & Payroll",  mo:110, build:850,
      why:"Labor, parts and trip fee kept separate. Overtime, drive time, burden — and the callback line nobody else shows you." },
    books:    { label:"Books & Metrics",      mo:80,  build:600,
      why:"Margin by trade and by how the job gets paid, callback rate by tech, first-time fix — computed, never reconstructed." },
    phones:   { label:"Switchboard · Phones", mo:120, build:900,
      why:"The inbound call becomes a booked job while the caller is still on the line — logged, summarized, on the board. Your number is wired at purchase." },
    webbook:  { label:"24/7 Web Booking",     mo:70,  build:500,
      why:"A booking page under your brand on your own site, offering only slots the live board can actually take." },
    mail:     { label:"Mail",                 mo:55,  build:420,
      why:"The shop's inbox, where a message lands on the job it is about instead of in somebody's pile — answered, filed onto the customer, or turned into work without anybody forwarding anything." },
    plans:    { label:"Service Plans",        mo:85,  build:650,
      why:"Maintenance agreements that schedule their own visits, bill themselves, price the member's repairs, and get chased for renewal by the department instead of by you." },
    fleet:    { label:"FleetView · Trucks",   mo:100, build:750,
      why:"Where every truck is right now, off the technician app's phone GPS — no hardware to install. Customer on-my-way links, and arrive/leave stamps that become the timesheet." },
    org:      { label:"Agent Org · Bus",      mo:140, build:1100,
      why:"The AI department chains, the event bus and the confidence gates." }
  };

  /* ================================================================ THE SKIN
     A skin is a palette, not a rebuild. Every surface in this system reads
     from CSS variables, so one object below repaints the whole operating
     system — sidebar, cards, charts, the lot. The shop picks its own; the
     house default is dark, because these floors get read in a truck at 6am
     and in a shop office with the lights off. */
  var SKIN_KEY = "toolbelt_skin_v1";
  var SKINS = {
    graphite: {
      name:"Graphite Night", dark:true,
      note:"The house default. Near-black graphite, safety orange on top.",
      v:{ "--t-tang":"#f0a458","--t-teal":"#63b3c1","--t-good":"#5fc79b","--t-watch":"#f2c469","--t-bad":"#e8899c", "--glass":"rgba(20,25,30,.86)", "--paper":"#101418","--card":"#181e24","--sunk":"#212932",
          "--rail":"#0b0e11","--rail-2":"#141a1f",
          "--ink":"#e8eef4","--ink-2":"#c2ced9","--mut":"#9fadba",
          "--line":"#2b343d","--line-2":"#222a31",
          "--on-rail":"#e8eef4","--on-rail-mut":"#9fadba",
          "--tang-wash":"rgba(228,131,43,.16)","--teal-wash":"rgba(47,125,140,.18)",
          "--gold-wash":"rgba(228,166,43,.18)",
          "--good-w":"rgba(47,143,107,.20)","--watch-w":"rgba(228,166,43,.20)","--bad-w":"rgba(180,72,94,.20)",
          "--dot-1":"rgba(242,121,46,.06)","--dot-2":"rgba(23,162,162,.06)",
          "--sh":"0 1px 2px rgba(0,0,0,.4), 0 8px 24px -12px rgba(0,0,0,.7)",
          "--sh-lg":"0 2px 4px rgba(0,0,0,.45), 0 24px 56px -24px rgba(0,0,0,.8)" } },
    espresso: {
      name:"Espresso Night", dark:true,
      note:"Warm dark. Reads easy at the end of a long day.",
      v:{ "--t-tang":"#f0a458","--t-teal":"#63b3c1","--t-good":"#5fc79b","--t-watch":"#f2c469","--t-bad":"#e8899c", "--glass":"rgba(29,24,19,.86)", "--paper":"#16120e","--card":"#211b15","--sunk":"#2c241c",
          "--rail":"#0f0c09","--rail-2":"#1a1510",
          "--ink":"#f0e8dd","--ink-2":"#d6c9ba","--mut":"#ad9e8c",
          "--line":"#3a2f25","--line-2":"#2b231b",
          "--on-rail":"#f0e8dd","--on-rail-mut":"#ad9e8c",
          "--tang-wash":"rgba(228,131,43,.18)","--teal-wash":"rgba(47,125,140,.18)",
          "--gold-wash":"rgba(228,166,43,.20)",
          "--good-w":"rgba(47,143,107,.20)","--watch-w":"rgba(228,166,43,.22)","--bad-w":"rgba(180,72,94,.20)",
          "--dot-1":"rgba(242,121,46,.07)","--dot-2":"rgba(228,166,43,.05)",
          "--sh":"0 1px 2px rgba(0,0,0,.4), 0 8px 24px -12px rgba(0,0,0,.7)",
          "--sh-lg":"0 2px 4px rgba(0,0,0,.45), 0 24px 56px -24px rgba(0,0,0,.8)" } },
    steel: {
      name:"Steel Blue", dark:true,
      note:"Cool and technical. The one that looks like the truck's gauge cluster.",
      v:{ "--t-tang":"#f0a458","--t-teal":"#63b3c1","--t-good":"#5fc79b","--t-watch":"#f2c469","--t-bad":"#e8899c", "--glass":"rgba(18,26,33,.86)", "--paper":"#0e1419","--card":"#161f27","--sunk":"#1f2a34",
          "--rail":"#080d11","--rail-2":"#111a21",
          "--ink":"#e4edf4","--ink-2":"#bccdda","--mut":"#94a7b6",
          "--line":"#27343f","--line-2":"#1e2932",
          "--on-rail":"#e4edf4","--on-rail-mut":"#94a7b6",
          "--tang-wash":"rgba(228,131,43,.16)","--teal-wash":"rgba(47,125,140,.22)",
          "--gold-wash":"rgba(228,166,43,.18)",
          "--good-w":"rgba(47,143,107,.20)","--watch-w":"rgba(228,166,43,.20)","--bad-w":"rgba(180,72,94,.20)",
          "--dot-1":"rgba(47,125,140,.08)","--dot-2":"rgba(242,121,46,.05)",
          "--sh":"0 1px 2px rgba(0,0,0,.4), 0 8px 24px -12px rgba(0,0,0,.7)",
          "--sh-lg":"0 2px 4px rgba(0,0,0,.45), 0 24px 56px -24px rgba(0,0,0,.8)" } },
    daylight: {
      name:"Workshop Daylight", dark:false,
      note:"Cool paper. The bright one, for a shop with windows.",
      v:{ "--t-tang":"#c46b18","--t-teal":"#245f6b","--t-good":"#245f6b","--t-watch":"#c46b18","--t-bad":"#b4485e", "--glass":"rgba(255,253,249,.88)", "--paper":"#f4f6f8","--card":"#ffffff","--sunk":"#e9edf1",
          "--rail":"#232b33","--rail-2":"#2e3842",
          "--ink":"#1f272e","--ink-2":"#4a5763","--mut":"#8391a0",
          "--line":"#dbe2e8","--line-2":"#eef2f5",
          "--on-rail":"#e6ecf2","--on-rail-mut":"#93a3b3",
          "--tang-wash":"rgba(228,131,43,.11)","--teal-wash":"rgba(47,125,140,.12)",
          "--gold-wash":"rgba(228,166,43,.15)",
          "--good-w":"rgba(47,143,107,.13)","--watch-w":"rgba(228,166,43,.17)","--bad-w":"rgba(180,72,94,.12)",
          "--dot-1":"rgba(242,121,46,.05)","--dot-2":"rgba(23,162,162,.05)",
          "--sh":"0 1px 2px rgba(31,39,46,.05), 0 8px 24px -12px rgba(31,39,46,.18)",
          "--sh-lg":"0 2px 4px rgba(31,39,46,.06), 0 24px 56px -24px rgba(31,39,46,.30)" } },
    linen: {
      name:"Linen", dark:false,
      note:"Warm paper. Softer than daylight, easier on the eyes.",
      v:{ "--t-tang":"#c46b18","--t-teal":"#245f6b","--t-good":"#245f6b","--t-watch":"#c46b18","--t-bad":"#b4485e", "--glass":"rgba(255,252,246,.90)", "--paper":"#f6f2ea","--card":"#fffdf8","--sunk":"#ece5d8",
          "--rail":"#2b2419","--rail-2":"#3a3123",
          "--ink":"#221d16","--ink-2":"#524738","--mut":"#8b7f6c",
          "--line":"#e0d7c6","--line-2":"#f0eae0",
          "--on-rail":"#f4ede1","--on-rail-mut":"#a99884",
          "--tang-wash":"rgba(228,131,43,.12)","--teal-wash":"rgba(47,125,140,.12)",
          "--gold-wash":"rgba(228,166,43,.16)",
          "--good-w":"rgba(47,143,107,.13)","--watch-w":"rgba(228,166,43,.17)","--bad-w":"rgba(180,72,94,.12)",
          "--dot-1":"rgba(228,166,43,.07)","--dot-2":"rgba(242,121,46,.05)",
          "--sh":"0 1px 2px rgba(43,36,25,.05), 0 8px 24px -12px rgba(43,36,25,.20)",
          "--sh-lg":"0 2px 4px rgba(43,36,25,.06), 0 24px 56px -24px rgba(43,36,25,.32)" } }
  };
  var SKIN_DEFAULT = "graphite";

  function skinRead(){
    try{ var v=JSON.parse(localStorage.getItem(SKIN_KEY)); if(v&&v.k) return v; }catch(e){}
    return { k:SKIN_DEFAULT, accent:null };
  }
  function skinWrite(v){ try{ localStorage.setItem(SKIN_KEY,JSON.stringify(v)); }catch(e){} }
  function skinNow(){ var v=skinRead(); return SKINS[v.k]?v:{k:SKIN_DEFAULT,accent:v.accent||null}; }
  function shade(hex,amt){
    var h=String(hex||"").replace("#","");
    if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var n=parseInt(h,16); if(isNaN(n)) return hex;
    var r=(n>>16)&255,g=(n>>8)&255,b=n&255;
    function m(x){ return Math.max(0,Math.min(255, Math.round(x+(amt<0?x:255-x)*amt))); }
    return "#"+[m(r),m(g),m(b)].map(function(x){return ("0"+x.toString(16)).slice(-2);}).join("");
  }
  function applySkin(){
    var cur=skinNow(), sk=SKINS[cur.k]||SKINS[SKIN_DEFAULT], root=document.documentElement;
    Object.keys(SKINS[SKIN_DEFAULT].v).forEach(function(k){ root.style.removeProperty(k); });
    Object.keys(sk.v).forEach(function(k){ root.style.setProperty(k, sk.v[k]); });
    if(cur.accent){
      root.style.setProperty("--tang", cur.accent);
      root.style.setProperty("--tang-2", shade(cur.accent,-0.22));
      root.style.setProperty("--tang-3", shade(cur.accent, 0.28));
      root.style.setProperty("--a-dispatch", cur.accent);
      root.style.setProperty("--a-schedule", cur.accent);
    } else {
      ["--tang","--tang-2","--tang-3","--a-dispatch","--a-schedule"].forEach(function(k){ root.style.removeProperty(k); });
    }
    root.setAttribute("data-skin", cur.k);
    root.setAttribute("data-dark", sk.dark?"1":"0");
    return sk;
  }
  function setSkin(k, accent){
    var cur=skinNow();
    skinWrite({ k:(k||cur.k), accent:(accent===undefined?cur.accent:accent) });
    return applySkin();
  }
  function skinAccent(){ return skinNow().accent || null; }
  try{ applySkin(); }catch(e){}

  function renderSkinPill(){
    var cur=skinNow(), sk=SKINS[cur.k]||SKINS[SKIN_DEFAULT];
    var pill=el('<div class="skinpill" title="Change the skin">'+
      '<span class="sw" style="background:'+(cur.accent||sk.v["--tang"]||"#e4832b")+'"></span>'+
      '<span>'+esc(sk.name)+'</span><span class="car">&#9650;</span></div>');
    var menu=el('<div class="skinmenu"></div>');
    function paint(){
      var c=skinNow();
      var h='<h4>Skins</h4>'+Object.keys(SKINS).map(function(k){ var s=SKINS[k];
        return '<div class="skinopt'+(k===c.k?" on":"")+'" data-skin="'+k+'">'+
          '<span class="chips"><i style="background:'+s.v["--rail"]+'"></i>'+
          '<i style="background:'+s.v["--paper"]+'"></i>'+
          '<i style="background:'+s.v["--card"]+'"></i>'+
          '<i style="background:'+(c.accent||"#e4832b")+'"></i></span>'+
          '<span><b>'+esc(s.name)+'</b><span>'+esc(s.note)+'</span></span></div>';
      }).join('');
      h+='<button class="more" id="skinMore">Open the Skin Room &rarr;</button>';
      menu.innerHTML=h;
      menu.querySelectorAll("[data-skin]").forEach(function(r){
        r.onclick=function(ev){ ev.stopPropagation();
          setSkin(r.getAttribute("data-skin"));
          var s2=SKINS[skinNow().k];
          pill.querySelector("span:nth-child(2)").textContent=s2.name;
          pill.querySelector(".sw").style.background=skinNow().accent||s2.v["--tang"]||"#e4832b";
          paint(); toast(s2.name+" on.","ok"); };
      });
      var mb=menu.querySelector("#skinMore");
      if(mb) mb.onclick=function(ev){ ev.stopPropagation(); location.href="skins.html"; };
    }
    pill.onclick=function(ev){ ev.stopPropagation();
      if(menu.classList.contains("open")){ menu.classList.remove("open"); return; }
      paint(); menu.classList.add("open"); };
    menu.onclick=function(ev){ ev.stopPropagation(); };
    document.addEventListener("click",function(ev){
      if(pill.contains(ev.target)||menu.contains(ev.target)) return;
      menu.classList.remove("open"); });
    document.body.appendChild(menu);
    document.body.appendChild(pill);
  }

  var TIERS = {
    truck: { key:"truck", name:"Core", ed:"CO", edname:"Core", rank:1, mo:450, build:0,
      desc:"One to three trucks. The whole system, sized for an owner who is still turning wrenches.",
      base:"Up to 3 techs · the full spine",
      includes:["dispatch","field","work","licences","truck","estimate","portal","sign","docs","money","mail"] },
    shop: { key:"shop", name:"Elite", ed:"EL", edname:"Elite", rank:2, mo:950, build:0,
      desc:"A real shop with a dispatcher. Adds the referral book, recruiting, books & metrics and the AI department org.",
      base:"Unlimited techs · dispatcher seat · referral CRM · agent org",
      includes:["dispatch","field","work","licences","truck","estimate","crm","portal","recruit","sign","docs","money","books","org","mail"] },
    grandsuite: { key:"grandsuite", name:"Mothership", ed:"MS", edname:"Mothership", rank:3, mo:2200, build:0,
      desc:"Nothing held back. Multi-location, multi-trade, dedicated environment, data migration and your own branded tech app.",
      base:"Multi-location · multi-trade · dedicated environment · migration · branded app",
      includes:["dispatch","field","work","licences","truck","estimate","crm","portal","recruit","sign","docs","money","books","org","phones","webbook","fleet","plans","mail"] }
  };
  var DEPTS = [
    { group:"Command", items:[
      { href:"dashboard.html", label:"Command Center", ic:"◎" , icon:"icons/command-center.svg"},
      { href:"calendar.html",  label:"Calendar",       ic:"▤" , icon:"icons/calendar.svg"},
      { href:"contacts.html",  label:"Contacts",       ic:"☎" , icon:"icons/families.svg"},
      { href:"connect.html",   label:"Connect · Video",ic:"◉" , icon:"icons/connect.svg"},
      { href:"masterlist.html",label:"Master List",    ic:"▤" , icon:"icons/master-list.svg"},
      { href:"records.html",   label:"Records · Filing",ic:"▤" , icon:"icons/records.svg"},
      { href:"approvals.html", label:"Approval Desk",  ic:"✓", accent:"ops" , icon:"icons/approvals.svg"} ]},
    { group:"Front Desk", items:[
      { href:"switchboard.html", label:"Switchboard · Phones", ic:"☏", room:"phones", accent:"crm" , icon:"icons/desk.svg"},
      { href:"book.html",        label:"Web Booking",          ic:"◷", room:"webbook", accent:"portal" , icon:"icons/enroll.svg"},
      { href:"mail.html",        label:"Mail",                 ic:"✉", room:"mail", accent:"intake" , icon:"icons/mail.svg"} ]},
    { group:"The Day", items:[
      { href:"dispatch.html",  label:"Dispatch & Board",ic:"▦", room:"dispatch", accent:"dispatch" , icon:"icons/schedule.svg"},
      { href:"field.html",     label:"Field & Proof",   ic:"◉", room:"field",    accent:"field" , icon:"icons/checkin.svg"},
      { href:"worksheets.html",label:"Worksheets & Permits",ic:"✎", room:"work", accent:"work" , icon:"icons/worksheets.svg"},
      { href:"checkpoints.html",label:"Checkpoints",        ic:"☑", room:"work", accent:"work" , icon:"icons/comply.svg"},
      { href:"drying.html",    label:"Drying Log",          ic:"≈", accent:"field", icon:"icons/measure.svg"},
      { href:"claims.html",    label:"Claim Packet",        ic:"▤", accent:"field", icon:"icons/documents.svg"},
      { href:"equipment.html", label:"Drying Equipment",    ic:"▣", accent:"field", icon:"icons/truck-stock.svg"},
      { href:"moldradon.html", label:"Mold & Radon",        ic:"◬", accent:"field", icon:"icons/comply.svg"},
      { href:"packout.html",   label:"Contents Pack-out",   ic:"▦", accent:"field", icon:"icons/records.svg"},
      { href:"oncall.html",    label:"24-Hour Line",        ic:"☏", accent:"field", icon:"icons/desk.svg"},
      { href:"timeclock.html", label:"Time Clock",          ic:"◷", accent:"field", icon:"icons/timeclock.svg" } ]},
    { group:"The Trucks", items:[
      { href:"licences.html",  label:"Licences",        ic:"⛨", room:"licences", accent:"licence" , icon:"icons/law.svg"},
      { href:"truck.html",     label:"Truck Stock",     ic:"▣", room:"truck",    accent:"ops", icon:"icons/truck-stock.svg" },
      { href:"aimos.html",     label:"Shop Stockroom",  ic:"▦", accent:"ops", icon:"icons/aimos-supplies.svg" },
      { href:"fleetview.html",label:"FleetView · Trucks",ic:"◍", room:"fleet",  accent:"dispatch", icon:"icons/fleetview.svg" } ]},
    { group:"Growth", items:[
      { href:"estimates.html", label:"Estimates",       ic:"✦", room:"estimate", accent:"estimate" , icon:"icons/funnel.svg"},
      { href:"measure.html",   label:"Measure",         ic:"▱", accent:"estimate", icon:"icons/measure.svg" },
      { href:"reviews.html",   label:"Reviews",         ic:"★", accent:"estimate", icon:"icons/reviews.svg" },
      { href:"plans.html",     label:"Service Plans",   ic:"❉", room:"plans",    accent:"money" , icon:"icons/tuition.svg"},
      { href:"referrals.html", label:"Referral CRM",    ic:"◈", room:"crm",      accent:"crm", icon:"icons/referral-crm.svg" },
      { href:"table.html",     label:"The Table",       ic:"◈", accent:"crm", icon:"icons/connect.svg" },
      { href:"portal.html",    label:"Customer Portal", ic:"☗", room:"portal",   accent:"portal", icon:"icons/customer-portal.svg" },
      { href:"recruiting.html",label:"Recruiting · ATS",ic:"★", room:"recruit",  accent:"recruit" , icon:"icons/hr.svg"} ]},
    { group:"Paper", items:[
      { href:"sign.html",      label:"e-Sign",          ic:"✍", room:"sign",     accent:"sign" , icon:"icons/docs.svg"},
      { href:"documents.html", label:"Documents",       ic:"▤", room:"docs",     accent:"sign" , icon:"icons/documents.svg"},
      { href:"law.html",       label:"Law · Contracts", ic:"⚖" } ]},
    { group:"The House", items:[
      { href:"trades.html",    label:"Trade Switch",    ic:"✚", accent:"ops", icon:"icons/command-center.svg" },
      { href:"hr.html",        label:"HR · People Ops", ic:"☷" },
      { href:"it.html",        label:"IT · System Health", ic:"♥" },
      { href:"manual.html",    label:"Owner's Manual",  ic:"?" },
      { href:"skins.html",     label:"Skins",           ic:"◐" , icon:"icons/skins.svg"} ]},
    { group:"Money", items:[
      { href:"money.html",     label:"Invoicing & Payroll",ic:"◧", room:"money", accent:"money" , icon:"icons/payroll.svg"},
      { href:"books.html",     label:"Books & Metrics", ic:"◭", room:"books",    accent:"money" , icon:"icons/books.svg"} ]},
    { group:"The Org", items:[
      { href:"org.html",       label:"Agent Org · Bus", ic:"❖", room:"org",      accent:"ops" , icon:"icons/org.svg"} ]}
  ];

  function tier(){ return db().tier||"grandsuite"; }
  var BUILD_VER = "V4.0";
  /* Owner tool gate. The customer sees three sizes and nothing else.
     Anthony and Barry turn the room switches on with ?owner=1 and off with ?owner=0;
     the choice sticks in this browser until it is turned back off. */
  function isOwner(){
    try{ var q=String(location.search||"");
      if(/[?&]owner=1/.test(q)) save(function(d){ d.ownerMode=true; });
      if(/[?&]owner=0/.test(q)) save(function(d){ d.ownerMode=false; });
    }catch(e){}
    return !!db().ownerMode; }
  function setTier(k){ return save(function(d){ d.tier=k; d.adds=[]; d.offs=[]; }); }
  function activeRooms(){ var d=db(), t=TIERS[d.tier]||TIERS.grandsuite, set=t.includes.slice();
    (d.adds||[]).forEach(function(k){ if(set.indexOf(k)<0) set.push(k); });
    (d.offs||[]).forEach(function(k){ set=set.filter(function(x){return x!==k;}); });
    return set; }
  function hasRoom(k){ return activeRooms().indexOf(k)>=0; }
  function toggleRoom(k){ return save(function(d){
    var t=TIERS[d.tier]||TIERS.grandsuite, inPack=t.includes.indexOf(k)>=0, on=activeRooms().indexOf(k)>=0;
    d.adds=d.adds||[]; d.offs=d.offs||[];
    if(on){ if(inPack) d.offs.push(k); else d.adds=d.adds.filter(function(x){return x!==k;}); }
    else  { if(inPack) d.offs=d.offs.filter(function(x){return x!==k;}); else d.adds.push(k); } }); }
  function priceNow(){ var d=db(), t=TIERS[d.tier]||TIERS.grandsuite, adds=d.adds||[], offs=d.offs||[];
    var am=adds.reduce(function(a,k){return a+((ROOMS[k]||{}).mo||0);},0);
    var ab=adds.reduce(function(a,k){return a+((ROOMS[k]||{}).build||0);},0);
    var om=offs.reduce(function(a,k){return a+((ROOMS[k]||{}).mo||0);},0);
    var ob=offs.reduce(function(a,k){return a+((ROOMS[k]||{}).build||0);},0);
    var rooms=activeRooms(), ala=rooms.reduce(function(a,k){return a+((ROOMS[k]||{}).mo||0);},0);
    var mo=Math.max(0,t.mo+am-om);
    return { tier:t, adds:adds, offs:offs, mo:mo, build:Math.max(0,t.build+ab-ob), rooms:rooms,
             alaMo:ala, savingMo:Math.max(0,ala-mo), changed: adds.length>0||offs.length>0 }; }
  function priceLabel(){ var p=priceNow(); return money(p.mo)+"/mo licensed"; }

  var SEATS = [
    { dept:"Dispatch",   dh:"Ivy",   ae:"Cal",  focus:"Fill rate, drive time, second trips, and who is sitting idle at 2pm." },
    { dept:"Field",      dh:"Roy",   ae:"Bree", focus:"Proof of service, callbacks by cause, first-time fix, permit documentation." },
    { dept:"Money",      dh:"Nell",  ae:"Gus",  focus:"Margin by trade and billing type, overtime creep, and the true cost of warranty work." },
    { dept:"Growth",     dh:"Sol",   ae:"Wren", focus:"Estimate win rate, referral conversion, and which accounts are worth keeping." },
    { dept:"Compliance", dh:"Hale",  ae:"Tess", focus:"Licence expiries, permitted work, insurance, and jobsite safety records." }
  ];
  var BRAIN = { name:"Foreman", role:"COO — the single point of contact",
    line:"Every department's conclusion reaches the owner through one seat, packaged as one decision at a time." };

  /* ------------------------------------------------------------- UI helpers */
  function el(h){ var t=document.createElement("template"); t.innerHTML=String(h).trim(); return t.content.firstChild; }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function money(n){ return "$"+(Math.round(Number(n)||0)).toLocaleString(); }
  function money2(n){ return "$"+(Number(n)||0).toFixed(2); }
  function pct(n,dp){ return (Number(n)||0).toFixed(dp===undefined?0:dp)+"%"; }
  function hhmm(s){ var p=String(s||"").split(":"); if(p.length<2) return s||"";
    var h=+p[0],m=p[1],ap=h>=12?"p":"a"; h=h%12; if(!h) h=12;
    return h+(m==="00"?"":":"+m)+ap; }
  function dayLabel(dISO){ var d=new Date(dISO+"T12:00:00");
    return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]+" "+(d.getMonth()+1)+"/"+d.getDate(); }
  var MARK_URL="https://www.aexperiences.com/Toolbelt_OS.png";
  function brandMark(){ return '<img src="'+MARK_URL+'" alt="Toolbelt OS" width="34" height="34" '+
    'style="display:block;border-radius:9px" onerror="this.style.display=\'none\';this.parentNode.textContent=\'TB\';">'; }
  function proofBand(s){ if(s==="Verified"||s==="On site") return "good";
    if(s==="Late"||s==="Scheduled") return "watch"; if(s==="Unassigned") return ""; return "bad"; }

  /* ------------------------------------------------------------- the shell */
  function renderShell(active){
    var side=document.createElement("aside"); side.className="sidebar";
    side.appendChild(el('<a href="dashboard.html" class="brand"><div class="bmark">'+brandMark()+
      '</div><div><div class="bt">Toolbelt OS</div><div class="bs">Field Service OS</div></div></a>'));
    var nav=document.createElement("nav"); nav.className="nav"; var on=activeRooms();
    DEPTS.forEach(function(g){
      nav.appendChild(el('<div class="nav-group">'+esc(g.group)+'</div>'));
      g.items.forEach(function(it){
        var off=it.room && on.indexOf(it.room)<0;
        var a=el('<a href="'+(off?"javascript:void(0)":it.href)+'" class="navlink '+(it.href===active?"active":"")+
          (off?" locked":"")+'"'+(it.accent?' data-accent="'+it.accent+'"':"")+'>'+(it.icon?'<img class="ic ic-img" src="'+it.icon+'" alt="">':'<span class="ic">'+it.ic+'</span>')+
          '<span class="lb">'+esc(it.label)+'</span>'+(off?'<span class="tier-tag">+'+money(ROOMS[it.room].mo)+'</span>':'')+'</a>');
        if(off){ a.title="Not in this build — add "+ROOMS[it.room].label+" for "+money(ROOMS[it.room].mo)+"/mo";
          a.addEventListener("click",function(){ toggleRoom(it.room);
            toast(ROOMS[it.room].label+" added — "+priceLabel(),"ok");
            setTimeout(function(){location.reload();},500); }); }
        nav.appendChild(a); });
    });
    side.appendChild(nav); return side;
  }
  var MOBILE_NAV=[{href:"dashboard.html",label:"Home",ic:"◎",icon:"icons/command-center.svg"},
    {href:"dispatch.html",label:"Board",ic:"▦",room:"dispatch",icon:"icons/schedule.svg"},
    {href:"field.html",label:"Field",ic:"◉",room:"field",icon:"icons/checkin.svg"},
    {href:"money.html",label:"Money",ic:"◧",room:"money",icon:"icons/payroll.svg"},
    {href:"approvals.html",label:"Approvals",ic:"✓",icon:"icons/approvals.svg"}];
  function renderMobileBar(active){
    var bar=document.createElement("nav"); bar.className="mobilebar"; var on=activeRooms();
    MOBILE_NAV.forEach(function(it){ var off=it.room&&on.indexOf(it.room)<0;
      bar.appendChild(el('<a href="'+(off?"javascript:void(0)":it.href)+'" class="mb-link '+(it.href===active?"active":"")+
        '">'+(it.icon?'<img class="mb-ic mb-img" src="'+it.icon+'" alt="">':'<span class="mb-ic">'+it.ic+'</span>')+
        '<span class="mb-lb">'+esc(it.label)+'</span></a>')); });
    bar.appendChild(el('<button class="mb-link mb-menu" id="mbMenu"><span class="mb-ic">☰</span><span class="mb-lb">Menu</span></button>'));
    return bar; }
  function iconFor(href){
    for(var g=0;g<DEPTS.length;g++){ for(var i=0;i<DEPTS[g].items.length;i++){
      if(DEPTS[g].items[i].href===href) return DEPTS[g].items[i].icon||null; } }
    return null; }
  function renderTopbar(crumb, active){
    var p=priceNow(), s=db().shop;
    var bar=document.createElement("div"); bar.className="topbar";
    var ini=(s.owner||"DK").split(" ").map(function(w){return w[0];}).join("").slice(0,2).toUpperCase();
    var hic=iconFor(active);
    bar.innerHTML='<button class="hamburger" id="hamburger" aria-label="Open menu">☰</button>'+
      (hic?'<img class="crumb-ic" src="'+hic+'" alt="">':'')+
      '<div class="crumbs">Toolbelt OS · <b>'+esc(crumb)+'</b></div><div class="spacer"></div>'+
      '<div class="tierpill" id="tierPillStatic"><span class="dot"></span><div><b>'+esc(p.tier.name)+
      '</b> <i class="cfg">'+esc(p.tier.ed)+' '+BUILD_VER+'</i>'+
      (p.changed&&isOwner()?' <i class="cfg">configured</i>':'')+
      ' <span class="price">'+money(p.mo)+'/mo licensed</span></div></div><div class="who"><div class="av">'+esc(ini)+'</div><div>'+esc(s.owner)+
      '<br><span class="muted small">Owner · '+esc(s.name)+'</span></div></div>';

    /* ---- THE CONFIGURATOR: click the price pill, size the system ---- */
    var pill = bar.querySelector('#tierPillStatic');
    if(pill){
      pill.style.cursor='pointer';
      pill.title='Click to size the system';
      var menu = document.createElement('div');
      menu.className='tiermenu';
      bar.appendChild(menu);

      function paintMenu(){
        var d=db(), cur=d.tier||'grandsuite', p=priceNow(), own=isOwner();
        var order=['truck','shop','grandsuite'];
        var h='<div class="tm-head">Every shop is a different size. Pick the one that matches yours &mdash; ' +
          'the system switches the rooms on and off to match, and the price is the price.</div>';
        h+='<div class="tm-sub">The three sizes</div>';
        h+=order.map(function(k){ var T=TIERS[k];
          return '<div class="tieropt'+(k===cur?' on':'')+'" data-tier="'+k+'">'+
            '<div class="to-top"><span class="to-name">'+esc(T.name)+
            ' <i class="rr-flag">Toolbelt OS '+esc(T.ed)+' &middot; '+esc(T.edname)+'</i></span>'+
            '<span class="to-price">'+money(T.mo)+'/mo</span></div>'+
            '<div class="to-desc">'+esc(T.desc)+'</div>'+
            '<div class="to-base">'+esc(T.base)+'</div></div>';
        }).join('');
        h+='<div class="tm-head" style="border-top:1px solid var(--line-2);border-bottom:0">'+
          'Licensed monthly, nothing down, no per-technician fee. Every size can also carry your own name, '+
          'colors and web address &mdash; we quote that part with you. Just ask.</div>';
        if(own){
          h+='<div class="tm-sub">Owner tool &mdash; rooms ('+activeRooms().length+' of '+Object.keys(ROOMS).length+' on)</div>';
          h+='<div class="roomlist">'+Object.keys(ROOMS).map(function(k){
            var R=ROOMS[k], on=hasRoom(k), inTier=(TIERS[cur].includes||[]).indexOf(k)>-1;
            return '<div class="roomrow'+(on?' on':'')+'" data-room="'+k+'">'+
              '<span class="rr-box">&#10003;</span>'+
              '<span class="rr-name">'+esc(R.label)+(inTier?'':' <i class="rr-flag">add-on</i>')+'</span>'+
              '<span class="to-price">'+(inTier?'included':'+'+money(R.mo)+'/mo')+'</span></div>';
          }).join('')+'</div>';
          h+='<div class="tm-head" style="border-top:1px solid var(--line-2);border-bottom:0">'+
            '<b>'+money(p.mo)+'/mo</b> as configured'+(p.changed?' &mdash; changed from the '+esc(p.tier.name)+' default':'')+
            ' <span class="muted small">&middot; owner view, hidden from the customer</span></div>';
        }
        menu.innerHTML=h;
        menu.querySelectorAll('[data-tier]').forEach(function(r){
          r.onclick=function(e){ e.stopPropagation(); setTier(r.getAttribute('data-tier')); location.reload(); };
        });
        menu.querySelectorAll('[data-room]').forEach(function(r){
          r.onclick=function(e){ e.stopPropagation(); toggleRoom(r.getAttribute('data-room')); location.reload(); };
        });
      }

      pill.onclick=function(e){
        e.stopPropagation();
        if(menu.classList.contains('open')){ menu.classList.remove('open'); return; }
        paintMenu(); menu.classList.add('open');
      };
      menu.onclick=function(e){ e.stopPropagation(); };
      document.addEventListener('click', function(ev){
        if(pill.contains(ev.target) || menu.contains(ev.target)) return;
        menu.classList.remove('open');
      });
    }

    return bar; }
  function ribbon(){ return el('<div class="ribbon"><span class="live">LIVE SHOWROOM</span>'+
    ' — this is the real operating system, not a slideshow. Type anywhere; it saves in your browser. '+
    'The shop, techs and customers below are a realistic sample book. '+
    '<a href="javascript:void(0)" id="resetFloor">Start with a clean slate</a></div>'); }
  function footer(){ return el('<div class="ae-credit"><a href="https://www.aexperiences.com/" class="ae-triad" aria-label="AOS — Accelerated Experiences LLC"><img src="/marks/aos/aos-business.png" alt="Accelerated Operating Systems" style="height:30px;width:auto;vertical-align:middle"></a><br>Toolbelt OS is an '+
    'Accelerated Operating System by Accelerated Experiences LLC. Sample data is a fictional shop. Benchmarks are sourced or shown blank — never invented. '+
    'Nothing here is legal, tax or code-compliance advice.</div>'); }
  function toast(m,k){ var w=document.getElementById("toast-wrap"); if(!w) return;
    var t=el('<div class="toast '+(k||"")+'">'+esc(m)+'</div>'); w.appendChild(t);
    setTimeout(function(){ t.style.opacity="0"; setTimeout(function(){t.remove();},250); },2600); }
  /* The fleet-wide Command Center polish layer. One file on the store, loaded by
     every product, so a change lands everywhere at once instead of fourteen times. */
  function loadFlava(){
    if(document.getElementById("aeFlavaCss")) return;
    var l=document.createElement("link"); l.id="aeFlavaCss"; l.rel="stylesheet";
    l.href="https://www.aexperiences.com/ae-flava.css"; document.head.appendChild(l);
    var j=document.createElement("script"); j.src="https://www.aexperiences.com/ae-flava.js";
    j.defer=true; document.head.appendChild(j);
  }
  function mount(o){
    try{ loadFlava(); }catch(e){} o=o||{}; db();
    var app=document.createElement("div"); app.className="app";
    var side=renderShell(o.active), backdrop=el('<div class="nav-backdrop" id="navBackdrop"></div>');
    var main=document.createElement("div"); main.className="main";
    main.appendChild(ribbon()); main.appendChild(renderTopbar(o.crumb||"Command Center", o.active));
    var content=document.createElement("div"); content.className="content"; content.id="content";
    main.appendChild(content); main.appendChild(footer());
    (function(){ var m=tradeMod(); if(m.k==="all" || o.active==="trades.html") return;
      content.appendChild(el('<a class="tb-modestrip" href="trades.html" style="--tc:'+m.color+'"><span class="tb-ic">'+m.ic+'</span> Showing <b>'+esc(m.name)+'</b> only · <u>switch trade</u></a>')); })();
    app.appendChild(side); app.appendChild(main);
    document.body.innerHTML=""; document.body.appendChild(app); document.body.appendChild(backdrop);
    /* each room wears its own color (the Workday look, Nov 15 2026) */
    (function(){ var it=null; DEPTS.forEach(function(g){ (g.items||[]).forEach(function(x){ if(x.href===o.active) it=x; }); });
      var a=it&&(it.accent||it.room); if(a) document.body.style.setProperty("--room","var(--a-"+a+", var(--tang))"); })();
    document.body.appendChild(renderMobileBar(o.active));
    document.body.appendChild(el('<div id="toast-wrap"></div>'));
    try{ applySkin(); renderSkinPill(); }catch(e){}
    setTimeout(function(){
      var r=document.getElementById("resetFloor");
      if(r) r.addEventListener("click",function(){
        if(!confirm("Clear the sample shop and start with an empty book?\n\nThis removes the sample techs, customers and jobs so you can enter your own. It cannot be undone.")) return;
        goLive(); toast("Empty book ready. Add your first customer.","ok");
        setTimeout(function(){location.reload();},500); });
      function open(){ side.classList.add("open"); backdrop.classList.add("show"); }
      function close(){ side.classList.remove("open"); backdrop.classList.remove("show"); }
      var h=document.getElementById("hamburger"), m=document.getElementById("mbMenu");
      if(h) h.addEventListener("click",open); if(m) m.addEventListener("click",open);
      backdrop.addEventListener("click",close);
      Array.prototype.forEach.call(side.querySelectorAll("a.navlink"),function(a){ a.addEventListener("click",close); });
    },0);
    return content; }
  function page(t,s,a){ return el('<div class="pagehead"><div><h1>'+esc(t)+'</h1>'+
    (s?'<p class="sub">'+s+'</p>':"")+'</div><div class="pagehead-actions">'+(a||"")+'</div></div>'); }
  function card(i,c){ return el('<section class="card '+(c||"")+'">'+i+'</section>'); }
  function stat(l,v,n,b){ return '<div class="stat '+(b||"")+'"><div class="s-l">'+esc(l)+'</div><div class="s-v">'+v+
    '</div>'+(n?'<div class="s-n">'+n+'</div>':"")+'</div>'; }
  function tag(t,k){ return '<span class="tag '+(k||"")+'">'+esc(t)+'</span>'; }
  function srcNote(t){ return '<div class="srcnote">Source: '+esc(t)+'</div>'; }
  function bar(p,c){ var w=Math.max(0,Math.min(100,p));
    return '<div class="bar" style="margin-top:6px"><i style="width:'+w.toFixed(0)+'%'+(c?";background:"+c:"")+'"></i></div>'; }

  /* ------------------------------------------------------- owner's manual */
  var MANUAL = [
    { t:"What this system is", c:"Toolbelt OS runs a field-service shop end to end: the day board, the truck, the job, the paperwork and the money. Every number on a dashboard is computed from your own jobs — nothing on a screen was typed in by hand." },
    { t:"Start with a clean slate", c:"It opens on a realistic sample shop so you can see how every room behaves with data in it. When you are ready for your own book, use 'Start with a clean slate' in the ribbon. It clears the sample and the option disappears." },
    { t:"Why one job has three money lines", c:"Labor is marked up over what the tech costs you. Parts are marked up over the supply house. The trip fee covers getting the truck there at all. Generic invoicing flattens those into one number, and that is how a shop can be busy all week and still lose money on a trade." },
    { t:"The callback line", c:"When you go back because something you did failed, you pay full cost and bill zero. Most shops never measure it. This one shows callback cost every week and callback count by tech — not to punish anyone, but because a tech with a pattern usually needs training or better parts, and you cannot see either without the number." },
    { t:"Manufacturer warranty is not free money", c:"The manufacturer reimburses parts and a fixed labor allowance, usually well below your hourly rate. The system bills it at the allowance so the margin you see on warranty work is the margin you actually get." },
    { t:"How dispatch ranks technicians", c:"Distance and drive time, whether it is their primary trade, whether the parts are already on their truck, how many times they have been to this customer, their callback record, and what the assignment does to their week. Every score shows its reasons so you can argue with it." },
    { t:"Hard blockers cannot be overridden", c:"An expired driver's licence, insurance, or OSHA card removes a tech from dispatch entirely. So does sending someone to permitted work without the licence that work requires — that is the finding that costs a contractor their licence, not a warning." },
    { t:"Permit work cannot close undocumented", c:"Panel changes, new circuits, gas alterations, water heater and service replacements, refrigerant work and backflow tests all require a permit and a specific licence. The system will not treat that job as properly closed until a permit number is on it." },
    { t:"Proof of service", c:"Arrival and departure with time and place, the tasks performed, photos, and the customer's signature. It is what settles a dispute three months later, and on commercial and warranty work it is what gets you paid." },
    { t:"Working with no signal", c:"Crawlspaces, mechanical rooms and rural valleys have no bars. The field app captures the timestamp and coordinates on the device and syncs when the connection returns, keeping the ORIGINAL time — otherwise every rural call would look late." },
    { t:"Second trips are the hidden margin killer", c:"A job where the truck is missing a part is a job that becomes two jobs. The board flags it before the tech leaves, and Truck Stock shows what is out and on which truck." },
    { t:"Overtime is a dispatch decision", c:"Past 40 hours the tech is paid time and a half. The customer is not billed time and a half. The board warns before an assignment creates it, and Books totals the drift for the week." },
    { t:"Licences and the expiry window", c:"Anything inside 45 days reads expiring; anything past reads expired and blocks dispatch. The Licences room sorts worst first." },
    { t:"Where the work comes from", c:"General contractors, property managers, realtors, home-warranty desks and the supply-house counter. The referral book tracks cadence and conversion — and shows which of those accounts is actually worth having. High-volume home-warranty work is often the lowest margin on the board." },
    { t:"The Switchboard", c:"An inbound call opens the caller's whole history before you say hello — what they own, what you did last time, whether they are on an agreement, the gate code. Book the job while they are still on the line and the customer record is created for you if they are new. The AI receptionist takes overflow and books off the live board, then writes down what it did. On this floor the calls are simulated and labelled as such; your real number, recording and IVR are wired to your line at purchase." },
    { t:"24/7 web booking", c:"The booking page runs on your own website under your own brand. It only offers times the live board can actually take: every technician is checked for a conflict and for the licence the work requires, so it cannot double-book you and it cannot hand a job to somebody who is not legal to do it. A booking creates the customer and an OPEN job on the board." },
    { t:"FleetView and the phone in the tech's pocket", c:"Turn on live tracking in FleetView and each person gets a link for their phone. While that Driver page is open and sharing, the truck shows on the map where the phone really is, with its speed and how old the position is. It works in the phone's browser, so it follows the phone while the page is on screen; it does not run in the background with the screen off. Trucks without a live phone keep their sample position and the map marks which is which. There is no box to install in a van and no per-truck subscription. One tap sends the customer a link with the tech's name and a live ETA — no app for them, no account. The same arrive and leave stamps that prove the visit also total the week's hours, so payroll reconciles against jobs that actually happened. Vehicle-level telemetry hardware is optional and wired at purchase; most shops never need it." },
    { t:"Service plans that chase their own renewals", c:"A maintenance agreement here is a live record, not a note in a file. It knows how many visits are left this year, when it renews, and whether it renews itself. Visits go on the board from the plan; the member's discount is applied in the pricebook rather than remembered by whoever answers the phone; and plan revenue sits on its own ledger line so you can see what the agreements are worth separately from service work. When a renewal is close the department drafts the nudge and it lands on the Approval Desk — it is never sent behind your back." },
    { t:"Financing on the estimate", c:"Above the minimum, every quote can show the monthly alongside the total — $8,400, or about $147 a month — with the terms laid out and no games about what the rate is. The margin stays on the quote where you can see it. On this floor the payment view is a demonstration: the financing partner and the actual underwriting are wired to your account at purchase, priced into your build fee. Nothing here approves anybody for credit." },
    { t:"Checkpoints — the job cannot close undocumented", c:"Every job carries a short stage checklist: what to photograph before anyone touches the equipment, the trade-specific step that matters in the middle, and the walkthrough before you leave. The items that carry proof are required, and the refusal is built into the system rather than into one screen — a job with a missing before-photo will not close from the field app, the office, or anywhere else. Jobs that were closed before Checkpoints existed read their state from the record they already left: photos on file and a captured signature." },
    { t:"e-Sign — how signing works here", c:"Pick a template, and the system mints an unguessable link. The customer opens it in any browser with no account, consents to sign electronically, adopts a signature by drawing or typing it, and the record freezes with a timestamped audit trail." },
    { t:"Is an electronic signature legally binding?", c:"US law (ESIGN and UETA) generally makes an electronic signature as enforceable as ink when the signer consented to do business electronically, intended to sign, the signature is attributable to them, and the record is retained and reproducible. This module captures all four. It is not legal advice — have your attorney review the consent language for your state." },
    { t:"Measure", c:"Find an address, then tap the corners of a roof, a yard or a slab on the aerial photo to get the flat square feet, the roof surface at the pitch you pick, and the feet around the edge. Tap along a fence or a trench for linear feet. Save it to the customer and start an estimate from it. The aerial photos are public USDA farm-survey photos, about two feet per pixel and a few years old: good for a quote, confirm on site before ordering." },
    { t:"Reviews", c:"Paste your review link once (your Google Business profile, Facebook, or any page). Every closed job from the last thirty days waits in Ready to ask. One tap opens a text or an email from your own phone with the message filled in; Toolbelt marks it asked so nobody is asked twice. Toolbelt cannot see whether the review was left." },
    { t:"Draft an estimate with AI", c:"In Estimates, describe the job in plain words. The AI writes the work steps, picks parts from your own parts list, and guesses the labor hours, then lists what to confirm on site. It never names a price: the suggested price and your cost are worked out from your own parts costs, markup and labor rate. Check it before it goes to a customer. It needs signal." },
    { t:"Time Clock and pay math", c:"Each person clocks in, starts and ends a break, and clocks out from the Time Clock room. That is the whole paid day, shop and drive time included, not only the hours on a job. The timesheet shows paid hours, overtime past the shop's weekly line, and how much of the week was on jobs. The office can fix or add a punch, and the original stays on the record with the reason. The owner and the office also see pay math: regular and overtime hours times each person's rate, as gross pay, with a pay sheet to download. It takes out no taxes, cuts no checks and files nothing." },
    { t:"What this system does NOT do by itself", c:"Four things need an outside party and the system says so rather than pretending: pulling the permit (the city or county issues it), taking payment (a licensed processor moves the money), live supply-house catalogue pricing (the distributor's feed), and filing payroll (a payroll processor). Everything upstream of those is native here." },
    { t:"The Approval Desk", c:"Anything that changes a rate, sends to a customer, writes off a callback, or commits money waits here instead of happening quietly. It should stay nearly empty." },
    { t:"On your phone", c:"Every room works on a phone. The bottom bar carries Home, Board, Field, Money and Approvals; Menu opens everything else. Buttons are sized for gloves." },
    { t:"Three ways to look at the same day", c:"The same information, drawn three ways, and you pick which one you want. LEDGER is what loads first: the whole day on one page with nothing hidden, the way a morning report sits on a desk. BOARD hangs the day on a time rail with the money sitting on each piece of work, which is what you want when you are running the day. LINE has no menu at all; you talk to it and it answers, and it is built for a phone in a truck. Switch whenever you like from the menu. It is the same information underneath all three, so nothing moves and nothing is lost when you change, and the view you leave it on is the one that comes back next time you sign in." },
    { t:"The menu, and finding anything fast", c:"The Menu button sits at the bottom of the screen next to Hold to talk, and it slides out from the left. Every room in the system is in it, grouped, with a count beside the ones that have something waiting on you. There is a search box at the top: type a job, a client, an invoice number or a room name. On a keyboard, press K from anywhere to open it and escape to close it. The menu is in all three views, including Line." }
  ];
  function manual(){ return MANUAL; }
  function askManual(q){
    q=String(q||"").toLowerCase().trim(); if(!q) return [];
    var syn={ot:"overtime",callback:"callback",cb:"callback",permit:"permit",licence:"licence",license:"licence",
      esign:"signature","e-sign":"signature",gps:"proof",offline:"signal",parts:"truck",stock:"truck",
      warranty:"warranty",margin:"money",phone:"phone",pay:"payroll"};
    var terms=q.split(/[^a-z0-9-]+/).filter(Boolean).map(function(w){ return syn[w]||w; });
    return MANUAL.map(function(a){ var hay=(a.t+" "+a.c).toLowerCase(), s=0;
      terms.forEach(function(t){ if(!t||t.length<3) return;
        if(a.t.toLowerCase().indexOf(t)>=0) s+=6; s += hay.split(t).length-1; });
      return {a:a,s:s}; }).filter(function(r){return r.s>0;})
      .sort(function(x,y){return y.s-x.s;}).slice(0,4).map(function(r){return r.a;});
  }

  document.addEventListener("visibilitychange",function(){ if(!document.hidden) db(); });

  global.Toolbelt = {
    db:db, save:save, fresh:fresh, goLive:goLive, isSample:isSample, SEED:SEED, TODAY:TODAY,
    iso:iso, addDays:addDays, weekOf:weekOf, thisWeek:thisWeek, lastWeek:lastWeek, jobsInWeek:jobsInWeek,
    hhmmToMin:hhmmToMin, minToHhmm:minToHhmm, isWeekend:isWeekend, isHoliday:isHoliday, afterHours:afterHours,
    TRADES:TRADES, tradeColor:tradeColor, JOB_TYPES:JOB_TYPES, BILLING:BILLING, billing:billing,
    isWarrantyWork:isWarrantyWork, PERMIT_WORK:PERMIT_WORK, permitRule:permitRule, needsPermit:needsPermit,
    TASKS:TASKS, LICENCES:LICENCES, LIC_WARN_DAYS:LIC_WARN_DAYS, SKILLS:SKILLS, RATES:RATES, PROOF:PROOF,
    ATS_STAGES:ATS_STAGES, REFERRER_TYPES:REFERRER_TYPES, ESTIMATE_STAGES:ESTIMATE_STAGES,
    BENCH:BENCH, REPLACES:REPLACES, DOC_TEMPLATES:DOC_TEMPLATES, ESIGN_CONSENT:ESIGN_CONSENT, templateById:templateById,
    customerById:customerById, techById:techById, jobById:jobById, partBySku:partBySku,
    docById:docById, docByToken:docByToken, techName:techName, applicantById:applicantById,
    rateFor:rateFor, partsCost:partsCost, scoped:scoped, assignedHoursBefore:assignedHoursBefore,
    weekRevenue:weekRevenue, weekCost:weekCost, weekMargin:weekMargin, weekMarginPct:weekMarginPct,
    weekHours:weekHours, openJobs:openJobs, openHours:openHours, fillRate:fillRate,
    revenueByTrade:revenueByTrade, revenueByBilling:revenueByBilling, marginPctBy:marginPctBy,
    overtimeHours:overtimeHours, callbacks:callbacks, callbackCost:callbackCost, callbackRate:callbackRate,
    callbacksByTech:callbacksByTech,
    daysUntil:daysUntil, licStatus:licStatus, licBlockers:licBlockers, licIssues:licIssues,
    cannotDispatch:cannotDispatch, permitGaps:permitGaps, dispatchedUnlicensed:dispatchedUnlicensed,
    matchFor:matchFor, haversineMi:haversineMi, driveMin:driveMin, busyAt:busyAt, stockFor:stockFor,
    truckStock:truckStock, reorderFlags:reorderFlags, secondTripRisk:secondTripRisk,
    proofState:proofState, proofClean:proofClean, proofExceptions:proofExceptions,
    proofCompliancePct:proofCompliancePct, PROOF_WINDOW_DAYS:PROOF_WINDOW_DAYS, recentClosed:recentClosed,
    arrive:arrive, depart:depart, assign:assign, addJob:addJob, removeJob:removeJob, setPermit:setPermit,
    estimateValue:estimateValue, winRate:winRate, moveEstimate:moveEstimate, addEstimate:addEstimate,
    screenScore:screenScore, moveApplicant:moveApplicant, addApplicant:addApplicant, pipelineCounts:pipelineCounts,
    moldBand:moldBand, radonBand:radonBand, equipDays:equipDays, claimDocs:claimDocs, setStore:setStore,
    dryDay:dryDay, dryRoomState:dryRoomState, dryIsDry:dryIsDry, dryDueToday:dryDueToday, addDryReading:addDryReading, passReferral:passReferral, moveReferral:moveReferral,
    modeLicences:modeLicences, modePermits:modePermits, modeJobs:modeJobs, modeTechs:modeTechs, modeEstimates:modeEstimates, modeTrades:modeTrades,
    TRADE_MODS:TRADE_MODS, tradeMods:tradeMods, tradeMode:tradeMode, tradeMod:tradeMod, setTradeMode:setTradeMode, inMode:inMode,
    referralOverdue:referralOverdue, referralConversion:referralConversion, topReferrers:topReferrers, logTouch:logTouch,
    createDoc:createDoc, sendDoc:sendDoc, openDoc:openDoc, signDoc:signDoc, docsAwaiting:docsAwaiting,
    fillTemplate:fillTemplate, docContext:docContext,
    SEATS:SEATS, BRAIN:BRAIN, bus:bus, approvals:approvals, decideApproval:decideApproval,
    TIERS:TIERS, ROOMS:ROOMS, DEPTS:DEPTS, tier:tier, setTier:setTier, activeRooms:activeRooms,
    hasRoom:hasRoom, toggleRoom:toggleRoom, priceNow:priceNow, priceLabel:priceLabel,
    manual:manual, askManual:askManual, kpis:kpis, iconFor:iconFor,
    SKINS:SKINS, SKIN_DEFAULT:SKIN_DEFAULT, skinNow:skinNow, setSkin:setSkin,
    applySkin:applySkin, skinAccent:skinAccent, shade:shade,
    calls:calls, callById:callById, callStats:callStats, callLabel:callLabel,
    trucks:trucks, truckById:truckById, truckForTech:truckForTech, fleetState:fleetState,
    truckState:truckState, currentJobFor:currentJobFor, etaFor:etaFor, serviceDue:serviceDue,
    milesSinceService:milesSinceService, sendOnMyWay:sendOnMyWay, jobByOmw:jobByOmw, FLEET_CLOCK:FLEET_CLOCK,
    stampsFor:stampsFor, stampHours:stampHours, stampExceptions:stampExceptions, pingAgeMin:pingAgeMin,
    brian:brian, brianBook:brianBook, brianDo:brianDo,
    reviewLink:reviewLink, setReviewLink:setReviewLink, reviews:reviews, reviewFor:reviewFor, reviewQueue:reviewQueue, reviewMessage:reviewMessage,
    reviewAsk:reviewAsk, reviewSkip:reviewSkip, PITCH:PITCH, geoLenFt:geoLenFt, geoAreaSqft:geoAreaSqft, measures:measures, measuresFor:measuresFor,
    addMeasure:addMeasure, deleteMeasure:deleteMeasure, aiDraftEstimate:aiDraftEstimate, priceDraft:priceDraft, techCostPerHr:techCostPerHr,
    TRACK_API:TRACK_API, trackOn:trackOn, trackKey:trackKey, trackStart:trackStart, trackStop:trackStop, trackLink:trackLink,
    trackPull:trackPull, livePhones:livePhones, liveFor:liveFor, trackStatus:trackStatus,
    CLOCK:CLOCK, punches:punches, punchById:punchById, openPunch:openPunch, openBreak:openBreak, clockState:clockState,
    punchMinutes:punchMinutes, breakMinutes:breakMinutes, clockIn:clockIn, clockOut:clockOut, breakStart:breakStart, breakEnd:breakEnd,
    editPunch:editPunch, addPunch:addPunch, punchesFor:punchesFor, clockWeek:clockWeek, payWeek:payWeek, payrollWeek:payrollWeek,
    clockExceptions:clockExceptions, payrollCsv:payrollCsv, timesheetCsv:timesheetCsv, seatNow:seatNow, seesMoney:seesMoney, localStamp:localStamp,
    plans:plans, planById:planById, memberships:memberships, membershipById:membershipById,
    membershipFor:membershipFor, isMember:isMember, memberDiscount:memberDiscount, memberPrice:memberPrice,
    visitsLeft:visitsLeft, planVisitsDue:planVisitsDue, renewalsDue:renewalsDue, renewalsAtRisk:renewalsAtRisk,
    planRevenue:planRevenue, schedulePlanVisit:schedulePlanVisit, draftRenewalNudge:draftRenewalNudge,
    enroll:enroll, setAutoRenew:setAutoRenew, PLAN_DUE_DAYS:PLAN_DUE_DAYS,
    FINANCE:FINANCE, monthlyPayment:monthlyPayment, financeEligible:financeEligible,
    financeOffers:financeOffers, bestMonthly:bestMonthly, requestFinancing:requestFinancing,
    CHECKPOINTS:CHECKPOINTS, CHECK_STAGES:CHECK_STAGES, checkpointsFor:checkpointsFor,
    checkState:checkState, setCheckpoint:setCheckpoint, checkBlockers:checkBlockers,
    canClose:canClose, checkExceptions:checkExceptions, checkStats:checkStats, checkStarted:checkStarted,
    answerCall:answerCall, bookFromCall:bookFromCall, aiHandleCall:aiHandleCall,
    mount:mount, toast:toast, el:el, esc:esc, money:money, money2:money2, pct:pct,
    hhmm:hhmm, dayLabel:dayLabel, page:page, card:card, stat:stat, tag:tag, srcNote:srcNote, bar:bar,
    proofBand:proofBand, brandMark:brandMark, MARK_URL:MARK_URL
  };
})(window);


/* ------------------------------------------------------------------ pricebook
   This showroom no longer trusts its own copy of the price book.

   Every demo used to hard-code its tier names and prices independent of the
   store, and they drifted: on Aug 8 2026 nine of twelve showrooms were quoting
   money that contradicted the store on the same afternoon. Re-syncing twelve
   files by hand every time a price moves isn't a fix, it's a chore that will
   eventually get skipped.

   So the demo now READS the store at runtime. catalog.js on aexperiences.com is
   the one price book; this pulls it, finds this product, and corrects the tier
   name, monthly, and build fee in place — on the same objects the UI renders
   from, so a correction that lands before first paint is simply what shows.

   Three rules, in order:
     1. Never break the demo. Offline, CORS, a catalog rewrite that breaks the
        parse — any failure and it does nothing at all. The baked numbers stay,
        and they are correct as of the Aug 8 2026 sync.
     2. Never invent a number. It only ever copies what the store publishes.
     3. Say something when it corrects. A silent correction hides the drift that
        caused it; the console note is how the next person finds the stale file.

   Read the result any time via: await window.AE_PRICEBOOK                    */

(function (global) {
  "use strict";

  var ID      = "toolbelt";                        /* this product, in the store catalog */
  var STORE   = "https://www.aexperiences.com";
  var CATALOG = STORE + "/catalog.js";
  var API     = STORE + "/api/pricing";   /* preferred the day the store ships it */

  /* Pull ['Name', mo, build] rows out of the catalog's tiers:[ ... ] block for
     one product. Bracket-balanced and string-aware rather than regex-greedy, so
     a description containing a bracket can't run the match past the block end. */
  function parseCatalog(src, id) {
    var at = src.indexOf("id:'" + id + "'");
    if (at < 0) at = src.indexOf('id:"' + id + '"');
    if (at < 0) return null;

    var key = src.indexOf("tiers:", at); if (key < 0) return null;
    var open = src.indexOf("[", key);    if (open < 0) return null;

    var depth = 0, end = -1, inStr = null, i, c;
    for (i = open; i < src.length; i++) {
      c = src[i];
      if (inStr) { if (c === "\\") i++; else if (c === inStr) inStr = null; continue; }
      if (c === "'" || c === '"') { inStr = c; continue; }
      if (c === "[") depth++;
      else if (c === "]") { depth--; if (!depth) { end = i; break; } }
    }
    if (end < 0) return null;

    var block = src.slice(open + 1, end), rows = [], m;
    var re = /\[\s*(['"])((?:\\.|(?!\1).)*)\1\s*,\s*(\d+)\s*,\s*(\d+)/g;
    while ((m = re.exec(block))) {
      rows.push({ name: m[2].replace(/\\(.)/g, "$1"), mo: +m[3], build: +m[4] });
    }
    return rows.length ? rows : null;
  }

  /* Find the app's live TIERS object. Each showroom exports under its own name,
     so match on shape — an object whose entries carry mo + build — rather than on
     a name that could be renamed out from under this. */
  function findTiers() {
    var seen = Object.keys(global), i, o, k, first;
    for (i = 0; i < seen.length; i++) {
      try { o = global[seen[i]]; } catch (e) { continue; }
      if (!o || typeof o !== "object" || !o.TIERS) continue;
      first = null;
      for (k in o.TIERS) { first = o.TIERS[k]; break; }
      if (first && typeof first.mo === "number" && typeof first.build === "number") return o.TIERS;
    }
    return null;
  }

  /* Put the app's tiers in store order. Most showrooms carry an explicit rank and
     that is authoritative. A few (Moments) don't, and there we fall back to the
     declaration order of the object — but only when the counts match exactly, so
     a tier added on one side can never silently shift prices onto the wrong one. */
  function ordered(tiers, expected) {
    var k, list = [], ranked = true;
    for (k in tiers) {
      if (!tiers[k] || typeof tiers[k].mo !== "number") continue;
      if (typeof tiers[k].rank !== "number") ranked = false;
      list.push(tiers[k]);
    }
    if (ranked) return list.sort(function (a, b) { return a.rank - b.rank; });
    return list.length === expected ? list : null;
  }

  /* Never match on the object key. The internal keys (lite/standard/…) are ours
     and can be renamed; the tier's position in the store's list is what a price
     actually belongs to. */
  function reconcile(list, book) {
    var fixes = [];
    book.forEach(function (row, i) {
      var t = list[i];
      if (!t) return;
      if (t.name === row.name && t.mo === row.mo && t.build === row.build) return;
      fixes.push("tier " + (i + 1) + ": " + t.name + " $" + t.mo + "/" + t.build +
                 "  ->  " + row.name + " $" + row.mo + "/" + row.build);
      t.name = row.name; t.mo = row.mo; t.build = row.build;
    });
    return fixes;
  }

  global.AE_PRICEBOOK = (async function () {
    var book = null, r, j, rows, res, tiers = null, tries;

    try {
      r = await fetch(API + "?product=" + encodeURIComponent(ID), { cache: "no-store" });
      if (r.ok) {
        j = await r.json();
        rows = j.tiers || j.data || j;
        if (Array.isArray(rows) && rows.length) {
          book = rows.map(function (t) {
            return Array.isArray(t) ? { name: t[0], mo: +t[1], build: +t[2] }
                                    : { name: t.name, mo: +t.mo, build: +t.build };
          });
        }
      }
    } catch (e) { /* endpoint absent — expected today, not an error */ }

    if (!book) {
      try {
        res = await fetch(CATALOG, { cache: "no-store" });
        if (res.ok) book = parseCatalog(await res.text(), ID);
      } catch (e) { return { ok: false, why: "store unreachable", id: ID }; }
    }
    if (!book) return { ok: false, why: "product not found in catalog", id: ID };

    /* The app may still be booting. Wait briefly, then give up quietly — a demo
       rendering its own correct baked numbers is a fine outcome. */
    for (tries = 0; tries < 60 && !(tiers = findTiers()); tries++) {
      await new Promise(function (done) { setTimeout(done, 50); });
    }
    if (!tiers) return { ok: false, why: "app tiers not exposed", id: ID };

    var list = ordered(tiers, book.length);
    if (!list) return { ok: false, why: "tier count disagrees with the catalog", id: ID };

    var fixes = reconcile(list, book);
    if (fixes.length) {
      console.info("[pricebook] " + ID + " — corrected " + fixes.length +
        " tier(s) against the store catalog. The copy baked into this repo has " +
        "drifted and should be re-synced:\n  " + fixes.join("\n  "));
    }
    return { ok: true, id: ID, tiers: book.length, corrected: fixes.length, fixes: fixes };
  })();

})(window);


/* --------------------------------------------------------------- scope note
   The showroom always opens at the TOP tier on purpose — Art. X: show the
   ceiling, take departments off to fit, never build up from a stripped base.
   That is deliberate and it is right. What was missing is that nobody ever
   SAID so, so a visitor who stepped the tier down had no way to tell whether
   the numbers still on screen were meant to be theirs. They are not. On a
   mystery-shop of Abode the reviewer put it as not being able to picture
   themselves in it, and this is a large part of why.

   So: when you are not on the top tier, the floor says out loud that the
   figures are still seeded at full scale, and tells you what your tier
   actually changes — the departments. No number is altered, invented or
   shrunk to flatter a smaller buyer (Art. IV).

   Appended rather than surgically inserted so it works identically across
   eleven engines that differ inside. It reads the live TIERS, never a copy. */

(function (global) {
  "use strict";

  function engine() {
    var k, o;
    for (k in global) {
      try { o = global[k]; } catch (e) { continue; }
      if (o && typeof o === "object" && o.TIERS && typeof o.tier === "function") return o;
    }
    return null;
  }

  function line(A) {
    var here, top = null, k;
    try { here = A.TIERS[A.tier()]; } catch (e) { return ""; }
    for (k in A.TIERS) if (!top || (A.TIERS[k].rank || 0) > (top.rank || 0)) top = A.TIERS[k];
    if (!here || !top || here.rank === top.rank) return "";          /* top tier: nothing to explain */
    var mine = (here.includes || []).length, all = (top.includes || []).length;
    var s = "This floor stays seeded at full " + top.name + " scale so you can see the ceiling — "
          + "the figures below are not resized down to " + here.name + ".";
    if (mine && all) s += " What your tier changes is the departments: " + mine + " of " + all + " switched on.";
    return s;
  }

  function paint() {
    var A = engine(); if (!A) return;
    var bar = document.querySelector(".topbar"); if (!bar || !bar.parentNode) return;
    var msg = line(A), el = document.getElementById("aeScopeNote");
    if (!msg) { if (el && el.parentNode) el.parentNode.removeChild(el); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "aeScopeNote";
      el.className = "scopenote";
      /* styled inline so this needs no stylesheet edit in any of the eleven,
         and inherits whatever chrome the product already uses */
      el.style.cssText = "padding:7px 14px;font-size:11.5px;line-height:1.45;opacity:.72;" +
        "border-bottom:1px solid rgba(128,128,128,.22)";
      bar.parentNode.insertBefore(el, bar.nextSibling);
    }
    if (el.textContent !== msg) el.textContent = msg;
  }

  function boot() {
    paint();
    [200, 600, 1400, 2600].forEach(function (ms) { setTimeout(paint, ms); });
    /* tier changes re-render the chrome; some engines reload, some do not */
    setInterval(paint, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

})(window);

/* BIRDSEYE:BEGIN — added by machines/birdseye/convert.py. Wraps Toolbelt.mount() so every page gets the
   Birdseye shell (header, floor plan, dock, More sheet, helper tab). Legacy functions are untouched.
   To undo: `python3 convert.py undo <repo>` (or delete from BEGIN to END). */
(function () {
  var G = window["Toolbelt"]; if (!G || typeof G.mount !== 'function' || G.__birdseye) return; G.__birdseye = true;
  var me = document.currentScript, base = me && me.src ? me.src.replace(/[^\/]*(\?.*)?$/, '') : '';
  var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + 'birdseye/birdseye.css'; document.head.appendChild(l);
  var ready = false, queue = [];
  function load(src, cb) { var s = document.createElement('script'); s.src = src; s.onload = cb; s.onerror = cb; document.head.appendChild(s); }
  load(base + 'birdseye/birdseye-shell.js', function () { load(base + 'birdseye.config.js', function () { ready = true; queue.splice(0).forEach(function (f) { f(); }); }); });
  var legacyMount = G.mount;
  G.mount = function (o) {
    document.documentElement.classList.add('bs-on', 'bs-pending');
    var c = legacyMount.apply(this, arguments);
    function go() { try { if (window.BirdseyeShell && window.BIRDSEYE) window.BirdseyeShell.adopt({ config: window.BIRDSEYE, active: o && o.active, content: c }); } catch (e) { if (window.console) console.error('[birdseye]', e); } document.documentElement.classList.remove('bs-pending'); }
    if (ready) go(); else queue.push(go);
    return c;
  };
})();
/* BIRDSEYE:END */
