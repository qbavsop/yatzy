# Checklist przed publikacją na Google Play (Faza 1 — Android)

## Placeholdery do podmiany w kodzie przed realnym wydaniem

| Co | Gdzie | Obecna wartość |
|---|---|---|
| RevenueCat API key | `dice-game-app/app.js` → `REVENUECAT_API_KEY` | ⚠️ ustawiony, ale to klucz **Test Store** (`test_...`) — działa tylko na wirtualnym sklepie testowym RevenueCat, nie na realnych zakupach z Google Play. Przed publikacją: podpiąć w RevenueCat prawdziwą integrację z Google Play (wymaga karty) i podmienić na klucz `goog_...` |
| AdMob banner/interstitial ad unit ID | `dice-game-app/app.js` → `ADMOB_BANNER_ID`, `ADMOB_INTERSTITIAL_ID` | ✅ podmienione na prawdziwe ID z konta AdMob |
| AdMob App ID | `android/app/src/main/AndroidManifest.xml` → `com.google.android.gms.ads.APPLICATION_ID` | ✅ podmienione na prawdziwe App ID |
| AdMob "initializeForTesting" | `dice-game-app/app.js` → `initMonetization()` | **⚠️ nadal `true`** — z realnymi ID reklamowymi oznacza to, że *każde* żądanie reklamy jest oznaczone jako testowe (bezpieczne teraz podczas testów, ale bez wyłączenia tego przed publikacją apka nigdy nie zarobi na realnych reklamach) |
| `applicationId` / package name | `capacitor.config.json`, `android/app/build.gradle`, `android/app/src/main/res/values/strings.xml` | `com.jakub.dicegame` — do potwierdzenia, czy tego chcesz używać docelowo (zmiana po opublikowaniu pierwszej wersji jest bardzo kłopotliwa) |

## Do rozważenia

- [x] Zmiana nazwy aplikacji z "Yahtzee" (zastrzeżony znak towarowy Hasbro) na **"Yatzy"** (generyczna, nietrademarkowana nazwa tej rodziny gier) — podmienione we wszystkich user-facing miejscach: `strings.xml`, `manifest.json`, `capacitor.config.json`, `index.html`, `langs/en.json` + `langs/pl.json` (w tym `category.general`/`category.general_bonus`/`joker.bonusHeading`), `app.js` (dwa hardkodowane napisy), `README.md`, `privacy-policy.html`/`polityka-prywatnosci.html`. Wewnętrzne nazwy zmiennych/funkcji w kodzie (`isYahtzeeBonus`, `pendingYahtzeeBonus` itd.) celowo zostawione bez zmian — nie są user-facing, więc nie ma ryzyka trademarkowego, a zmiana byłaby czystym refaktorem poza zakresem.
- [x] Wake lock — ekran pozostaje włączony przez cały czas działania aplikacji (Screen Wake Lock API, `dice-game-app/app.js` → `requestWakeLock()`/`initWakeLock()`, bez dodatkowej zależności natywnej; blokada odnawiana po powrocie apki na pierwszy plan)

## Konta do założenia

- [x] Konto Google Play Console (25$ jednorazowo)
- [x] Konto AdMob (darmowe, powiązane z Google) + utworzenie jednostek reklamowych banner + interstitial dla `com.jakub.dicegame`
- [x] Konto RevenueCat (darmowe do ok. 2.5k$/mies.) — SDK key wpięty, na razie tylko **Test Store** (bez podpiętej karty). Do zrobienia później: dodać kartę, podpiąć prawdziwy Google Play + produkt non-consumable `remove_ads`, zamienić klucz na `goog_...`

## Do zrobienia poza kodem

- [ ] Utworzenie zdalnego repozytorium na GitHubie i wypchnięcie brancha (wymaga Twojej zgody — repo dziś jest czysto lokalne). Potrzebne wyłącznie pod hosting polityki prywatności (patrz niżej) — apka już nie linkuje do `rules.md`, więc to jedyny powód, dla którego GitHub Pages jest nadal potrzebny.
- [ ] Wypełnienie formularza **Data Safety** w Google Play Console
- [ ] Skonfigurowanie **Play App Signing** przy tworzeniu wpisu aplikacji

### Polityka prywatności

- [x] Napisana ręcznie (freeprivacypolicy.com po zaznaczeniu AdMob + innych opcji przestaje być darmowe, ~100$) — `privacy-policy.html` (EN) i `polityka-prywatnosci.html` (PL) w katalogu głównym repo, wzajemnie linkowane. Opisują realnie zbierane dane: identyfikator reklamowy/Advertising ID i dane urządzenia przez **AdMob**, historię zakupów i anonimowy identyfikator przez **RevenueCat**. Kontakt: qbavsop@gmail.com.
- Hosting: GitHub Pages jest najprostszą opcją (statyczny plik w repo, Pages włączone jednym kliknięciem w ustawieniach repo) — wymaga wcześniej utworzenia zdalnego repozytorium na GitHubie (patrz wyżej). Po włączeniu Pages URL do wklejenia w Play Console to `https://<user>.github.io/<repo>/privacy-policy.html`.
- Gotowy URL wkleja się w Google Play Console przy tworzeniu wpisu aplikacji, w polu "Privacy Policy" (pole obowiązkowe, bez niego nie da się opublikować).
- **Uwaga:** Polityka Google Play ("User Data policy" / Prominent Disclosure) wymaga linku do polityki prywatności **też fizycznie w samej aplikacji** (zwykle w menu/ustawieniach), nie tylko w opisie w Play Console. To koliduje z tym, że właśnie usunęliśmy link "Zasady gry" i cały `@capacitor/browser` do otwierania zewnętrznych stron. Do wyboru, gdy polityka będzie już napisana i hostowana:
  1. Przywrócić minimalny link + otwieranie w przeglądarce (analogicznie do usuniętego mechanizmu "Zasady gry", z powrotem `@capacitor/browser`), albo
  2. Wyświetlić treść polityki prywatności bezpośrednio w aplikacji (nowy prosty ekran/modal z tekstem, bez dodatkowego pluginu).

### Data Safety (formularz w Google Play Console)

- To ankieta w Play Console wypełniana przy publikacji, **nie kod** — ok. 10-15 pytań w kreatorze, zajmuje 15-30 minut.
- Trzeba zaznaczyć zbierane kategorie danych: co najmniej "Device or other IDs" (AdMob) i "Purchase history" (RevenueCat).
- Trzeba wskazać cel zbierania (m.in. "Advertising or marketing" dla AdMob, "App functionality" dla RevenueCat) oraz potwierdzić szyfrowanie danych w tranzycie (tak — HTTPS) i możliwość zażądania usunięcia danych przez użytkownika.
- AdMob i RevenueCat mają własne publiczne dokumenty "data safety"/"data collection" opisujące dokładnie co i jak zbierają — warto się nimi podeprzeć przy wypełnianiu, żeby deklaracja była zgodna z rzeczywistością (rozbieżność między deklaracją a faktycznym zbieraniem danych to częsty powód odrzucenia/zdjęcia apki przez Google).

### Play App Signing

- Google Play wymaga podpisanej aplikacji (`.aab`) przed publikacją. Przy pierwszym uploadzie Play Console proponuje **Play App Signing** — Google przechowuje i zarządza kluczem produkcyjnym, deweloper podpisuje tylko kluczem "upload" lokalnie.
- Rekomendacja: skorzystać z Play App Signing (opcja domyślna/sugerowana), a nie samodzielnie zarządzanego podpisywania — przy tym drugim utrata klucza oznacza **trwałą** utratę możliwości aktualizowania opublikowanej aplikacji.
- Klucz upload generuje się przez Android Studio (Build → Generate Signed Bundle/APK → New key store) albo ręcznie `keytool -genkeypair`. Plik keystore **nie powinien trafić do repozytorium** (dodać do `.gitignore`, przechowywać osobno, np. w menedżerze haseł/bezpiecznym backupie).

## Build i test

- [x] JDK 21 + Android SDK (platform 36, build-tools 36.0.0, platform-tools) zainstalowane lokalnie; `./gradlew assembleDebug` przechodzi
- [x] Instalacja i uruchomienie `app-debug.apk` na emulatorze — potwierdzone wielokrotnie w tej sesji (pełny czysty uninstall+install przez `adb`)
- [x] Pełna rozgrywka, zapis/wznowienie gry (`localStorage`), przycisk X + modal TAK/NIE — przetestowane i działa
- [x] Banner AdMob — pokazuje się tylko na ekranie Scorecard, wraca poprawnie po każdej turze, ma zarezerwowane miejsce w layoucie (nie zasłania przycisków X/Continue), lista kategorii przewija się wewnętrznie gdy trzeba
- [x] Przepływ zakupu "Usuń reklamy" — poprawnie łapie błąd braku konfiguracji (`InvalidCredentialsError`) i pokazuje czytelny alert zamiast ciszy; nie pokazuje alertu przy anulowaniu przez użytkownika
- [x] Interstitial na ekranie Wyników — potwierdzone w logach (`interstitialAdLoaded` → `showInterstitial` → `interstitialAdShowed` → `interstitialAdDismissed` po ~14s, testowa reklama wideo) po pełnym przejściu 13 rund na najnowszym buildzie
- [ ] Prawdziwy zakup "Usuń reklamy" + "restore purchases" w trybie sandbox RevenueCat — niemożliwe do przetestowania bez konta RevenueCat, produktu w Play Console i urządzenia ze wsparciem Google Play Billing (obecny emulator go nie ma)
- [ ] `npx cap sync android` + przebudowa APK po każdej kolejnej zmianie w `dice-game-app/` (pamiętać: `cap sync` samo nie przebudowuje `.apk`, trzeba osobno `./gradlew assembleDebug`)
- [ ] Dopiero po pozytywnych testach z prawdziwą konfiguracją: build podpisanego `.aab`, wgranie na Internal Testing track, a następnie Production

## Poza zakresem tego brancha

Faza 2 (iOS) — patrz sekcja "Faza 2" w planie brainstormingu, wymaga osobnej decyzji o dostępie do Maca/CI.
