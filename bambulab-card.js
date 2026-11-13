// bambulab-card – minimalist Bambu Lab printer card (camera / preview, chips, progress)
// Config: printer (device id from the Bambu Lab integration), power_switch, camera (optional), name (optional)

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
    e_printer: 'Tiskárna', e_power_switch: 'Zásuvka (napájení tiskárny)', e_camera: 'Kamera', e_name: 'Název',
    e_icons: 'Ikony', e_colors: 'Barvy',
    e_icon_light: 'Ikona světla', e_icon_power: 'Ikona napájení', e_icon_nozzle: 'Ikona hotendu', e_icon_bed: 'Ikona podložky', e_icon_usage: 'Ikona příkonu',
    e_color_light: 'Barva světla (zapnuto)', e_color_power: 'Barva napájení (zapnuto)', e_color_nozzle: 'Barva hotendu', e_color_bed: 'Barva podložky', e_color_progress: 'Barva progresu',
    h_camera: 'Prázdné = kamera tiskárny', h_name: 'Prázdné = název zařízení', h_power_switch: 'Příkon se načte ze stejného zařízení',
    desc: 'Minimalistická karta pro Bambu Lab tiskárnu: kamera, náhled, teploty, progres',
  },
  en: {
    running: 'Printing', prepare: 'Preparing', pause: 'Paused', finish: 'Finished', failed: 'Print failed',
    idle: 'Ready', init: 'Starting', slicing: 'Slicing', offline: 'Offline', unavailable: 'Powered off', unknown: 'Unknown',
    err_print: 'Print error', more: 'more info',
    layer: 'layer', left: 'left', start: 'start', done: 'done', print: 'Print', live: 'LIVE', preview: 'PREVIEW',
    t_light: 'Light', t_power: 'Power', t_toggle: 'Switch camera / preview',
    warn: 'Pick a printer (a Bambu Lab device) in the card editor.',
    e_printer: 'Printer', e_power_switch: 'Smart plug (printer power)', e_camera: 'Camera', e_name: 'Name',
    e_icons: 'Icons', e_colors: 'Colors',
    e_icon_light: 'Light icon', e_icon_power: 'Power icon', e_icon_nozzle: 'Hotend icon', e_icon_bed: 'Bed icon', e_icon_usage: 'Power usage icon',
    e_color_light: 'Light color (on)', e_color_power: 'Power color (on)', e_color_nozzle: 'Hotend color', e_color_bed: 'Bed color', e_color_progress: 'Progress color',
    h_camera: 'Empty = printer camera', h_name: 'Empty = device name', h_power_switch: 'Power usage is read from the same device',
    desc: 'Minimalist Bambu Lab printer card: camera, preview, temperatures, progress',
  },
};
const bblLang = (hass) => {
  const l = ((hass && ((hass.locale && hass.locale.language) || hass.language)) || navigator.language || 'en').toLowerCase();
  return l.split('-')[0];
};
const bblT = (hass) => BBL_I18N[bblLang(hass)] || BBL_I18N.en;

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
  const T = BBL_I18N[(navigator.language || 'en').split('-')[0]] || BBL_I18N.en;
  window.customCards.push({ type: 'bambulab-card', name: 'Bambu Lab', description: T.desc, preview: false });
}
