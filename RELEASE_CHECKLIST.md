# Checklist przed publikacją na Google Play (Faza 1 — Android)

## Placeholdery do podmiany w kodzie przed realnym wydaniem

| Co | Gdzie | Obecna wartość |
|---|---|---|
| RevenueCat API key | `dice-game-app/app.js` → `REVENUECAT_API_KEY` | ✅ podmienione na produkcyjny klucz Google Play (`goog_...`). Pełna integracja skonfigurowana end-to-end: konto serwisowe Google Cloud (`revenuecat-integration@yatzy-revenuecat.iam.gserviceaccount.com`) zaproszone w Play Console z uprawnieniami do danych finansowych i informacji o aplikacji, Google Play Android Developer API włączone, dane logowania zweryfikowane w RevenueCat, konto sprzedawcy (Google Payments) skonfigurowane, produkt `remove_ads` aktywny w Play Console, entitlement `ads_removed` + Offering/Package skonfigurowane w RevenueCat |
| AdMob banner/interstitial ad unit ID | `dice-game-app/app.js` → `ADMOB_BANNER_ID`, `ADMOB_INTERSTITIAL_ID` | ✅ podmienione na prawdziwe ID z konta AdMob |
| AdMob App ID | `android/app/src/main/AndroidManifest.xml` → `com.google.android.gms.ads.APPLICATION_ID` | ✅ podmienione na prawdziwe App ID |
| AdMob "initializeForTesting" | `dice-game-app/app.js` → `initMonetization()` | ✅ wyłączone (`AdMobPlugin.initialize({})`) — produkcyjne żądania reklam. **Uwaga:** od teraz reklamy nie będą się pokazywać przy lokalnym testowaniu na fizycznym urządzeniu, dopóki apka nie przejdzie przeglądu Google (zwykle kilka dni po pierwszym uploadzie) — to normalne, nie błąd. Do lokalnych testów przywrócić tymczasowo `{ initializeForTesting: true, testingDevices: ['8B9D0F0895C17EFE0CE9C0E75DBF4AD8'] }` (patrz komentarz w kodzie) |
| `applicationId` / package name | `capacitor.config.json`, `android/app/build.gradle`, `android/app/src/main/res/values/strings.xml` | `com.jakub.dicegame` — do potwierdzenia, czy tego chcesz używać docelowo (zmiana po opublikowaniu pierwszej wersji jest bardzo kłopotliwa) |

## Do rozważenia

- [x] Zmiana nazwy aplikacji z "Yahtzee" (zastrzeżony znak towarowy Hasbro) na **"Yatzy"** (generyczna, nietrademarkowana nazwa tej rodziny gier) — podmienione we wszystkich user-facing miejscach: `strings.xml`, `manifest.json`, `capacitor.config.json`, `index.html`, `langs/en.json` + `langs/pl.json` (w tym `category.general`/`category.general_bonus`/`joker.bonusHeading`), `app.js` (dwa hardkodowane napisy), `README.md`, `privacy-policy.html`/`polityka-prywatnosci.html`. Wewnętrzne nazwy zmiennych/funkcji w kodzie (`isYahtzeeBonus`, `pendingYahtzeeBonus` itd.) celowo zostawione bez zmian — nie są user-facing, więc nie ma ryzyka trademarkowego, a zmiana byłaby czystym refaktorem poza zakresem.
- [x] Wake lock — ekran pozostaje włączony przez cały czas działania aplikacji (Screen Wake Lock API, `dice-game-app/app.js` → `requestWakeLock()`/`initWakeLock()`, bez dodatkowej zależności natywnej; blokada odnawiana po powrocie apki na pierwszy plan)

## Konta do założenia

- [x] Konto Google Play Console (25$ jednorazowo)
- [x] Konto AdMob (darmowe, powiązane z Google) + utworzenie jednostek reklamowych banner + interstitial dla `com.jakub.dicegame`
- [x] Konto RevenueCat (darmowe do ok. 2.5k$/mies.) — pełna integracja z Google Play: klucz produkcyjny `goog_...`, produkt `remove_ads`, entitlement `ads_removed`, Offering/Package skonfigurowane

## Do zrobienia poza kodem

- [x] Utworzenie zdalnego repozytorium na GitHubie i wypchnięcie brancha — `https://github.com/qbavsop/yatzy`, branch `android` wypchnięty (`git push -u origin android`)
- [ ] Wypełnienie formularza **Data Safety** w Google Play Console
- [ ] Skonfigurowanie **Play App Signing** przy tworzeniu wpisu aplikacji

### Polityka prywatności

- [x] Napisana ręcznie (freeprivacypolicy.com po zaznaczeniu AdMob + innych opcji przestaje być darmowe, ~100$) — `privacy-policy.html` (EN) i `polityka-prywatnosci.html` (PL) w katalogu głównym repo, wzajemnie linkowane. Opisują realnie zbierane dane: identyfikator reklamowy/Advertising ID i dane urządzenia przez **AdMob**, historię zakupów i anonimowy identyfikator przez **RevenueCat**. Kontakt: qbavsop@gmail.com.
- [x] Repo utworzone (`https://github.com/qbavsop/yatzy`, branch `android` wypchnięty), GitHub Pages włączone i zweryfikowane — obie strony działają: `https://qbavsop.github.io/yatzy/privacy-policy.html` (EN) i `https://qbavsop.github.io/yatzy/polityka-prywatnosci.html` (PL).
- [ ] Gotowy URL wkleić w Google Play Console przy tworzeniu wpisu aplikacji, w polu "Privacy Policy" (pole obowiązkowe, bez niego nie da się opublikować).
- [x] Link do polityki prywatności **fizycznie w samej aplikacji** (wymóg Google Play "User Data policy" / Prominent Disclosure) — zrealizowane opcją 2: przycisk "Polityka prywatności" na ekranie powitalnym otwiera `showPrivacyPolicyModal()` z treścią wyświetloną wprost w aplikacji (`PRIVACY_POLICY_HTML` w `app.js`, PL/EN), bez dodatkowego pluginu do otwierania przeglądarki.

### Data Safety (formularz w Google Play Console)

- To ankieta w Play Console wypełniana przy publikacji, **nie kod** — ok. 10-15 pytań w kreatorze, zajmuje 15-30 minut.
- Trzeba zaznaczyć zbierane kategorie danych: co najmniej "Device or other IDs" (AdMob) i "Purchase history" (RevenueCat).
- Trzeba wskazać cel zbierania (m.in. "Advertising or marketing" dla AdMob, "App functionality" dla RevenueCat) oraz potwierdzić szyfrowanie danych w tranzycie (tak — HTTPS) i możliwość zażądania usunięcia danych przez użytkownika.
- AdMob i RevenueCat mają własne publiczne dokumenty "data safety"/"data collection" opisujące dokładnie co i jak zbierają — warto się nimi podeprzeć przy wypełnianiu, żeby deklaracja była zgodna z rzeczywistością (rozbieżność między deklaracją a faktycznym zbieraniem danych to częsty powód odrzucenia/zdjęcia apki przez Google).

### Play App Signing

- Google Play wymaga podpisanej aplikacji (`.aab`) przed publikacją. Przy pierwszym uploadzie Play Console proponuje **Play App Signing** — Google przechowuje i zarządza kluczem produkcyjnym, deweloper podpisuje tylko kluczem "upload" lokalnie.
- Rekomendacja: skorzystać z Play App Signing (opcja domyślna/sugerowana), a nie samodzielnie zarządzanego podpisywania — przy tym drugim utrata klucza oznacza **trwałą** utratę możliwości aktualizowania opublikowanej aplikacji.
- [x] Klucz upload wygenerowany ręcznie przez `keytool -genkeypair` — `android/app/yatzy-upload-key.jks`, alias `upload`, ważny do 2054. Hasło (identyczne dla store i key, wymóg formatu PKCS12) zapisane w `android/app/keystore.properties`. **Oba pliki są w `.gitignore`, nie trafiły do repo — koniecznie zrób backup obu plików poza tym komputerem (menedżer haseł/bezpieczna chmura), zanim cokolwiek się z nim stanie. Bez tego pliku nie da się nigdy więcej zaktualizować opublikowanej aplikacji przez ten sam klucz upload** (Play App Signing pozwala go zresetować przez Google, ale to wymaga formalnego procesu weryfikacji i trwa dni).
- [x] `android/app/build.gradle` skonfigurowany, żeby automatycznie podpisywać `release` buildType tym kluczem, gdy `keystore.properties` istnieje (bez błędu, gdy go nie ma — np. na innej maszynie/CI)

## Build i test

- [x] JDK 21 + Android SDK (platform 36, build-tools 36.0.0, platform-tools) zainstalowane lokalnie; `./gradlew assembleDebug` przechodzi
- [x] Instalacja i uruchomienie `app-debug.apk` na emulatorze — potwierdzone wielokrotnie w tej sesji (pełny czysty uninstall+install przez `adb`)
- [x] Pełna rozgrywka, zapis/wznowienie gry (`localStorage`), przycisk X + modal TAK/NIE — przetestowane i działa
- [x] Banner AdMob — pokazuje się tylko na ekranie Scorecard, wraca poprawnie po każdej turze, ma zarezerwowane miejsce w layoucie (nie zasłania przycisków X/Continue), lista kategorii przewija się wewnętrznie gdy trzeba
- [x] Przepływ zakupu "Usuń reklamy" — poprawnie łapie błąd braku konfiguracji (`InvalidCredentialsError`) i pokazuje czytelny alert zamiast ciszy; nie pokazuje alertu przy anulowaniu przez użytkownika
- [x] Interstitial na ekranie Wyników — potwierdzone w logach (`interstitialAdLoaded` → `showInterstitial` → `interstitialAdShowed` → `interstitialAdDismissed` po ~14s, testowa reklama wideo) po pełnym przejściu 13 rund na najnowszym buildzie
- [ ] Prawdziwy zakup "Usuń reklamy" + "restore purchases" w trybie sandbox — konfiguracja (RevenueCat, produkt w Play Console, klucz `goog_...`) już gotowa, fizyczny telefon z Google Play Billing dostępny; sam test zakupu jeszcze nieprzeprowadzony w tej sesji. Uwaga: wymaga zainstalowania apki **przez Play Store** (Internal Testing), nie przez `adb install` lokalnego builda — sideloadowany build zwykle nie ma dostępu do prawdziwego Google Play Billing
- [ ] `npx cap sync android` + przebudowa APK po każdej kolejnej zmianie w `dice-game-app/` (pamiętać: `cap sync` samo nie przebudowuje `.apk`, trzeba osobno `./gradlew assembleDebug`)
- [x] Podpisany `.aab` zbudowany (`./gradlew bundleRelease`) — `android/app/build/outputs/bundle/release/app-release.aab` (9.6 MB), task `signReleaseBundle` przeszedł poprawnie kluczem upload
- [x] Wgranie `.aab` na Internal Testing track w Play Console, tester dodany (self) — do zainstalowania przez opt-in link na telefonie
- [ ] Po pozytywnych testach (w tym prawdziwego zakupu) — rollout na Production

## Poza zakresem tego brancha

Faza 2 (iOS) — patrz sekcja "Faza 2" w planie brainstormingu, wymaga osobnej decyzji o dostępie do Maca/CI.
