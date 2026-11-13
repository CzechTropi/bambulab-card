# Bambu Lab Printer Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories)

**English** · [Česky](#česky)

A minimalist Home Assistant dashboard card for Bambu Lab 3D printers: live camera / print preview, nozzle & bed temperatures, print progress with ETA, HMS errors, chamber light and smart-plug power.

Works with all Bambu Lab printers supported by the [ha-bambulab](https://github.com/greghesp/ha-bambulab) integration.

![Printing, paused with an error, finished and powered off](images/overview.png)

<table>
  <tr>
    <td align="center"><img src="images/preview.png" width="300"><br><sub>Print preview – one tap on the image icon</sub></td>
    <td align="center"><img src="images/preparing.png" width="300"><br><sub>Current stage while preparing the print</sub></td>
  </tr>
</table>

## Features

- Live camera with a one-tap switch to the print preview (cover image)
- Status line with the current stage (bed leveling, heating, filament change, pause reason…)
- Nozzle and bed temperature chips (current / target)
- Progress bar, layer count, remaining time, start and finish time
- HMS and print errors with a link to the Bambu wiki
- Chamber light toggle, optional smart plug (power state + wattage)
- Visual editor, customizable icons and colors
- Czech and English UI (follows your Home Assistant language)

## Requirements

- Home Assistant 2024.8 or newer
- [ha-bambulab](https://github.com/greghesp/ha-bambulab) integration (HACS)

The card finds the printer entities automatically by their `translation_key` on the selected device, so renaming entities doesn't break it. If some part is missing (e.g. layers or start/end time), make sure the corresponding entity is **enabled** in the device settings.

## Installation

### HACS (recommended)

1. HACS → ⋮ (top right) → **Custom repositories**
2. Repository: `https://github.com/CzechTropi/bambulab-card`, type: **Dashboard**
3. Find **Bambu Lab Printer Card** in HACS and download it
4. Reload the browser (Ctrl+F5)

### Manual

1. Copy `bambulab-card.js` to `/config/www/`
2. Settings → Dashboards → ⋮ → **Resources** → Add resource: `/local/bambulab-card.js`, type **JavaScript module**
3. Reload the browser

## Configuration

Add the card from the card picker (search for **Bambu Lab**) and pick your printer in the editor, or use YAML:

```yaml
type: custom:bambulab-card
printer: <device_id>            # Bambu Lab device (pick it in the visual editor)
power_switch: switch.printer_plug  # optional – smart plug
camera: camera.my_camera        # optional – defaults to the printer camera
name: My printer                # optional – defaults to the device name
```

| Option | Description |
| --- | --- |
| `printer` | **Required.** Device from the Bambu Lab integration |
| `power_switch` | Smart plug / switch powering the printer. Wattage is read from a `power` sensor on the same device |
| `power_sensor` | Override the power sensor |
| `camera` | Camera entity (default: printer camera) |
| `preview`, `light` | Override the preview image / chamber light entity |
| `name` | Card title |
| `icon_light`, `icon_power`, `icon_nozzle`, `icon_bed`, `icon_usage` | Custom icons (`mdi:…`) |
| `color_light`, `color_power`, `color_nozzle`, `color_bed`, `color_progress` | Custom colors (HA color name or CSS color) |
| `entities` | Map to override any resolved entity, e.g. `{ progress: sensor.xyz }` |

---

## Česky

Minimalistická karta do Home Assistantu pro 3D tiskárny Bambu Lab: živá kamera / náhled tisku, teplota trysky a podložky, průběh tisku s časem dokončení, HMS chyby, světlo a napájení přes chytrou zásuvku.

Funguje se všemi tiskárnami Bambu Lab, které podporuje integrace [ha-bambulab](https://github.com/greghesp/ha-bambulab).

<img src="images/czech.png" width="320" alt="Karta v češtině">

### Předpoklady

- Home Assistant 2024.8 nebo novější
- Integrace [ha-bambulab](https://github.com/greghesp/ha-bambulab) (z HACS)

Karta si entity najde sama podle `translation_key` na vybraném zařízení, takže jí nevadí přejmenování entit. Pokud se některá část nezobrazuje (vrstvy, čas startu/konce…), zkontroluj, že je daná entita v nastavení zařízení **povolená**.

### Instalace přes HACS

1. HACS → ⋮ (vpravo nahoře) → **Vlastní repozitáře**
2. Repozitář: `https://github.com/CzechTropi/bambulab-card`, typ: **Dashboard**
3. Najdi v HACS **Bambu Lab Printer Card** a stáhni
4. Obnov prohlížeč (Ctrl+F5)

### Použití

Přidej kartu přes výběr karet (hledej **Bambu Lab**) a v editoru vyber svou tiskárnu. Volitelně přidej zásuvku, kameru, název, vlastní ikony a barvy.

## License

MIT
