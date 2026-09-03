// Main application logic

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

const SAVE_STORAGE_KEY = 'diceGameApp.savedGame';

const ADMOB_BANNER_ID = 'ca-app-pub-3700031909511327/1880025006';
const ADMOB_INTERSTITIAL_ID = 'ca-app-pub-3700031909511327/7268083055';
// Typical ADAPTIVE_BANNER height (dp) on phone-width screens - used to reserve layout space
// immediately in showBannerAd(), before the real size is known via SizeChanged. See
// reserveBannerSpace() for why this matters (accidental-click / AdMob placement policy).
const ESTIMATED_BANNER_HEIGHT = 60;
const REVENUECAT_API_KEY = 'goog_TfldpvVMmvFkRsRCDXRabLDpzRK';
const ADS_REMOVED_ENTITLEMENT = 'ads_removed';

// Same content as /privacy-policy.html and /polityka-prywatnosci.html hosted on GitHub Pages,
// shown in-app to satisfy Google Play's "Prominent Disclosure" requirement (link must also live in the app itself).
const PRIVACY_POLICY_HTML = {
    en: `
        <h3>Data collected by third-party services</h3>
        <p><strong>Google AdMob</strong> (advertising) may collect your device's advertising identifier (Advertising ID) and other device/usage data to serve and measure banner and interstitial ads, including personalized ads where permitted.</p>
        <p><strong>RevenueCat</strong> (in-app purchases) collects your purchase history and an anonymous app-specific user identifier to manage the optional "Remove Ads" purchase and restore it across devices.</p>
        <h3>Why we collect this data</h3>
        <ul>
            <li>Advertising ID / device data (AdMob): to display and measure in-app advertising.</li>
            <li>Purchase history / anonymous ID (RevenueCat): to unlock and restore the "Remove Ads" purchase you paid for.</li>
        </ul>
        <h3>Data sharing &amp; security</h3>
        <p>This data is shared only with Google AdMob and RevenueCat, strictly to provide the functionality above. We do not sell your data. All data is encrypted in transit (HTTPS/TLS).</p>
        <h3>Your choices</h3>
        <ul>
            <li>Limit ad personalization or reset your Advertising ID in Android Settings → Privacy → Ads.</li>
            <li>Purchase "Remove Ads" to stop ads (and AdMob's ad-related data collection) entirely.</li>
            <li>Request deletion of data held by AdMob or RevenueCat by contacting us below.</li>
        </ul>
        <h3>Contact</h3>
        <p>Questions about this policy? Contact us at <a href="mailto:qbavsop@gmail.com">qbavsop@gmail.com</a>.</p>
    `,
    pl: `
        <h3>Dane zbierane przez usługi zewnętrzne</h3>
        <p><strong>Google AdMob</strong> (reklamy) może zbierać identyfikator reklamowy urządzenia (Advertising ID) i inne dane urządzenia/użycia, aby wyświetlać i mierzyć skuteczność reklam banerowych i pełnoekranowych, w tym reklam spersonalizowanych, o ile na to pozwolisz.</p>
        <p><strong>RevenueCat</strong> (zakupy w aplikacji) zbiera historię zakupów i anonimowy identyfikator użytkownika, aby obsłużyć opcjonalny zakup "Usuń reklamy" i przywrócić go na innych urządzeniach.</p>
        <h3>Dlaczego zbieramy te dane</h3>
        <ul>
            <li>Identyfikator reklamowy / dane urządzenia (AdMob): do wyświetlania i pomiaru reklam.</li>
            <li>Historia zakupów / anonimowy identyfikator (RevenueCat): do odblokowania i przywrócenia zakupu "Usuń reklamy".</li>
        </ul>
        <h3>Udostępnianie danych i bezpieczeństwo</h3>
        <p>Dane te są udostępniane wyłącznie Google AdMob i RevenueCat, tylko w celu zapewnienia powyższych funkcji. Nie sprzedajemy Twoich danych. Wszystkie dane są szyfrowane w tranzycie (HTTPS/TLS).</p>
        <h3>Twój wybór</h3>
        <ul>
            <li>Ogranicz personalizację reklam lub zresetuj Advertising ID w Ustawieniach Androida → Prywatność → Reklamy.</li>
            <li>Zakup "Usuń reklamy", aby całkowicie wyłączyć reklamy (i związane z nimi zbieranie danych przez AdMob).</li>
            <li>Zażądaj usunięcia danych przechowywanych przez AdMob lub RevenueCat, kontaktując się z nami poniżej.</li>
        </ul>
        <h3>Kontakt</h3>
        <p>Pytania dotyczące tej polityki? Napisz do nas na adres <a href="mailto:qbavsop@gmail.com">qbavsop@gmail.com</a>.</p>
    `,
    de: `
        <h3>Von Drittanbieterdiensten erfasste Daten</h3>
        <p><strong>Google AdMob</strong> (Werbung) kann die Werbe-ID deines Geräts (Advertising ID) sowie weitere Geräte-/Nutzungsdaten erfassen, um Banner- und Vollbildanzeigen anzuzeigen und zu messen, einschließlich personalisierter Anzeigen, sofern zulässig.</p>
        <p><strong>RevenueCat</strong> (In-App-Käufe) erfasst deinen Kaufverlauf und eine anonyme, app-spezifische Nutzer-ID, um den optionalen Kauf "Werbung entfernen" zu verwalten und geräteübergreifend wiederherzustellen.</p>
        <h3>Warum wir diese Daten erfassen</h3>
        <ul>
            <li>Werbe-ID / Gerätedaten (AdMob): zur Anzeige und Messung von In-App-Werbung.</li>
            <li>Kaufverlauf / anonyme ID (RevenueCat): zum Freischalten und Wiederherstellen des bezahlten Kaufs "Werbung entfernen".</li>
        </ul>
        <h3>Datenweitergabe &amp; Sicherheit</h3>
        <p>Diese Daten werden ausschließlich mit Google AdMob und RevenueCat geteilt, allein zur Bereitstellung der oben genannten Funktionen. Wir verkaufen deine Daten nicht. Alle Daten werden bei der Übertragung verschlüsselt (HTTPS/TLS).</p>
        <h3>Deine Wahlmöglichkeiten</h3>
        <ul>
            <li>Beschränke die Anzeigenpersonalisierung oder setze deine Werbe-ID zurück unter Android-Einstellungen → Datenschutz → Werbung.</li>
            <li>Kaufe "Werbung entfernen", um Werbung (und die damit verbundene Datenerfassung durch AdMob) vollständig zu deaktivieren.</li>
            <li>Fordere die Löschung der bei AdMob oder RevenueCat gespeicherten Daten an, indem du uns unten kontaktierst.</li>
        </ul>
        <h3>Kontakt</h3>
        <p>Fragen zu dieser Richtlinie? Kontaktiere uns unter <a href="mailto:qbavsop@gmail.com">qbavsop@gmail.com</a>.</p>
    `,
    es: `
        <h3>Datos recopilados por servicios de terceros</h3>
        <p><strong>Google AdMob</strong> (publicidad) puede recopilar el identificador de publicidad de tu dispositivo (Advertising ID) y otros datos de dispositivo/uso para mostrar y medir anuncios de banner y de pantalla completa, incluidos anuncios personalizados cuando esté permitido.</p>
        <p><strong>RevenueCat</strong> (compras dentro de la aplicación) recopila tu historial de compras y un identificador de usuario anónimo específico de la aplicación para gestionar la compra opcional "Quitar anuncios" y restaurarla en otros dispositivos.</p>
        <h3>Por qué recopilamos estos datos</h3>
        <ul>
            <li>Advertising ID / datos del dispositivo (AdMob): para mostrar y medir la publicidad dentro de la aplicación.</li>
            <li>Historial de compras / ID anónimo (RevenueCat): para desbloquear y restaurar la compra "Quitar anuncios" que pagaste.</li>
        </ul>
        <h3>Uso compartido de datos y seguridad</h3>
        <p>Estos datos se comparten únicamente con Google AdMob y RevenueCat, exclusivamente para proporcionar las funciones anteriores. No vendemos tus datos. Todos los datos se cifran en tránsito (HTTPS/TLS).</p>
        <h3>Tus opciones</h3>
        <ul>
            <li>Limita la personalización de anuncios o restablece tu Advertising ID en Ajustes de Android → Privacidad → Anuncios.</li>
            <li>Compra "Quitar anuncios" para detener los anuncios (y la recopilación de datos relacionada de AdMob) por completo.</li>
            <li>Solicita la eliminación de los datos que posean AdMob o RevenueCat contactándonos a continuación.</li>
        </ul>
        <h3>Contacto</h3>
        <p>¿Preguntas sobre esta política? Contáctanos en <a href="mailto:qbavsop@gmail.com">qbavsop@gmail.com</a>.</p>
    `
};

// @capacitor-community/admob's published bundle exposes its global as "capacitorStripe"
// (a leftover from the template it was generated from) rather than an admob-related name.
const AdMobPlugin = capacitorStripe.AdMob;

class DiceGameApp {
    constructor() {
        this.appContainer = document.getElementById('app');

        // Game state
        this.gameState = {
            players: [],
            currentPlayerIndex: 0,
            currentRound: 1,
            gameFinished: false,
            pendingYahtzeeBonus: null,
            adsRemoved: false,
            // Default-deny until initMonetization's UMP consent check resolves (fast for
            // non-EEA users, gated on an actual user choice for EEA/UK/CH).
            canRequestAds: false,
            privacyOptionsRequired: false
        };

        this.wakeLock = null;

        this.init();
        this.initMonetization();
        this.initWakeLock();
    }

    init() {
        this.showWelcomeScreen();
    }

    // Keep the screen on for the whole session - players look away from the phone
    // (rolling dice, waiting for their turn) often enough that it would otherwise time out.
    async requestWakeLock() {
        if (!('wakeLock' in navigator)) return;
        try {
            this.wakeLock = await navigator.wakeLock.request('screen');
        } catch (e) {
            console.warn('requestWakeLock failed:', e);
        }
    }

    initWakeLock() {
        this.requestWakeLock();
        // The OS releases the wake lock whenever the app leaves the foreground
        // (screen off, app switch), so it must be re-requested on return.
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.requestWakeLock();
            }
        });
    }

    // AdMob/RevenueCat only run on native builds; no-op in a plain browser
    async initMonetization() {
        if (!capacitorExports.Capacitor.isNativePlatform()) return;

        try {
            // Production: real ad requests, no forced test mode. During dev this was
            // { initializeForTesting: true, testingDevices: ['8B9D0F0895C17EFE0CE9C0E75DBF4AD8'] }
            // to reliably get test creatives instead of ERROR_CODE_NO_FILL - restore that
            // locally if testing on a physical device again before real ad traffic ramps up.
            await AdMobPlugin.initialize({});

            AdMobPlugin.addListener(capacitorStripe.BannerAdPluginEvents.SizeChanged, (info) => {
                this.reserveBannerSpace(info.height);
            });
        } catch (e) {
            console.warn('initMonetization (AdMob) failed:', e);
        }

        // Separate try/catch: a consent-flow failure (e.g. no message configured yet in the
        // AdMob console under Privacy & messaging) must not skip banner listener setup above.
        // gameState.canRequestAds stays at its default (false) on any failure here - fail closed,
        // since GDPR requires treating "consent status unknown" as "consent not given".
        try {
            let consentInfo = await AdMobPlugin.requestConsentInfo();
            if (consentInfo.isConsentFormAvailable && consentInfo.status === capacitorStripe.AdmobConsentStatus.REQUIRED) {
                consentInfo = await AdMobPlugin.showConsentForm();
            }
            this.gameState.canRequestAds = consentInfo.canRequestAds;
            // PrivacyOptionsRequirementStatus (unlike AdmobConsentStatus) isn't exported by this
            // plugin build's bundle, so compare against the raw string value instead.
            this.gameState.privacyOptionsRequired = consentInfo.privacyOptionsRequirementStatus === 'REQUIRED';
            const privacyOptionsBtn = this.appContainer.querySelector('#welcome-privacy-options');
            if (privacyOptionsBtn) {
                privacyOptionsBtn.style.display = this.gameState.privacyOptionsRequired ? '' : 'none';
            }
        } catch (e) {
            console.warn('initMonetization (AdMob consent) failed:', e);
        }

        try {
            await purchasesCapacitor.Purchases.configure({ apiKey: REVENUECAT_API_KEY });
            const { customerInfo } = await purchasesCapacitor.Purchases.getCustomerInfo();
            this.gameState.adsRemoved = !!customerInfo.entitlements.active[ADS_REMOVED_ENTITLEMENT];
            // initMonetization() is fire-and-forget from the constructor, so the welcome screen
            // has usually already rendered (with adsRemoved still at its default false) by the
            // time this resolves. Refresh the button directly if it's still on screen.
            const removeAdsBtn = this.appContainer.querySelector('#welcome-remove-ads');
            if (removeAdsBtn) {
                // .hidden alone doesn't work here: .text-link's `display: block` (style.css) is an
                // author-stylesheet rule, which beats the UA stylesheet's `[hidden] { display: none }`
                // in the cascade regardless of selector specificity. Setting the inline style directly
                // always wins.
                removeAdsBtn.style.display = this.gameState.adsRemoved ? 'none' : '';
            }
        } catch (e) {
            console.warn('initMonetization (RevenueCat) failed:', e);
        }
    }

    // @capacitor-community/admob double-counts the bottom system-bar inset on Android 15+
    // (it re-subtracts the nav bar height even though our WebView already stops above it),
    // so the banner floats well higher than height alone would suggest. Reserve extra
    // buffer room so page content/buttons never end up underneath the ad.
    reserveBannerSpace(height) {
        const navBarBuffer = height > 0 ? 44 : 0;
        this.appContainer.style.paddingBottom = height > 0
            ? 'calc(1rem + ' + (height + 16 + navBarBuffer) + 'px)'
            : 'calc(1rem + 16px)';
    }

    async showBannerAd() {
        if (!capacitorExports.Capacitor.isNativePlatform() || this.gameState.adsRemoved || !this.gameState.canRequestAds) return;
        // Reserve an estimated amount of space up front, before the banner has actually loaded,
        // instead of waiting for the SizeChanged listener to react after the fact - that reactive-only
        // update was letting "Next"/buttons visibly jump up right as the ad slid in underneath them
        // (accidental-click risk, against AdMob ad placement policy). SizeChanged still fires once the
        // real ad loads and corrects this to the exact height, but the correction is now small instead
        // of a full empty-to-reserved jump.
        this.reserveBannerSpace(ESTIMATED_BANNER_HEIGHT);
        try {
            await AdMobPlugin.showBanner({
                adId: ADMOB_BANNER_ID,
                adSize: capacitorStripe.BannerAdSize.ADAPTIVE_BANNER,
                position: capacitorStripe.BannerAdPosition.BOTTOM_CENTER
            });
        } catch (e) {
            console.warn('showBannerAd failed:', e);
            this.appContainer.style.paddingBottom = '';
        }
    }

    async hideBannerAd() {
        if (!capacitorExports.Capacitor.isNativePlatform()) return;
        try {
            await AdMobPlugin.removeBanner();
            this.appContainer.style.paddingBottom = '';
        } catch (e) {
            console.warn('hideBannerAd failed:', e);
        }
    }

    async showInterstitialAd() {
        if (!capacitorExports.Capacitor.isNativePlatform() || this.gameState.adsRemoved || !this.gameState.canRequestAds) return;
        try {
            await AdMobPlugin.prepareInterstitial({ adId: ADMOB_INTERSTITIAL_ID });
            await AdMobPlugin.showInterstitial();
        } catch (e) {
            console.warn('showInterstitialAd failed:', e);
        }
    }

    async purchaseRemoveAds() {
        if (!capacitorExports.Capacitor.isNativePlatform()) {
            alert(i18n.t('monetization.nativeOnly'));
            return;
        }
        try {
            const offerings = await purchasesCapacitor.Purchases.getOfferings();
            const pkg = offerings.current && offerings.current.availablePackages[0];
            if (!pkg) {
                alert(i18n.t('monetization.noOffering'));
                return;
            }
            const { customerInfo } = await purchasesCapacitor.Purchases.purchasePackage({ aPackage: pkg });
            this.gameState.adsRemoved = !!customerInfo.entitlements.active[ADS_REMOVED_ENTITLEMENT];
            if (this.gameState.adsRemoved) {
                await this.hideBannerAd();
            }
        } catch (e) {
            console.warn('purchaseRemoveAds failed:', e);
            if (!e || !e.userCancelled) {
                alert(i18n.t('monetization.purchaseFailed'));
            }
        }
    }

    // Persist just enough state to resume a game after a reload
    saveGame() {
        try {
            const data = {
                version: 1,
                players: this.gameState.players,
                currentPlayerIndex: this.gameState.currentPlayerIndex,
                currentRound: this.gameState.currentRound
            };
            localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('saveGame failed:', e);
        }
    }

    loadSavedGame() {
        try {
            const raw = localStorage.getItem(SAVE_STORAGE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !Array.isArray(data.players) || data.players.length === 0
                || typeof data.currentPlayerIndex !== 'number'
                || typeof data.currentRound !== 'number') {
                return null;
            }
            return data;
        } catch (e) {
            return null;
        }
    }

    clearSavedGame() {
        localStorage.removeItem(SAVE_STORAGE_KEY);
    }

    // Advance to the next player/round, persist progress, then continue or show results
    advanceTurnAndContinue() {
        this.gameState.currentPlayerIndex++;
        if (this.gameState.currentPlayerIndex >= this.gameState.players.length) {
            this.gameState.currentPlayerIndex = 0;
            this.gameState.currentRound++;
        }
        this.saveGame();

        if (this.gameState.currentRound > 13) {
            this.showResultsScreen();
            return;
        }

        this.showPlayerSplash(() => this.showScorecardScreen());
    }

    // new splash sequence before showing scorecard
    showPlayerSplash(nextScreen) {
        const template = document.getElementById('screen-splash');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        // translate static bits (if any)
        translateContainer(this.appContainer);

        const player = this.gameState.players[this.gameState.currentPlayerIndex];
        this.appContainer.querySelector('#splash-player-name').textContent = player.name;

        const progress = this.appContainer.querySelector('#splash-timer-progress');
        let elapsed = 0;
        const duration = 2000;
        const interval = 50;
        progress.style.width = '0%';
        const timer = setInterval(() => {
            elapsed += interval;
            const pct = Math.min(100, (elapsed / duration) * 100);
            progress.style.width = pct + '%';
            if (elapsed >= duration) {
                clearInterval(timer);
                nextScreen();
            }
        }, interval);
    }

    // ensure dropdown is present on every screen, and always wired up
    ensureLangSelector() {
        // create the selector only if this screen doesn't already have one (e.g. welcome)
        if (!document.getElementById('language-selector')) {
            const container = document.createElement('div');
            container.className = 'language-selector-container';
            container.innerHTML = `
                <select id="language-selector" class="language-selector">
                    <option value="en" data-i18n="language.english">English</option>
                    <option value="pl" data-i18n="language.polish">Polski</option>
                    <option value="de" data-i18n="language.german">Deutsch</option>
                    <option value="es" data-i18n="language.spanish">Español</option>
                </select>
            `;
            this.appContainer.insertBefore(container, this.appContainer.firstChild);
            translateContainer(container);
        }

        // always (re)wire the listener - the template's own selector never gets one otherwise
        const sel = document.getElementById('language-selector');
        if (sel) {
            sel.value = i18n.current;
            sel.addEventListener('change', async (e) => {
                localStorage.setItem('lang', e.target.value);
                await i18n.load(e.target.value);
                location.reload();
            });
        }
    }

    // Quit-to-menu confirmation modal, reused by all in-round screens
    showQuitConfirmModal() {
        if (document.getElementById('quit-confirm-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'quit-confirm-overlay';
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-dialog">
                <p class="modal-message" data-i18n="quit.confirmMessage">Are you sure you want to quit the game?</p>
                <div class="modal-actions">
                    <button id="quit-confirm-no" class="btn-secondary" data-i18n="quit.confirmNo">No</button>
                    <button id="quit-confirm-yes" class="btn-primary" data-i18n="quit.confirmYes">Yes</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        translateContainer(overlay);

        const closeModal = () => overlay.remove();

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        overlay.querySelector('#quit-confirm-no').addEventListener('click', closeModal);
        overlay.querySelector('#quit-confirm-yes').addEventListener('click', () => {
            this.saveGame();
            this.hideBannerAd();
            closeModal();
            this.showWelcomeScreen();
        });
    }

    // Privacy policy modal, opened from the welcome screen
    showPrivacyPolicyModal() {
        if (document.getElementById('privacy-policy-overlay')) return;

        const lang = PRIVACY_POLICY_HTML[i18n.current] ? i18n.current : 'en';
        const overlay = document.createElement('div');
        overlay.id = 'privacy-policy-overlay';
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-dialog modal-dialog--privacy">
                <div class="privacy-content">${PRIVACY_POLICY_HTML[lang]}</div>
                <div class="modal-actions">
                    <button id="privacy-policy-close" class="btn-primary" data-i18n="privacy.close">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        translateContainer(overlay);

        const closeModal = () => overlay.remove();
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        overlay.querySelector('#privacy-policy-close').addEventListener('click', closeModal);
    }

    // Screen: Welcome
    showWelcomeScreen() {
        const template = document.getElementById('screen-welcome');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        // translate static text
        translateContainer(this.appContainer);
        // show selector only on welcome screen; other screens omit
        this.ensureLangSelector();

        this.appContainer.querySelector('#welcome-start').addEventListener('click', () => {
            this.showPlayerSetupScreen();
        });

        const continueBtn = this.appContainer.querySelector('#welcome-continue');
        const savedGame = this.loadSavedGame();
        if (savedGame) {
            continueBtn.hidden = false;
            continueBtn.addEventListener('click', () => {
                this.gameState.players = savedGame.players;
                this.gameState.currentPlayerIndex = savedGame.currentPlayerIndex;
                this.gameState.currentRound = savedGame.currentRound;
                this.gameState.gameFinished = false;
                this.gameState.pendingYahtzeeBonus = null;
                this.showPlayerSplash(() => this.showScorecardScreen());
            });
        }

        const removeAdsBtn = this.appContainer.querySelector('#welcome-remove-ads');
        removeAdsBtn.style.display = this.gameState.adsRemoved ? 'none' : '';
        removeAdsBtn.addEventListener('click', async () => {
            await this.purchaseRemoveAds();
            removeAdsBtn.style.display = this.gameState.adsRemoved ? 'none' : '';
        });

        this.appContainer.querySelector('#welcome-privacy-policy').addEventListener('click', () => {
            this.showPrivacyPolicyModal();
        });

        const privacyOptionsBtn = this.appContainer.querySelector('#welcome-privacy-options');
        privacyOptionsBtn.style.display = this.gameState.privacyOptionsRequired ? '' : 'none';
        privacyOptionsBtn.addEventListener('click', async () => {
            try {
                await AdMobPlugin.showPrivacyOptionsForm();
            } catch (e) {
                console.warn('showPrivacyOptionsForm failed:', e);
            }
        });
    }

    // Screen: Player Setup (merged count + names)
    showPlayerSetupScreen() {
        const template = document.getElementById('screen-player-setup');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        // translate text on player setup screen
        translateContainer(this.appContainer);

        // Elements
        const playerBtns = this.appContainer.querySelectorAll('.player-btn');
        const playerInputsContainer = this.appContainer.querySelector('#player-inputs');
        const startBtn = this.appContainer.querySelector('#start-game');

        // Default: select 2 players
        playerBtns.forEach(b => b.classList.remove('active'));
        const defaultBtn = Array.from(playerBtns).find(b => b.dataset.players === '2');
        if (defaultBtn) defaultBtn.classList.add('active');

        // Initialize gameState players to 2 default names
        const defaultCount = 2;
        this.gameState.players = Array(defaultCount).fill(null).map((_, i) => ({
            name: i18n.t('playerSetup.defaultName', { number: i + 1 }),
            scores: {}
        }));

        // Render name inputs for current selection
        const renderNameInputs = (count) => {
            playerInputsContainer.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const group = document.createElement('div');
                group.className = 'player-input-group';
                const labelText = i18n.t('playerSetup.playerNameLabel', { index: i + 1 });
                const defaultName = this.gameState.players[i] ? this.gameState.players[i].name : i18n.t('playerSetup.defaultName', { number: i + 1 });
                group.innerHTML = `
                    <label>${labelText}</label>
                    <input type="text" placeholder="${i18n.t('playerSetup.enterName')}" value="${escapeHtml(defaultName)}" data-player-index="${i}">
                `;
                playerInputsContainer.appendChild(group);
            }

            const inputs = this.appContainer.querySelectorAll('[data-player-index]');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    const idx = parseInt(e.target.dataset.playerIndex);
                    this.gameState.players[idx].name = e.target.value;
                    this.updateContinueButton(startBtn, inputs);
                });
            });

            // Initial check
            this.updateContinueButton(startBtn, this.appContainer.querySelectorAll('[data-player-index]'));
        };

        // initial render for 2 players
        renderNameInputs(defaultCount);

        // Buttons behavior
        playerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                playerBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const count = parseInt(e.target.dataset.players);

                // adjust gameState players array
                const newPlayers = Array(count).fill(null).map((_, i) => ({
                    name: (this.gameState.players[i] && this.gameState.players[i].name) ? this.gameState.players[i].name : i18n.t('playerSetup.defaultName', { number: i + 1 }),
                    scores: (this.gameState.players[i] && this.gameState.players[i].scores) ? this.gameState.players[i].scores : {}
                }));
                this.gameState.players = newPlayers;

                renderNameInputs(count);
            });
        });

        startBtn.addEventListener('click', () => {
            this.gameState.currentPlayerIndex = 0;
            this.gameState.currentRound = 1;
            this.saveGame();
            // show preparation splash then scorecard
            this.showPlayerSplash(() => this.showScorecardScreen());
        });
    }

    updateContinueButton(btn, inputs) {
        const allFilled = Array.from(inputs).every(input => input.value.trim().length > 0);
        btn.disabled = !allFilled;
    }

    // Screen 3: Scorecard Preview
    showScorecardScreen() {
        const template = document.getElementById('screen-scorecard');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        // translate any static elements
        translateContainer(this.appContainer);

        const player = this.gameState.players[this.gameState.currentPlayerIndex];
        this.appContainer.querySelector('#player-name').textContent = i18n.t('scorecard.playerNameFormat', { name: player.name });
        this.appContainer.querySelector('#round-info').textContent = i18n.t('scorecard.roundInfo', { round: this.gameState.currentRound });

        this.renderScorecard();

        this.appContainer.querySelector('#proceed-to-dice').addEventListener('click', () => {
            this.hideBannerAd();
            this.showGameplayScreen();
        });

        this.appContainer.querySelector('#scorecard-quit').addEventListener('click', () => {
            this.showQuitConfirmModal();
        });

        this.showBannerAd();
    }

    renderScorecard() {
        const player = this.gameState.players[this.gameState.currentPlayerIndex];
        const tableCont = this.appContainer.querySelector('#scorecard-table');
        tableCont.innerHTML = '';

        // Upper section
        const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
        let upperSum = 0;

        upperCategories.forEach((cat, idx) => {
            const score = player.scores[cat];
            const isUsed = score !== undefined;
            upperSum += score || 0;

            const row = document.createElement('div');
            row.className = 'scorecard-row ' + (isUsed ? 'used' : 'available');

            const dots = this.getDiceDots(idx + 1);

            // Only show icon and value (no label)
            row.innerHTML = `
                <div class="scorecard-icon">${dots}</div>
                <div class="scorecard-value">${isUsed ? score : '-'}</div>
            `;
            tableCont.appendChild(row);
        });

        // Bonus (upper section)
        const bonusValue = upperSum >= 63 ? 35 : 0;
        if (bonusValue > 0) {
            const bonusRow = document.createElement('div');
            bonusRow.className = 'scorecard-row';
            bonusRow.style.backgroundColor = '#314158';
            bonusRow.innerHTML = `
                <div class="scorecard-icon crown-icon">${i18n.t('scorecard.upperBonus')}</div>
                <div class="scorecard-value">${bonusValue}</div>
            `;
            tableCont.appendChild(bonusRow);
        }

        // Upper subtotal (includes bonus)
        const upperTotalRow = document.createElement('div');
        upperTotalRow.className = 'scorecard-row mb-3';
        upperTotalRow.innerHTML = `
            <div class="scorecard-icon crown-icon">${i18n.t('scorecard.upperSum')}</div>
            <div class="scorecard-value">${upperSum + bonusValue}</div>
        `;
        tableCont.appendChild(upperTotalRow);

        // Lower section

        // Lower section
        const lowerCategories = ['three', 'four', 'full', 'ss', 'ls', 'general', 'chance'];
        let lowerSum = 0;

        lowerCategories.forEach((cat) => {
            const score = player.scores[cat];
            const isUsed = score !== undefined;
            lowerSum += score || 0;

            const row = document.createElement('div');
            row.className = 'scorecard-row ' + (isUsed ? 'used' : 'available');

            // const label = CATEGORY_NAMES[cat] || cat;
            const rawIcon = cat === 'general' || cat === 'general_bonus' ? 'Yatzy' : CATEGORY_NAMES[cat];
            const icon = i18n.t(`category.${cat}`, { default: rawIcon });

            // show icon and value only
            row.innerHTML = `
                <div class="scorecard-icon">${icon}</div>
                <div class="scorecard-value">${isUsed ? score : '-'}</div>
            `;
            tableCont.appendChild(row);
        });

        // Lower bonus (e.g., additional Yahtzee/general bonus) - only show if > 0
        const lowerBonus = player.scores['general_bonus'] || 0;
        if (lowerBonus > 0) {
            const bonusRowLower = document.createElement('div');
            bonusRowLower.className = 'scorecard-row';
            bonusRowLower.style.backgroundColor = '#314158';
            bonusRowLower.innerHTML = `
                <div class="scorecard-icon crown-icon">Yatzy Bonus</div>
                <div class="scorecard-value">${lowerBonus}</div>
            `;
            tableCont.appendChild(bonusRowLower);
        }

        // Lower subtotal (bottom total)
        const lowerTotal = lowerSum + lowerBonus;
        const lowerTotalRow = document.createElement('div');
        lowerTotalRow.className = 'scorecard-row mb-3';
        lowerTotalRow.innerHTML = `
            <div class="scorecard-icon crown-icon">${i18n.t('scorecard.lowerSum')}</div>
            <div class="scorecard-value">${lowerTotal}</div>
        `;
        tableCont.appendChild(lowerTotalRow);

        // Grand Sum row (final)
        const grandTotal = (upperSum + bonusValue) + lowerTotal;
        const sumRow = document.createElement('div');
        sumRow.className = 'scorecard-row';
        sumRow.style.fontWeight = 'bold';
        sumRow.innerHTML = `
            <div class="scorecard-icon crown-icon">${i18n.t('scorecard.sum')}</div>
            <div class="scorecard-value" style="color: var(--orange);">${grandTotal}</div>
        `;
        tableCont.appendChild(sumRow);
    }

    getDiceDots(num) {
        const patterns = {
            1: [[1, 1]],
            2: [[0, 0], [2, 2]],
            3: [[0, 0], [1, 1], [2, 2]],
            4: [[0, 0], [0, 2], [2, 0], [2, 2]],
            5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
            6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]]
        };

        let html = '<div class="dice-dots">';
        for (let i = 0; i < 9; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const hasDot = patterns[num].some(p => p[0] === row && p[1] === col);
            html += `<div class="dice-dot" style="${hasDot ? '' : 'opacity: 0;'}"></div>`;
        }
        html += '</div>';
        return html;
    }

    showGameplayScreen() {
        const template = document.getElementById('screen-gameplay');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        const player = this.gameState.players[this.gameState.currentPlayerIndex];
        this.appContainer.querySelector('#gameplay-player-name').textContent = i18n.t('gameplay.playerName', { name: player.name });
        this.appContainer.querySelector('#gameplay-round-info').textContent = i18n.t('gameplay.roundInfo', { round: this.gameState.currentRound });

        // translate potential static headers
        translateContainer(this.appContainer);

        let selectedDice = [];
        const continueBtn = this.appContainer.querySelector('#save-round');

        this.appContainer.querySelector('#gameplay-quit').addEventListener('click', () => {
            this.showQuitConfirmModal();
        });

        // Render dice grid
        const diceGrid = this.appContainer.querySelector('#dice-grid');
        for (let row = 0; row < 5; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'contents';

            for (let die = 1; die <= 6; die++) {
                const btn = document.createElement('button');
                btn.className = 'dice-button';
                btn.dataset.row = row;
                btn.dataset.die = die;

                const dots = this.getDiceDots(die);
                btn.innerHTML = dots;

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const rowNum = parseInt(btn.dataset.row);
                    const dieVal = parseInt(btn.dataset.die);

                    // Remove previous selection in this row
                    const prevSelected = diceGrid.querySelector(`[data-row="${rowNum}"].selected`);
                    if (prevSelected) {
                        prevSelected.classList.remove('selected');
                    }

                    btn.classList.add('selected');
                    selectedDice[rowNum] = dieVal;

                    // Update combinations
                    this.updateCombinations(selectedDice, continueBtn);
                });

                rowDiv.appendChild(btn);
            }
            diceGrid.appendChild(rowDiv);
        }

        continueBtn.addEventListener('click', () => {
            const selected = Object.values(selectedDice).filter(d => d !== undefined);
            if (selected.length < 5) {
                alert(i18n.t('gameplay.selectAllAlert'));
                return;
            }

            const player = this.gameState.players[this.gameState.currentPlayerIndex];

            // Apply the selected combination to scores (only if one was selected)
            if (this.gameState.selectedCombo) {
                player.scores[this.gameState.selectedCombo.category] = this.gameState.selectedCombo.score;
                this.gameState.selectedCombo = null;
            }

            this.advanceTurnAndContinue();
        });
    }

    updateCombinations(selectedDice, continueBtn) {
        const selected = Object.values(selectedDice).filter(d => d !== undefined);
        const comboList = this.appContainer.querySelector('#combinations-list');
        comboList.innerHTML = '';

        if (selected.length < 5) {
            continueBtn.disabled = true;
            return;
        }

        const player = this.gameState.players[this.gameState.currentPlayerIndex];

        // Check if this is a Yahtzee bonus BEFORE showing combinations
        if (ScoringEngine.isYahtzeeBonus(selected, player.scores)) {
            // Store dice for joker placement
            this.gameState.pendingYahtzeeBonus = {
                dice: selected,
                playerIndex: this.gameState.currentPlayerIndex
            };
            // Show joker screen instead of combinations
            this.showJokerSelectionScreen();
            return;
        }

        let validCombinations = ScoringEngine.getValidCombinations(selected, player.scores);
        // localize combo icons/texts
        validCombinations = validCombinations.map(c => ({
            ...c,
            icon: i18n.t(`category.${c.category}`, { default: c.icon || CATEGORY_NAMES[c.category] || c.category })
        }));

        // Build a map of valid combinations for quick lookup
        const validComboMap = {};
        validCombinations.forEach(combo => {
            validComboMap[combo.category] = combo;
        });

        // Get all categories that haven't been used yet
        const allCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
                               'three', 'four', 'full', 'ss', 'ls', 'general', 'chance'];

        // Build complete list: valid combos first, then unused categories with 0 points
        const categoriesToShow = allCategories
            .filter(cat => player.scores[cat] === undefined)
            .map(cat => {
                // If this category has a valid combo, use it; otherwise create a 0-point option
                if (validComboMap[cat]) {
                    return validComboMap[cat];
                } else {
                    return {
                        category: cat,
                        score: 0,
                        icon: CATEGORY_ICONS[cat] || cat,
                        isZero: true  // Mark as forcing 0 points
                    };
                }
            });

        if (categoriesToShow.length === 0) {
            this.appContainer.querySelector('#combinations-title').textContent = i18n.t('combos.allFilled');
            continueBtn.disabled = true;
            return;
        }

        this.appContainer.querySelector('#combinations-title').textContent = i18n.t('combos.availableOptions');
        continueBtn.disabled = true;

        categoriesToShow.forEach((combo) => {
            const item = document.createElement('div');
            item.className = 'combination-item' + (combo.score === 0 ? ' zero-placement' : '');

            const btn = document.createElement('button');
            btn.className = 'combination-btn';
            btn.textContent = i18n.t('common.select');

            btn.addEventListener('click', () => {
                // Remove selected class from all buttons
                comboList.querySelectorAll('.combination-btn').forEach(b => {
                    b.classList.remove('selected');
                });
                // Add selected class to clicked button
                btn.classList.add('selected');

                // Store the selected combo in gameState (don't add to scores yet)
                this.gameState.selectedCombo = combo;
                continueBtn.disabled = false;
            });

            const comboLabel = i18n.t(`category.${combo.category}`, { default: CATEGORY_NAMES[combo.category] || combo.category });
            item.innerHTML = `
                <div class="combination-label">${comboLabel}</div>
                <div class="combination-score" ${combo.isZero ? '' : ''}>${combo.score}</div>
            `;
            item.appendChild(btn);
            comboList.appendChild(item);
        });

        // Initialize selectedCombo to null when combinations are rendered
        this.gameState.selectedCombo = null;
    }

    // Screen: Joker Selection (Yahtzee Bonus)
    showJokerSelectionScreen() {
        const template = document.getElementById('screen-joker-selection');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        // translate static pieces
        translateContainer(this.appContainer);

        const player = this.gameState.players[this.gameState.currentPlayerIndex];
        this.appContainer.querySelector('#joker-player-name').textContent = player.name;
        this.appContainer.querySelector('#joker-round-info').textContent = i18n.t('scorecard.roundInfo', { round: this.gameState.currentRound });

        this.appContainer.querySelector('#joker-quit').addEventListener('click', () => {
            this.showQuitConfirmModal();
        });

        const dice = this.gameState.pendingYahtzeeBonus.dice;
        let selectedJokerCategory = null;

        // Get bonus value (check if already has general_bonus to add +100 more)
        const currentBonus = player.scores['general_bonus'] || 0;
        const newBonus = currentBonus + 100;
        this.appContainer.querySelector('#joker-bonus-text').innerHTML =
            i18n.t('joker.bonusInfoWithTotal', { total: newBonus });

        // Get valid joker options
        const jokerOptions = ScoringEngine.getJokerOptions(dice, player.scores);
        const optionsList = this.appContainer.querySelector('#joker-options-list');
        const confirmBtn = this.appContainer.querySelector('#joker-confirm');

        if (jokerOptions.length === 0) {
            optionsList.innerHTML = `<p style="color: var(--orange);">${i18n.t('joker.noOptions')}</p>`;
            return;
        }

        // Render options
        jokerOptions.forEach((option) => {
            const item = document.createElement('div');
            item.className = 'combination-item joker-option';

            const btn = document.createElement('button');
            btn.className = 'combination-btn';
            btn.textContent = i18n.t('common.select');

            btn.addEventListener('click', () => {
                // Remove previous selection
                optionsList.querySelectorAll('.combination-btn').forEach(b => {
                    b.classList.remove('selected');
                });
                btn.classList.add('selected');
                selectedJokerCategory = option;
                confirmBtn.disabled = false;
            });

            const reasonText = option.reasonKey ? i18n.t(option.reasonKey) : option.reason;
            item.innerHTML = `
                <div class="combination-label" style="flex: 1;">
                    <div>${i18n.t(`category.${option.category}`, { default: CATEGORY_NAMES[option.category] || option.category })}</div>
                    <small style="color: var(--slate-600);">${reasonText}</small>
                </div>
                <div class="combination-score">${option.score}</div>
            `;
            item.appendChild(btn);
            optionsList.appendChild(item);
        });

        confirmBtn.addEventListener('click', () => {
            if (!selectedJokerCategory) {
                alert(i18n.t('joker.selectCategoryAlert'));
                return;
            }

            // Apply the scores
            player.scores[selectedJokerCategory.category] = selectedJokerCategory.score;
            player.scores['general_bonus'] = (player.scores['general_bonus'] || 0) + 100;

            // Clear pending Yahtzee bonus
            this.gameState.pendingYahtzeeBonus = null;

            this.advanceTurnAndContinue();
        });
    }

    // Screen 6: Results
    showResultsScreen() {
        this.clearSavedGame();
        this.showInterstitialAd();

        const template = document.getElementById('screen-results');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        const resultsTable = this.appContainer.querySelector('#results-table');
        // translate any static text
        translateContainer(this.appContainer);

        const sorted = this.gameState.players
            .map((p, idx) => ({
                name: p.name,
                score: ScoringEngine.calculateTotalScore(p.scores),
                scoreDetails: p.scores,
                originalIndex: idx
            }))
            .sort((a, b) => b.score - a.score);

        sorted.forEach((result, idx) => {
            const item = document.createElement('div');
            item.className = 'result-accordion';

            // Header (clickable)
            const header = document.createElement('div');
            header.className = 'result-item result-item-clickable';
            header.innerHTML = `
                <div class="result-name">${idx + 1}. ${result.name}</div>
                <div class="result-score">${result.score}</div>
                <div class="accordion-arrow">▼</div>
            `;

            // Details (hidden by default)
            const details = document.createElement('div');
            details.className = 'result-details';
            details.innerHTML = this.buildDetailedScorecard(result.scoreDetails);

            // Toggle accordion
            header.addEventListener('click', () => {
                details.classList.toggle('expanded');
                header.classList.toggle('expanded');
            });

            item.appendChild(header);
            item.appendChild(details);
            resultsTable.appendChild(item);
        });

        this.appContainer.querySelector('#new-game').addEventListener('click', () => {
            this.gameState = {
                players: [],
                currentPlayerIndex: 0,
                currentRound: 1,
                gameFinished: false,
                pendingYahtzeeBonus: null
            };
            this.showPlayerSetupScreen();
        });
    }

    // Build detailed scorecard HTML
    buildDetailedScorecard(scores) {
        let html = '<div class="score-breakdown">';

        // Upper section
        const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
        let upperSum = 0;
        html += `<div class="score-section"><h4>${i18n.t('scorecard.upperSection')}</h4>`;

        upperCategories.forEach((cat) => {
            const score = scores[cat] ?? '-';
            if (score !== '-') upperSum += score;
            const label = i18n.t(`category.${cat}`, { default: CATEGORY_NAMES[cat] });
            html += `<div class="score-row"><span>${label}</span><span>${score}</span></div>`;
        });

        html += `<div class="score-row"><span>${i18n.t('scorecard.upperSum')}</span><span>${upperSum}</span></div>`;

        // Upper bonus
        const upperBonus = upperSum >= 63 ? 35 : 0;
        if (upperBonus > 0) {
            html += `<div class="score-row"><span>${i18n.t('scorecard.upperBonusLabel')}</span><span>${upperBonus}</span></div>`;
        }
        html += `<div class="score-row score-total"><span>${i18n.t('scorecard.upperTotalLabel')}</span><span>${upperSum + upperBonus}</span></div>`;
        html += '</div>';

        // Lower section
        const lowerCategories = ['three', 'four', 'full', 'ss', 'ls', 'general', 'general_bonus', 'chance'];
        let lowerSum = 0;
        html += `<div class="score-section"><h4>${i18n.t('scorecard.lowerSection')}</h4>`;

        lowerCategories.forEach((cat) => {
            const score = scores[cat] ?? '-';
            if (score !== '-') lowerSum += score;
            const label = i18n.t(`category.${cat}`, { default: CATEGORY_NAMES[cat] });
            html += `<div class="score-row"><span>${label}</span><span>${score}</span></div>`;
        });

        html += `<div class="score-row score-total"><span>${i18n.t('scorecard.lowerTotalLabel')}</span><span>${lowerSum}</span></div>`;
        html += '</div>';

        // Grand total
        const grandTotal = (upperSum + upperBonus) + lowerSum;
        html += `<div class="score-section"><div class="score-row score-grand-total"><span>${i18n.t('scorecard.grandTotalLabel')}</span><span>${grandTotal}</span></div></div>`;

        html += '</div>';
        return html;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new DiceGameApp();
});
