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
    e_icon_light: 'Ikona světla', e_icon_power: 'Ikona napájení', e_icon_nozzle: 'Ikona hotendu', e_icon_bed: 'Ikona podložky', e_icon_usage: 'Ikona příkonu',
    e_color_light: 'Barva světla (zapnuto)', e_color_power: 'Barva napájení (zapnuto)', e_color_nozzle: 'Barva hotendu', e_color_bed: 'Barva podložky', e_color_progress: 'Barva progresu',
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
    e_icon_light: 'Light icon', e_icon_power: 'Power icon', e_icon_nozzle: 'Hotend icon', e_icon_bed: 'Bed icon', e_icon_usage: 'Power usage icon',
    e_color_light: 'Light color (on)', e_color_power: 'Power color (on)', e_color_nozzle: 'Hotend color', e_color_bed: 'Bed color', e_color_progress: 'Progress color',
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
};

const BBL_ICONS = {
  light: 'M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z',
  power: 'M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13',
  image: 'M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z',
  video: 'M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z',
  nozzle: 'M7,2H17V8H19V13H16.5L13,17H11L7.5,13H5V8H7V2M10,22H2V20H10A1,1 0 0,0 11,19V18H13V19A3,3 0 0,1 10,22Z',
  bed: 'M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z',
  bolt: 'M11,15H6L13,1V9H18L11,23V15Z',
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
      e = bblResolve(hass, c.printer);
    }
    if (c.camera) e.camera = c.camera;
    if (c.preview) e.preview = c.preview;
    if (c.light) e.light = c.light;
    e.power_switch = c.power_switch;
    e.power_sensor = c.power_sensor || bblPowerSensor(hass, c.power_switch);
    Object.assign(e, c.entities || {});
    const dev = c.printer && hass.devices ? hass.devices[c.printer] : null;
    e.name = c.name || (dev && (dev.name_by_user || (dev.model ? `Bambu ${dev.model}` : dev.name))) || 'Bambu Lab';
    this._e = e;
  }

  set hass(hass) {
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
      ['--bbl-bed', c.color_bed, '#E07250'], ['--bbl-prog', c.color_progress, '#378ADD']]
      .forEach(([k, v, d]) => this.style.setProperty(k, bblColor(v, d)));
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        ha-card { padding: 14px; overflow: hidden; }
        .head { display: flex; align-items: center; gap: 10px; }
        .dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; transition: background .3s; }
        .dot.live { animation: pulse 2s infinite; }
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
      this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: this._e.power_switch }, bubbles: true, composed: true }));
    });

    if (this._e.camera) {
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
  _call(domain, service, entity_id) { if (entity_id) this._hass.callService(domain, service, { entity_id }); }

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
    const T = bblT(this._hass); const cs = this._lang === 'cs';
    const sObj = hs[e.status];
    const label = T[s] || ((sObj && this._hass.formatEntityState) ? this._hass.formatEntityState(sObj) : s);
    const color = BBL_COLORS[s] || '#8a8a85';
    const printing = ['running', 'pause', 'prepare'].includes(s);

    $('name').textContent = e.name;
    const stageObj = hs[e.stage];
    const stage = stageObj ? stageObj.state : undefined;
    let stageTxt = null;
    if (stage && !['idle', 'unknown', 'unavailable', 'printing'].includes(stage) && powerOn !== 'off') {
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
    if (powerOn === 'off') errs.length = 0;
    const errHtml = errs.map((x) => `<div>${x}</div>`).join('');
    if (this._errHtml !== errHtml) { $('errmsgs').innerHTML = errHtml; this._errHtml = errHtml; }
    $('err').classList.toggle('hidden', !errs.length);
    if (errs.length && !BBL_COLORS[s]) $('dot').style.background = '#E24B4A';

    const chips = [];
    const noz = this._num(e.nozzle), nozT = this._num(e.nozzleT), bed = this._num(e.bed), bedT = this._num(e.bedT);
    const t = (v, tg) => v == null ? '—' : (tg ? `${Math.round(v)}°/${Math.round(tg)}°` : `${Math.round(v)} °C`);
    if (configured && powerOn !== 'off') {
      chips.push(`<span class="chip c-noz">${this._icon('icon_nozzle', 'nozzle', 14)}${t(noz, nozT)}</span>`);
      chips.push(`<span class="chip c-bed">${this._icon('icon_bed', 'bed', 14)}${t(bed, bedT)}</span>`);
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
    return ent && ent.device_id ? { printer: ent.device_id } : {};
  }
  static getConfigElement() { return document.createElement('bambulab-card-editor'); }
}

const BBL_SCHEMA = [
  { name: 'printer', required: true, selector: { device: { filter: { integration: 'bambu_lab' } } } },
  { name: 'power_switch', selector: { entity: { domain: ['switch', 'input_boolean', 'light'] } } },
  { name: 'camera', selector: { entity: { domain: 'camera' } } },
  { name: 'name', selector: { text: {} } },
  { name: 'icons', type: 'expandable', flatten: true, icon: 'mdi:emoticon-outline', schema: [
    { type: 'grid', name: '', flatten: true, schema: [
      { name: 'icon_light', selector: { icon: { placeholder: 'mdi:lightbulb' } } },
      { name: 'icon_power', selector: { icon: { placeholder: 'mdi:power' } } },
      { name: 'icon_nozzle', selector: { icon: { placeholder: 'mdi:printer-3d-nozzle' } } },
      { name: 'icon_bed', selector: { icon: { placeholder: 'mdi:radiator' } } },
      { name: 'icon_usage', selector: { icon: { placeholder: 'mdi:flash' } } },
    ] },
  ] },
  { name: 'colors', type: 'expandable', flatten: true, icon: 'mdi:palette-outline', schema: [
    { type: 'grid', name: '', flatten: true, schema: [
      { name: 'color_light', selector: { ui_color: {} } },
      { name: 'color_power', selector: { ui_color: {} } },
      { name: 'color_nozzle', selector: { ui_color: {} } },
      { name: 'color_bed', selector: { ui_color: {} } },
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
      this._form.schema = BBL_SCHEMA;
      this._form.computeLabel = (s) => bblT(this._hass)[`e_${s.name}`] || s.name;
      this._form.computeHelper = (s) => bblT(this._hass)[`h_${s.name}`] || '';
      this._form.addEventListener('value-changed', (ev) => {
        const cfg = { ...ev.detail.value };
        Object.keys(cfg).forEach((k) => { if (cfg[k] === '' || cfg[k] === undefined || cfg[k] === null) delete cfg[k]; });
        this._config = { ...cfg, type: this._config.type };
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = this._config;
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
  f_empty: 'Prázdné', f_external: 'Externí', f_humidity: 'Vlhkost', f_temp: 'Teplota', f_active: 'Aktivní',
  f_warn_ams: 'Vyber v editoru karty AMS (zařízení z integrace Bambu Lab).',
  f_warn_spool: 'Vyber v editoru karty špulku (externí nebo slot AMS).',
  f_warn_printer: 'Vyber v editoru karty tiskárnu (zařízení z integrace Bambu Lab).',
  f_warn_filament: 'Vyber v editoru karty AMS nebo externí špulku.',
  f_desc_ams: 'Jedno nebo více AMS: barva, název a typ filamentu, vlhkost',
  f_desc_spool: 'Jedna špulka – externí nebo slot AMS. Vzhled: špulka, slim, ležící špulka nebo panel',
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
  o_spool: 'Špulka', o_compact: 'Kompaktní',
  o_left: 'Vlevo', o_right: 'Vpravo', o_top: 'Nahoře', o_bottom: 'Dole',
  o_ext_always: 'Vždy', o_ext_active: 'Jen když se z ní tiskne',
  o_xs_slim: 'Slim', o_xs_normal: 'Normální', o_xs_ribbon: 'Ležící špulka', o_xs_panel: 'Panel',
  e_show_when: 'Kdy zobrazit', e_spool_style: 'Vzhled',
  e_custom_humidity: 'Vlastní senzor vlhkosti', e_custom_temperature: 'Vlastní senzor teploty',
  e_external_style: 'Styl externí špulky', h_show_external: 'Jen když se z ní tiskne = jinak se karta skryje',
});
Object.assign(BBL_I18N.en, {
  f_empty: 'Empty', f_external: 'External', f_humidity: 'Humidity', f_temp: 'Temperature', f_active: 'Active',
  f_warn_ams: 'Pick an AMS (a Bambu Lab device) in the card editor.',
  f_warn_spool: 'Pick a spool (external or an AMS tray) in the card editor.',
  f_warn_printer: 'Pick a printer (a Bambu Lab device) in the card editor.',
  f_warn_filament: 'Pick an AMS or the external spool in the card editor.',
  f_desc_ams: 'One or more AMS: color, name and type of the filament, humidity',
  f_desc_spool: 'One spool – the external spool or an AMS tray. Appearance: spool, slim, lying spool or panel',
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
  o_spool: 'Spool', o_compact: 'Compact',
  o_left: 'Left', o_right: 'Right', o_top: 'Top', o_bottom: 'Bottom',
  o_ext_always: 'Always', o_ext_active: 'Only while in use',
  o_xs_slim: 'Slim', o_xs_normal: 'Normal', o_xs_ribbon: 'Lying spool', o_xs_panel: 'Panel',
  e_show_when: 'When to Show', e_spool_style: 'Appearance',
  e_custom_humidity: 'Custom Humidity Sensor', e_custom_temperature: 'Custom Temperature Sensor',
  e_external_style: 'External Spool Style', h_show_external: 'Only while in use = otherwise the card is hidden',
});

const BBF_AMS_MODELS = ['AMS', 'AMS Lite', 'AMS 2 Pro', 'AMS HT', 'AMS 3H'];
const BBF_ICONS = {
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
  .groups { display: flex; flex-wrap: wrap; gap: 8px; }
  .layout { display: flex; gap: 8px; align-items: flex-start; }
  .amscol { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .extcol { display: flex; min-width: 0; }
  .extcol .grp { flex: 1 1 auto !important; }
  .vlayout { display: flex; flex-direction: column; gap: 8px; }
  .vlayout .amscol { flex: none !important; }
  .extbar { display: flex; flex-wrap: wrap; gap: 6px; width: 100%; }
  .xb { all: unset; box-sizing: border-box; cursor: pointer; display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1 1 auto;
        padding: 6px 10px; border-radius: 10px; background: rgba(128,128,128,.07); border: 1px solid rgba(128,128,128,.18); font-size: 12px; }
  .xb.active { border-color: var(--bbf-active); box-shadow: 0 0 8px color-mix(in srgb, var(--bbf-active) 45%, transparent); }
  .xdot { width: 16px; height: 16px; border-radius: 50%; background: var(--fil); flex-shrink: 0; box-shadow: inset 0 0 0 2px rgba(255,255,255,.18), 0 0 0 1px rgba(128,128,128,.4); }
  .xb.empty .xdot { background: transparent; }
  .xl { color: var(--secondary-text-color); font-weight: 500; }
  .xn { color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .xt { color: var(--secondary-text-color); font-size: 11px; white-space: nowrap; }
  /* external spool: panel */
  .xpanel { all: unset; box-sizing: border-box; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 12px;
            background: rgba(128,128,128,.07); border: 1px solid rgba(128,128,128,.18); }
  .xpanel.active { border-color: color-mix(in srgb, var(--bbf-active) 70%, transparent); }
  .xpspool { flex: none; }
  .xpspool .slot { max-width: none; cursor: inherit; }
  .xpinfo { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .xpl { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
  .xpa { color: var(--bbf-active); }
  .xpn { font-size: 14px; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .xpt { font-size: 12px; color: var(--secondary-text-color); }
  /* external spool: lying spool */
  .xr { all: unset; box-sizing: border-box; cursor: pointer; display: flex; height: 40px; border-radius: 9px; overflow: hidden;
        border: 2px solid #6b6b6b; background: #2a2a2a; transition: border-color .25s, box-shadow .25s; }
  .xr.active { border-color: var(--bbf-active); box-shadow: 0 0 10px color-mix(in srgb, var(--bbf-active) 55%, transparent); }
  .xrf { width: 14px; flex: none; background: linear-gradient(90deg, #9a9a9a, #6e6e6e); }
  .xrf.r { background: linear-gradient(90deg, #6e6e6e, #8e8e8e); }
  .xrw { flex: 1; min-width: 0; position: relative; display: flex; align-items: center; justify-content: center; padding: 0 8px;
         background: var(--fil); }
  .xrw::after { content: ''; position: absolute; inset: 0;
         background: repeating-linear-gradient(0deg, rgba(0,0,0,.26) 0 1px, transparent 1px 4px),
                     linear-gradient(0deg, rgba(0,0,0,.35), rgba(255,255,255,.14) 45%, rgba(255,255,255,.04) 60%, rgba(0,0,0,.35)); }
  .xr.empty .xrw { background: transparent; }
  .xrtx { position: relative; z-index: 1; font-size: 12px; color: #fff; background: rgba(0,0,0,.5); padding: 2px 8px; border-radius: 6px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; backdrop-filter: blur(3px); }
  .xrtx b { font-weight: 500; color: #ccc; margin-right: 4px; }
  .xrtx i { font-style: normal; color: #bbb; margin-left: 4px; font-size: 11px; }
  /* after the "all: unset" above: the panel and the lying spool fill the card width */
  .xr, .xpanel { width: 100%; }
  .xr + .xr, .xpanel + .xpanel { margin-top: 6px; }

  .row { display: flex; gap: 8px; min-width: 0; align-items: flex-start; }
  .fill { min-width: 0; }
  .grp { min-width: 0; box-sizing: border-box; background: rgba(128,128,128,.07); border: 1px solid rgba(128,128,128,.18); border-radius: 12px; padding: 8px; }
  .ghead { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin: 0 2px 8px; min-height: 22px; }
  .glabel { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ghead .chip, .gfoot .chip { font-size: 11px; padding: 1px 7px; }
  .gfoot { margin-top: 8px; }
  .gfoot .chips { justify-content: center; gap: 4px; }
  .gfoot .chip { font-size: 10px; padding: 0 5px; gap: 2px; }
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
  /* compact */
  .dotwrap { display: flex; justify-content: center; padding-top: 2px; }
  .dot { position: relative; width: 38px; height: 38px; border-radius: 50%; background: var(--fil); box-shadow: inset 0 0 0 2px rgba(255,255,255,.18), 0 0 0 2px rgba(128,128,128,.35);
         display: flex; align-items: center; justify-content: center; transition: box-shadow .25s; }
  .dot::after { content: ''; width: 10px; height: 10px; border-radius: 50%; background: var(--card-background-color, #1c1c1c); box-shadow: 0 0 0 2px rgba(0,0,0,.25); }
  .slot.empty .dot, .slot.off .dot { background: transparent; box-shadow: inset 0 0 0 2px rgba(128,128,128,.45); }
  .cval { min-height: 14px; text-align: center; font-size: 11px; font-weight: 500; color: var(--primary-text-color); margin-top: -2px; }
  /* label under the spool */
  .lbl { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 2px; text-align: center; padding: 5px 4px; border-radius: 8px;
         background: rgba(128,128,128,.14); border: 1px solid transparent; transition: border-color .25s; min-height: 32px; box-sizing: border-box; }
  .nm { font-size: 11px; line-height: 1.25; color: var(--primary-text-color); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: break-word; hyphens: auto; }
  .ty { font-size: 10px; line-height: 1.2; color: var(--secondary-text-color); letter-spacing: .3px; }
  .slot.empty .nm, .slot.off .nm { color: var(--secondary-text-color); }
  /* active spool */
  .slot.active .spool { border-color: var(--bbf-active); box-shadow: 0 0 10px color-mix(in srgb, var(--bbf-active) 55%, transparent); }
  .slot.active .dot { box-shadow: inset 0 0 0 2px rgba(255,255,255,.18), 0 0 0 3px var(--bbf-active), 0 0 10px var(--bbf-active); }
  .slot.active .lbl { border-color: color-mix(in srgb, var(--bbf-active) 70%, transparent); }
  /* phones / narrow columns */
  @container (max-width: 440px) {
    .groups, .layout, .amscol, .row, .slots { gap: 5px; }
    .grp { padding: 6px; border-radius: 10px; }
    .ghead { margin: 0 1px 6px; }
    .ghead .chip { font-size: 10px; padding: 0 5px; gap: 2px; }
    .lbl { padding: 4px 2px; min-height: 28px; }
    .nm { font-size: 10px; }
    .ty { font-size: 9px; }
    .val { font-size: 10px; padding: 1px 4px; }
    .spool { border-radius: 7px; }
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
        if (el) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: el.dataset.e }, bubbles: true, composed: true }));
      });
      this._body = root.getElementById('body');
    }
    const html = this._render(hass, bblT(hass));
    if (html !== this._html) { this._body.innerHTML = html; this._html = html; }
  }

  // ---- shared pieces ----
  _opt(key, def) { const v = this._cfg[key]; return v === undefined ? def : v; }

  // the width decides the layout (how many AMS fit in one row, spool size of the panel)
  connectedCallback() {
    if (!this._ro && window.ResizeObserver) {
      this._ro = new ResizeObserver((en) => {
        const w = Math.round(en[0].contentRect.width);
        if (w && Math.abs(w - (this._w || 0)) > 4) { this._w = w; if (this._hass) this.hass = this._hass; }
      });
    }
    if (this._ro) this._ro.observe(this);
  }
  disconnectedCallback() { if (this._ro) this._ro.disconnect(); }


  // ---- external spool in the different styles ----
  _extInfo(sl, T) {
    return { name: sl.empty ? T.f_empty : sl.name, sub: [sl.empty ? '' : sl.type, sl.remText].filter(Boolean).join(' · '),
      active: sl.active && this._opt('highlight_active', true) };
  }
  _spoolPic(sl, active) {
    return `<div class="slot${active ? ' active' : ''}${sl.empty ? ' empty' : ''}" style="--fil:${bbfEsc(sl.colors[0])}">`
      + `<div class="spool"><div class="fl"></div><div class="core"><div class="wind"></div></div><div class="fl b"></div></div></div>`;
  }
  // panel: a box as wide as the AMS, spool on the left, details next to it
  _extPanelHtml(ext, T, slotPx) {
    return ext.slots.map((sl) => {
      const i = this._extInfo(sl, T);
      return `<button class="grp xpanel${i.active ? ' active' : ''}" data-e="${bbfEsc(sl.entity)}">`
        + `<div class="xpspool" style="width:${slotPx}px">${this._spoolPic(sl, i.active)}</div>`
        + `<div class="xpinfo"><div class="xpl">${bbfEsc(ext.label || T.f_external)}${i.active ? ` · <span class="xpa">${bbfEsc(T.f_active)}</span>` : ''}</div>`
        + `<div class="xpn">${bbfEsc(i.name)}</div>${i.sub ? `<div class="xpt">${bbfEsc(i.sub)}</div>` : ''}</div></button>`;
    }).join('');
  }
  // lying spool ("ribbon"): the spool drawn on its side, as wide as the AMS
  _extRibbonHtml(ext, T) {
    return ext.slots.map((sl) => {
      const i = this._extInfo(sl, T);
      return `<button class="xr${i.active ? ' active' : ''}${sl.empty ? ' empty' : ''}" data-e="${bbfEsc(sl.entity)}" style="--fil:${bbfEsc(sl.colors[0])}">`
        + `<span class="xrf"></span><span class="xrw"><span class="xrtx"><b>${bbfEsc(ext.label || T.f_external)}</b> ${bbfEsc(i.name)}${i.sub ? ` <i>${bbfEsc(i.sub)}</i>` : ''}</span></span><span class="xrf r"></span></button>`;
    }).join('');
  }
  // external spool as one slim line: color dot, name, type, remaining
  _extBarHtml(ext, T) {
    return `<div class="extbar">${ext.slots.map((sl) => {
      const active = sl.active && this._opt('highlight_active', true);
      const name = sl.empty ? T.f_empty : sl.name;
      return `<button class="xb${active ? ' active' : ''}${sl.empty ? ' empty' : ''}" data-e="${bbfEsc(sl.entity)}" style="--fil:${bbfEsc(sl.colors[0])}">`
        + `<span class="xdot"></span><span class="xl">${bbfEsc(ext.label || T.f_external)}</span><span class="xn">${bbfEsc(name)}</span>`
        + `${sl.type && !sl.empty ? `<span class="xt">${bbfEsc(sl.type)}</span>` : ''}${sl.remText ? `<span class="xt">${bbfEsc(sl.remText)}</span>` : ''}</button>`;
    }).join('')}</div>`;
  }

  _slotHtml(sl, T) {
    const style = this._opt('style', 'spool');
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
    let pic;
    if (style === 'compact') {
      pic = `<div class="dotwrap"><div class="dot"></div></div>${this._opt('show_remaining', 'auto') !== 'never' ? `<div class="cval">${bbfEsc(sl.remText)}</div>` : ''}`;
    } else {
      const val = sl.remText || (sl.empty || sl.off ? '—' : '');
      pic = `<div class="spool"><div class="fl"></div><div class="core"><div class="wind"></div></div><div class="fl b"></div>${val ? `<span class="val">${bbfEsc(val)}</span>` : ''}</div>`;
    }
    const lbl = (showName || (showType && sl.type))
      ? `<div class="lbl">${showName ? `<div class="nm">${bbfEsc(name)}</div>` : ''}${showType && sl.type && !sl.empty ? `<div class="ty">${bbfEsc(sl.type)}</div>` : ''}</div>`
      : '';
    return `<button class="${cls}" style="${vars}" data-e="${bbfEsc(sl.entity)}" title="${bbfEsc(tip)}">${pic}${lbl}</button>`;
  }

  _slotsHtml(slots, T) {
    return `<div class="slots" style="grid-template-columns:repeat(${Math.max(slots.length, 1)},minmax(0,1fr))">${slots.map((s) => this._slotHtml(s, T)).join('')}</div>`;
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

  static _getStub(hass, test) {
    const d = hass && hass.devices && Object.values(hass.devices).find((x) => test(x));
    return d ? d.id : undefined;
  }
}

// ---------------------------------------------------------------- AMS card
// ---------------------------------------------------------------- External spool card
class BambuLabSpoolCard extends BambuLabFilamentBase {
  getGridOptions() {
    // a spool drawing is narrow, the other styles are as wide as an AMS card
    return this._spoolStyle() === 'normal' ? { columns: 3, rows: 'auto', min_columns: 2 } : { columns: 12, rows: 'auto', min_columns: 3 };
  }
  _spoolStyle() {
    const v = this._opt('external_style', 'normal');
    return ['slim', 'ribbon', 'panel'].includes(v) ? v : 'normal';
  }
  _render(hass, T) {
    let ids = [];
    if (this._cfg.entity) ids = [this._cfg.entity];
    else if (this._cfg.spool) {
      ids = bbfEntities(hass, this._cfg.spool, 'external_spool');
      if (!ids.length) { const t = bbfTray(hass, this._cfg.spool, this._cfg.tray); if (t) ids = [t]; }
    }
    const slots = ids.map((id) => {
      const o = this._ovr(id, null);
      if (this._cfg.name) o.name = this._cfg.name;
      if (this._cfg.remaining) o.remaining = this._cfg.remaining;
      return bbfSlot(hass, id, this._cfg, o);
    }).filter(Boolean);
    if (!slots.length) { this._hide(false); return `<div class="warn">${T.f_warn_spool}</div>`; }
    // "only while in use": the card disappears from the dashboard unless the printer prints from this spool
    const active = slots.filter((s) => s.active);
    const hide = this._opt('show_external', 'always') === 'active' && !active.length;
    this._hide(hide);
    const shown = hide ? slots : (this._opt('show_external', 'always') === 'active' ? active : slots);
    // an AMS tray is labelled "AMS · 2" instead of "External"
    let label = T.f_external;
    const ent = hass.entities && hass.entities[shown[0].entity];
    if (ent && ent.translation_key === 'tray') {
      const dev = hass.devices && hass.devices[ent.device_id];
      const pName = dev && dev.via_device_id ? bbfDeviceName(hass, dev.via_device_id) : '';
      let n = bbfDeviceName(hass, ent.device_id);
      if (pName && n.startsWith(`${pName}_`)) n = n.slice(pName.length + 1);
      const no = hass.states[shown[0].entity] && hass.states[shown[0].entity].attributes.slot;
      label = `${(n || 'AMS').replace(/_/g, ' ')}${no ? ` · ${no}` : ''}`;
    }
    const ext = { n: shown.length, slots: shown, label };
    const st = this._spoolStyle();
    if (st === 'normal') return this._header(this._cfg.title, '') + this._slotsHtml(shown, T);
    let body;
    if (st === 'slim') body = this._extBarHtml(ext, T);
    else if (st === 'ribbon') body = this._extRibbonHtml(ext, T);
    else {
      // same spool size as in a full-width AMS card next to it (4 trays)
      const w = (this._w || this.clientWidth || 400) - 24 - 18 - 3 * 8;
      body = this._extPanelHtml(ext, T, Math.max(48, Math.min(150, Math.round(w / 4))));
    }
    return this._header(this._cfg.title, '') + body;
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
    return spool ? { spool } : {};
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
    if (['panel', 'ribbon'].includes(v)) return v;
    return v === 'normal' || v === 'column' ? 'normal' : 'slim';
  }

  _render(hass, T) {
    const c = this._cfg;
    const src = bbfSources(hass, c);
    if (!src.ams.length && !src.ext.length) return `<div class="warn">${T.f_warn_filament}</div>`;
    const amsIds = src.ams;
    const labels = this._opt('show_labels', true);
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
      groups.push({ n: slots.length, name: name.replace(/_/g, ' ') || 'AMS', chips: this._chipsHtml(hass, id, custom), slots });
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

    // Sizes in px at the smallest comfortable spool; a group of n spools takes n*SLOT + gaps + padding.
    // The same numbers are used as flex weights, so every spool in the card ends up the same width.
    const SLOT = 62, GAP = 8, PAD = 18;
    const gw = (n) => n * SLOT + (n - 1) * GAP + PAD;
    const width = (this._w || this.clientWidth || 600) - 24;          // minus the card padding
    // external spool: slim = one line above / below the AMS, normal = a spool in its own column left / right.
    // Without any AMS it is always a normal spool.
    const xs = !groups.length ? 'normal' : this._extStyle();
    const extSide = ext && xs === 'normal';
    const avail = width - (extSide ? gw(ext.n) + GAP : 0);
    const end = this._opt('external_position', 'start') === 'end';
    const seq = groups;
    // pack the AMS units into rows, then even the rows out (2+2 instead of 3+1)
    const rows = [];
    seq.forEach((g) => {
      const r = rows[rows.length - 1];
      if (r && r.w + GAP + gw(g.n) <= avail) { r.items.push(g); r.w += GAP + gw(g.n); } else rows.push({ items: [g], w: gw(g.n) });
    });
    if (rows.length > 1) {
      const per = Math.ceil(seq.length / rows.length);
      rows.length = 0;
      for (let i = 0; i < seq.length; i += per) {
        const items = seq.slice(i, i + per);
        rows.push({ items, w: items.reduce((x, g) => x + gw(g.n), 0) + (items.length - 1) * GAP });
      }
    }
    const cap = Math.max(0, ...rows.map((r) => r.w));               // the widest row sets the scale

    const anyHead = labels || groups.some((g) => g.chips);
    const grp = (g, cls) => {
      // a one-spool unit (AMS HT) is too narrow for name + chips in one line: its chips go under the spool
      const narrow = g.n === 1 && g.chips;
      const head = anyHead ? `<div class="ghead"><span class="glabel">${labels ? bbfEsc(g.name) : ''}</span>${narrow ? '' : g.chips}</div>` : '';
      const foot = narrow ? `<div class="gfoot">${g.chips}</div>` : '';
      return `<div class="grp${cls || ''}" style="flex:${gw(g.n)} 1 0">${head}${this._slotsHtml(g.slots, T)}${foot}</div>`;
    };
    // a shorter (last) row gets an empty filler, so its spools keep the same size as above
    const fill = (r) => (cap - r.w > 1 ? `<div class="fill" style="flex:${cap - r.w - GAP} 1 0"></div>` : '');
    const rowHtml = (r) => `<div class="row">${r.items.map((g) => grp(g)).join('')}${fill(r)}</div>`;
    const amsCol = rows.length ? `<div class="amscol" style="flex:${cap} 1 0">${rows.map(rowHtml).join('')}</div>` : '';
    if (ext && ['slim', 'panel', 'ribbon'].includes(xs)) {
      const slotPx = Math.min(150, Math.round((width / Math.max(cap, 1)) * SLOT));
      const bar = xs === 'panel' ? this._extPanelHtml(ext, T, slotPx) : xs === 'ribbon' ? this._extRibbonHtml(ext, T) : this._extBarHtml(ext, T);
      return this._header(c.title, '') + `<div class="vlayout">${end ? amsCol + bar : bar + amsCol}</div>`;
    }
    const extCol = extSide ? `<div class="extcol" style="flex:${gw(ext.n)} 1 0">${grp(ext, ' ext')}</div>` : '';
    const body = !rows.length ? (extSide ? extCol : '')
      : !extSide ? amsCol
        : end ? amsCol + extCol : extCol + amsCol;
    return this._header(c.title, '') + `<div class="layout">${body}</div>`;
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
    return cfg;
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
    { name: 'style', required: true, selector: { select: { mode: 'dropdown', options: [{ value: 'spool', label: T.o_spool }, { value: 'compact', label: T.o_compact }] } } },
    { type: 'grid', name: '', flatten: true, column_min_width: '220px', schema: [
      { name: 'show_name', selector: { boolean: {} } },
      { name: 'show_type', selector: { boolean: {} } },
      { name: 'highlight_active', selector: { boolean: {} } },
      ...(kind !== 'spool' ? [{ name: 'show_info', selector: { boolean: {} } }] : []),
      ...(kind !== 'spool' ? [{ name: 'show_labels', selector: { boolean: {} } }] : []),
    ] },
    ...(kind === 'filament' && ctx.hasExt ? [{ name: 'show_external', required: true, selector: { select: { mode: 'dropdown', options: [
      { value: 'always', label: T.o_ext_always }, { value: 'active', label: T.o_ext_active }] } } },
      { name: 'external_style', required: true, selector: { select: { mode: 'dropdown', options: [
        { value: 'slim', label: T.o_xs_slim }, { value: 'ribbon', label: T.o_xs_ribbon }, { value: 'panel', label: T.o_xs_panel },
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
    ams: [{ name: 'ams', required: true, selector: { device: { multiple: true, filter: amsFilter } } }],
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
    ...head,
    { name: 'title', selector: { text: {} } },
    ...display,
  ];
}

function bbfSpoolSchema(T, ctx) {
  const amsFilter = BBF_AMS_MODELS.map((model) => ({ integration: 'bambu_lab', model }));
  const normal = ctx.spoolStyle === 'normal';
  return [
    { name: 'spool', selector: { device: { filter: [{ integration: 'bambu_lab', model: 'External Spool' }, ...amsFilter] } } },
    ...(ctx.isAms ? [{ name: 'tray', selector: { number: { min: 1, max: ctx.trays || 4, step: 1, mode: 'box' } } }] : []),
    { name: 'external_style', required: true, selector: { select: { mode: 'dropdown', options: [
      { value: 'normal', label: T.o_xs_normal }, { value: 'slim', label: T.o_xs_slim }, { value: 'ribbon', label: T.o_xs_ribbon },
      { value: 'panel', label: T.o_xs_panel }] } } },
    { name: 'show_external', required: true, selector: { select: { mode: 'dropdown', options: [
      { value: 'always', label: T.o_ext_always }, { value: 'active', label: T.o_ext_active }] } } },
    { name: 'title', selector: { text: {} } },
    { name: 'show_remaining', required: true, selector: { select: { mode: 'dropdown', options: [
      { value: 'auto', label: T.o_auto }, { value: 'always', label: T.o_always }, { value: 'never', label: T.o_never }] } } },
    ...(normal ? [{ name: 'style', required: true, selector: { select: { mode: 'dropdown', options: [{ value: 'spool', label: T.o_spool }, { value: 'compact', label: T.o_compact }] } } }] : []),
    { type: 'grid', name: '', flatten: true, column_min_width: '220px', schema: [
      ...(normal ? [{ name: 'show_name', selector: { boolean: {} } }, { name: 'show_type', selector: { boolean: {} } }] : []),
      { name: 'highlight_active', selector: { boolean: {} } },
    ] },
    { name: 'color_active', selector: { ui_color: {} } },
  ];
}

const BBF_DEFAULTS = { show_name: true, show_type: true, highlight_active: true, show_info: true, show_external: 'always', show_labels: true,
  show_remaining: 'auto', style: 'spool', external_position: 'start', external_style: 'slim' };

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
        return L[`h_${s.name}`] || '';
      };
      this._form.addEventListener('value-changed', (ev) => {
        const cfg = { ...ev.detail.value };
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
            || (Array.isArray(cfg[k]) && !cfg[k].length)) delete cfg[k];
        });
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
    const amsList = kind !== 'spool' && this._config.ams ? [].concat(this._config.ams) : [];
    const dev = kind === 'spool' ? this._config.spool : amsList.length === 1 ? amsList[0] : null;
    const ctx = { isAms: !!dev && bbfEntities(this._hass, dev, 'tray').length > 0, trays: dev ? bbfTrayCount(this._hass, dev) : 4,
      hasExt: !!this._config.external, oneAms: new Set(amsList).size === 1, multiAms: new Set(amsList).size > 1,
      // own humidity / temperature sensor for every AMS in the card (any model)
      liteAms: [...new Set(amsList)].map((id) => ({ id, name: bbfAmsLabel(this._hass, id) })),
      extStyle: ['normal', 'column'].includes(this._config.external_style) ? 'normal' : 'slim',
      spoolStyle: ['slim', 'ribbon', 'panel'].includes(this._config.external_style) ? this._config.external_style : 'normal' };
    this._lite = ctx.liteAms;
    const sig = `${bblLang(this._hass)}|${kind}|${ctx.liteAms.map((a) => `${a.id}:${a.name}`).join(',')}|${ctx.isAms}|${ctx.trays}|${ctx.hasExt}|${ctx.oneAms}|${ctx.multiAms}|${ctx.extStyle}|${ctx.spoolStyle}`;
    if (this._sig !== sig) { this._form.schema = bbfSchema(kind, T, ctx); this._sig = sig; }
    this._form.hass = this._hass;
    const data = { ...BBF_DEFAULTS, ...this._config };
    if (data.show_external === true) data.show_external = 'always';
    if (data.show_external === false) data.show_external = 'never';
    data.external_style = kind === 'spool' ? ctx.spoolStyle
      : (['panel', 'ribbon'].includes(this._config.external_style) ? this._config.external_style : ctx.extStyle);
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
