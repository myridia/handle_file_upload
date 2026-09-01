# AGENTS.md — handle_file_upload

## What this is
A JavaScript library that lets users pick the columns of a CSV, XLS or XLSX file and returns the selected columns for import into a data grid.

## Stack
- JavaScript (ES5, browser)
- jQuery 3.x and Bootstrap 4.x (dependencies)
- Build via `watchify` (Browserify) in `make.sh`

## Build
```bash
./make.sh
```
Run `watchify handle_file_upload.js --s Handle_file_upload -o dist/handle_file_upload.js -v` to compile the browser bundle into `dist/`.

## Run
Import `dist/handle_file_upload.js` in a page, then `var h = new Handle_file_upload(columns, mycallback); h.init();` — the callback receives the selected column data.

## Structure
- `handle_file_upload.js` — the library source
- `make.sh` — builds the browser bundle
- `xlsx.full.min.js` — bundled SheetJS parser for XLS/XLSX

## Conventions
- No comments in code unless asked.
- Verify: `node --check handle_file_upload.js`
