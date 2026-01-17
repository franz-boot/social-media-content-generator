# Průvodce Spuštěním Aplikace (Application Launch Guide)

## ✅ Ověření Před Spuštěním

Tato aplikace je validována a připravena ke spuštění. Všechny potřebné soubory jsou přítomny a funkční.

### Automatické Ověření

Pro automatické ověření, že aplikace je připravena ke spuštění, spusťte:

```bash
node verify-app.js
```

Tento skript zkontroluje:
- ✓ Existenci všech potřebných souborů (index.html, script.js, styles.css)
- ✓ Správnou strukturu HTML
- ✓ Funkční JavaScript kód
- ✓ Platné CSS styly
- ✓ Správné propojení souborů

## 🚀 Způsoby Spuštění

### Metoda 1: Přímé Otevření v Prohlížeči

Nejjednodušší způsob pro lokální testování:

1. Najděte soubor `index.html` v adresáři projektu
2. Dvojklikem otevřete soubor ve webovém prohlížeči
3. Nebo přetáhněte soubor do okna prohlížeče

**Poznámka:** Některé funkce (jako kopírování do schránky) mohou vyžadovat HTTPS nebo localhost.

### Metoda 2: Python HTTP Server

Pokud máte nainstalovaný Python 3:

```bash
# Spusťte v kořenovém adresáři projektu
python3 -m http.server 8000
```

Poté otevřete prohlížeč na adrese: `http://localhost:8000`

### Metoda 3: Node.js HTTP Server

Pokud máte nainstalovaný Node.js:

```bash
# Instalace http-server (pouze jednou)
npm install -g http-server

# Spuštění serveru
http-server -p 8000
```

Poté otevřete prohlížeč na adrese: `http://localhost:8000`

### Metoda 4: PHP Built-in Server

Pokud máte nainstalovaný PHP:

```bash
php -S localhost:8000
```

Poté otevřete prohlížeč na adrese: `http://localhost:8000`

## 🧪 Testování Funkcionality

Po spuštění aplikace otestujte následující funkce:

### 1. Vyplnění Formuláře
- [x] Zadejte téma příspěvku
- [x] Vyberte platformu (Facebook, Instagram, Twitter/X, LinkedIn, TikTok)
- [x] Vyberte tón (Profesionální, Neformální, Přátelský, Humorný, Inspirativní)
- [x] Vyberte délku (Krátký, Střední, Dlouhý)
- [x] Volitelně přidejte klíčová slova
- [x] Volitelně přidejte další informace

### 2. Generování Obsahu
- [x] Klikněte na tlačítko "Generovat obsah"
- [x] Počkejte na zobrazení vygenerovaného obsahu (simulace 2 sekundy)
- [x] Ověřte, že se zobrazil vygenerovaný text

### 3. Kopírování Obsahu
- [x] Klikněte na tlačítko "Zkopírovat"
- [x] Ověřte zobrazení zprávy o úspěšném zkopírování
- [x] Vložte text do jiné aplikace pro ověření

### 4. Další Funkce
- [x] Klikněte na "Nový obsah" pro skrytí výsledků
- [x] Klikněte na "Vymazat formulář" pro reset formuláře
- [x] Otestujte responzivní design na mobilním zařízení

## 🌐 Požadavky na Prohlížeč

Aplikace je kompatibilní s moderními webovými prohlížeči:

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Minimální Požadavky
- JavaScript ES6+ podpora
- CSS3 Grid a Flexbox
- Clipboard API (pro kopírování do schránky)

## 📱 Mobilní Zařízení

Aplikace je plně responzivní a funguje na:
- 📱 Mobilních telefonech (portrait i landscape)
- 📱 Tabletech
- 💻 Desktop počítačích

## ⚠️ Důležité Poznámky

### Aktuální Verze (Mock)
Tato verze aplikace používá **mockované generování obsahu**. Obsah je generován lokálně bez připojení k ChatGPT API.

### Produkční Verze
V produkční verzi bude potřeba:
1. ChatGPT API klíč
2. Backend server pro bezpečné volání API
3. Správa rate limitů a error handling
4. Autentizace uživatelů (volitelně)

## 🔧 Technické Informace

### Struktura Projektu
```
/
├── index.html      # Hlavní HTML soubor
├── script.js       # JavaScript logika
├── styles.css      # CSS styly
├── verify-app.js   # Verifikační skript
└── README.md       # Dokumentace projektu
```

### Závislosti
**Žádné!** Aplikace je postavena na vanilla JavaScript, HTML a CSS bez externích závislostí.

## 🐛 Řešení Problémů

### Problém: Aplikace se nenačte
- Zkontrolujte, že jsou všechny soubory v jednom adresáři
- Spusťte `node verify-app.js` pro diagnostiku
- Zkontrolujte console v Developer Tools (F12)

### Problém: Kopírování nefunguje
- Používejte HTTPS nebo localhost (ne file://)
- Povolte clipboard přístup v nastavení prohlížeče
- Zkuste jiný prohlížeč

### Problém: Formulář se neodesílá
- Zkontrolujte, že jsou vyplněna všechna povinná pole
- Otevřete Console (F12) a zkontrolujte chybové hlášky
- Obnovte stránku a zkuste znovu

## 📞 Podpora

Pro hlášení problémů nebo dotazy:
1. Otevřete issue na GitHubu
2. Uveďte verzi prohlížeče a OS
3. Přiložte screenshot a chybovou hlášku z Console

## ✨ Další Kroky

Po ověření, že aplikace funguje správně:
1. Přizpůsobte design dle svých potřeb
2. Integrujte skutečné ChatGPT API
3. Přidejte backend pro správu API klíčů
4. Nasaďte na web hosting (GitHub Pages, Netlify, Vercel, atd.)

---

**Status:** ✅ Aplikace je ověřena a připravena ke spuštění  
**Verze:** 1.0 (Mock)  
**Datum Ověření:** 2026-01-02
