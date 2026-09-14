const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

if (menu && nav) {
  menu.onclick = () => nav.classList.toggle("open");
  nav.onclick = () => nav.classList.remove("open");
}

const ANALYTICS_ID = "G-RNP8LLYVGL";
const CONSENT_KEY = "instantdesk_analytics_consent";

function getAnalyticsConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function setAnalyticsConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // The visitor can still make a choice for the current page.
  }
}

function loadGoogleAnalytics() {
  if (document.querySelector("script[data-instantdesk-analytics]")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", ANALYTICS_ID, { anonymize_ip: true });

  const analytics = document.createElement("script");
  analytics.async = true;
  analytics.dataset.instantdeskAnalytics = "true";
  analytics.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  document.head.appendChild(analytics);
}

function removeAnalyticsCookies() {
  document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => name.startsWith("_ga"))
    .forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}; SameSite=Lax`;
    });
}

function showCookieBanner() {
  document.querySelector(".cookie-banner")?.remove();

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Analytics cookie preferences");
  banner.innerHTML = `
    <div>
      <strong>Your privacy choices</strong>
      <p>InstantDesk would like to use Google Analytics to understand how visitors use this website. Analytics will only load if you accept. Read our <a href="privacy.html">Privacy Policy</a>.</p>
    </div>
    <div class="cookie-actions">
      <button type="button" class="cookie-reject">Reject</button>
      <button type="button" class="cookie-accept">Accept analytics</button>
    </div>
  `;

  banner.querySelector(".cookie-accept").onclick = () => {
    setAnalyticsConsent("accepted");
    loadGoogleAnalytics();
    banner.remove();
  };

  banner.querySelector(".cookie-reject").onclick = () => {
    setAnalyticsConsent("rejected");
    removeAnalyticsCookies();
    banner.remove();
  };

  document.body.appendChild(banner);
  banner.querySelector(".cookie-accept").focus();
}

function addCookieSettingsControl() {
  const footer = document.querySelector("footer .wrap");
  if (!footer || footer.querySelector(".cookie-settings")) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "cookie-settings";
  button.textContent = "Cookie settings";
  button.onclick = showCookieBanner;
  footer.appendChild(button);
}

const consent = getAnalyticsConsent();
if (consent === "accepted") {
  loadGoogleAnalytics();
} else if (consent !== "rejected") {
  showCookieBanner();
}
addCookieSettingsControl();
