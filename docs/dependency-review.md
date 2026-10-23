# Dependency review — 2026-10-23

Audited frontend and backend npm lockfiles with Node 24.19.0 and npm 11.9.0. Counts below represent affected package entries reported by npm audit, including transitive dependencies; they are not counts of independent vulnerabilities or proof of exploitability.

| Lockfile | Low | Moderate | High | Critical | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| frontend (after form-data update) | 2 | 5 | 11 | 1 | 19 |
| backend | 4 | 1 | 5 | 1 | 11 |

## Change included

The Axios-scoped form-data override now uses upstream 4.0.6 from registry.npmjs.org. Version 4.0.4 addressed the originally reported weak-boundary issue but remains affected by [multipart CRLF injection](https://github.com/advisories/GHSA-hmw2-7cc7-3qxx), which npm audit reports as affecting 4.x versions below 4.0.6. After updating, npm audit no longer reports form-data. This override does not fix other Axios advisories or backend dependencies.

## Priority follow-up work

1. Upgrade Next.js 15.1.6 and the matching eslint-config-next together. npm audit proposes 15.5.28 within the existing major line. Validate App Router pages, production build, and login/register behavior. The existing version has critical advisories, including [React Flight RCE](https://github.com/advisories/GHSA-9qr9-h5gf-34mp).
2. Update Axios within 1.x and its transitive dependencies. Repeat JSON, native FormData and streamed multipart tests. Assess browser and Node advisory applicability separately.
3. Upgrade Express within 4.x (audit proposes 4.22.3), Morgan within 1.x (audit proposes 1.12.1), and refresh backend transitive dependencies. The lockfile includes a critical [proxy-addr IP-spoofing advisory](https://github.com/advisories/GHSA-jqcg-44mw-7w3h); actual exposure depends on proxy trust configuration. Validate authentication, JSON/urlencoded parsing, cookies, errors, and proxy handling.
4. Refresh remaining frontend build/lint dependencies and backend JWT-related dependencies, then audit again.

These are audit-proposed versions, not tested upgrades in this change. Avoid npm audit fix --force and review generated lockfile diffs.

## Continuous integration

The CI workflow runs on pull requests, pushes to master, and manual dispatch. It installs frontend locked dependencies, lints source/tests, tests JSON and multipart, and builds Next.js. Separate frontend/backend audit jobs fail for high or critical findings (including development dependencies). They are expected to fail against the unresolved findings listed above; no findings are suppressed.

Workflow actions are pinned to verified upstream commit SHAs. Token permissions are contents:read and checkout does not persist credentials. CI uses Node 24.19.0; this does not alter deployment runtime configuration.

Local checks: production build passed before the final form-data-only update; source/tests lint passed; JSON/native/streamed multipart tests passed with form-data 4.0.6. Full browser authentication and backend integration tests were not run. The build downloads next/font Google assets and therefore requires outbound access to the font service.
