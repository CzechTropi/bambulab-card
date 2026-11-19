// bambulab-card – minimalist Bambu Lab printer card (camera / preview, chips, progress)
// + bambulab-ams-card (one or more AMS), bambulab-spool-card (external spool or one AMS tray)
// and, for older dashboards only, bambulab-filament-card (AMS + external spool in one card)
// Printer card config: printer (device id from the Bambu Lab integration), power_switch, camera (optional), name (optional)

const BBL_COLORS = {
  running: '#378ADD', prepare: '#BA7517', pause: '#E0A030', finish: '#639922', failed: '#E24B4A',
};

const BBL_I18N = {
  cs: {
    running: 'Tiskne', prepare: 'Připravuje tisk', pause: 'Pozastaveno', finish: 'Dokončeno', failed: 'Chyba tisku',
    idle: 'Připravena', init: 'Spouští se', slicing: 'Slicuje', offline: 'Offline', unavailable: 'Vypnutá', unknown: 'Neznámý stav',
    err_print: 'Chyba tisku', more: 'více informací',
    layer: 'vrstva', left: 'zbývá', start: 'start', done: 'hotovo', print: 'Tisk', live: 'ŽIVĚ', preview: 'NÁHLED',
    t_light: 'Světlo', t_power: 'Napájení', t_toggle: 'Přepnout kamera / náhled',
    warn: 'Vyber v editoru karty tiskárnu (zařízení z integrace Bambu Lab).',
    e_printer: 'Tiskárna', e_power_switch: 'Vypínač napájení', e_camera: 'Vlastní kamera', e_name: 'Název tiskárny',
    e_icons: 'Ikony', e_colors: 'Barvy',
    e_icon_light: 'Ikona světla', e_icon_power: 'Ikona napájení', e_icon_nozzle: 'Ikona hotendu', e_icon_bed: 'Ikona podložky', e_icon_chamber: 'Ikona komory', e_icon_usage: 'Ikona příkonu',
    e_color_light: 'Barva světla (zapnuto)', e_color_power: 'Barva napájení (zapnuto)', e_color_nozzle: 'Barva hotendu', e_color_bed: 'Barva podložky', e_color_chamber: 'Barva komory', e_color_progress: 'Barva progresu',
    h_camera: 'Prázdné = kamera tiskárny', h_name: 'Prázdné = název zařízení', h_power_switch: 'Chytrá zásuvka tiskárny. Příkon se načte ze stejného zařízení',
    desc: 'Minimalistická karta pro Bambu Lab tiskárnu: kamera, náhled, teploty, progres',
  },
  en: {
    running: 'Printing', prepare: 'Preparing', pause: 'Paused', finish: 'Finished', failed: 'Print failed',
    idle: 'Ready', init: 'Starting', slicing: 'Slicing', offline: 'Offline', unavailable: 'Powered off', unknown: 'Unknown',
    err_print: 'Print error', more: 'more info',
    layer: 'layer', left: 'left', start: 'start', done: 'done', print: 'Print', live: 'LIVE', preview: 'PREVIEW',
    t_light: 'Light', t_power: 'Power', t_toggle: 'Switch camera / preview',
    warn: 'Pick a printer (a Bambu Lab device) in the card editor.',
    e_printer: 'Printer', e_power_switch: 'Power switch', e_camera: 'Custom camera', e_name: 'Printer name',
    e_icons: 'Icons', e_colors: 'Colors',
    e_icon_light: 'Light icon', e_icon_power: 'Power icon', e_icon_nozzle: 'Hotend icon', e_icon_bed: 'Bed icon', e_icon_chamber: 'Chamber icon', e_icon_usage: 'Power usage icon',
    e_color_light: 'Light color (on)', e_color_power: 'Power color (on)', e_color_nozzle: 'Hotend color', e_color_bed: 'Bed color', e_color_chamber: 'Chamber color', e_color_progress: 'Progress color',
    h_camera: 'Empty = printer camera', h_name: 'Empty = device name', h_power_switch: 'Smart plug of the printer. Power usage is read from the same device',
    desc: 'Minimalist Bambu Lab printer card: camera, preview, temperatures, progress',
  },
};
const bblLang = (hass) => {
  const l = ((hass && ((hass.locale && hass.locale.language) || hass.language)) || navigator.language || 'en').toLowerCase();
  return l.split('-')[0];
};
const bblT = (hass) => BBL_I18N[bblLang(hass)] || BBL_I18N.en;
// Card picker texts are registered before hass exists: HA sets <html lang> to the profile language
const bblPickerT = () => {
  const l = ((document.documentElement && document.documentElement.lang) || navigator.language || 'en').toLowerCase().split('-')[0];
  return BBL_I18N[l] || BBL_I18N.en;
};

const BBL_STAGE = {
  printing: 'Tiskne',
  auto_bed_leveling: 'Vyrovnávání podložky',
  bed_level_phase_1: 'Vyrovnávání podložky (1)',
  bed_level_phase_2: 'Vyrovnávání podložky (2)',
  bed_level_high_temperature: 'Vyrovnávání podložky za tepla',
  heatbed_preheating: 'Předehřev podložky',
  heatbed_stabilizing: 'Stabilizace teploty podložky',
  waiting_for_heatbed_temperature: 'Čeká na teplotu podložky',
  heating_hotend: 'Ohřev hotendu',
  preparing_hotend: 'Příprava hotendu',
  checking_extruder_temperature: 'Kontrola teploty extruderu',
  cleaning_nozzle_tip: 'Čištění trysky',
  homing_toolhead: 'Najíždění do výchozí polohy',
  calibrating_extrusion: 'Kalibrace extruze',
  calibrating_extrusion_flow: 'Kalibrace průtoku',
  calibrating_motor_noise: 'Kalibrace hluku motorů',
  motor_noise_showoff: 'Kalibrace hluku motorů',
  calibrating_micro_lidar: 'Kalibrace lidaru',
  scanning_bed_surface: 'Skenování podložky',
  measuring_surface: 'Měření povrchu',
  identifying_build_plate_type: 'Rozpoznávání podložky',
  inspecting_first_layer: 'Kontrola první vrstvy',
  print_calibration_lines: 'Tisk kalibračních čar',
  pre_extrusion_before_printing: 'Předextruze',
  filament_loading: 'Zavádění filamentu',
  filament_unloading: 'Vytahování filamentu',
  changing_filament: 'Výměna filamentu',
  preparing_ams: 'Příprava AMS',
  check_material: 'Kontrola materiálu',
  cooling_nozzle: 'Chlazení trysky',
  heated_bedcooling: 'Chlazení podložky',
  moving_toolhead_to_center_of_heatbed: 'Přesun hlavy na střed',
  sweeping_xy_mech_mode: 'Kalibrace os XY',
  paused_user: 'pozastaveno uživatelem',
  paused_user_gcode: 'pozastaveno G-kódem',
  m400_pause: 'pozastaveno G-kódem',
  paused_filament_runout: 'došel filament',
  paused_nozzle_clog: 'ucpaná tryska',
  paused_first_layer_error: 'chyba první vrstvy',
  paused_skipped_step: 'přeskočené kroky motoru',
  paused_ams_lost: 'ztráta spojení s AMS',
  paused_nozzle_temperature_malfunction: 'porucha teploty trysky',
  paused_heat_bed_temperature_malfunction: 'porucha teploty podložky',
  paused_low_fan_speed_heat_break: 'nízké otáčky ventilátoru',
  paused_front_cover_falling: 'uvolněný přední kryt',
  paused_nozzle_filament_covered_detected: 'filament na trysce',
  paused_cutter_error: 'chyba řezačky',
};

// role -> "domain:translation_key" of the ha-bambulab entity on the printer device
const BBL_ROLES = {
  status: 'sensor:print_status',
  stage: 'sensor:stage',
  progress: 'sensor:print_progress',
  nozzle: 'sensor:nozzle_temp',
  nozzleT: 'sensor:target_nozzle_temp',
  bed: 'sensor:bed_temp',
  bedT: 'sensor:target_bed_temp',
  chamber: 'sensor:chamber_temp',
  chamberT: 'sensor:target_chamber_temp',
  remaining: 'sensor:remaining_time',
  start: 'sensor:start_time',
  end: 'sensor:end_time',
  task: 'sensor:subtask_name',
  gcode: 'sensor:gcode_file',
  tray: 'sensor:active_tray',
  layer: 'sensor:current_layer',
  layers: 'sensor:total_layers',
  preview: 'image:cover_image',
  light: 'light:chamber_light',
  camera: 'camera:camera',
  hms: 'binary_sensor:hms_errors',
  perr: 'binary_sensor:print_error',
  online: 'binary_sensor:online',
};

const BBL_ICONS = {
  light: 'M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z',
  power: 'M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13',
  image: 'M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z',
  video: 'M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z',
  nozzle: 'M7,2H17V8H19V13H16.5L13,17H11L7.5,13H5V8H7V2M10,22H2V20H10A1,1 0 0,0 11,19V18H13V19A3,3 0 0,1 10,22Z',
  bed: 'M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z',
  bolt: 'M11,15H6L13,1V9H18L11,23V15Z',
  chamber: 'M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z',
  alert: 'M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  printer: 'M19,6A1,1 0 0,0 20,5A1,1 0 0,0 19,4A1,1 0 0,0 18,5A1,1 0 0,0 19,6M19,2A3,3 0 0,1 22,5V11H18V7H6V11H2V5A3,3 0 0,1 5,2H19M18,18.25C18,18.63 17.79,18.96 17.47,19.13L12.57,21.82C12.4,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L6.53,19.13C6.21,18.96 6,18.63 6,18.25V13C6,12.62 6.21,12.29 6.53,12.12L11.43,9.68C11.59,9.56 11.79,9.5 12,9.5C12.21,9.5 12.4,9.56 12.57,9.68L17.47,12.12C17.79,12.29 18,12.62 18,13V18.25M12,11.65L9.04,13L12,14.6L14.96,13L12,11.65M8,17.66L11,19.29V16.33L8,14.71V17.66M16,17.66V14.71L13,16.33V19.29L16,17.66Z',
};

const bblColor = (v, def) => {
  if (!v) return def;
  if (/^(#|rgb|hsl|var\()/i.test(v)) return v;
  return `var(--${v}-color, ${def})`;
};
const bblAttr = (x) => String(x).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

const bblsvg = (p, size = 18) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path fill="currentColor" d="${p}"/></svg>`;

// Find entity ids for every role on a Bambu Lab printer device
function bblResolve(hass, deviceId) {
  const out = {};
  if (!hass || !hass.entities || !deviceId) return out;
  const want = {};
  Object.entries(BBL_ROLES).forEach(([role, key]) => { want[key] = role; });
  Object.values(hass.entities).forEach((ent) => {
    if (ent.device_id !== deviceId || !ent.translation_key) return;
    const key = `${ent.entity_id.split('.')[0]}:${ent.translation_key}`;
    if (want[key] && !out[want[key]]) out[want[key]] = ent.entity_id;
  });
  return out;
}

// Power sensor (device_class power) on the same device as the power switch
function bblPowerSensor(hass, switchId) {
  const sw = hass && hass.entities && hass.entities[switchId];
  if (!sw || !sw.device_id) return undefined;
  const hit = Object.values(hass.entities).find((ent) => ent.device_id === sw.device_id
    && ent.entity_id.startsWith('sensor.')
    && hass.states[ent.entity_id]
    && hass.states[ent.entity_id].attributes.device_class === 'power');
  return hit ? hit.entity_id : undefined;
}

// ---- MOCK: made-up data, so the cards can be tried without the printer / AMS (like `printer: MOCK` in ha-bambulab)
Object.assign(BBL_I18N.cs, {
  e_source: 'Zdroj dat', o_src_device: 'Moje zařízení', o_src_mock: 'Ukázková data (MOCK)',
  h_source: 'MOCK = vymyšlená data jen na vyzkoušení vzhledu, z tiskárny se nic nečte',
  f_mock_title: 'MOCK', e_mock_ams: 'Ukázková AMS', e_mock_printer: 'Stav tiskárny', e_mock_spool: 'Ukázková špulka',
  o_m_3h: 'AMS 3H (H3C) se sušicím boxem', o_m_2pro: 'AMS 2 Pro – právě suší', o_m_ht: 'AMS HT – právě suší', o_m_ams: 'AMS', o_m_lite: 'AMS Lite',
  o_m_error: 'Chyba (HMS)', o_ms_ext: 'Externí špulka', o_ms_ext_active: 'Externí špulka – právě se z ní tiskne', o_ms_tray: 'Slot AMS (vícebarevný filament)',
  m_task: 'Krabička na Raspberry Pi', m_hms: 'AMS A, slot 1: došel filament. Vložte nový filament.',
});
Object.assign(BBL_I18N.en, {
  e_source: 'Data Source', o_src_device: 'My devices', o_src_mock: 'Mock data (MOCK)',
  h_source: 'MOCK = made-up data just to try the look, nothing is read from the printer',
  f_mock_title: 'MOCK', e_mock_ams: 'Mock AMS', e_mock_printer: 'Printer State', e_mock_spool: 'Mock Spool',
  o_m_3h: 'AMS 3H (H3C) with dry box', o_m_2pro: 'AMS 2 Pro – drying now', o_m_ht: 'AMS HT – drying now', o_m_ams: 'AMS', o_m_lite: 'AMS Lite',
  o_m_error: 'Error (HMS)', o_ms_ext: 'External spool', o_ms_ext_active: 'External spool – printing from it', o_ms_tray: 'AMS tray (multi-color filament)',
  m_task: 'Raspberry Pi case', m_hms: 'AMS A slot 1: filament has run out. Please insert a new filament.',
});
const bblIsMock = (v) => [].concat(v || []).includes('MOCK');
const BBL_MOCK_DEV = 'bbf_mock_printer';
// a print plate seen from above with one printed part on it – the "cover image" of the mock print
const BBL_MOCK_PREVIEW = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">'
  + '<rect width="320" height="180" fill="#1d1f22"/><path d="M60 120 160 160 260 120 160 80Z" fill="#3a3d42"/><path d="M60 120v6l100 40 100-40v-6l-100 40z" fill="#2a2c30"/>'
  + '<path d="M118 108v-36l42 17v36z" fill="#1E50C8"/><path d="M160 125V89l42-17v36z" fill="#173f9e"/><path d="M118 72l42-17 42 17-42 17z" fill="#3f73e6"/>'
  + '<path d="M140 72l20-8 20 8-20 8z" fill="#173f9e"/></svg>')}`;
// a made-up live camera view of the chamber: the part grows with the progress, the toolhead moves while printing
function bblMockCam(scenario) {
  const m = BBL_MOCK_PRINTER[scenario] || BBL_MOCK_PRINTER.printing;
  const moving = m[0] === 'running';
  const h = Math.round((scenario === 'idle' ? 0 : m[2] / 100) * 110);
  const top = 292 - h;
  const head = scenario === 'idle' || scenario === 'finish' ? 'translate(190 0)' : 'translate(0 0)';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">'
    + '<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2d31"/><stop offset="1" stop-color="#121315"/></linearGradient>'
    + '<radialGradient id="lt" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#fff3d6" stop-opacity=".22"/><stop offset="1" stop-color="#fff3d6" stop-opacity="0"/></radialGradient></defs>'
    + '<rect width="640" height="360" fill="url(#bg)"/><rect width="640" height="360" fill="url(#lt)"/>'
    + '<path d="M40 0 92 250M600 0 548 250" stroke="#3a3d42" stroke-width="6"/>'
    + '<path d="M110 292h420l60 56H50z" fill="#3b3e44"/><path d="M110 292h420l60 56H50z" fill="none" stroke="#55585e" stroke-width="2"/>'
    + '<path d="M50 348h540v8H50z" fill="#25272b"/>'
    + (h ? `<path d="M270 ${top}h100v${h}H270z" fill="#1E50C8"/><path d="M270 ${top}l14-12h100l-14 12z" fill="#3f73e6"/><path d="M370 ${top}l14-12v${h}l-14 12z" fill="#173f9e"/>`
      + `<path d="M270 ${top}h100" stroke="#7fa6ff" stroke-width="2" opacity=".6"/>` : '')
    + `<path d="M60 ${top - 86}h520v14H60z" fill="#4a4d52"/>`
    + `<g transform="${head}"><g>`
    + (moving ? '<animateTransform attributeName="transform" type="translate" values="-40 0;60 0;10 0;-40 0" dur="2.6s" repeatCount="indefinite"/>' : '')
    + `<path d="M286 ${top - 96}h68v78h-68z" fill="#d9d9d9"/><path d="M286 ${top - 96}h68v12h-68z" fill="#bdbdbd"/>`
    + `<path d="M300 ${top - 18}h40v8h-40z" fill="#8b8b8b"/><path d="M314 ${top - 10}h12l-6 9z" fill="#c9a24a"/>`
    + `<rect x="300" y="${top - 80}" width="40" height="5" rx="2" fill="#00ae42"/></g></g>`
    + '<text x="40" y="336" text-anchor="start" font-family="sans-serif" font-size="13" fill="#ffffff" opacity=".35">MOCK</text></svg>';
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
const BBL_MOCK_PRINTER = {
  // status, stage, progress %, nozzle, nozzle target, bed, bed target, hours left, layer, power W, cover image
  printing: ['running', 'printing', 42, 220, 220, 65, 65, 1.6, 87, 142, true],
  pause: ['pause', 'paused_user', 63, 204, 220, 65, 65, 0.9, 131, 96, true],
  prepare: ['prepare', 'heatbed_preheating', 0, 142, 220, 48, 65, 2.7, 0, 610, true],
  finish: ['finish', 'idle', 100, 41, 0, 44, 0, 0, 210, 18, true],
  idle: ['idle', 'idle', 0, 27, 0, 25, 0, 0, 0, 12, false],
  error: ['pause', 'paused_filament_runout', 71, 198, 220, 65, 65, 0.7, 149, 90, true],
};
// a copy of hass with only the mock printer in it
function bblMockHass(hass, scenario, st) {
  const T = bblT(hass);
  const m = BBL_MOCK_PRINTER[scenario] || BBL_MOCK_PRINTER.printing;
  const states = {}, entities = {}, devices = {};
  devices[BBL_MOCK_DEV] = { id: BBL_MOCK_DEV, name: 'MOCK', model: 'X1C', manufacturer: 'Bambu Lab' };
  const add = (role, state, attributes) => {
    const [domain, key] = (BBL_ROLES[role] || role).split(':');
    const id = `${domain}.bbf_mock_${key}`;
    entities[id] = { entity_id: id, device_id: BBL_MOCK_DEV, translation_key: key, platform: 'bambu_lab' };
    states[id] = { entity_id: id, state: String(state), attributes: attributes || {} };
  };
  const now = Math.floor(Date.now() / 60000) * 60000;
  const c = { unit_of_measurement: '°C' };
  add('status', m[0]); add('stage', m[1]); add('progress', m[2], { unit_of_measurement: '%' });
  add('nozzle', m[3], c); add('nozzleT', m[4], c); add('bed', m[5], c); add('bedT', m[6], c);
  add('chamber', { printing: 38, pause: 37, prepare: 29, finish: 34, idle: 26, error: 38 }[scenario] || 38, c);
  add('remaining', m[7], { unit_of_measurement: 'h' });
  add('start', new Date(now - 70 * 60000).toISOString()); add('end', new Date(now + m[7] * 3600000).toISOString());
  add('task', T.m_task || 'Raspberry Pi case'); add('layer', m[8]); add('layers', 210);
  if (m[10]) add('preview', 'mock', { entity_picture: BBL_MOCK_PREVIEW });
  add('light', st.light === false || (st.light == null && scenario === 'idle') ? 'off' : 'on');
  add('hms', scenario === 'error' ? 'on' : 'off', scenario === 'error'
    ? { Count: 1, '1-Error': T.m_hms, '1-Wiki': 'https://wiki.bambulab.com/en/x1/troubleshooting/hmscode/0700_2000_0002_0001' } : {});
  add('perr', 'off');
  add('switch:mock_power', st.power === false ? 'off' : 'on');
  add('sensor:mock_power_usage', m[9], { device_class: 'power', unit_of_measurement: 'W' });
  return Object.assign(Object.create(hass), { states, entities, devices });
}

class BambuLabCard extends HTMLElement {
  setConfig(config) {
    this._cfg = { ...(config || {}) };
    this._e = null;
    this._showPreview = false;
    this._built = false;
  }

  getCardSize() { return 7; }
  getGridOptions() { return { columns: 'full', rows: 'auto' }; }

  _resolveAll(hass) {
    const c = this._cfg;
    let e = {};
    if (c.printer) {
      e = bblResolve(hass, bblIsMock(c.printer) ? BBL_MOCK_DEV : c.printer);
    }
    if (c.camera) e.camera = c.camera;
    if (c.preview) e.preview = c.preview;
    if (c.light) e.light = c.light;
    e.power_switch = c.power_switch;
    e.power_sensor = c.power_sensor || bblPowerSensor(hass, c.power_switch);
    Object.assign(e, c.entities || {});
    if (bblIsMock(c.printer)) {
      e.power_switch = 'switch.bbf_mock_mock_power'; e.power_sensor = 'sensor.bbf_mock_mock_power_usage';
      if (!c.camera) e.camera = 'camera.bbf_mock_camera';
      e.name = c.name || 'Bambu Lab X1C · MOCK';
      this._e = e; return;
    }
    const dev = c.printer && hass.devices ? hass.devices[c.printer] : null;
    e.name = c.name || (dev && (dev.name_by_user || (dev.model ? `Bambu ${dev.model}` : dev.name))) || 'Bambu Lab';
    this._e = e;
  }

  set hass(hass) {
    this._realHass = hass;
    this._mock = bblIsMock(this._cfg.printer);
    if (this._mock) hass = bblMockHass(hass, this._cfg.mock, this._mockSt || (this._mockSt = {}));
    this._hass = hass;
    if (!this._e || (this._cfg.printer && !this._e.status && hass.entities)) {
      const had = this._e && this._e.camera;
      this._resolveAll(hass);
      if (this._built && this._e.camera !== had) { this._built = false; this._camCard = null; }
    }
    if (this._built && this._lang !== bblLang(hass)) { this._built = false; this._camCard = null; }
    if (!this._built) this._build();
    if (this._camCard) this._camCard.hass = hass;
    this._update();
  }

  _build() {
    this._built = true;
    this._chipHtml = null; this._tIcon = null; this._errHtml = null;
    const T = bblT(this._hass); this._lang = bblLang(this._hass);
    const c = this._cfg;
    [['--bbl-light', c.color_light, '#FFC107'], ['--bbl-power', c.color_power, '#7CB342'], ['--bbl-noz', c.color_nozzle, '#E9A23B'],
      ['--bbl-bed', c.color_bed, '#E07250'], ['--bbl-cham', c.color_chamber, '#4FB3A9'], ['--bbl-prog', c.color_progress, '#378ADD']]
      .forEach(([k, v, d]) => this.style.setProperty(k, bblColor(v, d)));
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        ha-card { padding: 14px; overflow: hidden; }
        .head { display: flex; align-items: center; gap: 10px; }
        .dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; transition: background .3s; }
        .dot.live { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
              @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
        .title { flex: 1; min-width: 0; }
        .name { font-size: 15px; font-weight: 500; line-height: 1.2; }
        .status { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ibtn { width: 36px; height: 36px; border-radius: 50%; border: none; display: inline-flex; align-items: center; justify-content: center;
                background: rgba(128,128,128,.12); color: var(--secondary-text-color); cursor: pointer; padding: 0; flex-shrink: 0;
                transition: background .2s, color .2s; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .ibtn.on-light { background: color-mix(in srgb, var(--bbl-light) 18%, transparent); color: var(--bbl-light); }
        .ibtn.on-power { background: color-mix(in srgb, var(--bbl-power) 16%, transparent); color: var(--bbl-power); }
        .media { position: relative; margin-top: 12px; border-radius: 12px; overflow: hidden; background: rgba(128,128,128,.1); aspect-ratio: 16/9; }
        .media > div { position: absolute; inset: 0; }
        .media img.mockcam { width: 100%; height: 100%; object-fit: cover; display: block; transition: filter .3s; }
        .media img.mockcam.dark { filter: brightness(.45); }
        .media img.mockcam.off { filter: brightness(0); }
        .media img.preview { width: 100%; height: 100%; object-fit: contain; display: block; }
        .media .cam { --ha-card-border-width: 0; --ha-card-border-radius: 0; --ha-card-box-shadow: none; }
        .media .cam > * { height: 100%; display: block; }
        .mtoggle { position: absolute; top: 8px; right: 8px; z-index: 2; background: rgba(0,0,0,.5); color: #fff; backdrop-filter: blur(4px); }
        .mlabel { position: absolute; left: 8px; top: 8px; z-index: 2; font-size: 10px; font-weight: 600; letter-spacing: .5px; color: #fff;
                  background: rgba(0,0,0,.5); padding: 3px 7px; border-radius: 6px; backdrop-filter: blur(4px); }
        .chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 12px; }
        .chips:empty { display: none; }
        .chip { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; padding: 4px 10px; border-radius: 999px; white-space: nowrap;
                border: 1px solid; line-height: 1.4; }
        .chip svg { flex-shrink: 0; }
        .c-noz { background: color-mix(in srgb, var(--bbl-noz) 12%, transparent); border-color: color-mix(in srgb, var(--bbl-noz) 45%, transparent); color: var(--bbl-noz); }
        .c-cham { background: color-mix(in srgb, var(--bbl-cham) 12%, transparent); border-color: color-mix(in srgb, var(--bbl-cham) 45%, transparent); color: var(--bbl-cham); }
        .c-bed { background: color-mix(in srgb, var(--bbl-bed) 12%, transparent); border-color: color-mix(in srgb, var(--bbl-bed) 45%, transparent); color: var(--bbl-bed); }
        .c-fil { background: rgba(55,138,221,.12); border-color: rgba(55,138,221,.45); color: #5BA3EA; }
        .c-pow { background: rgba(128,128,128,.1); border-color: rgba(128,128,128,.3); color: var(--secondary-text-color); }
        .swatch { width: 9px; height: 9px; border-radius: 50%; border: 1px solid rgba(255,255,255,.3); }
        .divider { height: 1px; background: rgba(128,128,128,.18); margin: 12px 0; }
        .file { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .plabel { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; margin: 8px 0 6px; }
        .plabel .pct { font-weight: 600; color: var(--pcolor); }
        .plabel .meta { color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bar { position: relative; height: 8px; background: rgba(128,128,128,.18); border-radius: 999px; }
        .fill { height: 100%; border-radius: 999px; background: var(--pcolor); transition: width .6s ease; }
        .times { display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px; color: var(--secondary-text-color); }
        .times .eta { color: #7CB342; }
        .warn { margin-top: 12px; font-size: 13px; color: var(--secondary-text-color); }
        .err { margin-top: 12px; display: flex; gap: 8px; align-items: flex-start; padding: 8px 10px; border-radius: 10px;
               background: rgba(228,75,74,.12); border: 1px solid rgba(228,75,74,.45); color: #F07170; font-size: 12px; line-height: 1.4; }
        .err svg { flex-shrink: 0; margin-top: 1px; }
        .err .msgs { min-width: 0; }
        .err .msgs div + div { margin-top: 4px; }
        .err a { color: inherit; }
        .hidden { display: none !important; }
      </style>
      <ha-card>
        <div class="head">
          <div class="dot" id="dot"></div>
          <div class="title"><div class="name" id="name"></div><div class="status" id="status"></div></div>
          <button class="ibtn" id="light" title="${T.t_light}">${this._icon('icon_light', 'light')}</button>
          <button class="ibtn" id="power" title="${T.t_power}">${this._icon('icon_power', 'power')}</button>
        </div>
        <div class="warn hidden" id="warn">${T.warn}</div>
        <div class="err hidden" id="err">${bblsvg(BBL_ICONS.alert, 16)}<div class="msgs" id="errmsgs"></div></div>
        <div class="media" id="media">
          <div id="camwrap" class="cam"></div>
          <div id="prevwrap" class="hidden"><img class="preview" id="previmg" alt=""></div>
          <span class="mlabel" id="mlabel">${T.live}</span>
          <button class="ibtn mtoggle" id="mtoggle" title="${T.t_toggle}"></button>
        </div>
        <div class="chips" id="chips"></div>
        <div id="printblock" class="hidden">
          <div class="divider"></div>
          <div class="file" id="file"></div>
          <div class="plabel"><span class="pct" id="pct"></span><span class="meta" id="meta"></span></div>
          <div class="bar"><div class="fill" id="fill"></div></div>
          <div class="times"><span id="tstart"></span><span class="eta" id="tend"></span></div>
        </div>
      </ha-card>`;
    this._r = root;
    const $ = (id) => root.getElementById(id);
    this._$ = $;
    const stop = (el) => ['pointerdown', 'pointerup', 'touchstart', 'touchend'].forEach((ev) => el.addEventListener(ev, (e) => e.stopPropagation()));
    ['light', 'power', 'mtoggle'].forEach((id) => stop($(id)));

    $('light').addEventListener('click', () => this._call('light', 'toggle', this._e.light));
    $('mtoggle').addEventListener('click', () => { this._showPreview = !this._showPreview; this._update(); });
    $('power').addEventListener('click', () => {
      if (this._mock) { this._call('switch', 'toggle', this._e.power_switch); return; }
      this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: this._e.power_switch }, bubbles: true, composed: true }));
    });

    if (this._e.camera === 'camera.bbf_mock_camera') {
      $('camwrap').innerHTML = '<img class="mockcam" id="mockcam" alt="">';
    } else if (this._e.camera) {
      const camCfg = { type: 'picture-entity', entity: this._e.camera, camera_view: 'live', show_name: false, show_state: false, tap_action: { action: 'more-info' } };
      const mk = (helpers) => {
        this._camCard = helpers.createCardElement(camCfg);
        this._camCard.hass = this._hass;
        $('camwrap').appendChild(this._camCard);
      };
      if (window.loadCardHelpers) window.loadCardHelpers().then(mk);
    }
  }

  _icon(cfgKey, svgKey, size = 18) {
    const ic = this._cfg[cfgKey];
    return ic ? `<ha-icon icon="${bblAttr(ic)}" style="--mdc-icon-size:${size}px;display:inline-flex"></ha-icon>` : bblsvg(BBL_ICONS[svgKey], size);
  }

  _st(id) { const s = id && this._hass.states[id]; return s ? s.state : undefined; }
  _num(id) { const v = parseFloat(this._st(id)); return isNaN(v) ? null : v; }
  _call(domain, service, entity_id) {
    // MOCK: the buttons switch the made-up light / power, nothing is sent to HA
    if (this._mock) { const k = domain === 'light' ? 'light' : 'power'; this._mockSt[k] = this._st(entity_id) !== 'on'; this.hass = this._realHass; return; }
    if (entity_id) this._hass.callService(domain, service, { entity_id });
  }

  _fmtTime(iso) {
    if (!iso || ['unknown', 'unavailable'].includes(iso)) return '';
    const d = new Date(iso); if (isNaN(d)) return '';
    const tf = this._hass && this._hass.locale && this._hass.locale.time_format;
    const opts = { hour: '2-digit', minute: '2-digit' };
    if (tf === '24') opts.hourCycle = 'h23';
    else if (tf === '12') opts.hour12 = true;
    return d.toLocaleTimeString(tf === 'system' ? undefined : (this._lang || undefined), opts);
  }
  _fmtDur(h) {
    if (h == null || h <= 0) return '';
    const m = Math.round(h * 60); const hh = Math.floor(m / 60); const mm = m % 60;
    return hh > 0 ? `${hh} h ${mm} min` : `${mm} min`;
  }

  _update() {
    if (!this._r || !this._hass || !this._e) return;
    const $ = this._$; const e = this._e; const hs = this._hass.states;
    const configured = !!hs[e.status];
    $('warn').classList.toggle('hidden', configured);

    const powerOn = this._st(e.power_switch);
    let s = this._st(e.status) || 'unknown';
    if (powerOn === 'off') s = 'unavailable';
    // no smart plug: the integration reports `offline` (and Online = off), but the temperatures keep their last values
    else if (s === 'offline' || this._st(e.online) === 'off') s = 'offline';
    const dead = ['unavailable', 'offline'].includes(s);
    const T = bblT(this._hass); const cs = this._lang === 'cs';
    const sObj = hs[e.status];
    const label = T[s] || ((sObj && this._hass.formatEntityState) ? this._hass.formatEntityState(sObj) : s);
    const color = BBL_COLORS[s] || '#8a8a85';
    const printing = ['running', 'pause', 'prepare'].includes(s);

    $('name').textContent = e.name;
    const stageObj = hs[e.stage];
    const stage = stageObj ? stageObj.state : undefined;
    let stageTxt = null;
    if (stage && !['idle', 'unknown', 'unavailable', 'offline', 'printing'].includes(stage) && !dead) {
      stageTxt = (cs && BBL_STAGE[stage]) || (this._hass.formatEntityState ? this._hass.formatEntityState(stageObj) : stage.replace(/_/g, ' '));
      if (s === 'pause' && !cs) { stageTxt = stageTxt.replace(/^paused[\s:,-]*/i, ''); stageTxt = stageTxt.charAt(0).toLowerCase() + stageTxt.slice(1); }
    }
    let sub = label;
    if (s === 'pause') {
      if (stageTxt) sub = `${label} · ${stageTxt}`;
    } else if (stageTxt) {
      sub = stageTxt.charAt(0).toUpperCase() + stageTxt.slice(1);
    } else if (s === 'running') {
      const l = this._num(e.layer), L = this._num(e.layers);
      if (L) sub += ` · ${T.layer} ${l}/${L}`;
    }
    $('status').textContent = sub;
    $('dot').style.background = color;
    $('dot').classList.toggle('live', s === 'running');

    $('light').classList.toggle('on-light', this._st(e.light) === 'on');
    $('light').classList.toggle('hidden', !hs[e.light]);
    const pb = $('power');
    pb.classList.toggle('hidden', !hs[e.power_switch]);
    pb.classList.toggle('on-power', powerOn === 'on');

    const mc = this._mock && $('mockcam');
    if (mc) {
      const src = bblMockCam(this._cfg.mock);
      if (mc.getAttribute('src') !== src) mc.setAttribute('src', src);
      mc.classList.toggle('dark', this._st(e.light) !== 'on');
      mc.classList.toggle('off', dead);
    }
    const prev = hs[e.preview];
    const showPrev = !!(this._showPreview && prev);
    $('media').classList.toggle('hidden', !e.camera && !prev);
    $('camwrap').classList.toggle('hidden', showPrev);
    $('prevwrap').classList.toggle('hidden', !showPrev);
    $('mlabel').textContent = T.preview;
    $('mlabel').classList.toggle('hidden', !showPrev);
    const tIcon = showPrev ? 'video' : 'image';
    if (this._tIcon !== tIcon) { $('mtoggle').innerHTML = bblsvg(BBL_ICONS[tIcon]); this._tIcon = tIcon; }
    $('mtoggle').classList.toggle('hidden', !prev || !e.camera);
    if (prev) {
      const url = prev.attributes.entity_picture;
      if (url && $('previmg').getAttribute('src') !== url) $('previmg').setAttribute('src', url);
    }
    if (!e.camera && prev && !this._showPreview) { this._showPreview = true; return this._update(); }

    // errors: HMS (attributes "1-Error", "1-Wiki", …) and print error
    const errs = [];
    const esc = (x) => String(x).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    const hms = hs[e.hms];
    if (hms && hms.state === 'on') {
      const a = hms.attributes || {};
      const n = parseInt(a.Count || a.count, 10) || 0;
      for (let i = 1; i <= Math.max(n, 1); i++) {
        const msg = a[`${i}-Error`]; if (!msg) continue;
        const wiki = a[`${i}-Wiki`];
        errs.push(esc(String(msg).replace(/^HMS_[0-9A-F_]+:\s*/i, '')) + (wiki ? ` · <a href="${esc(wiki)}" target="_blank" rel="noopener">${T.more}</a>` : ''));
      }
    }
    const perr = hs[e.perr];
    if (perr && perr.state === 'on') {
      const a = perr.attributes || {};
      const msg = a.error || a.description || (a.code ? `${T.err_print} ${a.code}` : T.err_print);
      if (!errs.length || a.error) errs.push(esc(msg));
    }
    if (dead) errs.length = 0;
    const errHtml = errs.map((x) => `<div>${x}</div>`).join('');
    if (this._errHtml !== errHtml) { $('errmsgs').innerHTML = errHtml; this._errHtml = errHtml; }
    $('err').classList.toggle('hidden', !errs.length);
    if (errs.length && !BBL_COLORS[s]) $('dot').style.background = '#E24B4A';

    const chips = [];
    const noz = this._num(e.nozzle), nozT = this._num(e.nozzleT), bed = this._num(e.bed), bedT = this._num(e.bedT);
    const t = (v, tg) => v == null ? '—' : (tg ? `${Math.round(v)}°/${Math.round(tg)}°` : `${Math.round(v)} °C`);
    if (configured && !dead) {
      chips.push(`<span class="chip c-noz">${this._icon('icon_nozzle', 'nozzle', 14)}${t(noz, nozT)}</span>`);
      chips.push(`<span class="chip c-bed">${this._icon('icon_bed', 'bed', 14)}${t(bed, bedT)}</span>`);
      // enclosed printers with a chamber sensor (X1, H2D…): the integration only creates it there
      const cham = this._num(e.chamber), chamT = this._num(e.chamberT);
      if (cham != null) chips.push(`<span class="chip c-cham">${this._icon('icon_chamber', 'chamber', 14)}${t(cham, chamT)}</span>`);
    }
    const w = this._num(e.power_sensor);
    if (w != null && powerOn !== 'off') chips.push(`<span class="chip c-pow">${this._icon('icon_usage', 'bolt', 14)}${Math.round(w)} W</span>`);
    const chipHtml = chips.join('');
    if (this._chipHtml !== chipHtml) { $('chips').innerHTML = chipHtml; this._chipHtml = chipHtml; }

    $('printblock').classList.toggle('hidden', !printing);
    if (printing) {
      const prog = Math.max(0, Math.min(100, Math.round(this._num(e.progress) || 0)));
      let file = this._st(e.task);
      if (!file || ['unknown', 'unavailable'].includes(file)) file = this._st(e.gcode);
      if (!file || ['unknown', 'unavailable'].includes(file)) file = T.print;
      $('file').textContent = file;
      this.style.setProperty('--pcolor', s === 'pause' ? '#E0A030' : 'var(--bbl-prog)');
      $('pct').textContent = `${prog} %`;
      const rem = this._fmtDur(this._num(e.remaining));
      $('meta').textContent = rem ? (cs ? `${T.left} ${rem}` : `${rem} ${T.left}`) : '';
      $('fill').style.width = `${prog}%`;
      const st = this._fmtTime(this._st(e.start)), en = this._fmtTime(this._st(e.end));
      $('tstart').textContent = st ? `${T.start} ${st}` : '';
      $('tend').textContent = en ? `${T.done} ~${en}` : '';
    }
  }

  static getStubConfig(hass) {
    const ent = hass && hass.entities && Object.values(hass.entities).find((x) => x.platform === 'bambu_lab' && x.translation_key === 'print_status');
    return ent && ent.device_id ? { printer: ent.device_id } : { printer: 'MOCK', mock: 'printing' };
  }
  static getConfigElement() { return document.createElement('bambulab-card-editor'); }
}

// data source switch shared by all editors: my devices / MOCK
const bblSourceField = (T) => ({ name: '_source', required: true, selector: { select: { mode: 'list', options: [
  { value: 'device', label: T.o_src_device }, { value: 'mock', label: T.o_src_mock }] } } });
const bblSchema = (T, mock) => [
  bblSourceField(T),
  ...(mock ? [{ name: 'mock', required: true, selector: { select: { mode: 'list', options: [
    { value: 'printing', label: T.running }, { value: 'pause', label: T.pause }, { value: 'prepare', label: T.prepare },
    { value: 'finish', label: T.finish }, { value: 'idle', label: T.idle }, { value: 'error', label: T.o_m_error }] } } }]
    : [{ name: 'printer', required: true, selector: { device: { filter: { integration: 'bambu_lab' } } } },
      { name: 'power_switch', selector: { entity: { domain: ['switch', 'input_boolean', 'light'] } } }]),
  ...BBL_SCHEMA_REST,
];
const BBL_SCHEMA_REST = [
  { name: 'camera', selector: { entity: { domain: 'camera' } } },
  { name: 'name', selector: { text: {} } },
  { name: 'icons', type: 'expandable', flatten: true, icon: 'mdi:emoticon-outline', schema: [
    { type: 'grid', name: '', flatten: true, schema: [
      { name: 'icon_light', selector: { icon: { placeholder: 'mdi:lightbulb' } } },
      { name: 'icon_power', selector: { icon: { placeholder: 'mdi:power' } } },
      { name: 'icon_nozzle', selector: { icon: { placeholder: 'mdi:printer-3d-nozzle' } } },
      { name: 'icon_bed', selector: { icon: { placeholder: 'mdi:radiator' } } },
      { name: 'icon_chamber', selector: { icon: { placeholder: 'mdi:thermometer' } } },
      { name: 'icon_usage', selector: { icon: { placeholder: 'mdi:flash' } } },
    ] },
  ] },
  { name: 'colors', type: 'expandable', flatten: true, icon: 'mdi:palette-outline', schema: [
    { type: 'grid', name: '', flatten: true, schema: [
      { name: 'color_light', selector: { ui_color: {} } },
      { name: 'color_power', selector: { ui_color: {} } },
      { name: 'color_nozzle', selector: { ui_color: {} } },
      { name: 'color_bed', selector: { ui_color: {} } },
      { name: 'color_chamber', selector: { ui_color: {} } },
      { name: 'color_progress', selector: { ui_color: {} } },
    ] },
  ] },
];

class BambuLabCardEditor extends HTMLElement {
  setConfig(config) { this._config = config || {}; this._render(); }
  set hass(hass) { this._hass = hass; if (this._form) this._form.hass = hass; else this._render(); }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => { const L = bblT(this._hass); return s.name === 'mock' ? L.e_mock_printer : s.name === '_source' ? L.e_source : L[`e_${s.name}`] || s.name; };
      this._form.computeHelper = (s) => { const L = bblT(this._hass); return s.name === '_source' ? L.h_source : L[`h_${s.name}`] || ''; };
      this._form.addEventListener('value-changed', (ev) => {
        const cfg = { ...ev.detail.value };
        const src = cfg._source; delete cfg._source;
        if (src === 'mock') { cfg.printer = 'MOCK'; if (!BBL_MOCK_PRINTER[cfg.mock]) cfg.mock = 'printing'; delete cfg.power_switch; }
        else { if (bblIsMock(cfg.printer)) delete cfg.printer; delete cfg.mock; }
        Object.keys(cfg).forEach((k) => { if (cfg[k] === '' || cfg[k] === undefined || cfg[k] === null) delete cfg[k]; });
        this._config = { ...cfg, type: this._config.type };
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const mock = bblIsMock(this._config.printer);
    const sig = `${bblLang(this._hass)}|${mock}`;
    if (this._sig !== sig) { this._form.schema = bblSchema(bblT(this._hass), mock); this._sig = sig; }
    this._form.hass = this._hass;
    this._form.data = { ...this._config, _source: mock ? 'mock' : 'device', ...(mock ? { mock: this._config.mock || 'printing' } : {}) };
  }
}

if (!customElements.get('bambulab-card')) customElements.define('bambulab-card', BambuLabCard);
if (!customElements.get('bambulab-card-editor')) customElements.define('bambulab-card-editor', BambuLabCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.find((c) => c.type === 'bambulab-card')) {
  const T = bblPickerT();
  window.customCards.push({ type: 'bambulab-card', name: 'CzechTropi · Bambu Lab Printer', description: T.desc, preview: true, documentationURL: 'https://github.com/CzechTropi/bambulab-card' });
}

// ============================================================================================
// Filament cards: AMS (bambulab-ams-card), external spool (bambulab-spool-card)
// and AMS + external spool together (bambulab-filament-card)
// ============================================================================================

Object.assign(BBL_I18N.cs, {
  f_drybox: 'Sušicí box', f_empty: 'Prázdné', f_external: 'Externí', f_humidity: 'Vlhkost', f_temp: 'Teplota', f_active: 'Aktivní',
  f_warn_ams: 'Vyber v editoru karty AMS (zařízení z integrace Bambu Lab).',
  f_warn_spool: 'Vyber v editoru karty špulku (externí nebo slot AMS).',
  f_warn_printer: 'Vyber v editoru karty tiskárnu (zařízení z integrace Bambu Lab).',
  f_warn_filament: 'Vyber v editoru karty AMS nebo externí špulku.',
  f_desc_ams: 'Jedno nebo více AMS: barva, název a typ filamentu, vlhkost, sušení. Špulky nebo kolečka, i kompaktně',
  f_desc_spool: 'Jedna špulka – externí nebo slot AMS, ve stejném vzhledu jako karta AMS nebo jako úzký řádek',
  f_desc_filament: 'Jedno nebo více AMS, volitelně s externí špulkou',
  e_ams: 'AMS', e_spool: 'Špulka', e_tray: 'Slot', e_entity: 'Vlastní senzor špulky', e_title: 'Nadpis',
  e_display: 'Zobrazení', e_slots: 'Vlastní názvy a senzory zbývajícího filamentu',
  e_show_info: 'Zobrazit informační lištu', e_show_name: 'Zobrazit názvy filamentů', e_show_type: 'Zobrazit typy filamentů',
  e_show_remaining: 'Zobrazit zbývající filament', e_highlight_active: 'Zvýraznit aktivní špulku', e_style: 'Styl karty',
  e_show_external: 'Zobrazit externí špulku', e_external_position: 'Pozice externí špulky', e_show_labels: 'Zobrazit popisky skupin',
  e_color_active: 'Barva aktivní špulky', f_name: 'Vlastní název', e_remaining: 'Vlastní senzor zbývajícího filamentu',
  e_slot_name: 'Vlastní název (slot {n})', e_slot_remaining: 'Vlastní senzor zbývajícího filamentu (slot {n})',
  h_entity: 'Volitelné, místo špulky. Senzor slotu z integrace Bambu Lab', h_title: 'Prázdné = bez nadpisu',
  hf_name: 'Prázdné = název filamentu z tiskárny',
  h_spool: 'Externí špulka nebo AMS', h_tray: 'Který slot AMS zobrazit',
  h_ams_list: 'Jednotky AMS. Zobrazí se v pořadí, v jakém je přidáš',
  e_external: 'Externí špulka', h_external: 'Volitelné. Prázdné = karta ukáže jen AMS',
  h_show_remaining: 'Automaticky = jen u špulek Bambu s RFID, kde tiskárna stav opravdu zná',
  h_remaining: 'Např. input_number s % nebo gramy',
  o_auto: 'Automaticky (jen Bambu RFID)', o_always: 'Vždy, když ho tiskárna hlásí', o_never: 'Nikdy',
  o_spool: 'Špulka',
  o_left: 'Vlevo', o_right: 'Vpravo', o_top: 'Nahoře', o_bottom: 'Dole',
  o_ext_always: 'Vždy', o_ext_active: 'Jen když se z ní tiskne',
  o_xs_slim: 'Slim', o_xs_normal: 'Normální',
  e_show_when: 'Kdy zobrazit', e_spool_style: 'Vzhled',
  e_custom_humidity: 'Vlastní senzor vlhkosti', e_custom_temperature: 'Vlastní senzor teploty',
  e_external_style: 'Styl externí špulky', h_show_external: 'Jen když se z ní tiskne = jinak se karta skryje',
  o_rings: 'Kolečka', e_size: 'Velikost', o_sz_compact: 'Kompaktní', o_sz_normal: 'Normální',
});
Object.assign(BBL_I18N.en, {
  f_drybox: 'Dry box', f_empty: 'Empty', f_external: 'External', f_humidity: 'Humidity', f_temp: 'Temperature', f_active: 'Active',
  f_warn_ams: 'Pick an AMS (a Bambu Lab device) in the card editor.',
  f_warn_spool: 'Pick a spool (external or an AMS tray) in the card editor.',
  f_warn_printer: 'Pick a printer (a Bambu Lab device) in the card editor.',
  f_warn_filament: 'Pick an AMS or the external spool in the card editor.',
  f_desc_ams: 'One or more AMS: color, name and type of the filament, humidity, drying. Spools or rings, also compact',
  f_desc_spool: 'One spool – the external spool or an AMS tray, in the AMS card\'s look or as one slim line',
  f_desc_filament: 'One or more AMS, optionally with the external spool',
  e_ams: 'AMS', e_spool: 'Spool', e_tray: 'Tray', e_entity: 'Custom spool sensor', e_title: 'Title',
  e_display: 'Display', e_slots: 'Custom names and remaining sensors',
  e_show_info: 'Show Info Bar', e_show_name: 'Show Filament Names', e_show_type: 'Show Filament Types',
  e_show_remaining: 'Show Remaining Filament', e_highlight_active: 'Highlight Active Spool', e_style: 'Card Style',
  e_show_external: 'Show External Spool', e_external_position: 'External Spool Position', e_show_labels: 'Show Group Labels',
  e_color_active: 'Active Spool Color', f_name: 'Custom Name', e_remaining: 'Custom Remaining Sensor',
  e_slot_name: 'Custom Name (Tray {n})', e_slot_remaining: 'Custom Remaining Sensor (Tray {n})',
  h_entity: 'Optional, instead of a spool. A tray sensor from the Bambu Lab integration', h_title: 'Empty = no title',
  hf_name: 'Empty = filament name from the printer',
  h_spool: 'External spool or an AMS', h_tray: 'Which AMS tray to show',
  h_ams_list: 'AMS units. They are shown in the order you add them',
  e_external: 'External Spool', h_external: 'Optional. Empty = the card shows the AMS only',
  h_show_remaining: 'Automatic = only Bambu spools with RFID, where the printer really knows it',
  h_remaining: 'E.g. an input_number in % or grams',
  o_auto: 'Automatic (Bambu RFID only)', o_always: 'Whenever the printer reports it', o_never: 'Never',
  o_spool: 'Spool',
  o_left: 'Left', o_right: 'Right', o_top: 'Top', o_bottom: 'Bottom',
  o_ext_always: 'Always', o_ext_active: 'Only while in use',
  o_xs_slim: 'Slim', o_xs_normal: 'Normal',
  e_show_when: 'When to Show', e_spool_style: 'Appearance',
  e_custom_humidity: 'Custom Humidity Sensor', e_custom_temperature: 'Custom Temperature Sensor',
  e_external_style: 'External Spool Style', h_show_external: 'Only while in use = otherwise the card is hidden',
  o_rings: 'Rings', e_size: 'Size', o_sz_compact: 'Compact', o_sz_normal: 'Normal',
});

const BBF_AMS_MODELS = ['AMS', 'AMS Lite', 'AMS 2 Pro', 'AMS HT', 'AMS 3H'];
const BBF_ICONS = {
  heat: 'M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2Z',
  water: 'M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z',
  temp: 'M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z',
};

const bbfEsc = (x) => String(x == null ? '' : x).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const bbfHex = (c) => {
  if (!c || typeof c !== 'string') return null;
  const m = c.match(/^#?([0-9a-f]{6})([0-9a-f]{2})?$/i);
  return m ? `#${m[1]}` : c;
};
const bbfIsZero = (v) => !v || /^0+$/.test(String(v));

// Entities of a device by translation_key (sensor domain), sorted by the "slot" attribute
function bbfEntities(hass, deviceId, key) {
  if (!hass || !hass.entities || !deviceId) return [];
  return Object.values(hass.entities)
    .filter((e) => e.device_id === deviceId && e.translation_key === key && e.entity_id.startsWith('sensor.'))
    .map((e) => e.entity_id)
    .sort((a, b) => {
      const sa = hass.states[a] && hass.states[a].attributes.slot;
      const sb = hass.states[b] && hass.states[b].attributes.slot;
      if (sa != null && sb != null && sa !== sb) return sa - sb;
      return a.localeCompare(b, undefined, { numeric: true });
    });
}
const bbfEntity = (hass, deviceId, key) => bbfEntities(hass, deviceId, key)[0];
// Tray sensor of an AMS by its number (1-based, the "slot" attribute; falls back to the position)
function bbfTray(hass, amsId, no) {
  const trays = bbfEntities(hass, amsId, 'tray');
  const n = parseInt(no, 10) || 1;
  return trays.find((id) => hass.states[id] && Number(hass.states[id].attributes.slot) === n) || trays[n - 1];
}
const bbfIsAms3h = (hass, id) => { const d = hass && hass.devices && hass.devices[id]; return !!d && d.model === 'AMS 3H'; };
const bbfTrayCount = (hass, id) => Math.max(bbfEntities(hass, id, 'tray').length, bbfIsAms3h(hass, id) ? 9 : 4);
const bbfDeviceName = (hass, id) => {
  const d = hass && hass.devices && hass.devices[id];
  return d ? (d.name_by_user || d.name || '') : '';
};
// AMS units and external spools attached to a printer (via_device_id)
function bbfChildren(hass, printerId) {
  const out = { ams: [], ext: [] };
  if (!hass || !hass.devices || !printerId) return out;
  Object.values(hass.devices)
    .filter((d) => d.via_device_id === printerId)
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { numeric: true }))
    .forEach((d) => {
      if (bbfEntities(hass, d.id, 'tray').length) out.ams.push(d.id);
      else if (bbfEntities(hass, d.id, 'external_spool').length) out.ext.push(d.id);
    });
  return out;
}

// What the filament card shows: { ams: [AMS device ids in order], ext: [external spool device ids] }.
// New configs list the AMS units and the external spool; old ones only had `printer`.
function bbfSources(hass, c) {
  let ams = Array.isArray(c.ams) ? c.ams.filter(Boolean) : (c.ams ? [c.ams] : []);
  let ext = c.external ? [].concat(c.external) : [];
  if (c.printer) {
    // someone may have picked the AMS or the external spool itself as the "printer"
    if (bbfEntities(hass, c.printer, 'tray').length) { if (!ams.length) ams = [c.printer]; }
    else if (bbfEntities(hass, c.printer, 'external_spool').length) { if (!ext.length) ext = [c.printer]; }
  }
  if (c.printer && !ams.includes(c.printer) && !ext.includes(c.printer)) {
    const ch = bbfChildren(hass, c.printer);
    if (!ams.length) ams = ch.ams;
    if (!c.external) ext = ch.ext;
  }
  if (c.show_external === false || c.show_external === 'never') ext = [];
  return { ams, ext };
}
// Drying zones of an AMS 3H (zone_humidity / zone_temperature / remaining_drying_time with `zone` and `slots`
// attributes) – the same way the integration's own cards find them. Empty for every other AMS.
function bbfAmsZones(hass, amsId) {
  if (!hass || !hass.entities || !amsId) return [];
  const keys = { zone_humidity: 'humidity', zone_temperature: 'temperature', remaining_drying_time: 'drying' };
  const zones = new Map();
  let drying = null;
  Object.values(hass.entities).forEach((e) => {
    if (e.device_id !== amsId || !keys[e.translation_key]) return;
    const a = (hass.states[e.entity_id] || {}).attributes || {};
    let z = parseInt(a.zone, 10);
    if (!(z > 0) && Number.isInteger(Number(a.zone_id))) z = Number(a.zone_id) + 1;
    if (!(z > 0)) { if (keys[e.translation_key] === 'drying') drying = e.entity_id; return; }
    const cur = zones.get(z) || { zone: z, slots: [] };
    if (!cur.slots.length && Array.isArray(a.slots)) cur.slots = a.slots.map(Number).filter(Number.isInteger);
    cur[keys[e.translation_key]] = e.entity_id;
    zones.set(z, cur);
  });
  const list = [...zones.values()].sort((x, y) => x.zone - y.zone);
  if (list.length >= 2) {
    const dry = [...list].sort((x, y) => x.slots.length - y.slots.length)[0];
    dry.dryBox = true;
    if (drying && !dry.drying) dry.drying = drying;
  }
  return list;
}
// "2 h 15 min" from a duration sensor (minutes by default, or with its unit)
function bbfDuration(st) {
  if (!st) return '';
  let v = parseFloat(st.state);
  if (isNaN(v) || v <= 0) return '';
  const u = (st.attributes && st.attributes.unit_of_measurement) || 'min';
  if (u === 'h') v *= 60; else if (u === 's') v /= 60;
  const h = Math.floor(v / 60), m = Math.round(v % 60);
  return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
}

// ---- MOCK AMS units and spools (config `ams: MOCK` + `mock: [ams_3h, ...]`, `spool: MOCK` + `mock: external_active`)
const BBF_MOCK_TRAYS = [
  ['Bambu PLA Basic', 'PLA', ['#F2F0EA'], 64], ['Bambu PLA Matte', 'PLA', ['#6AA84F'], 45], ['Bambu PETG HF', 'PETG', ['#1E50C8'], 88],
  ['eSUN PLA+', 'PLA', ['#F2C230']], ['Generic ASA', 'ASA', ['#4A5058']], ['Polymaker PolyTerra PLA', 'PLA', ['#D2486A']],
  ['Bambu PLA Silk Multi-Color', 'PLA', ['#C8A040', '#D8D8D8', '#B87333'], 31], ['Bambu PA6-CF', 'PA6-CF', ['#2B2B2B'], 52], ['Bambu PAHT-CF', 'PAHT-CF', ['#3A3A3A']],
];
const BBF_MOCK = {
  ams_3h: { name: 'AMS 3H', model: 'AMS 3H', trays: [0, 1, 2, 3, 4, 5, 6, 7, 8], active: 2,
    zones: [{ slots: [1, 2, 3, 4, 5, 6, 7], humidity: 21, temperature: 26 }, { slots: [8, 9], humidity: 9, temperature: 65, drying: 135 }] },
  ams_2_pro: { name: 'AMS 2 Pro', model: 'AMS 2 Pro', trays: [2, 1, 5, -1], humidity: 12, temperature: 55, drying: 95 },
  ams_ht: { name: 'AMS HT', model: 'AMS HT', trays: [7], humidity: 8, temperature: 70, drying: 240 },
  ams: { name: 'AMS', model: 'AMS', trays: [0, 3, 4, 6], humidity_index: 2, temperature: 25 },
  ams_lite: { name: 'AMS Lite', model: 'AMS Lite', trays: [0, 1, 3, 6] },
};
const bbfMockList = (v) => [].concat(v === true || v == null ? ['ams_3h', 'ams_2_pro'] : v).filter((k) => BBF_MOCK[k]);
const bbfIsMockEntity = (id) => /^[a-z_]+\.bbf_mock_/.test(String(id || ''));
const BBF_MOCK_SPOOL = { external: 'TPU', external_active: 'TPU', ams_tray: 'tray' };
// a copy of hass whose states / entities / devices hold only the mock AMS units / external spool
function bbfMockHass(hass, keys, ext) {
  const states = {}, entities = {}, devices = {};
  devices.bbf_mock_printer = { id: 'bbf_mock_printer', name: 'MOCK', model: 'X1C', manufacturer: 'Bambu Lab' };
  const add = (dev, key, id, state, attributes) => {
    entities[id] = { entity_id: id, device_id: dev, translation_key: key, platform: 'bambu_lab' };
    states[id] = { entity_id: id, state: String(state), attributes };
  };
  keys.forEach((k) => {
    const d = BBF_MOCK[k]; const dev = `bbf_mock_${k}`; const p = `sensor.bbf_mock_${k}`;
    devices[dev] = { id: dev, name: `MOCK_${d.name.replace(/ /g, '_')}`, model: d.model, manufacturer: 'Bambu Lab', via_device_id: 'bbf_mock_printer' };
    d.trays.forEach((ti, i) => {
      const t = BBF_MOCK_TRAYS[ti];
      const cols = t ? t[2].map((c) => `${c}FF`) : ['#00000000'];
      add(dev, 'tray', `${p}_tray_${i + 1}`, t ? t[0] : 'Empty', { slot: i + 1, name: t ? t[0] : '', type: t ? t[1] : '', color: cols[0], cols,
        empty: !t, remain: t && t[3] != null ? t[3] : -1, remain_enabled: true, tag_uid: t && t[3] != null ? 'B0CA0001' : '0000000000000000',
        tray_uuid: '0', active: d.active != null ? i === d.active : i === 0 && k === 'ams_2_pro' });
    });
    if (d.humidity != null) add(dev, 'humidity', `${p}_humidity`, d.humidity, { unit_of_measurement: '%' });
    if (d.humidity_index != null) add(dev, 'humidity_index', `${p}_humidity_index`, d.humidity_index, {});
    if (d.temperature != null) add(dev, 'ams_temp', `${p}_temperature`, d.temperature, { unit_of_measurement: '°C' });
    if (d.drying) add(dev, 'remaining_drying_time', `${p}_drying`, d.drying, { unit_of_measurement: 'min' });
    (d.zones || []).forEach((z, i) => {
      const a = { zone: i + 1, slots: z.slots };
      add(dev, 'zone_humidity', `${p}_zone${i + 1}_humidity`, z.humidity, { ...a, unit_of_measurement: '%' });
      add(dev, 'zone_temperature', `${p}_zone${i + 1}_temperature`, z.temperature, { ...a, unit_of_measurement: '°C' });
      if (z.drying) add(dev, 'remaining_drying_time', `${p}_zone${i + 1}_drying`, z.drying, { ...a, unit_of_measurement: 'min' });
    });
  });
  if (ext) {
    devices.bbf_mock_ext = { id: 'bbf_mock_ext', name: 'MOCK_External_Spool', model: 'External Spool', manufacturer: 'Bambu Lab', via_device_id: 'bbf_mock_printer' };
    add('bbf_mock_ext', 'external_spool', 'sensor.bbf_mock_external_spool', 'Bambu TPU 95A HF', { slot: 0, name: 'Bambu TPU 95A HF', type: 'TPU',
      color: '#2E3E52FF', cols: ['#2E3E52FF'], empty: false, remain: -1, remain_enabled: true, tag_uid: '0000000000000000', tray_uuid: '0', active: ext === 'external_active' });
  }
  return Object.assign(Object.create(hass), { states, entities, devices });
}

// "A1_AMS" -> "AMS", "P1S_AMS_2" -> "AMS 2": the AMS name without the printer name in front
function bbfAmsLabel(hass, id) {
  const dev = hass && hass.devices && hass.devices[id];
  const pName = dev && dev.via_device_id ? bbfDeviceName(hass, dev.via_device_id) : '';
  let n = bbfDeviceName(hass, id);
  if (pName && n.startsWith(`${pName}_`)) n = n.slice(pName.length + 1);
  return n.replace(/_/g, ' ') || 'AMS';
}
// Old config (printer) -> new one (ams + external), for the visual editor
function bbfMigrate(hass, cfg) {
  if (!cfg.printer || !hass || !hass.devices) return null;
  const src = bbfSources(hass, cfg);
  const out = { ...cfg, ams: src.ams };
  delete out.printer;
  if (src.ext.length) out.external = src.ext[0]; else delete out.external;
  if (out.show_external === true || out.show_external === false || out.show_external === 'never') delete out.show_external;
  if (!out.ams.length) delete out.ams;
  return out;
}

// Turn a tray / external spool sensor into what a slot shows
function bbfSlot(hass, entityId, cfg, ovr) {
  const s = hass.states[entityId];
  if (!s) return null;
  ovr = ovr || {};
  const a = s.attributes || {};
  const off = ['unavailable', 'unknown'].includes(s.state) && !a.name;
  const empty = !off && (a.empty === true || (!a.name && !a.type));
  const cols = Array.isArray(a.cols) ? a.cols.map(bbfHex).filter(Boolean) : [];
  const color = bbfHex(ovr.color) || bbfHex(a.color) || '#8a8a8a';
  const slot = {
    entity: entityId,
    name: ovr.name || a.name || (off || empty ? '' : s.state),
    type: a.type || '',
    colors: cols.length > 1 ? cols : [color],
    empty, off,
    active: a.active === true,
    remText: '', level: null,
  };
  const mode = cfg.show_remaining || 'auto';
  if (mode !== 'never' && !empty && !off) {
    const re = ovr.remaining && hass.states[ovr.remaining];
    if (re) {
      const v = parseFloat(re.state);
      if (!isNaN(v)) {
        const unit = re.attributes.unit_of_measurement || '';
        slot.remText = `${Math.round(v)}${unit ? (unit === '%' ? ' %' : ` ${unit}`) : ''}`;
        const max = parseFloat(ovr.max) || (unit === 'kg' ? 1 : unit === 'g' ? 1000 : 100);
        slot.level = Math.max(0, Math.min(1, v / max));
      }
    } else {
      const known = a.remain_enabled === true && typeof a.remain === 'number' && a.remain >= 0;
      const rfid = !bbfIsZero(a.tag_uid) || !bbfIsZero(a.tray_uuid);
      if (known && (mode === 'always' || rfid)) {
        slot.remText = `${Math.round(a.remain)} %`;
        slot.level = Math.max(0, Math.min(1, a.remain / 100));
      }
    }
  }
  return slot;
}

const BBF_STYLE = `
  :host { display: block; height: 100%; }
  ha-card { padding: 12px; overflow: hidden; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
  #body { flex: 1; }
  .warn { font-size: 13px; color: var(--secondary-text-color); }
  .hdr { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; min-height: 28px; }
  .hdr.notitle { justify-content: flex-end; }
  .ttl { font-size: 15px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chips { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .chip { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 2px 9px; border-radius: 999px; white-space: nowrap;
          background: rgba(128,128,128,.12); border: 1px solid rgba(128,128,128,.28); color: var(--secondary-text-color); cursor: pointer; line-height: 1.5; }
  .chip svg { flex-shrink: 0; }
  ha-card { container-type: inline-size; }
  .vlayout { display: flex; flex-direction: column; gap: 8px; }
  .extbar { display: flex; flex-wrap: wrap; gap: 6px; width: 100%; }
  /* slim: one line – small spool, label + name, type, remaining */
  .xb { all: unset; box-sizing: border-box; cursor: pointer; display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1 1 auto;
        padding: 7px 12px 7px 8px; border-radius: 10px; background: rgba(128,128,128,.07); border: 1px solid rgba(128,128,128,.18);
        transition: border-color .25s, box-shadow .25s; }
  .xb.active { border-color: var(--bbf-active); box-shadow: 0 0 8px color-mix(in srgb, var(--bbf-active) 45%, transparent); }
  .xsp { display: flex; flex: none; width: 34px; height: 28px; border-radius: 5px; overflow: hidden; background: #2a2a2a;
         box-shadow: 0 0 0 1px rgba(128,128,128,.45); }
  .xsp .xf { width: 5px; flex: none; background: linear-gradient(90deg, #9a9a9a, #6e6e6e); }
  .xsp .xw { flex: 1; position: relative; background: var(--fil); }
  .xsp .xw::after { content: ''; position: absolute; inset: 0;
         background: repeating-linear-gradient(0deg, rgba(0,0,0,.26) 0 1px, transparent 1px 3px),
                     linear-gradient(0deg, rgba(0,0,0,.35), rgba(255,255,255,.14) 45%, rgba(0,0,0,.35)); }
  .xb.empty .xsp .xw { background: transparent; }
  .xb.empty .xsp .xw::after { display: none; }
  .xtx { display: flex; flex-direction: column; min-width: 0; flex: 1; line-height: 1.25; }
  .xl { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
  .xact { color: var(--bbf-active); font-weight: 500; }
  .xn { font-size: 13px; font-weight: 500; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .xb.empty .xn { color: var(--secondary-text-color); font-weight: 400; }
  .xtag { flex: none; font-size: 11px; line-height: 1.5; padding: 0 8px; border-radius: 999px; color: var(--secondary-text-color);
          border: 1px solid rgba(128,128,128,.35); white-space: nowrap; }
  .xrem { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; font-size: 11px; color: var(--primary-text-color); }
  .xbar { width: 44px; height: 4px; border-radius: 2px; background: rgba(128,128,128,.3); overflow: hidden; }
  .xbar i { display: block; height: 100%; background: var(--fil); }
  .xt { color: var(--secondary-text-color); font-size: 11px; white-space: nowrap; }

  .grp { min-width: 0; box-sizing: border-box; background: rgba(128,128,128,.07); border: 1px solid rgba(128,128,128,.18); border-radius: 12px; padding: 8px; }
  .ghead { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 6px; margin: 0 2px 8px; min-height: 22px; }
  .glabel { flex: 0 1 auto; max-width: 100%; font-size: 12px; font-weight: 500; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ghead .chips { margin-left: auto; }
  .ghead .chip { font-size: 11px; padding: 1px 7px; }
  .chip.drying { color: #E8913A; border-color: color-mix(in srgb, #E8913A 55%, transparent); background: color-mix(in srgb, #E8913A 12%, transparent); }
  .slots { display: grid; gap: 8px; align-items: stretch; }
  .slot { all: unset; box-sizing: border-box; display: flex; flex-direction: column; gap: 6px; min-width: 0; cursor: pointer;
          -webkit-tap-highlight-color: transparent; border-radius: 10px;
          width: 100%; max-width: 150px; justify-self: center; }
  .slot:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  /* spool drawing */
  .spool { position: relative; aspect-ratio: 5 / 4; border-radius: 9px; overflow: hidden; display: flex; flex-direction: column;
           background: #2a2a2a; border: 2px solid #6b6b6b; box-sizing: border-box; transition: border-color .25s, box-shadow .25s; }
  .fl { height: 15%; flex-shrink: 0; background: linear-gradient(#9a9a9a, #6e6e6e); }
  .fl.b { background: linear-gradient(#6e6e6e, #8e8e8e); }
  .core { flex: 1; display: flex; justify-content: center; align-items: stretch;
          background: linear-gradient(90deg, #1f1f1f, #353535 50%, #1f1f1f); }
  .wind { width: var(--w, 86%); background: var(--fil); position: relative; transition: width .6s ease; }
  .wind::after { content: ''; position: absolute; inset: 0;
          background: repeating-linear-gradient(90deg, rgba(0,0,0,.26) 0 1px, transparent 1px 4px),
                      linear-gradient(90deg, rgba(0,0,0,.35), rgba(255,255,255,.14) 45%, rgba(255,255,255,.04) 60%, rgba(0,0,0,.35)); }
  .slot.empty .wind, .slot.off .wind { display: none; }
  .slot.off .spool { opacity: .45; }
  .val { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 1; font-size: 12px; font-weight: 500; color: #fff;
         background: rgba(0,0,0,.5); padding: 2px 6px; border-radius: 6px; white-space: nowrap; backdrop-filter: blur(3px); }
  .slot.empty .val, .slot.off .val { background: none; color: #9a9a9a; }
  /* label under the spool */
  .lbl { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 2px; text-align: center; padding: 5px 4px; border-radius: 8px;
         background: rgba(128,128,128,.14); border: 1px solid transparent; transition: border-color .25s; min-height: 32px; box-sizing: border-box; }
  .nm { font-size: 11px; line-height: 1.25; color: var(--primary-text-color); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: break-word; hyphens: auto; }
  .ty { font-size: 10px; line-height: 1.2; color: var(--secondary-text-color); letter-spacing: .3px; }
  .slot.empty .nm, .slot.off .nm { color: var(--secondary-text-color); }
  /* active spool */
  .slot.active .spool { border-color: var(--bbf-active); box-shadow: 0 0 10px color-mix(in srgb, var(--bbf-active) 55%, transparent); }
  .slot.active .lbl { border-color: color-mix(in srgb, var(--bbf-active) 70%, transparent); }

  /* drying: orange frame (AMS 2 Pro / HT, the AMS 3H dry box) */
  .grp.drying, .ndry.on { border: 1px solid color-mix(in srgb, #E8913A 60%, transparent); background: color-mix(in srgb, #E8913A 5%, transparent); }
  /* ---- AMS grid: one equal column per AMS, four spools in a row ---- */
  .nwrap { display: grid; gap: 8px; align-items: start; grid-template-columns: repeat(auto-fit, minmax(min(var(--minb, 400px), 100%), 1fr)); }
  .nb { min-width: 0; display: flex; flex-direction: column; }
  .ng { display: grid; gap: 8px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .ndry { margin-top: 8px; padding: 8px; border-radius: 10px; border: 1px dashed rgba(128,128,128,.35); }
  .ndry .ghead { margin-bottom: 6px; }
  /* rings (and the bare drawn spool of a one-spool unit) */
  .ni { all: unset; box-sizing: border-box; cursor: pointer; min-width: 0; -webkit-tap-highlight-color: transparent; border-radius: 10px; --n-rem: #d6d6d6;
        display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 4px 0; }
  .ni:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 1px; }
  .ni.low { --n-rem: #F0A050; }
  .ni.off { opacity: .45; }
  .rr { width: 56px; height: 56px; border-radius: 50%; padding: 3px; box-sizing: border-box; flex: none; transition: box-shadow .25s; }
  .rf { width: 100%; height: 100%; border-radius: 50%; border: 2px solid var(--card-background-color, #1c1c1c); box-sizing: border-box; background: var(--fil);
        display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); }
  .rh { width: 19px; height: 19px; border-radius: 50%; background: var(--card-background-color, #1c1c1c); font-size: 11px; font-weight: 600; color: var(--primary-text-color);
        display: flex; align-items: center; justify-content: center; }
  .rh:empty { width: 13px; height: 13px; }
  .ni.empty .rf { background: transparent; border: 2px dashed rgba(128,128,128,.5); box-shadow: none; }
  .ni.active .rr, .n-spool.active .spool { box-shadow: 0 0 0 2px var(--bbf-active), 0 0 10px color-mix(in srgb, var(--bbf-active) 70%, transparent); }
  .n-spool .spool { width: 100%; }
  .n-spool.active .spool { border-color: var(--bbf-active); }
  .n-spool.empty .wind, .n-spool.off .wind { display: none; }
  .rt { font-size: 10px; color: var(--secondary-text-color); letter-spacing: .3px; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; text-align: center; }
  .rn { font-size: 11px; line-height: 1.25; color: var(--primary-text-color); text-align: center; max-width: 100%; overflow: hidden;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: break-word; }
  .ni.empty .rn { color: var(--secondary-text-color); }
  .ni.active .rt { color: var(--bbf-active); }
  .dt { flex: none; font-size: 10px; line-height: 1.5; padding: 0 6px; border-radius: 999px; white-space: nowrap; border: 1px solid color-mix(in srgb, var(--bbf-active) 60%, transparent); color: var(--bbf-active); }
  /* one-spool unit (AMS HT, external spool): the spool and its info side by side; a drawn spool is as wide as one in a 4-tray AMS */
  .nhtb { flex: 1; display: flex; align-items: center; gap: 12px; }
  .nhtb > .ni { flex: none; padding: 0; }
  .htpic { flex: 0 0 calc((100% - 24px) / 4); min-width: 0; display: grid; }
  .htpic .ni { width: 100%; padding: 0; }
  .nhtt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
  .hrow { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .hn { min-width: 0; font-size: 13px; font-weight: 500; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hs { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
  .nhtt .chips { justify-content: flex-start; margin-top: 3px; }
  .nhtt .chip, .nb .ghead .chip { font-size: 11px; padding: 1px 7px; }
  /* compact AMS: tiles, four in a row */
  .cg { display: grid; gap: 6px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .cg.one { grid-template-columns: minmax(0, 1fr); }
  .ct { all: unset; box-sizing: border-box; cursor: pointer; -webkit-tap-highlight-color: transparent; display: flex; align-items: center; gap: 7px; min-width: 0;
        padding: 6px 7px 6px 6px; border-radius: 8px; background: rgba(128,128,128,.10); border: 1px solid transparent; --n-rem: #d6d6d6; transition: border-color .25s; }
  .ct:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 1px; }
  .ct.active { border-color: color-mix(in srgb, var(--bbf-active) 70%, transparent); box-shadow: 0 0 6px color-mix(in srgb, var(--bbf-active) 35%, transparent); }
  .ct.low { --n-rem: #F0A050; }
  .ct.off { opacity: .45; }
  .ct .xsp { width: 22px; height: 30px; flex: none; }
  .ct .xring .rr { width: 32px; height: 32px; }
  .ct .xsp .xf { width: 4px; }
  .ct.empty .xsp .xw::after { display: none; }
  .ctx { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; line-height: 1.2; }
  .ctn { font-size: 11px; color: var(--primary-text-color); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere; }
  .ct.empty .ctn { color: var(--secondary-text-color); }
  .cts { font-size: 10px; color: var(--secondary-text-color); letter-spacing: .2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ct.active .cts { color: var(--bbf-active); }
  .ct.low .cts { color: #F0A050; }
  .ct .xring .rh { display: flex; width: 13px; height: 13px; font-size: 8px; }
  .csingle { padding: 0; cursor: pointer; }
  .csingle .xsp { width: 34px; height: 40px; }
  .csingle.active .xsp { box-shadow: 0 0 0 2px var(--bbf-active), 0 0 10px color-mix(in srgb, var(--bbf-active) 70%, transparent); }
  .csingle .xring .rr { width: 40px; height: 40px; }
  /* slim line with a ring */
  .xring { flex: none; display: flex; }
  .xring .rr { width: 30px; height: 30px; padding: 2px; }
  .xring .rf { border-width: 1px; }
  .xring .rh { display: none; }
  .xb { --n-rem: #d6d6d6; }
  /* phones / narrow columns */
  @container (max-width: 440px) {
    .slots, .ng { gap: 5px; }
    .grp { padding: 6px; border-radius: 10px; }
    .ghead { margin: 0 1px 6px; }
    .ghead .chip, .nhtt .chip, .nb .ghead .chip { font-size: 10px; padding: 0 5px; gap: 2px; }
    .lbl { padding: 4px 2px; min-height: 28px; }
    .nm { font-size: 10px; }
    .ty { font-size: 9px; }
    .val { font-size: 10px; padding: 1px 4px; }
    .spool { border-radius: 7px; }
    .rr { width: 48px; height: 48px; }
    .ct { flex-direction: column; align-items: stretch; gap: 4px; padding: 5px; text-align: center; }
    .ct .xsp { width: 100%; height: 18px; }
    .ct .xring { justify-content: center; }
    .ctn { font-size: 10px; }
    .cg.one .ct { flex-direction: row; align-items: center; text-align: left; gap: 7px; padding: 6px 7px 6px 6px; }
    .cg.one .ct .xsp { width: 22px; height: 30px; }
  }
`;

class BambuLabFilamentBase extends HTMLElement {
  setConfig(config) {
    this._cfg = { ...(config || {}) };
    this._html = null;
    this.style.setProperty('--bbf-active', bblColor(this._cfg.color_active, '#4A9EF0'));
  }

  getCardSize() { return 3; }

  set hass(hass) {
    this._hass = hass;
    if (!this.shadowRoot) {
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${BBF_STYLE}</style><ha-card><div id="body"></div></ha-card>`;
      root.addEventListener('click', (ev) => {
        const el = ev.composedPath().find((n) => n.dataset && n.dataset.e);
        if (el && !bbfIsMockEntity(el.dataset.e)) this._open(el.dataset.e);
      });
      this._body = root.getElementById('body');
    }
    const html = this._render(hass, bblT(hass));
    if (html !== this._html) { this._body.innerHTML = html; this._html = html; }
  }

  // ---- shared pieces ----
  _opt(key, def) { const v = this._cfg[key]; return v === undefined ? def : v; }

  // re-render when the width changes
  connectedCallback() {
    if (!this._ro && window.ResizeObserver) {
      this._ro = new ResizeObserver((en) => {
        const w = Math.round(en[0].contentRect.width);
        if (w && Math.abs(w - (this._w || 0)) > 4) { this._w = w; if (this._hass) this.hass = this._hass; }
      });
    }
    if (this._ro) this._ro.observe(this);
  }


  // ---- external spool in the different styles ----
  // external spool as one slim line: color dot, name, type, remaining
  _extBarHtml(ext, T) {
    return `<div class="extbar">${ext.slots.map((sl) => {
      const active = sl.active && this._opt('highlight_active', true);
      const name = sl.empty ? T.f_empty : sl.name;
      const type = sl.type && !sl.empty && this._opt('show_type', true) ? `<span class="xtag">${bbfEsc(sl.type)}</span>` : '';
      const rem = sl.remText
        ? `<span class="xrem">${bbfEsc(sl.remText)}${sl.level != null ? `<span class="xbar"><i style="width:${Math.round(sl.level * 100)}%"></i></span>` : ''}</span>` : '';
      const n = sl.colors.length;
      const fil = n > 1 ? `linear-gradient(90deg, ${sl.colors.map((c, i) => `${c} ${Math.round((i / n) * 100)}% ${Math.round(((i + 1) / n) * 100)}%`).join(', ')})` : sl.colors[0];
      return `<button class="xb${active ? ' active' : ''}${sl.empty ? ' empty' : ''}" data-e="${bbfEsc(sl.entity)}" style="--fil:${bbfEsc(fil)}">`
        + (bbfStyle(this._cfg.style) === 'rings' ? `<span class="xring">${this._nRing(this._hass, sl)}</span>` : `<span class="xsp"><i class="xf"></i><i class="xw"></i><i class="xf"></i></span>`)
        + `<span class="xtx"><span class="xl">${bbfEsc(ext.label || T.f_external)}${active ? ` · <span class="xact">${bbfEsc(T.f_active)}</span>` : ''}</span>`
        + `<span class="xn">${bbfEsc(name)}</span></span>${type}${rem}</button>`;
    }).join('')}</div>`;
  }

  _slotHtml(sl, T) {
    const showName = this._opt('show_name', true);
    const showType = this._opt('show_type', true);
    const active = sl.active && this._opt('highlight_active', true);
    const cls = ['slot', sl.empty ? 'empty' : '', sl.off ? 'off' : '', active ? 'active' : ''].join(' ').trim();
    const n = sl.colors.length;
    const fil = n > 1
      ? `linear-gradient(90deg, ${sl.colors.map((c, i) => `${c} ${Math.round((i / n) * 100)}% ${Math.round(((i + 1) / n) * 100)}%`).join(', ')})`
      : sl.colors[0];
    const vars = `--fil:${bbfEsc(fil)};${sl.level != null ? `--w:${Math.round(30 + sl.level * 56)}%;` : ''}`;
    const name = sl.empty ? T.f_empty : (sl.off ? '—' : sl.name);
    const tip = [sl.name, sl.type, sl.remText, sl.active ? T.f_active : ''].filter(Boolean).join(' · ');
    const val = sl.remText;
    const pic = `<div class="spool"><div class="fl"></div><div class="core"><div class="wind"></div></div><div class="fl b"></div>${val ? `<span class="val">${bbfEsc(val)}</span>` : ''}</div>`;
    const lbl = (showName || (showType && sl.type))
      ? `<div class="lbl">${showName ? `<div class="nm">${bbfEsc(name)}</div>` : ''}${showType && sl.type && !sl.empty ? `<div class="ty">${bbfEsc(sl.type)}</div>` : ''}</div>`
      : '';
    return `<button class="${cls}" style="${vars}" data-e="${bbfEsc(sl.entity)}" title="${bbfEsc(tip)}">${pic}${lbl}</button>`;
  }

  // custom: { humidity, temperature } – own sensors (e.g. in a dryer box) instead of the AMS ones
  _chipsHtml(hass, amsId, custom) {
    if (!this._opt('show_info', true)) return '';
    custom = custom || {};
    const val = (id) => { const s = id && hass.states[id]; const v = s ? parseFloat(s.state) : NaN; return isNaN(v) ? null : v; };
    const unit = (id, def) => { const u = hass.states[id] && hass.states[id].attributes.unit_of_measurement; return u ? (u === '%' ? ' %' : ` ${u}`) : def; };
    // AMS Lite has no humidity / temperature sensor, it only reports zeros
    const dev = hass.devices && hass.devices[amsId];
    const lite = !!dev && /lite/i.test(dev.model || '');
    const nz = (v) => (v ? v : null);
    const chips = [];
    // humidity: own sensor, else the AMS (in %, or the 1–5 index)
    const cH = val(custom.humidity);
    if (cH != null) chips.push(`<span class="chip" data-e="${bbfEsc(custom.humidity)}">${bblsvg(BBF_ICONS.water, 13)}${Math.round(cH)}${unit(custom.humidity, ' %')}</span>`);
    else if (!lite) {
      const hum = bbfEntity(hass, amsId, 'humidity'), hidx = bbfEntity(hass, amsId, 'humidity_index');
      const h = nz(val(hum)), hi = nz(val(hidx));
      if (h != null) chips.push(`<span class="chip" data-e="${hum}">${bblsvg(BBF_ICONS.water, 13)}${Math.round(h)} %</span>`);
      else if (hi != null) chips.push(`<span class="chip" data-e="${hidx}">${bblsvg(BBF_ICONS.water, 13)}${Math.round(hi)}/5</span>`);
    }
    // temperature: own sensor, else the AMS
    const cT = val(custom.temperature);
    if (cT != null) chips.push(`<span class="chip" data-e="${bbfEsc(custom.temperature)}">${bblsvg(BBF_ICONS.temp, 13)}${Math.round(cT)}${unit(custom.temperature, ' °C')}</span>`);
    else if (!lite) {
      const tmp = bbfEntity(hass, amsId, 'ams_temp');
      const t = nz(val(tmp));
      if (t != null) chips.push(`<span class="chip" data-e="${tmp}">${bblsvg(BBF_ICONS.temp, 13)}${Math.round(t)} °C</span>`);
    }
    // drying (AMS 2 Pro / AMS HT): time left while the AMS dries its filament
    const dry = bbfEntity(hass, amsId, 'remaining_drying_time');
    const left = dry && !(hass.states[dry] && hass.states[dry].attributes && hass.states[dry].attributes.zone) ? bbfDuration(hass.states[dry]) : '';
    if (left) chips.unshift(`<span class="chip drying" data-e="${dry}">${bblsvg(BBF_ICONS.heat, 13)}${left}</span>`);
    return chips.length ? `<div class="chips">${chips.join('')}</div>` : '';
  }

  // humidity / temperature / drying time of one AMS 3H drying zone
  _zoneChipsHtml(hass, zone) {
    if (!this._opt('show_info', true) || !zone) return '';
    const chips = [];
    const val = (id) => { const s = id && hass.states[id]; const v = s ? parseFloat(s.state) : NaN; return isNaN(v) ? null : v; };
    const left = zone.drying ? bbfDuration(hass.states[zone.drying]) : '';
    if (left) chips.push(`<span class="chip drying" data-e="${zone.drying}">${bblsvg(BBF_ICONS.heat, 13)}${left}</span>`);
    const h = val(zone.humidity), t = val(zone.temperature);
    if (h != null) chips.push(`<span class="chip" data-e="${zone.humidity}">${bblsvg(BBF_ICONS.water, 13)}${Math.round(h)} %</span>`);
    if (t != null) chips.push(`<span class="chip" data-e="${zone.temperature}">${bblsvg(BBF_ICONS.temp, 13)}${Math.round(t)} °C</span>`);
    return chips.length ? `<div class="chips">${chips.join('')}</div>` : '';
  }

  _header(title, chips) {
    if (!title && !chips) return '';
    return `<div class="hdr${title ? '' : ' notitle'}">${title ? `<div class="ttl">${bbfEsc(title)}</div>` : ''}${chips}</div>`;
  }

  // per-slot overrides: `overrides: { sensor.x: { name, remaining, color, max } }`
  _ovr(entityId, slotNo) {
    const o = { ...((this._cfg.overrides || {})[entityId] || {}) };
    if (slotNo != null) {
      if (this._cfg[`name_${slotNo}`]) o.name = this._cfg[`name_${slotNo}`];
      if (this._cfg[`remaining_${slotNo}`]) o.remaining = this._cfg[`remaining_${slotNo}`];
    }
    return o;
  }

  _amsSlots(hass, amsId, flat) {
    return bbfEntities(hass, amsId, 'tray').map((id) => {
      const no = hass.states[id] && hass.states[id].attributes.slot;
      return bbfSlot(hass, id, this._cfg, this._ovr(id, flat ? no : null));
    }).filter(Boolean);
  }

  // ---- one look for the AMS card and the spool card: drawn spools or rings, names under the spools.
  // Every AMS is one cell of a grid of equal columns, so a spool has the same size in every AMS of the card.
  // Older configs: style compact / list / pills -> rings.
  _nFill(sl) {
    if (sl.empty || sl.off) return 'transparent';
    const n = sl.colors.length;
    return n > 1 ? `linear-gradient(90deg, ${sl.colors.map((c, i) => `${c} ${Math.round((i / n) * 100)}% ${Math.round(((i + 1) / n) * 100)}%`).join(', ')})` : sl.colors[0];
  }
  _nNo(hass, sl) {
    const e = hass.entities && hass.entities[sl.entity];
    const a = (hass.states[sl.entity] || {}).attributes || {};
    return e && e.translation_key === 'external_spool' ? '' : a.slot != null ? String(a.slot) : '';
  }
  _nActive(sl) { return sl.active && this._opt('highlight_active', true); }
  _nRing(hass, sl) {
    const pct = sl.level != null ? Math.round(sl.level * 100) : null;
    return `<span class="rr" style="background:${pct != null ? `conic-gradient(var(--n-rem) ${pct}%, rgba(128,128,128,.22) 0)` : 'rgba(128,128,128,.22)'}"><span class="rf"><span class="rh">${bbfEsc(this._nNo(hass, sl))}</span></span></span>`;
  }
  // one spool; bare = the picture only. A tap opens the filament dialog (see _open)
  _nItem(hass, sl, T, st, bare) {
    if (st === 'spool' && !bare) return this._slotHtml(sl, T);
    const pct = sl.level != null ? Math.round(sl.level * 100) : null;
    const cls = ['ni', `n-${st}`, this._nActive(sl) ? 'active' : '', sl.empty ? 'empty' : '', sl.off ? 'off' : '', pct != null && pct < 15 ? 'low' : ''].filter(Boolean).join(' ');
    const name = sl.empty ? T.f_empty : (sl.off ? '—' : sl.name);
    const type = sl.empty || sl.off ? '' : (this._opt('show_type', true) ? sl.type : '');
    const tip = [this._nNo(hass, sl), sl.name, sl.type, sl.remText, sl.active ? T.f_active : ''].filter(Boolean).join(' · ');
    let inner = st === 'rings' ? this._nRing(hass, sl)
      : `<span class="spool"${pct != null ? ` style="--w:${Math.round(30 + pct * 0.56)}%"` : ''}><span class="fl"></span><span class="core"><span class="wind"></span></span><span class="fl b"></span>${sl.remText ? `<span class="val">${bbfEsc(sl.remText)}</span>` : ''}</span>`;
    if (!bare) {
      const sub = [type, sl.remText].filter(Boolean).join(' · ');
      inner += `${this._opt('show_name', true) ? `<span class="rn">${bbfEsc(name)}</span>` : ''}${sub ? `<span class="rt">${bbfEsc(sub)}</span>` : ''}`;
    }
    return `<button class="${cls}" data-e="${bbfEsc(sl.entity)}" title="${bbfEsc(tip)}" style="--fil:${bbfEsc(this._nFill(sl))}">${inner}</button>`;
  }
  // compact: a small tile, the picture on the left, name and slot · type · remaining on the right
  _nPic(hass, sl, st) {
    return st === 'rings' ? `<span class="xring">${this._nRing(hass, sl)}</span>` : '<span class="xsp"><i class="xf"></i><i class="xw"></i><i class="xf"></i></span>';
  }
  _nTile(hass, sl, T, st) {
    const pct = sl.level != null ? Math.round(sl.level * 100) : null;
    const cls = ['ct', this._nActive(sl) ? 'active' : '', sl.empty ? 'empty' : '', sl.off ? 'off' : '', pct != null && pct < 15 ? 'low' : ''].filter(Boolean).join(' ');
    const name = sl.empty ? T.f_empty : (sl.off ? '—' : sl.name);
    const sub = [sl.empty || sl.off ? '' : (this._opt('show_type', true) ? sl.type : ''), sl.remText].filter(Boolean).join(' · ');
    const tip = [this._nNo(hass, sl), sl.name, sl.type, sl.remText, sl.active ? T.f_active : ''].filter(Boolean).join(' · ');
    return `<button class="${cls}" data-e="${bbfEsc(sl.entity)}" title="${bbfEsc(tip)}" style="--fil:${bbfEsc(this._nFill(sl))}">${this._nPic(hass, sl, st)}`
      + `<span class="ctx">${this._opt('show_name', true) ? `<span class="ctn">${bbfEsc(name)}</span>` : ''}${sub ? `<span class="cts">${bbfEsc(sub)}</span>` : ''}</span></button>`;
  }
  _nGrid(hass, slots, T, st, compact) {
    return compact ? `<div class="cg">${slots.map((sl) => this._nTile(hass, sl, T, st)).join('')}</div>`
      : `<div class="ng">${slots.map((sl) => this._nItem(hass, sl, T, st)).join('')}</div>`;
  }
  // a unit with one spool (AMS HT, the external spool, an AMS tray in the spool card): the spool, everything about it next to it
  _nSingle(hass, g, T, st, compact, inner) {
    const sl = g.slots[0];
    const pic = compact ? `<span class="ni csingle${this._nActive(sl) ? ' active' : ''}" data-e="${bbfEsc(sl.entity)}" style="--fil:${bbfEsc(this._nFill(sl))}">${this._nPic(hass, sl, st)}</span>` : this._nItem(hass, sl, T, st, true);
    const name = sl.empty ? T.f_empty : (sl.off ? '—' : sl.name);
    // the type only when shown in the card; a drawn spool has its remaining inside, like in an AMS
    const sub = [sl.empty || !this._opt('show_type', true) ? '' : sl.type, st === 'spool' && !compact ? '' : sl.remText].filter(Boolean).join(' · ');
    const tag = this._nActive(sl) && !sl.empty ? `<span class="dt">${bbfEsc(T.f_active)}</span>` : '';
    const row = `<div class="nhtb">${st === 'spool' && !compact ? `<div class="htpic">${pic}</div>` : pic}<div class="nhtt">`
      + `${g.name ? `<span class="glabel">${bbfEsc(g.name)}</span>` : ''}<span class="hrow"><span class="hn">${bbfEsc(name)}</span>${tag}</span>`
      + `${sub ? `<span class="hs">${bbfEsc(sub)}</span>` : ''}</div></div>`;
    return inner ? row : `<div class="grp nb">${row}</div>`;
  }
  _nBlock(hass, g, T, st, compact) {
    const labels = this._opt('show_labels', true);
    const drying = /chip drying/.test(g.chips || '');
    const head = labels || g.chips ? `<div class="ghead"><span class="glabel">${labels ? bbfEsc(g.name) : ''}</span>${g.chips}</div>` : '';
    if (g.ht) {
      // AMS HT: the same header as every AMS; one tile (compact) or the spool with its details next to it
      const body = compact ? `<div class="cg one">${this._nTile(hass, g.slots[0], T, st)}</div>` : this._nSingle(hass, { slots: g.slots }, T, st, false, true);
      return `<div class="grp nb${drying ? ' drying' : ''}">${head}${body}</div>`;
    }
    // AMS 3H: the main zone in rows of four, the dry box in its own frame below
    const dry = g.dry ? `<div class="ndry${/chip drying/.test(g.dry.chips) ? ' on' : ''}"><div class="ghead"><span class="glabel">${bbfEsc(T.f_drybox)}</span>${g.dry.chips}</div>`
      + `${this._nGrid(hass, g.dry.slots, T, st, compact)}</div>` : '';
    return `<div class="grp nb${drying && !g.dry ? ' drying' : ''}">${head}${this._nGrid(hass, g.slots, T, st, compact)}${dry}</div>`;
  }
  _nWrap(cells, st, compact) { return cells.length ? `<div class="nwrap" style="--minb:${compact || st === 'rings' ? 360 : 400}px">${cells.join('')}</div>` : ''; }

  // a tap on a spool: the integration's own filament dialog (same as its AMS cards), else more-info
  async _open(id) {
    const ent = this._hass && this._hass.entities && this._hass.entities[id];
    if (ent && ent.platform === 'bambu_lab' && ['tray', 'external_spool'].includes(ent.translation_key) && customElements.get('ams-popup')) {
      if (this._pop) this._pop.remove();
      const p = document.createElement('ams-popup');
      p.style.cssText = 'position:fixed;left:-200vw;top:0;width:1px;height:1px';
      document.body.appendChild(p);
      this._pop = p;
      p.hass = this._hass; p.entity_id = id; p.controlBlocked = true;
      await p.updateComplete;
      const inner = p.shadowRoot && p.shadowRoot.querySelector('.popup-action-container');
      if (inner) { inner.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true })); return; }
    }
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true }));
  }
  disconnectedCallback() { if (this._ro) this._ro.disconnect(); if (this._pop) { this._pop.remove(); this._pop = null; } }

  static _getStub(hass, test) {
    const d = hass && hass.devices && Object.values(hass.devices).find((x) => test(x));
    return d ? d.id : undefined;
  }
}

// ---------------------------------------------------------------- AMS card
// ---------------------------------------------------------------- External spool card
class BambuLabSpoolCard extends BambuLabFilamentBase {
  getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 3 }; }
  // compact = one line (the old "slim"); normal = the spool with everything about it next to it, in the AMS card's look
  _spoolSize() { return bbfSpoolSize(this._cfg); }
  _render(hass, T) {
    let cfg = this._cfg;
    if (bblIsMock(cfg.spool)) {
      const m = BBF_MOCK_SPOOL[cfg.mock] ? cfg.mock : 'external_active';
      hass = bbfMockHass(hass, m === 'ams_tray' ? ['ams'] : [], m === 'ams_tray' ? null : m);
      cfg = { ...cfg, spool: m === 'ams_tray' ? 'bbf_mock_ams' : 'bbf_mock_ext', tray: 4, title: cfg.title == null ? T.f_mock_title : cfg.title };
      delete cfg.entity; delete cfg.remaining;
    }
    let ids = [];
    if (cfg.entity) ids = [cfg.entity];
    else if (cfg.spool) {
      ids = bbfEntities(hass, cfg.spool, 'external_spool');
      if (!ids.length) { const t = bbfTray(hass, cfg.spool, cfg.tray); if (t) ids = [t]; }
    }
    const slots = ids.map((id) => {
      const o = this._ovr(id, null);
      if (cfg.name) o.name = cfg.name;
      if (cfg.remaining) o.remaining = cfg.remaining;
      return bbfSlot(hass, id, cfg, o);
    }).filter(Boolean);
    if (!slots.length) { this._hide(false); return `<div class="warn">${T.f_warn_spool}</div>`; }
    // "only while in use": the card disappears from the dashboard unless the printer prints from this spool
    const active = slots.filter((x) => x.active);
    const only = this._opt('show_external', 'always') === 'active';
    this._hide(only && !active.length);
    const shown = only && active.length ? active : slots;
    // an AMS tray is labelled "AMS · 2" instead of "External"
    let label = T.f_external;
    const ent = hass.entities && hass.entities[shown[0].entity];
    if (ent && ent.translation_key === 'tray') {
      const no = hass.states[shown[0].entity] && hass.states[shown[0].entity].attributes.slot;
      label = `${bbfAmsLabel(hass, ent.device_id)}${no ? ` · ${no}` : ''}`;
    }
    if (this._spoolSize() === 'compact') return this._header(cfg.title, '') + this._extBarHtml({ n: shown.length, slots: shown, label }, T);
    const st = bbfStyle(this._cfg.style);
    return this._header(cfg.title, '') + this._nWrap(shown.map((sl) => this._nSingle(hass, { name: label, chips: '', slots: [sl] }, T, st)), st);
  }
  _hide(h) {
    // in the card editor / dashboard edit mode it stays visible (dimmed), so it can be set up
    const edit = !!(this.preview || this.editMode);
    const st = h && !edit ? 'none' : '';
    if (this._hidden === `${h}${edit}`) return;
    this._hidden = `${h}${edit}`;
    this.style.display = st;
    this.style.opacity = h && edit ? '0.5' : '';
  }
  static getStubConfig(hass) {
    const spool = BambuLabFilamentBase._getStub(hass, (d) => bbfEntities(hass, d.id, 'external_spool').length);
    return spool ? { spool } : { spool: 'MOCK', mock: 'external_active' };
  }
  static getConfigElement() { const el = document.createElement('bambulab-filament-editor'); el.kind = 'spool'; return el; }
}

// ---------------------------------------------------------------- AMS + external spool card
class BambuLabFilamentCard extends BambuLabFilamentBase {
  getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }

  // external spool: always | active (only while printing from it) | never; booleans from older configs
  _extMode() {
    const v = this._opt('show_external', 'always');
    return v === true ? 'always' : v === false ? 'never' : v;
  }

  _extStyle() {
    const v = this._opt('external_style', 'slim');
    return ['normal', 'column', 'panel'].includes(v) ? 'normal' : 'slim';
  }

  _render(hass, T) {
    let c = this._cfg;
    if (bblIsMock(c.ams)) {
      const keys = bbfMockList(c.mock);
      hass = bbfMockHass(hass, keys);
      c = { ...c, ams: keys.map((k) => `bbf_mock_${k}`), title: c.title == null ? T.f_mock_title : c.title };
      delete c.printer; delete c.external; delete c.custom_sensors; delete c.custom_humidity; delete c.custom_temperature;
    }
    const src = bbfSources(hass, c);
    if (!src.ams.length && !src.ext.length) return `<div class="warn">${T.f_warn_filament}</div>`;
    const amsIds = src.ams;
    const groups = [];
    amsIds.forEach((id) => {
      const slots = this._amsSlots(hass, id, amsIds.length === 1);
      if (!slots.length) return;
      // "A1_AMS" -> "AMS": drop the printer name in front
      const dev = hass.devices && hass.devices[id];
      const pName = dev && dev.via_device_id ? bbfDeviceName(hass, dev.via_device_id) : '';
      let name = bbfDeviceName(hass, id);
      if (pName && name.startsWith(`${pName}_`)) name = name.slice(pName.length + 1);
      const custom = new Set(amsIds).size === 1 ? { humidity: c.custom_humidity, temperature: c.custom_temperature } : (c.custom_sensors || {})[id];
      const zones = bbfAmsZones(hass, id);
      const dryZone = zones.find((z) => z.dryBox);
      if (dryZone) {
        // AMS 3H: as wide as a 4-spool AMS – the main zone in rows of four, the dry box below it
        const trayNo = (sl) => Number(((hass.states[sl.entity] || {}).attributes || {}).slot);
        const main = zones.find((z) => !z.dryBox);
        const custom3h = custom && (custom.humidity || custom.temperature) ? custom : null;
        groups.push({ n: 4, cols: 4, name: name.replace(/_/g, ' ') || 'AMS',
          chips: custom3h ? this._chipsHtml(hass, id, custom3h) : this._zoneChipsHtml(hass, main),
          slots: slots.filter((sl) => !dryZone.slots.includes(trayNo(sl))),
          dry: { slots: slots.filter((sl) => dryZone.slots.includes(trayNo(sl))), chips: this._zoneChipsHtml(hass, dryZone), zone: dryZone } });
      } else {
        const chips = this._chipsHtml(hass, id, custom);
        // AMS HT (one spool): the spool with its chips next to it, as wide as two spools – the chips need the room
        const ht = slots.length === 1 && !!chips;
        groups.push({ n: ht ? 2 : slots.length, ht, name: name.replace(/_/g, ' ') || 'AMS', chips, slots });
      }
    });
    let ext = null;
    const mode = this._extMode();
    if (src.ext.length) {
      const slots = [];
      src.ext.forEach((d) => bbfEntities(hass, d, 'external_spool').forEach((id) => {
        const sl = bbfSlot(hass, id, c, this._ovr(id, null));
        if (sl && (mode === 'always' || sl.active)) slots.push(sl);
      }));
      if (slots.length) ext = { n: slots.length, name: T.f_external, chips: '', slots };
    }
    if (!groups.length && !ext) return `<div class="warn">${T.f_warn_filament}</div>`;
    return this._renderNew(hass, T, c, groups, ext);
  }

  _renderNew(hass, T, c, groups, ext) {
    const st = bbfStyle(this._cfg.style);
    const compact = this._cfg.size === 'compact';
    // external spool (old filament card): slim line above or below, "normal" = one more cell in the grid
    const xs = ext ? (groups.length ? this._extStyle() : 'normal') : null;
    const end = this._opt('external_position', 'start') === 'end';
    const cells = groups.map((g) => this._nBlock(hass, g, T, st, compact));
    if (xs === 'normal') {
      const blks = ext.slots.map((sl) => this._nSingle(hass, { name: T.f_external, chips: '', slots: [sl] }, T, st, compact));
      if (end) cells.push(...blks); else cells.unshift(...blks);
    }
    const grid = this._nWrap(cells, st, compact);
    const bar = xs === 'slim' ? this._extBarHtml(ext, T) : '';
    return this._header(c.title, '') + `<div class="vlayout">${end ? grid + bar : bar + grid}</div>`;
  }


  static getStubConfig(hass) {
    const ent = hass && hass.entities && Object.values(hass.entities).find((x) => x.platform === 'bambu_lab' && x.translation_key === 'print_status');
    if (!ent || !ent.device_id) return {};
    const ch = bbfChildren(hass, ent.device_id);
    const cfg = {};
    if (ch.ams.length) cfg.ams = ch.ams;
    if (ch.ext.length) cfg.external = ch.ext[0];
    return cfg;
  }
  static getConfigElement() { const el = document.createElement('bambulab-filament-editor'); el.kind = 'filament'; return el; }
}

// ---------------------------------------------------------------- AMS card: one or more AMS, no external spool
class BambuLabAmsCard extends BambuLabFilamentCard {
  setConfig(config) {
    const c = { ...(config || {}) };
    c.ams = c.ams ? [].concat(c.ams) : [];
    delete c.external;
    c.show_external = 'never';
    super.setConfig(c);
  }
  static getStubConfig(hass) {
    const cfg = BambuLabFilamentCard.getStubConfig(hass);
    delete cfg.external;
    if (!cfg.ams) {
      const ams = BambuLabFilamentBase._getStub(hass, (d) => bbfEntities(hass, d.id, 'tray').length);
      if (ams) cfg.ams = [ams];
    }
    return cfg.ams ? cfg : { ams: ['MOCK'], mock: ['ams_3h', 'ams_2_pro'] };
  }
  static getConfigElement() { const el = document.createElement('bambulab-filament-editor'); el.kind = 'ams'; return el; }
}

// ---------------------------------------------------------------- Editor (shared)
function bbfSchema(kind, T, ctx) {
  ctx = ctx || {};
  const amsFilter = BBF_AMS_MODELS.map((model) => ({ integration: 'bambu_lab', model }));
  if (kind === 'spool') return bbfSpoolSchema(T, ctx);
  const display = [
    { name: 'show_remaining', required: true, selector: { select: { mode: 'dropdown', options: [
      { value: 'auto', label: T.o_auto }, { value: 'always', label: T.o_always }, { value: 'never', label: T.o_never }] } } },
    { type: 'grid', name: '', flatten: true, schema: [
      { name: 'style', required: true, selector: { select: { mode: 'list', options: [{ value: 'spool', label: T.o_spool }, { value: 'rings', label: T.o_rings }] } } },
      { name: 'size', required: true, selector: { select: { mode: 'list', options: [
        { value: 'normal', label: T.o_sz_normal }, { value: 'compact', label: T.o_sz_compact }] } } }] },
    { type: 'grid', name: '', flatten: true, column_min_width: '220px', schema: [
      { name: 'show_name', selector: { boolean: {} } },
      { name: 'show_type', selector: { boolean: {} } },
      { name: 'highlight_active', selector: { boolean: {} } },
      { name: 'show_labels', selector: { boolean: {} } },
    ] },
    ...(kind === 'filament' && ctx.hasExt ? [{ name: 'show_external', required: true, selector: { select: { mode: 'dropdown', options: [
      { value: 'always', label: T.o_ext_always }, { value: 'active', label: T.o_ext_active }] } } },
      { name: 'external_style', required: true, selector: { select: { mode: 'dropdown', options: [
        { value: 'slim', label: T.o_xs_slim },
        { value: 'normal', label: T.o_xs_normal }] } } },
      { name: 'external_position', required: true, selector: { select: { mode: 'dropdown', options: ctx.extStyle === 'normal'
        ? [{ value: 'start', label: T.o_left }, { value: 'end', label: T.o_right }]
        : [{ value: 'start', label: T.o_top }, { value: 'end', label: T.o_bottom }] } } },
] : []),
    { name: 'color_active', selector: { ui_color: {} } },
    ...(ctx.oneAms && (ctx.liteAms || []).length ? [{ type: 'grid', name: '', flatten: true, schema: [
      { name: 'custom_humidity', selector: { entity: { domain: ['sensor', 'input_number', 'number'] } } },
      { name: 'custom_temperature', selector: { entity: { domain: ['sensor', 'input_number', 'number'] } } }] }] : []),
    ...(!ctx.oneAms ? (ctx.liteAms || []).map((a, i) => ({ type: 'grid', name: '', flatten: true, schema: [
      { name: `cs_h_${i}`, label_ams: a.name, selector: { entity: { domain: ['sensor', 'input_number', 'number'] } } },
      { name: `cs_t_${i}`, label_ams: a.name, selector: { entity: { domain: ['sensor', 'input_number', 'number'] } } }] })) : []),
  ];
  const head = {
    ams: ctx.mock ? [{ name: 'mock', selector: { select: { multiple: true, mode: 'list', options: [
      { value: 'ams_3h', label: T.o_m_3h }, { value: 'ams_2_pro', label: T.o_m_2pro }, { value: 'ams_ht', label: T.o_m_ht },
      { value: 'ams', label: T.o_m_ams }, { value: 'ams_lite', label: T.o_m_lite }] } } }]
      : [{ name: 'ams', required: true, selector: { device: { multiple: true, filter: amsFilter } } }],
    spool: [
      { name: 'spool', selector: { device: { filter: [...amsFilter, { integration: 'bambu_lab', model: 'External Spool' }] } } },
      ...(ctx.isAms ? [{ name: 'tray', selector: { number: { min: 1, max: ctx.trays || 4, step: 1, mode: 'box' } } }] : []),
      { name: 'entity', selector: { entity: { domain: 'sensor', integration: 'bambu_lab' } } },
    ],
    filament: [
      { name: 'ams', selector: { device: { multiple: true, filter: amsFilter } } },
      { name: 'external', selector: { device: { filter: { integration: 'bambu_lab', model: 'External Spool' } } } },
    ],
  }[kind];
  return [
    ...(kind === 'ams' ? [bblSourceField(T)] : []),
    ...head,
    { name: 'title', selector: { text: {} } },
    ...display,
  ];
}

function bbfSpoolSchema(T, ctx) {
  const amsFilter = BBF_AMS_MODELS.map((model) => ({ integration: 'bambu_lab', model }));
  return [
    bblSourceField(T),
    ...(ctx.mock ? [{ name: 'mock', required: true, selector: { select: { mode: 'list', options: [
      { value: 'external', label: T.o_ms_ext }, { value: 'external_active', label: T.o_ms_ext_active }, { value: 'ams_tray', label: T.o_ms_tray }] } } }]
      : [{ name: 'spool', selector: { device: { filter: [{ integration: 'bambu_lab', model: 'External Spool' }, ...amsFilter] } } },
        ...(ctx.isAms ? [{ name: 'tray', selector: { number: { min: 1, max: ctx.trays || 4, step: 1, mode: 'box' } } }] : [])]),
    { type: 'grid', name: '', flatten: true, schema: [
      { name: 'size', required: true, selector: { select: { mode: 'list', options: [
        { value: 'normal', label: T.o_sz_normal }, { value: 'compact', label: T.o_sz_compact }] } } },
      { name: 'style', required: true, selector: { select: { mode: 'list', options: [{ value: 'spool', label: T.o_spool }, { value: 'rings', label: T.o_rings }] } } }] },
    { name: 'show_external', required: true, selector: { select: { mode: 'list', options: [
      { value: 'always', label: T.o_ext_always }, { value: 'active', label: T.o_ext_active }] } } },
    { name: 'title', selector: { text: {} } },
    { name: 'show_remaining', required: true, selector: { select: { mode: 'dropdown', options: [
      { value: 'auto', label: T.o_auto }, { value: 'always', label: T.o_always }, { value: 'never', label: T.o_never }] } } },
    { type: 'grid', name: '', flatten: true, column_min_width: '220px', schema: [
      { name: 'show_type', selector: { boolean: {} } },
      { name: 'highlight_active', selector: { boolean: {} } },
    ] },
    { name: 'color_active', selector: { ui_color: {} } },
  ];
}

const BBF_DEFAULTS = { show_name: true, show_type: true, highlight_active: true, show_info: true, show_external: 'always', show_labels: true,
  show_remaining: 'auto', style: 'spool', external_position: 'start', external_style: 'slim' };
// style spool | rings (older compact / list / pills are rings)
const bbfStyle = (v) => (['compact', 'rings', 'list', 'pills'].includes(v) ? 'rings' : 'spool');
// spool card: size compact = one slim line (older external_style slim / ribbon), normal = the AMS card's look
const bbfSpoolSize = (c) => (c.size === 'compact' || (!c.size && ['slim', 'ribbon'].includes(c.external_style)) ? 'compact' : 'normal');

class BambuLabFilamentEditor extends HTMLElement {
  setConfig(config) { this._config = config || {}; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _render() {
    if (!this._hass || !this._config) return;
    const T = bblT(this._hass);
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => {
        const L = bblT(this._hass);
        const m = s.name.match(/^(name|remaining)_(\d)$/);
        if (m) return (m[1] === 'name' ? L.e_slot_name : L.e_slot_remaining).replace('{n}', m[2]);
        if (s.name === 'name') return L.f_name;
        if (s.name === '_source') return L.e_source;
        if (s.name === 'mock') return this.kind === 'spool' ? L.e_mock_spool : L.e_mock_ams;
        if (/^cs_[ht]_\d+$/.test(s.name)) return `${s.name[3] === 'h' ? L.e_custom_humidity : L.e_custom_temperature} – ${s.label_ams}`;
        if (s.name === 'show_external' && this.kind === 'spool') return L.e_show_when;
        if (s.name === 'external_style' && this.kind === 'spool') return L.e_spool_style;
        return L[`e_${s.name}`] || s.name;
      };
      this._form.computeHelper = (s) => {
        const L = bblT(this._hass);
        if (s.name === 'ams') return this.kind === 'filament' ? L.h_ams_list : '';
        if (s.name === 'external') return L.h_external;
        if (s.name === 'show_external' && this.kind !== 'spool') return '';
        if (s.name === 'name') return L.hf_name;
        if (s.name === '_source') return L.h_source;
        return L[`h_${s.name}`] || '';
      };
      this._form.addEventListener('value-changed', (ev) => {
        const cfg = { ...ev.detail.value };
        // data source: MOCK puts `ams: [MOCK]` / `spool: MOCK` in the config, "my devices" takes it out again
        const src = cfg._source; delete cfg._source;
        const dk = this.kind === 'spool' ? 'spool' : 'ams';
        if (src === 'mock') {
          cfg[dk] = dk === 'ams' ? ['MOCK'] : 'MOCK';
          if (dk === 'spool' && !BBF_MOCK_SPOOL[cfg.mock]) cfg.mock = 'external_active';
          if (dk === 'ams' && !bblIsMock(this._config.ams)) cfg.mock = ['ams_3h', 'ams_2_pro'];
          delete cfg.tray; delete cfg.entity; delete cfg.custom_sensors; delete cfg.custom_humidity; delete cfg.custom_temperature;
          Object.keys(cfg).filter((k) => k.startsWith('cs_')).forEach((k) => delete cfg[k]);
        } else if (src === 'device' && bblIsMock(cfg[dk])) { delete cfg[dk]; delete cfg.mock; }
        // per-AMS sensor fields -> custom_sensors: { <AMS id>: { humidity, temperature } }
        if (Object.keys(cfg).some((k) => k.startsWith('cs_'))) {
          const map = { ...(cfg.custom_sensors || {}) };
          (this._lite || []).forEach((a, i) => {
            const h = cfg[`cs_h_${i}`], t = cfg[`cs_t_${i}`];
            if (h || t) map[a.id] = { ...(h ? { humidity: h } : {}), ...(t ? { temperature: t } : {}) }; else delete map[a.id];
          });
          Object.keys(cfg).filter((k) => k.startsWith('cs_')).forEach((k) => delete cfg[k]);
          if (Object.keys(map).length) cfg.custom_sensors = map; else delete cfg.custom_sensors;
        }
        Object.keys(cfg).forEach((k) => {
          const def = this.kind === 'spool' && k === 'external_style' ? 'normal' : BBF_DEFAULTS[k];
          if (cfg[k] === '' || cfg[k] === undefined || cfg[k] === null || def === cfg[k]
            || (Array.isArray(cfg[k]) && !cfg[k].length && k !== 'mock')) delete cfg[k];
        });
        if (cfg.style) cfg.style = bbfStyle(cfg.style);
        if (cfg.style === 'spool') delete cfg.style;
        if (cfg.size !== 'compact') delete cfg.size;
        if (this.kind === 'spool') delete cfg.external_style;
        if (this.kind === 'spool' && cfg.spool && !bbfEntities(this._hass, cfg.spool, 'tray').length) delete cfg.tray;
        if (this.kind === 'filament' && !cfg.external) { delete cfg.show_external; delete cfg.external_position; delete cfg.external_style; }
        if (this.kind === 'filament') delete cfg.external_wrap;
        if (this.kind !== 'spool' && new Set([].concat(cfg.ams || [])).size !== 1) { delete cfg.custom_humidity; delete cfg.custom_temperature; }
        this._config = { type: this._config.type, ...cfg };
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const kind = this.kind || 'ams';
    // an old filament card (printer) opens with its AMS units and external spool filled in
    if (kind === 'filament' && this._config.printer) {
      const m = bbfMigrate(this._hass, this._config);
      if (m) {
        this._config = m;
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: m }, bubbles: true, composed: true }));
      }
    }
    // rebuild the form when the language or the picked device changes (tray field, number of trays)
    const mock = kind !== 'filament' && bblIsMock(kind === 'spool' ? this._config.spool : this._config.ams);
    const amsList = kind !== 'spool' && this._config.ams && !mock ? [].concat(this._config.ams) : [];
    const dev = kind === 'spool' ? (mock ? null : this._config.spool) : amsList.length === 1 ? amsList[0] : null;
    const ctx = { isAms: !!dev && bbfEntities(this._hass, dev, 'tray').length > 0, trays: dev ? bbfTrayCount(this._hass, dev) : 4,
      hasExt: !!this._config.external, mock, oneAms: new Set(amsList).size === 1, multiAms: new Set(amsList).size > 1,
      // own humidity / temperature sensor for every AMS in the card (any model)
      liteAms: [...new Set(amsList)].map((id) => ({ id, name: bbfAmsLabel(this._hass, id) })),
      extStyle: ['normal', 'column', 'panel'].includes(this._config.external_style) ? 'normal' : 'slim',
    };
    this._lite = ctx.liteAms;
    const sig = `${bblLang(this._hass)}|${kind}|${ctx.liteAms.map((a) => `${a.id}:${a.name}`).join(',')}|${ctx.isAms}|${ctx.trays}|${ctx.hasExt}|${ctx.oneAms}|${ctx.multiAms}|${ctx.extStyle}|${ctx.mock}`;
    if (this._sig !== sig) { this._form.schema = bbfSchema(kind, T, ctx); this._sig = sig; }
    this._form.hass = this._hass;
    const data = { ...BBF_DEFAULTS, ...this._config, _source: mock ? 'mock' : 'device' };
    if (mock && kind === 'spool') data.mock = BBF_MOCK_SPOOL[data.mock] ? data.mock : 'external_active';
    if (mock && kind !== 'spool') data.mock = data.mock == null ? ['ams_3h', 'ams_2_pro'] : [].concat(data.mock);
    data.style = bbfStyle(this._config.style);
    data.size = kind === 'spool' ? bbfSpoolSize(this._config) : (this._config.size === 'compact' ? 'compact' : 'normal');
    if (data.show_external === true) data.show_external = 'always';
    if (data.show_external === false) data.show_external = 'never';
    if (kind !== 'spool') data.external_style = ctx.extStyle;
    if (!ctx.oneAms) (ctx.liteAms || []).forEach((a, i) => {
      const cs = (this._config.custom_sensors || {})[a.id] || {};
      data[`cs_h_${i}`] = cs.humidity; data[`cs_t_${i}`] = cs.temperature;
    });
    this._form.data = data;
  }
}

window.customCards = window.customCards || [];
[
  ['bambulab-ams-card', BambuLabAmsCard, 'CzechTropi · Bambu Lab AMS', 'f_desc_ams'],
  ['bambulab-spool-card', BambuLabSpoolCard, 'CzechTropi · Bambu Lab Spool', 'f_desc_spool'],
  ['bambulab-filament-card', BambuLabFilamentCard, null, null],     // AMS + external spool in one card: old dashboards only
].forEach(([tag, cls, name, desc]) => {
  if (!customElements.get(tag)) customElements.define(tag, cls);
  if (name && !window.customCards.find((c) => c.type === tag)) {
    const T = bblPickerT();
    window.customCards.push({ type: tag, name, description: T[desc], preview: true, documentationURL: 'https://github.com/CzechTropi/bambulab-card' });
  }
});
if (!customElements.get('bambulab-filament-editor')) customElements.define('bambulab-filament-editor', BambuLabFilamentEditor);
