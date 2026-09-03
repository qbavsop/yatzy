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
- [x] Wypełnienie formularza **Data Safety** w Google Play Console
- [x] Skonfigurowanie **Play App Signing** przy tworzeniu wpisu aplikacji

### Polityka prywatności

- [x] Napisana ręcznie (freeprivacypolicy.com po zaznaczeniu AdMob + innych opcji przestaje być darmowe, ~100$) — `privacy-policy.html` (EN) i `polityka-prywatnosci.html` (PL) w katalogu głównym repo, wzajemnie linkowane. Opisują realnie zbierane dane: identyfikator reklamowy/Advertising ID i dane urządzenia przez **AdMob**, historię zakupów i anonimowy identyfikator przez **RevenueCat**. Kontakt: qbavsop@gmail.com.
- [x] Repo utworzone (`https://github.com/qbavsop/yatzy`, branch `android` wypchnięty), GitHub Pages włączone i zweryfikowane — obie strony działają: `https://qbavsop.github.io/yatzy/privacy-policy.html` (EN) i `https://qbavsop.github.io/yatzy/polityka-prywatnosci.html` (PL).
- [x] URL wklejony w Google Play Console (deklaracja "Polityka prywatności" w sekcji "Zawartość aplikacji").
- [x] Link do polityki prywatności **fizycznie w samej aplikacji** (wymóg Google Play "User Data policy" / Prominent Disclosure) — zrealizowane opcją 2: przycisk "Polityka prywatności" na ekranie powitalnym otwiera `showPrivacyPolicyModal()` z treścią wyświetloną wprost w aplikacji (`PRIVACY_POLICY_HTML` w `app.js`, PL/EN), bez dodatkowego pluginu do otwierania przeglądarki.

### Data Safety (formularz w Google Play Console)

- To ankieta w Play Console wypełniana przy publikacji, **nie kod** — ok. 10-15 pytań w kreatorze, zajmuje 15-30 minut.
- Trzeba zaznaczyć zbierane kategorie danych: co najmniej "Device or other IDs" (AdMob) i "Purchase history" (RevenueCat).
- Trzeba wskazać cel zbierania (m.in. "Advertising or marketing" dla AdMob, "App functionality" dla RevenueCat) oraz potwierdzić szyfrowanie danych w tranzycie (tak — HTTPS) i możliwość zażądania usunięcia danych przez użytkownika.
- AdMob i RevenueCat mają własne publiczne dokumenty "data safety"/"data collection" opisujące dokładnie co i jak zbierają — warto się nimi podeprzeć przy wypełnianiu, żeby deklaracja była zgodna z rzeczywistością (rozbieżność między deklaracją a faktycznym zbieraniem danych to częsty powód odrzucenia/zdjęcia apki przez Google).

### Zawartość aplikacji (Play Console → Panel → "Podaj informacje o aplikacji i utwórz jej stronę")

- [x] Polityka prywatności — URL wklejony
- [x] Dane logowania — zadeklarowano że apka ma płatną zawartość (zakup "Usuń reklamy"), z instrukcją dla recenzenta jak to przetestować bez logowania
- [x] Bezpieczeństwo danych (Data Safety) — Historia zakupów (RevenueCat, nieudostępniane, funkcjonalność aplikacji) + Identyfikatory urządzenia (AdMob Advertising ID, udostępniane, reklama/marketing)
- [x] Reklamy / identyfikator wyświetlania reklam (AD_ID) — zadeklarowano "Tak", cel: cele marketingowe
- [x] Funkcje finansowe — zadeklarowano "Moja aplikacja nie zawiera żadnych funkcji finansowych" (zakup przez standardowy Google Play Billing nie liczy się jako funkcja finansowa w tym sensie)
- [x] Ocena treści (Content rating) — wypełniono
- [x] Pozostałe deklaracje (Odbiorcy docelowi, Aplikacje instytucji państwowych, Zdrowie itd.) — wypełnione

### Zasoby wizualne w Play Console

- [x] Ikona aplikacji — zmniejszona z `resources/icon.png` (1024×1024) do wymaganych 512×512, `resources/icon-512.png`
- [x] Zrzuty ekranu telefonu (4 sztuki, 1080×2414, PNG) wygenerowane bezpośrednio z działającej aplikacji na fizycznym urządzeniu — `resources/store-screenshots/1-welcome.png` … `4-gameplay.png` (ekran powitalny, wybór graczy, scorecard, wybór kości)
- [x] Grafika promocyjna (feature graphic, 1024×500) — gotowa i wgrana

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
- [x] Prawdziwy zakup "Usuń reklamy" przetestowany end-to-end na Internal Testing (Play Store install, nie `adb install`) — zakup przez Google Play Billing przeszedł, baner na scorecard poprawnie przestał się pokazywać. Po drodze znalezione i naprawione **trzy** osobne usterki:
  1. **`sw.js` `CACHE_NAME` nie był bumpowany przy ostatnich zmianach w `app.js`** — Service Worker serwował stary zcache'owany JS (ze starym kluczem testowym RevenueCat) nawet po legalnej aktualizacji z Play Store, nie tylko po `adb install -r`. Bumpowanie `CACHE_NAME` przy każdej zmianie plików z `FILES_TO_CACHE` jest krytyczne dla **wszystkich** przyszłych aktualizacji — patrz komentarz w `sw.js`.
  2. **Race condition**: `initMonetization()` (odpytanie RevenueCat o `customerInfo`) jest fire-and-forget z konstruktora, więc ekran powitalny renderuje się (z domyślnym `adsRemoved: false`) zanim odpowiedź wróci — przycisk "Remove Ads" zostawał widoczny mimo aktywnego entitlementu. Naprawione: `initMonetization()` teraz odświeża widoczność przycisku bezpośrednio po otrzymaniu odpowiedzi ([app.js](dice-game-app/app.js), `initMonetization()`).
  3. **Konflikt CSS**: `.text-link { display: block; }` w `style.css` (reguła autora) nadpisywała domyślne `[hidden] { display: none }` przeglądarki (reguła user-agenta) — atrybut `hidden` jest zawsze przegrywa z regułami autorskimi w kaskadzie CSS, niezależnie od specyficzności selektora. Naprawione: użycie `style.display = 'none'` zamiast `.hidden` (inline style ma gwarantowany najwyższy priorytet).

  Wszystko zweryfikowane wizualnie po naprawie: przycisk poprawnie znika po wykryciu zakupu. "restore purchases" (dla drugiego urządzenia/reinstalacji) niepotwierdzone osobno, ale mechanizm jest ten sam (`getCustomerInfo()` przy starcie)
- [ ] `npx cap sync android` + przebudowa APK po każdej kolejnej zmianie w `dice-game-app/` (pamiętać: `cap sync` samo nie przebudowuje `.apk`, trzeba osobno `./gradlew assembleDebug`)
- [x] Podpisany `.aab` zbudowany (`./gradlew bundleRelease`) — `android/app/build/outputs/bundle/release/app-release.aab` (9.6 MB), task `signReleaseBundle` przeszedł poprawnie kluczem upload
- [x] Wgranie `.aab` na Internal Testing track w Play Console, tester dodany (self) — do zainstalowania przez opt-in link na telefonie
- [x] Wgranie `.aab` (versionCode 6) na ścieżkę **Zamknięte testy (Alpha)** — Play Console wymaga osobnego, zawsze rosnącego `versionCode` niezależnie od Internal Testing (nie można ponownie użyć tego samego numeru). Wersja wysłana do Google w celu sprawdzenia.
- [ ] **Wymóg Google dla nowych kont deweloperskich**: min. **12 testerów** musi dołączyć do Zamkniętych testów i korzystać z apki przez ciągłe **14 dni**, zanim odblokuje się ścieżka Production. Trzeba dodać listę e-mail testerów i rozesłać link opt-in (Zamknięte testy → zakładka Testerzy).
- [ ] Po pozytywnych testach (w tym prawdziwego zakupu) i spełnieniu wymogu 12 testerów/14 dni — rollout na Production

## Poza zakresem tego brancha

Faza 2 (iOS) — patrz sekcja "Faza 2" w planie brainstormingu, wymaga osobnej decyzji o dostępie do Maca/CI.
