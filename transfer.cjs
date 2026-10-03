#!/usr/bin/env node
/**
 * COMMAND: transfer
 * Zips your project (excluding node_modules & vendor) into a timestamped zip
 * and saves it to your chosen backup location.
 */



const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const readline = require('readline');


// ── Config ────────────────────────────────────────────────────────────────────
const EXCLUDED_FOLDERS = ['node_modules', 'vendor', '.git']; 
const CONFIG_FILE      = path.join(__dirname, '.transfer-config.json');
const DEFAULT_DIR      = path.join(process.env.USERPROFILE, 'Documents', 'Back Ups');
const sourceDir        = process.cwd();
// ─────────────────────────────────────────────────────────────────────────────

// Generate a timestamp string like 2026-02-27_14-30-00
function getTimestamp() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '-');
    return `${date}_${time}`;
}

// Load saved config (backup location)
function loadConfig() {
    if (fs.existsSync(CONFIG_FILE)) {
        try { return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')); }
        catch { return {}; }
    }
    return {};
}

// Save config
function saveConfig(data) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

// Simple readline prompt
function ask(rl, question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
    const config = loadConfig();

    console.log('\n================================================');
    console.log('          TRANSFER — Project Backup Tool        ');
    console.log('================================================\n');

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    // ── Ask for save location ────────────────────────────────────────────────
    const savedLocation = config.backupDir || DEFAULT_DIR;
    console.log(`  Current backup location: ${savedLocation}`);
    const changeLoc = await ask(rl, '  Change backup location? (y/N): ');

    let backupDir = savedLocation;

    if (changeLoc.trim().toLowerCase() === 'y') {
        const newLoc = await ask(rl, '  Enter new backup folder path: ');
        backupDir = newLoc.trim() || savedLocation;
        const remember = await ask(rl, '  Remember this location for next time? (Y/n): ');
        if (remember.trim().toLowerCase() !== 'n') {
            saveConfig({ ...config, backupDir });
            console.log('  Location saved!\n');
        }
    }

    rl.close();

    // ── Build zip filename with timestamp ────────────────────────────────────
    const projectName = path.basename(sourceDir);
    const timestamp   = getTimestamp();
    const zipName     = `${projectName}_Backup_${timestamp}.zip`;
    const zipPath     = path.join(backupDir, zipName);

    // Create backup dir if needed
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log(`\n  Source   : ${sourceDir}`);
    console.log(`  Output   : ${zipPath}`);
    console.log(`  Skipping : ${EXCLUDED_FOLDERS.join(', ')}`);
    console.log('\n  Packing files...\n');

    // ── Archive ───────────────────────────────────────────────────────────────
    const output  = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        const bytes = archive.pointer();
        const display = bytes >= 1048576
            ? `${(bytes / 1048576).toFixed(2)} MB`
            : `${(bytes / 1024).toFixed(1)} KB`;

        console.log('------------------------------------------------');
        console.log(`  ✔ Done! Backup created successfully.`);
        console.log(`  File : ${zipName}`);
        console.log(`  Size : ${display}`);
        console.log(`  Path : ${backupDir}`);
        console.log('------------------------------------------------\n');

        // ── List existing backups for this project ────────────────────────────
        const backups = fs.readdirSync(backupDir)
            .filter(f => f.startsWith(`${projectName}_Backup_`) && f.endsWith('.zip'))
            .sort();

        if (backups.length > 1) {
            console.log(`  Backup history for "${projectName}" (${backups.length} saved):`);
            backups.forEach((b, i) => {
                const marker = i === backups.length - 1 ? '  → ' : '    ';
                console.log(`${marker}${b}`);
            });
            console.log('');
        }
    });

    archive.on('warning', err => { if (err.code === 'ENOENT') console.warn(`  [Warning] ${err.message}`); else throw err; });
    archive.on('error',   err => { console.error(`\n  [Error] ${err.message}\n`); process.exit(1); });
    archive.on('entry',   entry => console.log(`  + ${entry.name}`));

    archive.pipe(output);
    archive.glob('**/*', {
        cwd: sourceDir,
        ignore: EXCLUDED_FOLDERS.map(f => `${f}/**`),
        dot: true
    });
    archive.finalize();
}

main();