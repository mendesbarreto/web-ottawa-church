# Edge Case Hunter Review Prompt

Use the `bmad-review-edge-case-hunter` skill if available.

You may read the project files. Review every branching path and boundary condition introduced by the diff below. Focus on unhandled edge cases, invalid states, persistence/export failures, authorization gaps, accessibility traps, and browser/runtime failure modes.

Return findings only. For each finding include severity, affected file/path, reproduction path, and a concrete fix direction.

# Combined diff for BMad review

Baseline commit: `b6607ae3a27b26ad2a76ee34caf9804bf29a7a7f`

## Git status

```text
 M .gitignore
 M README.md
?? .env.example
?? .github/
?? _bmad-output/
?? apps/
?? bun.lock
?? package.json
?? packages/
?? tmp/
?? tsconfig.base.json
?? tsconfig.json
?? turbo.json

```

## .gitignore

```diff
diff --git a/.gitignore b/.gitignore
index 9703c86..d9aa11e 100644
--- a/.gitignore
+++ b/.gitignore
@@ -90,6 +90,8 @@ typings/
 # Nuxt.js build / generate output
 .nuxt
 dist
+.turbo/
+.playwright-mcp/
 
 # Gatsby files
 .cache/

```

## README.md

```diff
diff --git a/README.md b/README.md
index a777899..881d8fe 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,40 @@
-# ottawa-church-events
\ No newline at end of file
+# Ottawa Church Events
+
+Church website, participant portal, and admin event workflow for a free-tier-first personal project.
+
+## Stack
+
+- Runtime/package manager: Bun workspace
+- Monorepo orchestration: Turborepo
+- Web app: React, TanStack Router, Vite, Tailwind CSS/shadcn-style components
+- Domain package: framework-independent TypeScript event, registration, RSVP, CSV, and calendar logic
+- Deployment target: Cloudflare Pages for the web app
+- Future services: Supabase free tier for auth/database and Resend free tier for email
+
+## Local Development
+
+```bash
+bun install
+bun --filter @ottawa-church/web dev
+```
+
+Open `http://127.0.0.1:3000/`.
+
+## Validation
+
+```bash
+bun run typecheck
+bun test
+bun run build
+```
+
+## Cloudflare Pages
+
+Use these settings when connecting the repository to Cloudflare Pages:
+
+- Framework preset: None / Vite
+- Build command: `bun run build`
+- Build output directory: `apps/web/dist`
+- Root directory: repository root
+
+`apps/web/public/_redirects` keeps direct links working for the single-page app.

```

## .env.example

```diff
diff --git a/.env.example b/.env.example
new file mode 100644
index 0000000..4b00f7e
--- /dev/null
+++ b/.env.example
@@ -0,0 +1,7 @@
+# Local MVP works without these values.
+# Future free-tier production adapters:
+VITE_SITE_URL=http://localhost:3000
+VITE_SUPABASE_URL=
+VITE_SUPABASE_PUBLISHABLE_KEY=
+SUPABASE_SERVICE_ROLE_KEY=
+RESEND_API_KEY=

```

## package.json

```diff
diff --git a/package.json b/package.json
new file mode 100644
index 0000000..35607f7
--- /dev/null
+++ b/package.json
@@ -0,0 +1,28 @@
+{
+  "name": "web-ottawa-church",
+  "version": "0.1.0",
+  "private": true,
+  "workspaces": [
+    "apps/*",
+    "packages/*"
+  ],
+  "scripts": {
+    "dev": "turbo dev",
+    "build": "turbo build",
+    "typecheck": "turbo run typecheck",
+    "test": "bun test",
+    "format": "echo 'formatter not configured yet'"
+  },
+  "dependencies": {
+    "@ottawa-church/domain": "workspace:*"
+  },
+  "devDependencies": {
+    "@types/bun": "1.3.14",
+    "turbo": "2.9.14",
+    "typescript": "^5.9.3"
+  },
+  "engines": {
+    "bun": ">=1.3.0"
+  },
+  "packageManager": "bun@1.3.14"
+}

```

## bun.lock

```diff
diff --git a/bun.lock b/bun.lock
new file mode 100644
index 0000000..1bd56f9
--- /dev/null
+++ b/bun.lock
@@ -0,0 +1,197 @@
+{
+  "lockfileVersion": 1,
+  "configVersion": 1,
+  "workspaces": {
+    "": {
+      "name": "web-ottawa-church",
+      "dependencies": {
+        "@ottawa-church/domain": "workspace:*",
+      },
+      "devDependencies": {
+        "@types/bun": "1.3.14",
+        "turbo": "2.9.14",
+        "typescript": "^5.9.3",
+      },
+    },
+    "apps/web": {
+      "name": "@ottawa-church/web",
+      "version": "0.1.0",
+      "dependencies": {
+        "@ottawa-church/domain": "workspace:*",
+        "@tanstack/react-router": "1.170.5",
+        "@vitejs/plugin-react": "6.0.1",
+        "lucide-react": "0.545.0",
+        "react": "19.2.0",
+        "react-dom": "19.2.0",
+        "vite": "8.0.13",
+      },
+      "devDependencies": {
+        "@types/react": "19.2.0",
+        "@types/react-dom": "19.2.0",
+      },
+    },
+    "packages/domain": {
+      "name": "@ottawa-church/domain",
+      "version": "0.1.0",
+    },
+  },
+  "packages": {
+    "@emnapi/core": ["@emnapi/core@1.10.0", "", { "dependencies": { "@emnapi/wasi-threads": "1.2.1", "tslib": "^2.4.0" } }, "sha512-yq6OkJ4p82CAfPl0u9mQebQHKPJkY7WrIuk205cTYnYe+k2Z8YBh11FrbRG/H6ihirqcacOgl2BIO8oyMQLeXw=="],
+
+    "@emnapi/runtime": ["@emnapi/runtime@1.10.0", "", { "dependencies": { "tslib": "^2.4.0" } }, "sha512-ewvYlk86xUoGI0zQRNq/mC+16R1QeDlKQy21Ki3oSYXNgLb45GV1P6A0M+/s6nyCuNDqe5VpaY84BzXGwVbwFA=="],
+
+    "@emnapi/wasi-threads": ["@emnapi/wasi-threads@1.2.1", "", { "dependencies": { "tslib": "^2.4.0" } }, "sha512-uTII7OYF+/Mes/MrcIOYp5yOtSMLBWSIoLPpcgwipoiKbli6k322tcoFsxoIIxPDqW01SQGAgko4EzZi2BNv2w=="],
+
+    "@napi-rs/wasm-runtime": ["@napi-rs/wasm-runtime@1.1.5", "", { "dependencies": { "@tybys/wasm-util": "^0.10.2" }, "peerDependencies": { "@emnapi/core": "^1.7.1", "@emnapi/runtime": "^1.7.1" } }, "sha512-AWPoBRJ9tsnVhor4sjO7rkni+7p+2IAEFj6cx06UgP10jkQHqay/36uRV/bFkgrh18D9vb4cr8Q0Pthskgzy+Q=="],
+
+    "@ottawa-church/domain": ["@ottawa-church/domain@workspace:packages/domain"],
+
+    "@ottawa-church/web": ["@ottawa-church/web@workspace:apps/web"],
+
+    "@oxc-project/types": ["@oxc-project/types@0.130.0", "", {}, "sha512-ibD2usx9JRu7f5pu2tMKMI4cpA4NgXJQoYRP4pQ7Pxmn1l6k/53qWtQWZayhYy3X4QZkt90Ot+mJEaeXouio6Q=="],
+
+    "@rolldown/binding-android-arm64": ["@rolldown/binding-android-arm64@1.0.1", "", { "os": "android", "cpu": "arm64" }, "sha512-fJI3I0r3C3Oj/zdBCpaCmBRZYf07xpaq4yCfDDoSFm+beWNzbIl26puW8RraUdugoJw/95zerNOn6jasAhzSmg=="],
+
+    "@rolldown/binding-darwin-arm64": ["@rolldown/binding-darwin-arm64@1.0.1", "", { "os": "darwin", "cpu": "arm64" }, "sha512-cKnAhWEsV7TPcA/5EAteDp6KcJZBQ2G+BqE7zayMMi7kMvwRsbv7WT9aOnn0WNl4SKEIf43vjS31iUPu80nzXg=="],
+
+    "@rolldown/binding-darwin-x64": ["@rolldown/binding-darwin-x64@1.0.1", "", { "os": "darwin", "cpu": "x64" }, "sha512-YKrVwQjIRBPo+5G/u03wGjbdy4q7pyzCe93DK9VJ7zkVmeg8LJ7GbgsiHWdR4xSoe4CAXRD7Bcjgbtr64bkXNg=="],
+
+    "@rolldown/binding-freebsd-x64": ["@rolldown/binding-freebsd-x64@1.0.1", "", { "os": "freebsd", "cpu": "x64" }, "sha512-z/oBsREo46SsFqBwYtFe0kpJeBijAT48O/WXLI4suiCLBkr03RTtTJMCzSdDd2znlh8VJizL09XVkQgk8IZonw=="],
+
+    "@rolldown/binding-linux-arm-gnueabihf": ["@rolldown/binding-linux-arm-gnueabihf@1.0.1", "", { "os": "linux", "cpu": "arm" }, "sha512-ik8q7GM11zxvYxFc2PeDcT6TBvhCQMaUxfph/M5l9sKuTs/Sjg3L+Byw0F7w0ZVLBZmx30P+gG0ECzzN+MFcmQ=="],
+
+    "@rolldown/binding-linux-arm64-gnu": ["@rolldown/binding-linux-arm64-gnu@1.0.1", "", { "os": "linux", "cpu": "arm64" }, "sha512-QoSx2EkyrrdZ6kcyE8stqZ62t0Yra8Fs5ia9lOxJrh6TMQJK7gQKmscdTHf7pOXKREKrVwOtJcQG3qVSfc866A=="],
+
+    "@rolldown/binding-linux-arm64-musl": ["@rolldown/binding-linux-arm64-musl@1.0.1", "", { "os": "linux", "cpu": "arm64" }, "sha512-uwNwFpwKeNiZawfAWBgg0VIztPTV3ihhh1vV334h9ivnNLorxnQMU6Fz8wG1Zb4Qh9LC1/MkcyT3YlDXG3Rsgg=="],
+
+    "@rolldown/binding-linux-ppc64-gnu": ["@rolldown/binding-linux-ppc64-gnu@1.0.1", "", { "os": "linux", "cpu": "ppc64" }, "sha512-zY1bul7OWr7DFBiJ++wofXvnr8B45ce3QsQUhKrIhXsygAh7bTkwyeM1bi1a2g5C/yC/N8TZyGDEoMfm/l9mpg=="],
+
+    "@rolldown/binding-linux-s390x-gnu": ["@rolldown/binding-linux-s390x-gnu@1.0.1", "", { "os": "linux", "cpu": "s390x" }, "sha512-0frlsT/f4Ft6I7SMESTKnF3cZsdicQn1dCMkF/jT9wDLE+gGoiQfv1nmT9e+s7s/fekvvy6tZM2jHvI2tkbJDQ=="],
+
+    "@rolldown/binding-linux-x64-gnu": ["@rolldown/binding-linux-x64-gnu@1.0.1", "", { "os": "linux", "cpu": "x64" }, "sha512-XABVmGp9Tg0WspTVvwduTc4fpqy6JnAUrSQe6OuyqD/03nI7r0O9OWUkMIwFrjKAIqolvqoA4ZrJppgwE0Gxmw=="],
+
+    "@rolldown/binding-linux-x64-musl": ["@rolldown/binding-linux-x64-musl@1.0.1", "", { "os": "linux", "cpu": "x64" }, "sha512-bV4fzswuzVcKD90o/VM6QqKxnxlDq0g2BISDLNVmxrnhpv1DDbyPhCIjYfvzYLV+MvkKKnQt2Q6AO86SEBULUQ=="],
+
+    "@rolldown/binding-openharmony-arm64": ["@rolldown/binding-openharmony-arm64@1.0.1", "", { "os": "none", "cpu": "arm64" }, "sha512-/Mh0Zhq3OP7fVs0kcQHZP6lZEthMGTaSf8UBQYSFEZDWGXXlEC+nJ6EqenaK2t4LBXMe3A+K/G2BVXXdtOr4PQ=="],
+
+    "@rolldown/binding-wasm32-wasi": ["@rolldown/binding-wasm32-wasi@1.0.1", "", { "dependencies": { "@emnapi/core": "1.10.0", "@emnapi/runtime": "1.10.0", "@napi-rs/wasm-runtime": "^1.1.4" }, "cpu": "none" }, "sha512-+1xc9X45l8ufsBAm6Gjvx2qDRIY9lTVt0cgWNcJ+1gdhXvkbxePA60yRTwSTuXL09CMhyJmjpV7E3NoyxbqFQQ=="],
+
+    "@rolldown/binding-win32-arm64-msvc": ["@rolldown/binding-win32-arm64-msvc@1.0.1", "", { "os": "win32", "cpu": "arm64" }, "sha512-1D+UqZdfnuR+Jy1GgMJwi85bD40H21uNmOPRWQhw4oRSuolZ/B5rixZ45DK2KXOTCvmVCecauWgEhbw8bI7tOw=="],
+
+    "@rolldown/binding-win32-x64-msvc": ["@rolldown/binding-win32-x64-msvc@1.0.1", "", { "os": "win32", "cpu": "x64" }, "sha512-INAycaWuhlOK3wk4mRHGsdgwYWmd9cChdPdE9bwWmy6rn9VqVNYNFGhOdXrofXUxwHIncSiPNb8tNm8knDVIeQ=="],
+
+    "@rolldown/pluginutils": ["@rolldown/pluginutils@1.0.0-rc.7", "", {}, "sha512-qujRfC8sFVInYSPPMLQByRh7zhwkGFS4+tyMQ83srV1qrxL4g8E2tyxVVyxd0+8QeBM1mIk9KbWxkegRr76XzA=="],
+
+    "@tanstack/history": ["@tanstack/history@1.162.0", "", {}, "sha512-79pf/RkhteYZTRgcR4F9kbk84P2N8rugQJswxfIqovlbRiT3yI7eBE+5QorIrZaOKktsgzRlXh1l/du/xpl4iA=="],
+
+    "@tanstack/react-router": ["@tanstack/react-router@1.170.5", "", { "dependencies": { "@tanstack/history": "1.162.0", "@tanstack/react-store": "^0.9.3", "@tanstack/router-core": "1.171.3", "isbot": "^5.1.22" }, "peerDependencies": { "react": ">=18.0.0 || >=19.0.0", "react-dom": ">=18.0.0 || >=19.0.0" } }, "sha512-SML7KhtehzfuoflBWhlUf3SA30bdk82cyoMet2ZZDK3fW4x/dKx5LKNwMUp8TOqUOTW7FW+Rfle9Ae/FswwsZA=="],
+
+    "@tanstack/react-store": ["@tanstack/react-store@0.9.3", "", { "dependencies": { "@tanstack/store": "0.9.3", "use-sync-external-store": "^1.6.0" }, "peerDependencies": { "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0", "react-dom": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0" } }, "sha512-y2iHd/N9OkoQbFJLUX1T9vbc2O9tjH0pQRgTcx1/Nz4IlwLvkgpuglXUx+mXt0g5ZDFrEeDnONPqkbfxXJKwRg=="],
+
+    "@tanstack/router-core": ["@tanstack/router-core@1.171.3", "", { "dependencies": { "@tanstack/history": "1.162.0", "cookie-es": "^3.0.0", "seroval": "^1.5.4", "seroval-plugins": "^1.5.4" } }, "sha512-CbaA38aiV1SC8N0ZAMs8P2PZPoNATim7lq8zhKhno5i5+iriaH6PQMrixYLrq3yhjAOwWhN3bj/4DCjPyHqHnA=="],
+
+    "@tanstack/store": ["@tanstack/store@0.9.3", "", {}, "sha512-8reSzl/qGWGGVKhBoxXPMWzATSbZLZFWhwBAFO9NAyp0TxzfBP0mIrGb8CP8KrQTmvzXlR/vFPPUrHTLBGyFyw=="],
+
+    "@turbo/darwin-64": ["@turbo/darwin-64@2.9.14", "", { "os": "darwin", "cpu": "x64" }, "sha512-t7QiPflaEyBE4oayeZtSmu4mEfjgIrcNlNNl1z1dmIVPqEdtA7+CfTf8d7KXsOGPh6aNgWjKxyvQg9uGfDQF+A=="],
+
+    "@turbo/darwin-arm64": ["@turbo/darwin-arm64@2.9.14", "", { "os": "darwin", "cpu": "arm64" }, "sha512-d23147mC9BsCPA9mJ0h/ubcpbRgcJBXbcG3+Vq7YLhjz3IXuvQsJ1UXH8f4MD76ZjJ4m/E4aRdJV+MW88CDfbw=="],
+
+    "@turbo/linux-64": ["@turbo/linux-64@2.9.14", "", { "os": "linux", "cpu": "x64" }, "sha512-P3ZKB5tuUDdDQWuAsACGUR1qv9W7BNWxdxqVJ0kZNuNNPRaVYTPPikLcp79+GiEcW3npsR+KyP38lnQiBc5aSA=="],
+
+    "@turbo/linux-arm64": ["@turbo/linux-arm64@2.9.14", "", { "os": "linux", "cpu": "arm64" }, "sha512-ZRTlzcUMrrPv9ZuDzRF9n60Ym13bKeG9jDB8WjxyLhWNzV+AJQN+zdpIk3NJYf2zQsGUm1mNar2P0elRzLw25g=="],
+
+    "@turbo/windows-64": ["@turbo/windows-64@2.9.14", "", { "os": "win32", "cpu": "x64" }, "sha512-exanwN6sIduZwykYeiTQj8kCmOhazP5WOz3bvXMcYtjhL6Z3iRWLewKrXCBq0bqwSP3iBMb/AerRCnHI4lx46A=="],
+
+    "@turbo/windows-arm64": ["@turbo/windows-arm64@2.9.14", "", { "os": "win32", "cpu": "arm64" }, "sha512-fVdCsnmYoKICsycbWuuGp6Jvi51/3G/UluFWuAUCvR8PIW5IJkAk5BM9UF8PSm0Q2IphWHFZjYEgjHsh3B9y/g=="],
+
+    "@tybys/wasm-util": ["@tybys/wasm-util@0.10.2", "", { "dependencies": { "tslib": "^2.4.0" } }, "sha512-RoBvJ2X0wuKlWFIjrwffGw1IqZHKQqzIchKaadZZfnNpsAYp2mM0h36JtPCjNDAHGgYez/15uMBpfGwchhiMgg=="],
+
+    "@types/bun": ["@types/bun@1.3.14", "", { "dependencies": { "bun-types": "1.3.14" } }, "sha512-h1hFqFVcvAvD9j9K7ZW7vd82aSA+rTdznZa+5bwvCwqSB1jmmfLcbIWhOLx1/+boy/xmjgCs/OMUL8hRJSmnPw=="],
+
+    "@types/node": ["@types/node@26.0.0", "", { "dependencies": { "undici-types": "~8.3.0" } }, "sha512-vf2YFi1iY9lHGwNJMs01biZFbKJkrZR1T6/MlzjhJLPdntOHLhTrDSnSVcdtvjihi4VQNlrFRIxLsDBlQpAipA=="],
+
+    "@types/react": ["@types/react@19.2.0", "", { "dependencies": { "csstype": "^3.0.2" } }, "sha512-1LOH8xovvsKsCBq1wnT4ntDUdCJKmnEakhsuoUSy6ExlHCkGP2hqnatagYTgFk6oeL0VU31u7SNjunPN+GchtA=="],
+
+    "@types/react-dom": ["@types/react-dom@19.2.0", "", { "peerDependencies": { "@types/react": "^19.2.0" } }, "sha512-brtBs0MnE9SMx7px208g39lRmC5uHZs96caOJfTjFcYSLHNamvaSMfJNagChVNkup2SdtOxKX1FDBkRSJe1ZAg=="],
+
+    "@vitejs/plugin-react": ["@vitejs/plugin-react@6.0.1", "", { "dependencies": { "@rolldown/pluginutils": "1.0.0-rc.7" }, "peerDependencies": { "@rolldown/plugin-babel": "^0.1.7 || ^0.2.0", "babel-plugin-react-compiler": "^1.0.0", "vite": "^8.0.0" }, "optionalPeers": ["@rolldown/plugin-babel", "babel-plugin-react-compiler"] }, "sha512-l9X/E3cDb+xY3SWzlG1MOGt2usfEHGMNIaegaUGFsLkb3RCn/k8/TOXBcab+OndDI4TBtktT8/9BwwW8Vi9KUQ=="],
+
+    "bun-types": ["bun-types@1.3.14", "", { "dependencies": { "@types/node": "*" } }, "sha512-4N0ig0fEomHt5R0KCFWjovxow98rIoRwKolrYdCcknNwMekCXRnWEUvgu5soYV8QXtVsrUD8B95MBOZGPvr6KQ=="],
+
+    "cookie-es": ["cookie-es@3.1.1", "", {}, "sha512-UaXxwISYJPTr9hwQxMFYZ7kNhSXboMXP+Z3TRX6f1/NyaGPfuNUZOWP1pUEb75B2HjfklIYLVRfWiFZJyC6Npg=="],
+
+    "csstype": ["csstype@3.2.3", "", {}, "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ=="],
+
+    "detect-libc": ["detect-libc@2.1.2", "", {}, "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ=="],
+
+    "fdir": ["fdir@6.5.0", "", { "peerDependencies": { "picomatch": "^3 || ^4" }, "optionalPeers": ["picomatch"] }, "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg=="],
+
+    "fsevents": ["fsevents@2.3.3", "", { "os": "darwin" }, "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw=="],
+
+    "isbot": ["isbot@5.1.43", "", {}, "sha512-drJhFmibra4LO6Wd7D3Oi6UICRK9244vSZkmxzhlZP0TTdwCA2ueK4PEkUkzPYeuqug9+cqqdWPgihjk5+83Cg=="],
+
+    "lightningcss": ["lightningcss@1.32.0", "", { "dependencies": { "detect-libc": "^2.0.3" }, "optionalDependencies": { "lightningcss-android-arm64": "1.32.0", "lightningcss-darwin-arm64": "1.32.0", "lightningcss-darwin-x64": "1.32.0", "lightningcss-freebsd-x64": "1.32.0", "lightningcss-linux-arm-gnueabihf": "1.32.0", "lightningcss-linux-arm64-gnu": "1.32.0", "lightningcss-linux-arm64-musl": "1.32.0", "lightningcss-linux-x64-gnu": "1.32.0", "lightningcss-linux-x64-musl": "1.32.0", "lightningcss-win32-arm64-msvc": "1.32.0", "lightningcss-win32-x64-msvc": "1.32.0" } }, "sha512-NXYBzinNrblfraPGyrbPoD19C1h9lfI/1mzgWYvXUTe414Gz/X1FD2XBZSZM7rRTrMA8JL3OtAaGifrIKhQ5yQ=="],
+
+    "lightningcss-android-arm64": ["lightningcss-android-arm64@1.32.0", "", { "os": "android", "cpu": "arm64" }, "sha512-YK7/ClTt4kAK0vo6w3X+Pnm0D2cf2vPHbhOXdoNti1Ga0al1P4TBZhwjATvjNwLEBCnKvjJc2jQgHXH0NEwlAg=="],
+
+    "lightningcss-darwin-arm64": ["lightningcss-darwin-arm64@1.32.0", "", { "os": "darwin", "cpu": "arm64" }, "sha512-RzeG9Ju5bag2Bv1/lwlVJvBE3q6TtXskdZLLCyfg5pt+HLz9BqlICO7LZM7VHNTTn/5PRhHFBSjk5lc4cmscPQ=="],
+
+    "lightningcss-darwin-x64": ["lightningcss-darwin-x64@1.32.0", "", { "os": "darwin", "cpu": "x64" }, "sha512-U+QsBp2m/s2wqpUYT/6wnlagdZbtZdndSmut/NJqlCcMLTWp5muCrID+K5UJ6jqD2BFshejCYXniPDbNh73V8w=="],
+
+    "lightningcss-freebsd-x64": ["lightningcss-freebsd-x64@1.32.0", "", { "os": "freebsd", "cpu": "x64" }, "sha512-JCTigedEksZk3tHTTthnMdVfGf61Fky8Ji2E4YjUTEQX14xiy/lTzXnu1vwiZe3bYe0q+SpsSH/CTeDXK6WHig=="],
+
+    "lightningcss-linux-arm-gnueabihf": ["lightningcss-linux-arm-gnueabihf@1.32.0", "", { "os": "linux", "cpu": "arm" }, "sha512-x6rnnpRa2GL0zQOkt6rts3YDPzduLpWvwAF6EMhXFVZXD4tPrBkEFqzGowzCsIWsPjqSK+tyNEODUBXeeVHSkw=="],
+
+    "lightningcss-linux-arm64-gnu": ["lightningcss-linux-arm64-gnu@1.32.0", "", { "os": "linux", "cpu": "arm64" }, "sha512-0nnMyoyOLRJXfbMOilaSRcLH3Jw5z9HDNGfT/gwCPgaDjnx0i8w7vBzFLFR1f6CMLKF8gVbebmkUN3fa/kQJpQ=="],
+
+    "lightningcss-linux-arm64-musl": ["lightningcss-linux-arm64-musl@1.32.0", "", { "os": "linux", "cpu": "arm64" }, "sha512-UpQkoenr4UJEzgVIYpI80lDFvRmPVg6oqboNHfoH4CQIfNA+HOrZ7Mo7KZP02dC6LjghPQJeBsvXhJod/wnIBg=="],
+
+    "lightningcss-linux-x64-gnu": ["lightningcss-linux-x64-gnu@1.32.0", "", { "os": "linux", "cpu": "x64" }, "sha512-V7Qr52IhZmdKPVr+Vtw8o+WLsQJYCTd8loIfpDaMRWGUZfBOYEJeyJIkqGIDMZPwPx24pUMfwSxxI8phr/MbOA=="],
+
+    "lightningcss-linux-x64-musl": ["lightningcss-linux-x64-musl@1.32.0", "", { "os": "linux", "cpu": "x64" }, "sha512-bYcLp+Vb0awsiXg/80uCRezCYHNg1/l3mt0gzHnWV9XP1W5sKa5/TCdGWaR/zBM2PeF/HbsQv/j2URNOiVuxWg=="],
+
+    "lightningcss-win32-arm64-msvc": ["lightningcss-win32-arm64-msvc@1.32.0", "", { "os": "win32", "cpu": "arm64" }, "sha512-8SbC8BR40pS6baCM8sbtYDSwEVQd4JlFTOlaD3gWGHfThTcABnNDBda6eTZeqbofalIJhFx0qKzgHJmcPTnGdw=="],
+
+    "lightningcss-win32-x64-msvc": ["lightningcss-win32-x64-msvc@1.32.0", "", { "os": "win32", "cpu": "x64" }, "sha512-Amq9B/SoZYdDi1kFrojnoqPLxYhQ4Wo5XiL8EVJrVsB8ARoC1PWW6VGtT0WKCemjy8aC+louJnjS7U18x3b06Q=="],
+
+    "lucide-react": ["lucide-react@0.545.0", "", { "peerDependencies": { "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0" } }, "sha512-7r1/yUuflQDSt4f1bpn5ZAocyIxcTyVyBBChSVtBKn5M+392cPmI5YJMWOJKk/HUWGm5wg83chlAZtCcGbEZtw=="],
+
+    "nanoid": ["nanoid@3.3.14", "", { "bin": { "nanoid": "bin/nanoid.cjs" } }, "sha512-U9kYi5bpVMEI31yC8iw4bJJp0avcHXA0W8/wNfLfnvJYzihQo2ZRPYPvpAAd570HAcCBjCTN7vnr+v4StKl1IQ=="],
+
+    "picocolors": ["picocolors@1.1.1", "", {}, "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA=="],
+
+    "picomatch": ["picomatch@4.0.4", "", {}, "sha512-QP88BAKvMam/3NxH6vj2o21R6MjxZUAd6nlwAS/pnGvN9IVLocLHxGYIzFhg6fUQ+5th6P4dv4eW9jX3DSIj7A=="],
+
+    "postcss": ["postcss@8.5.15", "", { "dependencies": { "nanoid": "^3.3.12", "picocolors": "^1.1.1", "source-map-js": "^1.2.1" } }, "sha512-FfR8sjd4em2T6fb3I2MwAJU7HWVMr9zba+enmQeeWFfCbm+UOC/0X4DS8XtpUTMwWMGbjKYP7xjfNekzyGmB3A=="],
+
+    "react": ["react@19.2.0", "", {}, "sha512-tmbWg6W31tQLeB5cdIBOicJDJRR2KzXsV7uSK9iNfLWQ5bIZfxuPEHp7M8wiHyHnn0DD1i7w3Zmin0FtkrwoCQ=="],
+
+    "react-dom": ["react-dom@19.2.0", "", { "dependencies": { "scheduler": "^0.27.0" }, "peerDependencies": { "react": "^19.2.0" } }, "sha512-UlbRu4cAiGaIewkPyiRGJk0imDN2T3JjieT6spoL2UeSf5od4n5LB/mQ4ejmxhCFT1tYe8IvaFulzynWovsEFQ=="],
+
+    "rolldown": ["rolldown@1.0.1", "", { "dependencies": { "@oxc-project/types": "=0.130.0", "@rolldown/pluginutils": "^1.0.0" }, "optionalDependencies": { "@rolldown/binding-android-arm64": "1.0.1", "@rolldown/binding-darwin-arm64": "1.0.1", "@rolldown/binding-darwin-x64": "1.0.1", "@rolldown/binding-freebsd-x64": "1.0.1", "@rolldown/binding-linux-arm-gnueabihf": "1.0.1", "@rolldown/binding-linux-arm64-gnu": "1.0.1", "@rolldown/binding-linux-arm64-musl": "1.0.1", "@rolldown/binding-linux-ppc64-gnu": "1.0.1", "@rolldown/binding-linux-s390x-gnu": "1.0.1", "@rolldown/binding-linux-x64-gnu": "1.0.1", "@rolldown/binding-linux-x64-musl": "1.0.1", "@rolldown/binding-openharmony-arm64": "1.0.1", "@rolldown/binding-wasm32-wasi": "1.0.1", "@rolldown/binding-win32-arm64-msvc": "1.0.1", "@rolldown/binding-win32-x64-msvc": "1.0.1" }, "bin": { "rolldown": "bin/cli.mjs" } }, "sha512-X0KQHljNnEkWNqqiz9zJrGunh1B0HgOxLXvnFpCOcadzcy5qohZ3tqMEUg00vncoRovXuK3ZqCT9KnnKzoInFQ=="],
+
+    "scheduler": ["scheduler@0.27.0", "", {}, "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q=="],
+
+    "seroval": ["seroval@1.5.4", "", {}, "sha512-46uFvgrXTVxZcUorgSSRZ4y+ieqLLQRMlG4bnCZKW3qI6BZm7Rg4ntMW4p1mILEEBZWrFlcpp0AyIIlM6jD9iw=="],
+
+    "seroval-plugins": ["seroval-plugins@1.5.4", "", { "peerDependencies": { "seroval": "^1.0" } }, "sha512-S0xQPhUTefAhNvNWFg0c1J8qJArHt5KdtJ/cFAofo06KD1MVSeFWyl4iiu+ApDIuw0WhjpOfCdgConOfAnLgkw=="],
+
+    "source-map-js": ["source-map-js@1.2.1", "", {}, "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA=="],
+
+    "tinyglobby": ["tinyglobby@0.2.17", "", { "dependencies": { "fdir": "^6.5.0", "picomatch": "^4.0.4" } }, "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g=="],
+
+    "tslib": ["tslib@2.8.1", "", {}, "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w=="],
+
+    "turbo": ["turbo@2.9.14", "", { "optionalDependencies": { "@turbo/darwin-64": "2.9.14", "@turbo/darwin-arm64": "2.9.14", "@turbo/linux-64": "2.9.14", "@turbo/linux-arm64": "2.9.14", "@turbo/windows-64": "2.9.14", "@turbo/windows-arm64": "2.9.14" }, "bin": { "turbo": "bin/turbo" } }, "sha512-BQqXRr4UoWI3UPFrtznCLykYHxwxWh53iCB57x092jPMjIlW1wnm3N895g5irpiXmnxUhREBB0n6+y8BHhs4nw=="],
+
+    "typescript": ["typescript@5.9.3", "", { "bin": { "tsc": "bin/tsc", "tsserver": "bin/tsserver" } }, "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw=="],
+
+    "undici-types": ["undici-types@8.3.0", "", {}, "sha512-j375ScV60dom+YkPFIfTLcOiPxkN/buHz5GobjLhixFuANaNs3C9l4GmrWqejgXWJ7BbJcFYpTEUkS1Ge8bpZQ=="],
+
+    "use-sync-external-store": ["use-sync-external-store@1.6.0", "", { "peerDependencies": { "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0" } }, "sha512-Pp6GSwGP/NrPIrxVFAIkOQeyw8lFenOHijQWkUTrDvrF4ALqylP2C/KCkeS9dpUM3KvYRQhna5vt7IL95+ZQ9w=="],
+
+    "vite": ["vite@8.0.13", "", { "dependencies": { "lightningcss": "^1.32.0", "picomatch": "^4.0.4", "postcss": "^8.5.14", "rolldown": "1.0.1", "tinyglobby": "^0.2.16" }, "optionalDependencies": { "fsevents": "~2.3.3" }, "peerDependencies": { "@types/node": "^20.19.0 || >=22.12.0", "@vitejs/devtools": "^0.1.18", "esbuild": "^0.27.0 || ^0.28.0", "jiti": ">=1.21.0", "less": "^4.0.0", "sass": "^1.70.0", "sass-embedded": "^1.70.0", "stylus": ">=0.54.8", "sugarss": "^5.0.0", "terser": "^5.16.0", "tsx": "^4.8.1", "yaml": "^2.4.2" }, "optionalPeers": ["@types/node", "@vitejs/devtools", "esbuild", "jiti", "less", "sass", "sass-embedded", "stylus", "sugarss", "terser", "tsx", "yaml"], "bin": { "vite": "bin/vite.js" } }, "sha512-MFtjBYgzmSxmgA4RAfjIyXWpGe1oALnjgUTzzV7QLx/TKxCzjtMH6Fd9/eVK+5Fg1qNoz5VAwsmMs/NofrmJvw=="],
+
+    "rolldown/@rolldown/pluginutils": ["@rolldown/pluginutils@1.0.1", "", {}, "sha512-2j9bGt5Jh8hj+vPtgzPtl72j0yRxHAyumoo6TNfAjsLB04UtpSvPbPcDcBMxz7n+9CYB0c1GxQFxYRg2jimqGw=="],
+  }
+}

```

## turbo.json

```diff
diff --git a/turbo.json b/turbo.json
new file mode 100644
index 0000000..f15d47d
--- /dev/null
+++ b/turbo.json
@@ -0,0 +1,20 @@
+{
+  "$schema": "https://turbo.build/schema.json",
+  "ui": "tui",
+  "tasks": {
+    "build": {
+      "dependsOn": ["^build"],
+      "outputs": ["dist/**", ".output/**"]
+    },
+    "dev": {
+      "cache": false,
+      "persistent": true
+    },
+    "typecheck": {
+      "dependsOn": ["^typecheck"]
+    },
+    "test": {
+      "dependsOn": ["^build"]
+    }
+  }
+}

```

## tsconfig.base.json

```diff
diff --git a/tsconfig.base.json b/tsconfig.base.json
new file mode 100644
index 0000000..c40ad56
--- /dev/null
+++ b/tsconfig.base.json
@@ -0,0 +1,31 @@
+{
+  "$schema": "https://json.schemastore.org/tsconfig",
+  "compilerOptions": {
+    "target": "ESNext",
+    "lib": ["ESNext", "DOM", "DOM.Iterable"],
+    "module": "ESNext",
+    "moduleResolution": "bundler",
+    "moduleDetection": "force",
+    "verbatimModuleSyntax": true,
+    "noEmit": true,
+    "jsx": "react-jsx",
+    "strict": true,
+    "noImplicitAny": true,
+    "strictNullChecks": true,
+    "noImplicitOverride": true,
+    "noUnusedLocals": true,
+    "noUnusedParameters": true,
+    "noFallthroughCasesInSwitch": true,
+    "noUncheckedIndexedAccess": true,
+    "exactOptionalPropertyTypes": false,
+    "esModuleInterop": true,
+    "forceConsistentCasingInFileNames": true,
+    "isolatedModules": true,
+    "resolveJsonModule": true,
+    "skipLibCheck": true,
+    "allowSyntheticDefaultImports": true,
+    "useDefineForClassFields": true,
+    "types": ["bun"]
+  },
+  "exclude": ["node_modules", "dist", ".output", ".turbo"]
+}

```

## tsconfig.json

```diff
diff --git a/tsconfig.json b/tsconfig.json
new file mode 100644
index 0000000..725f316
--- /dev/null
+++ b/tsconfig.json
@@ -0,0 +1,4 @@
+{
+  "extends": "./tsconfig.base.json",
+  "files": []
+}

```

## apps/web/package.json

```diff
diff --git a/apps/web/package.json b/apps/web/package.json
new file mode 100644
index 0000000..ba95374
--- /dev/null
+++ b/apps/web/package.json
@@ -0,0 +1,28 @@
+{
+  "name": "@ottawa-church/web",
+  "version": "0.1.0",
+  "private": true,
+  "type": "module",
+  "imports": {
+    "#/*": "./src/*"
+  },
+  "scripts": {
+    "dev": "vite dev --host 127.0.0.1 --port 3000",
+    "build": "vite build",
+    "preview": "vite preview --port 3000",
+    "typecheck": "tsc --noEmit -p tsconfig.json"
+  },
+  "dependencies": {
+    "@ottawa-church/domain": "workspace:*",
+    "@tanstack/react-router": "1.170.5",
+    "@vitejs/plugin-react": "6.0.1",
+    "lucide-react": "0.545.0",
+    "react": "19.2.0",
+    "react-dom": "19.2.0",
+    "vite": "8.0.13"
+  },
+  "devDependencies": {
+    "@types/react": "19.2.0",
+    "@types/react-dom": "19.2.0"
+  }
+}

```

## apps/web/tsconfig.json

```diff
diff --git a/apps/web/tsconfig.json b/apps/web/tsconfig.json
new file mode 100644
index 0000000..95d7cde
--- /dev/null
+++ b/apps/web/tsconfig.json
@@ -0,0 +1,10 @@
+{
+  "extends": "../../tsconfig.base.json",
+  "compilerOptions": {
+    "baseUrl": ".",
+    "paths": {
+      "#/*": ["src/*"]
+    }
+  },
+  "include": ["src/**/*.ts", "src/**/*.tsx", "vite.config.ts"]
+}

```

## apps/web/vite.config.ts

```diff
diff --git a/apps/web/vite.config.ts b/apps/web/vite.config.ts
new file mode 100644
index 0000000..8195215
--- /dev/null
+++ b/apps/web/vite.config.ts
@@ -0,0 +1,6 @@
+import viteReact from '@vitejs/plugin-react';
+import { defineConfig } from 'vite';
+
+export default defineConfig({
+  plugins: [viteReact()],
+});

```

## apps/web/index.html

```diff
diff --git a/apps/web/index.html b/apps/web/index.html
new file mode 100644
index 0000000..a0cc098
--- /dev/null
+++ b/apps/web/index.html
@@ -0,0 +1,12 @@
+<!doctype html>
+<html lang="en">
+  <head>
+    <meta charset="UTF-8" />
+    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+    <title>Ottawa Church Events</title>
+  </head>
+  <body>
+    <div id="root"></div>
+    <script type="module" src="/src/main.tsx"></script>
+  </body>
+</html>

```

## apps/web/public/_redirects

```diff
diff --git a/apps/web/public/_redirects b/apps/web/public/_redirects
new file mode 100644
index 0000000..7797f7c
--- /dev/null
+++ b/apps/web/public/_redirects
@@ -0,0 +1 @@
+/* /index.html 200

```

## apps/web/public/favicon.ico

```diff
diff --git a/apps/web/public/favicon.ico b/apps/web/public/favicon.ico
new file mode 100644
index 0000000..8b13789
--- /dev/null
+++ b/apps/web/public/favicon.ico
@@ -0,0 +1 @@
+

```

## apps/web/src/main.tsx

```diff
diff --git a/apps/web/src/main.tsx b/apps/web/src/main.tsx
new file mode 100644
index 0000000..a68ee2e
--- /dev/null
+++ b/apps/web/src/main.tsx
@@ -0,0 +1,11 @@
+import React from 'react';
+import ReactDOM from 'react-dom/client';
+import { RouterProvider } from '@tanstack/react-router';
+import { router } from './router';
+import './styles.css';
+
+ReactDOM.createRoot(document.getElementById('root')!).render(
+  <React.StrictMode>
+    <RouterProvider router={router} />
+  </React.StrictMode>,
+);

```

## apps/web/src/router.tsx

```diff
diff --git a/apps/web/src/router.tsx b/apps/web/src/router.tsx
new file mode 100644
index 0000000..327a37b
--- /dev/null
+++ b/apps/web/src/router.tsx
@@ -0,0 +1,29 @@
+import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
+import { ChurchEventsApp } from './features/church-events/ChurchEventsApp';
+
+const rootRoute = createRootRoute({
+  component: () => <Outlet />,
+});
+
+const indexRoute = createRoute({
+  getParentRoute: () => rootRoute,
+  path: '/',
+  component: ChurchEventsApp,
+});
+
+const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: ChurchEventsApp });
+const serviceRoute = createRoute({ getParentRoute: () => rootRoute, path: '/service-times-location', component: ChurchEventsApp });
+const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: ChurchEventsApp });
+const eventsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events', component: ChurchEventsApp });
+const portalRoute = createRoute({ getParentRoute: () => rootRoute, path: '/portal', component: ChurchEventsApp });
+const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: ChurchEventsApp });
+
+const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, serviceRoute, contactRoute, eventsRoute, portalRoute, adminRoute]);
+
+export const router = createRouter({ routeTree });
+
+declare module '@tanstack/react-router' {
+  interface Register {
+    router: typeof router;
+  }
+}

```

## apps/web/src/routes/__root.tsx

```diff
diff --git a/apps/web/src/routes/__root.tsx b/apps/web/src/routes/__root.tsx
new file mode 100644
index 0000000..01fc8bf
--- /dev/null
+++ b/apps/web/src/routes/__root.tsx
@@ -0,0 +1 @@
+export { router } from '../router';

```

## apps/web/src/routes/index.tsx

```diff
diff --git a/apps/web/src/routes/index.tsx b/apps/web/src/routes/index.tsx
new file mode 100644
index 0000000..07dc866
--- /dev/null
+++ b/apps/web/src/routes/index.tsx
@@ -0,0 +1 @@
+export { ChurchEventsApp as default } from '../features/church-events/ChurchEventsApp';

```

## apps/web/src/lib/storage.ts

```diff
diff --git a/apps/web/src/lib/storage.ts b/apps/web/src/lib/storage.ts
new file mode 100644
index 0000000..77ca0d0
--- /dev/null
+++ b/apps/web/src/lib/storage.ts
@@ -0,0 +1,22 @@
+import { type AppState, initialState } from '@ottawa-church/domain';
+
+const storageKey = 'ottawa-church-events-state-v1';
+
+export function loadState(): AppState {
+  if (typeof localStorage === 'undefined') return initialState;
+  const raw = localStorage.getItem(storageKey);
+  if (!raw) return initialState;
+  try {
+    return JSON.parse(raw) as AppState;
+  } catch {
+    return initialState;
+  }
+}
+
+export function saveState(state: AppState) {
+  localStorage.setItem(storageKey, JSON.stringify(state));
+}
+
+export function resetState() {
+  localStorage.removeItem(storageKey);
+}

```

## apps/web/src/lib/download.ts

```diff
diff --git a/apps/web/src/lib/download.ts b/apps/web/src/lib/download.ts
new file mode 100644
index 0000000..e9f8c9c
--- /dev/null
+++ b/apps/web/src/lib/download.ts
@@ -0,0 +1,9 @@
+export function downloadFile(filename: string, content: string, type: string) {
+  const blob = new Blob([content], { type });
+  const url = URL.createObjectURL(blob);
+  const link = document.createElement('a');
+  link.href = url;
+  link.download = filename;
+  link.click();
+  URL.revokeObjectURL(url);
+}

```

## apps/web/src/features/church-events/ChurchEventsApp.tsx

```diff
diff --git a/apps/web/src/features/church-events/ChurchEventsApp.tsx b/apps/web/src/features/church-events/ChurchEventsApp.tsx
new file mode 100644
index 0000000..6efacec
--- /dev/null
+++ b/apps/web/src/features/church-events/ChurchEventsApp.tsx
@@ -0,0 +1,370 @@
+import { Link, useRouterState } from '@tanstack/react-router';
+import {
+  ageRanges,
+  emptyAgeCounts,
+  eventTotals,
+  formatDateTime,
+  generateIcs,
+  generateRosterCsv,
+  initialState,
+  registerForEvent,
+  statusLabel,
+  updateApproval,
+  updateRsvp,
+  type AgeRangeKey,
+  type ApprovalStatus,
+  type AppState,
+  type ChurchEvent,
+  type EventStatus,
+  type Registration,
+  type RsvpStatus,
+  type User,
+} from '@ottawa-church/domain';
+import { CalendarPlus, CircleUserRound, MapPin, MoreHorizontal, Plus, Printer, ShieldCheck, UserPlus, X } from 'lucide-react';
+import type { FormEvent, ReactNode } from 'react';
+import { useEffect, useState } from 'react';
+import { downloadFile } from '#/lib/download';
+import { loadState, resetState, saveState } from '#/lib/storage';
+
+type DialogMode =
+  | { type: 'none' }
+  | { type: 'details'; event: ChurchEvent }
+  | { type: 'register'; event: ChurchEvent }
+  | { type: 'signup'; event?: ChurchEvent }
+  | { type: 'create-event' }
+  | { type: 'print'; event: ChurchEvent };
+
+const navItems = [
+  { label: 'Home', to: '/' },
+  { label: 'About', to: '/about' },
+  { label: 'Service Times & Location', to: '/service-times-location' },
+  { label: 'Events', to: '/events' },
+  { label: 'Contact', to: '/contact' },
+];
+
+export function ChurchEventsApp() {
+  const [state, setState] = useState<AppState>(() => loadState());
+  const [dialog, setDialog] = useState<DialogMode>({ type: 'none' });
+  const [notice, setNotice] = useState('');
+  const pathname = useRouterState({ select: (routerState) => routerState.location.pathname });
+  const activeUser = state.users.find((user) => user.id === state.activeUserId) ?? null;
+  const publishedEvents = state.events.filter((event) => event.status === 'published').sort((first, second) => first.startsAt.localeCompare(second.startsAt));
+
+  useEffect(() => saveState(state), [state]);
+
+  function commit(nextState: AppState, nextNotice?: string) {
+    setState(nextState);
+    if (nextNotice) setNotice(nextNotice);
+  }
+
+  function signIn(user: User) {
+    commit({ ...state, activeUserId: user.id }, `Signed in as ${user.name}.`);
+  }
+
+  function signOut() {
+    commit({ ...state, activeUserId: null }, 'Signed out.');
+  }
+
+  function addDemoSignup(name: string, email: string, phone: string, event?: ChurchEvent) {
+    const user: User = { id: `user-${Date.now()}`, name, email, phone, isAdmin: false };
+    commit({ ...state, users: [...state.users, user], activeUserId: user.id }, 'Account created. You can now register for events.');
+    setDialog(event ? { type: 'register', event } : { type: 'none' });
+  }
+
+  function handleCalendar(event: ChurchEvent) {
+    downloadFile(`${event.id}.ics`, generateIcs(event, window.location.origin), 'text/calendar;charset=utf-8');
+    setNotice('Calendar file generated.');
+  }
+
+  function handleCsv(event: ChurchEvent) {
+    downloadFile(`${event.id}-roster.csv`, generateRosterCsv(event, state.registrations), 'text/csv;charset=utf-8');
+    setNotice('CSV roster exported.');
+  }
+
+  function visiblePage() {
+    if (pathname === '/about') return <AboutPage />;
+    if (pathname === '/service-times-location') return <ServicePage />;
+    if (pathname === '/contact') return <ContactPage />;
+    if (pathname === '/portal') return <PortalPage state={state} activeUser={activeUser} setState={commit} />;
+    if (pathname === '/admin') return <AdminPage state={state} activeUser={activeUser} setState={commit} setDialog={setDialog} onCsv={handleCsv} />;
+    return <EventsHome publishedEvents={publishedEvents} activeUser={activeUser} state={state} setDialog={setDialog} onCalendar={handleCalendar} />;
+  }
+
+  return (
+    <div className="app-shell">
+      <header className="site-header">
+        <Link to="/" className="brand" aria-label="Ottawa Church home">
+          <span className="brand-mark">OC</span>
+          <span>
+            <strong>Ottawa Church</strong>
+            <small>Events & community</small>
+          </span>
+        </Link>
+        <nav className="main-nav" aria-label="Main navigation">
+          {navItems.map((item) => <Link key={item.to} to={item.to} activeProps={{ className: 'active' }}>{item.label}</Link>)}
+          {activeUser ? <Link to="/portal">Portal</Link> : null}
+          {activeUser?.isAdmin ? <Link to="/admin">Admin</Link> : null}
+        </nav>
+        <div className="auth-actions">
+          {activeUser ? (
+            <>
+              <span className="user-chip"><CircleUserRound size={16} /> {activeUser.name}</span>
+              <button className="button secondary" onClick={signOut}>Sign out</button>
+            </>
+          ) : (
+            <>
+              <button className="button secondary" onClick={() => signIn(state.users[1]!)}>Sign in</button>
+              <button className="button secondary" onClick={() => signIn(state.users[0]!)}>Admin demo</button>
+              <button className="button primary" onClick={() => setDialog({ type: 'signup' })}><UserPlus size={16} /> Sign up</button>
+            </>
+          )}
+        </div>
+      </header>
+
+      {notice ? <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notice">×</button></div> : null}
+
+      <main>{visiblePage()}</main>
+
+      <footer className="site-footer">
+        <span>Ottawa Church · Sunday service 10:00 AM</span>
+        <span>Built for simple, free-tier-friendly event coordination.</span>
+        <button className="link-button" onClick={() => { resetState(); setState(initialState); setNotice('Demo data reset.'); }}>Reset demo data</button>
+      </footer>
+
+      <DialogLayer dialog={dialog} setDialog={setDialog} state={state} activeUser={activeUser} setState={commit} onSignup={addDemoSignup} onCalendar={handleCalendar} />
+    </div>
+  );
+}
+
+function EventsHome({ publishedEvents, activeUser, state, setDialog, onCalendar }: {
+  publishedEvents: ChurchEvent[];
+  activeUser: User | null;
+  state: AppState;
+  setDialog: (dialog: DialogMode) => void;
+  onCalendar: (event: ChurchEvent) => void;
+}) {
+  return (
+    <>
+      <section className="hero">
+        <div className="hero-copy">
+          <span className="eyebrow">Upcoming community events</span>
+          <h1>Register for church events with clarity and care.</h1>
+          <p>Find BBQs, harvest days, camping weekends, and community gatherings. Register your group, include age-range counts, and keep your status up to date.</p>
+        </div>
+        <div className="hero-card">
+          <strong>{publishedEvents.length}</strong>
+          <span>published events</span>
+          <small>Admin approval keeps planning accurate.</small>
+        </div>
+      </section>
+      <section className="content-section" id="events">
+        <SectionHeader title="Upcoming events" description="Register from the row menu. Details and calendar export stay with the event itself." />
+        <EventTable events={publishedEvents} registrations={state.registrations} activeUser={activeUser} setDialog={setDialog} onCalendar={onCalendar} />
+      </section>
+    </>
+  );
+}
+
+function EventTable({ events, registrations, activeUser, setDialog, onCalendar }: {
+  events: ChurchEvent[];
+  registrations: Registration[];
+  activeUser: User | null;
+  setDialog: (dialog: DialogMode) => void;
+  onCalendar: (event: ChurchEvent) => void;
+}) {
+  if (!events.length) return <div className="empty-state">No upcoming events are published right now.</div>;
+  return (
+    <div className="table-card">
+      <table>
+        <thead>
+          <tr><th>Event</th><th>Date</th><th>Location</th><th>Status</th><th>Actions</th></tr>
+        </thead>
+        <tbody>
+          {events.map((event) => {
+            const registration = activeUser ? registrations.find((item) => item.eventId === event.id && item.userId === activeUser.id) : undefined;
+            return (
+              <tr key={event.id}>
+                <td><strong>{event.title}</strong><small>{event.summary}</small></td>
+                <td>{formatDateTime(event.startsAt)}</td>
+                <td><a href={event.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={14} /> {event.location}</a></td>
+                <td><StatusBadge status={registration?.approvalStatus ?? 'not_registered'} /></td>
+                <td><RowMenu items={[
+                  { label: 'Details', action: () => setDialog({ type: 'details', event }) },
+                  { label: registration ? 'View status' : 'Register', action: () => activeUser ? setDialog({ type: 'register', event }) : setDialog({ type: 'signup', event }) },
+                  { label: 'Add to calendar', action: () => onCalendar(event) },
+                ]} /></td>
+              </tr>
+            );
+          })}
+        </tbody>
+      </table>
+    </div>
+  );
+}
+
+function PortalPage({ state, activeUser, setState }: { state: AppState; activeUser: User | null; setState: (state: AppState, notice?: string) => void }) {
+  if (!activeUser) return <GateCard title="Sign in required" description="Use Sign in or Sign up to see your registrations." />;
+  const mine = state.registrations.filter((registration) => registration.userId === activeUser.id);
+  return (
+    <section className="content-section">
+      <SectionHeader title="Participant portal" description="Track approval status and update whether you will attend." />
+      <div className="table-card">
+        <table>
+          <thead><tr><th>Event</th><th>Approval</th><th>RSVP</th><th>Group</th><th>Actions</th></tr></thead>
+          <tbody>
+            {mine.map((registration) => {
+              const event = state.events.find((item) => item.id === registration.eventId)!;
+              return <tr key={registration.id}>
+                <td><strong>{event.title}</strong><small>{formatDateTime(event.startsAt)}</small></td>
+                <td><StatusBadge status={registration.approvalStatus} /></td>
+                <td><StatusBadge status={registration.rsvpStatus} /></td>
+                <td>{1 + registration.accompanyingCount} people</td>
+                <td><RowMenu items={[
+                  { label: 'Mark attending', action: () => setState(updateRsvp(state, registration.id, 'attending'), 'RSVP saved as attending.') },
+                  { label: 'Mark not attending', action: () => setState(updateRsvp(state, registration.id, 'not_attending'), 'You marked this event as not attending.') },
+                ]} /></td>
+              </tr>;
+            })}
+          </tbody>
+        </table>
+      </div>
+    </section>
+  );
+}
+
+function AdminPage({ state, activeUser, setState, setDialog, onCsv }: {
+  state: AppState;
+  activeUser: User | null;
+  setState: (state: AppState, notice?: string) => void;
+  setDialog: (dialog: DialogMode) => void;
+  onCsv: (event: ChurchEvent) => void;
+}) {
+  if (!activeUser?.isAdmin) return <GateCard title="Admin access required" description="You do not have access to this page." />;
+  return (
+    <section className="content-section">
+      <div className="section-heading with-action"><div><h2>Admin events</h2><p>Manage events, approvals, planning totals, reminders, and rosters.</p></div><button className="button primary" onClick={() => setDialog({ type: 'create-event' })}><Plus size={16} /> Create event</button></div>
+      <div className="stats-grid">
+        <Metric label="Pending approvals" value={state.registrations.filter((registration) => registration.approvalStatus === 'pending').length} />
+        <Metric label="Approved registrations" value={state.registrations.filter((registration) => registration.approvalStatus === 'approved').length} />
+        <Metric label="Published events" value={state.events.filter((event) => event.status === 'published').length} />
+      </div>
+      <div className="table-card">
+        <table>
+          <thead><tr><th>Event</th><th>Status</th><th>Planning totals</th><th>Age signal</th><th>Actions</th></tr></thead>
+          <tbody>{state.events.map((event) => {
+            const totals = eventTotals(event.id, state.registrations);
+            const pending = state.registrations.filter((registration) => registration.eventId === event.id && registration.approvalStatus === 'pending');
+            return <tr key={event.id}>
+              <td><strong>{event.title}</strong><small>{formatDateTime(event.startsAt)}</small></td>
+              <td><StatusBadge status={event.status} /></td>
+              <td>{totals.pending} pending · {totals.approved} approved · {totals.people} people</td>
+              <td>{ageRanges.map((range) => `${range}: ${totals.ages[range]}`).join(' · ')}</td>
+              <td><RowMenu items={[
+                { label: 'Review pending', action: () => pending[0] ? setState(updateApproval(state, pending[0].id, 'approved', activeUser.name), `Approved ${pending[0].participantName}.`) : setState(state, 'No pending registrations.') },
+                { label: 'Export roster CSV', action: () => onCsv(event) },
+                { label: 'Printable roster', action: () => setDialog({ type: 'print', event }) },
+                { label: 'Send reminder', action: () => setState(state, 'Reminder queued in demo mode. Email adapter remains free-tier-ready.') },
+              ]} /></td>
+            </tr>;
+          })}</tbody>
+        </table>
+      </div>
+    </section>
+  );
+}
+
+function DialogLayer({ dialog, setDialog, state, activeUser, setState, onSignup, onCalendar }: {
+  dialog: DialogMode;
+  setDialog: (dialog: DialogMode) => void;
+  state: AppState;
+  activeUser: User | null;
+  setState: (state: AppState, notice?: string) => void;
+  onSignup: (name: string, email: string, phone: string, event?: ChurchEvent) => void;
+  onCalendar: (event: ChurchEvent) => void;
+}) {
+  if (dialog.type === 'none') return null;
+  const close = () => setDialog({ type: 'none' });
+  return <div className="dialog-backdrop" role="presentation" onMouseDown={close}>
+    <div className="dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
+      <button className="dialog-close" onClick={close} aria-label="Close dialog"><X size={18} /></button>
+      {dialog.type === 'details' ? <EventDetails event={dialog.event} activeUser={activeUser} registrations={state.registrations} onCalendar={onCalendar} /> : null}
+      {dialog.type === 'signup' ? <SignupForm event={dialog.event} onSignup={onSignup} /> : null}
+      {dialog.type === 'register' ? <RegistrationForm event={dialog.event} activeUser={activeUser} state={state} setState={setState} close={close} /> : null}
+      {dialog.type === 'create-event' ? <CreateEventForm state={state} setState={setState} close={close} /> : null}
+      {dialog.type === 'print' ? <PrintableRoster event={dialog.event} registrations={state.registrations} /> : null}
+    </div>
+  </div>;
+}
+
+function EventDetails({ event, activeUser, registrations, onCalendar }: { event: ChurchEvent; activeUser: User | null; registrations: Registration[]; onCalendar: (event: ChurchEvent) => void }) {
+  const approved = registrations.filter((registration) => registration.eventId === event.id && registration.approvalStatus === 'approved');
+  return <div className="dialog-content"><span className="eyebrow">Event details</span><h2>{event.title}</h2><p>{event.description}</p><div className="detail-grid">
+    <Detail label="Date" value={formatDateTime(event.startsAt)} />
+    <Detail label="Location" value={<a href={event.mapsUrl} target="_blank" rel="noreferrer">{event.location}</a>} />
+    <Detail label="Capacity" value={`${event.capacity} people`} />
+    <Detail label="Cost" value={event.cost} />
+    <Detail label="Age group" value={event.ageGroup} />
+    <Detail label="Required items" value={event.requiredItems} />
+    <Detail label="Transportation" value={event.transportation} />
+    <Detail label="Waiver / consent" value={event.waiver || 'No extra waiver note.'} />
+    <Detail label="Volunteer needs" value={event.volunteerNeeds} />
+    {activeUser ? <Detail label="People going" value={`${approved.length} approved registrations`} /> : null}
+  </div><button className="button secondary" onClick={() => onCalendar(event)}><CalendarPlus size={16} /> Add to calendar</button></div>;
+}
+
+function SignupForm({ event, onSignup }: { event?: ChurchEvent; onSignup: (name: string, email: string, phone: string, event?: ChurchEvent) => void }) {
+  const [name, setName] = useState('Maria Santos');
+  const [email, setEmail] = useState('maria@example.com');
+  const [phone, setPhone] = useState('613-555-0199');
+  return <form className="dialog-content form-stack" onSubmit={(submitEvent) => { submitEvent.preventDefault(); onSignup(name, email, phone, event); }}><span className="eyebrow">Website sign up</span><h2>Create your account</h2><p>This creates your website account only. Event registration happens separately after sign in.</p><label>Name<input value={name} onChange={(event) => setName(event.target.value)} required /></label><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} required /></label><label>Password<input type="password" defaultValue="welcome123" required /></label><button className="button primary">Create account</button></form>;
+}
+
+function RegistrationForm({ event, activeUser, state, setState, close }: { event: ChurchEvent; activeUser: User | null; state: AppState; setState: (state: AppState, notice?: string) => void; close: () => void }) {
+  const [accompanyingCount, setAccompanyingCount] = useState(0);
+  const [ageCounts, setAgeCounts] = useState<Record<AgeRangeKey, number>>(emptyAgeCounts());
+  const [notes, setNotes] = useState('');
+  const [errors, setErrors] = useState<string[]>([]);
+  if (!activeUser) return <GateCard title="Sign in required" description="Create an account or sign in before registering for an event." />;
+  function submit(formEvent: FormEvent) {
+    formEvent.preventDefault();
+    const result = registerForEvent(state, { eventId: event.id, user: activeUser!, accompanyingCount, ageCounts, notes });
+    setErrors(result.errors);
+    if (!result.errors.length) {
+      setState(result.state, 'Your registration is pending approval.');
+      close();
+    }
+  }
+  return <form className="dialog-content form-stack" onSubmit={submit}><span className="eyebrow">Event registration</span><h2>{event.title}</h2><p>Include yourself in the age ranges. Example: if you are coming with 2 children, accompanying people = 2 and age ranges total = 3.</p>{errors.length ? <div className="error-summary">{errors.map((error) => <div key={error}>{error}</div>)}</div> : null}<label>Accompanying people<input type="number" min="0" value={accompanyingCount} onChange={(event) => setAccompanyingCount(Number(event.target.value))} /></label><fieldset><legend>Age ranges</legend>{ageRanges.map((range) => <label className="age-row" key={range}><span>{range}</span><input type="number" min="0" value={ageCounts[range]} onChange={(event) => setAgeCounts({ ...ageCounts, [range]: Number(event.target.value) })} /></label>)}</fieldset><label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Allergies, transportation, or planning notes" /></label><button className="button primary">Submit registration</button></form>;
+}
+
+function CreateEventForm({ state, setState, close }: { state: AppState; setState: (state: AppState, notice?: string) => void; close: () => void }) {
+  const [title, setTitle] = useState('New Community Event');
+  const [location, setLocation] = useState('Ottawa Church');
+  function submit(event: FormEvent) {
+    event.preventDefault();
+    const newEvent: ChurchEvent = { id: `event-${Date.now()}`, title, status: 'draft', startsAt: '2026-10-03T10:00:00-04:00', endsAt: '2026-10-03T13:00:00-04:00', summary: 'Draft event summary.', description: 'Draft event description.', location, mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(location)}`, capacity: 50, cost: 'Free', ageGroup: 'All ages', requiredItems: '', waiver: '', transportation: '', volunteerNeeds: '', registrationOpen: true };
+    setState({ ...state, events: [...state.events, newEvent] }, 'Draft event created.');
+    close();
+  }
+  return <form className="dialog-content form-stack" onSubmit={submit}><span className="eyebrow">Create event</span><h2>Create event</h2><label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} required /></label><label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} required /></label><label>Publication status<select defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option></select></label><button className="button primary">Save event</button></form>;
+}
+
+function PrintableRoster({ event, registrations }: { event: ChurchEvent; registrations: Registration[] }) {
+  const rows = registrations.filter((registration) => registration.eventId === event.id);
+  return <div className="dialog-content print-roster"><h2>{event.title} roster</h2><p>{formatDateTime(event.startsAt)} · {event.location}</p><table><thead><tr><th>Participant</th><th>Approval</th><th>RSVP</th><th>Group</th></tr></thead><tbody>{rows.map((registration) => <tr key={registration.id}><td>{registration.participantName}</td><td>{statusLabel(registration.approvalStatus)}</td><td>{statusLabel(registration.rsvpStatus)}</td><td>{1 + registration.accompanyingCount}</td></tr>)}</tbody></table><button className="button secondary no-print" onClick={() => window.print()}><Printer size={16} /> Print</button></div>;
+}
+
+function AboutPage() { return <InfoPage title="About Ottawa Church" text="We are a local church community focused on worship, Scripture, hospitality, and practical service in Ottawa." />; }
+function ServicePage() { return <InfoPage title="Service Times & Location" text="Sunday service is at 10:00 AM. Join us at 120 Riverside Dr, Ottawa. Parking and transit access are available." />; }
+function ContactPage() { return <InfoPage title="Contact" text="Questions about events? Email events@ottawachurch.test or speak with the welcome team on Sunday." />; }
+function InfoPage({ title, text }: { title: string; text: string }) { return <section className="content-section narrow"><span className="eyebrow">Church information</span><h1>{title}</h1><p>{text}</p></section>; }
+function SectionHeader({ title, description }: { title: string; description: string }) { return <div className="section-heading"><h2>{title}</h2><p>{description}</p></div>; }
+function Metric({ label, value }: { label: string; value: number }) { return <div className="metric"><strong>{value}</strong><span>{label}</span></div>; }
+function GateCard({ title, description }: { title: string; description: string }) { return <section className="content-section narrow"><div className="empty-state"><ShieldCheck size={28} /><h2>{title}</h2><p>{description}</p></div></section>; }
+function Detail({ label, value }: { label: string; value: ReactNode }) { return <div className="detail"><span>{label}</span><strong>{value}</strong></div>; }
+function StatusBadge({ status }: { status: string }) { return <span className={`badge ${status}`}>{statusLabel(status as ApprovalStatus | RsvpStatus | EventStatus)}</span>; }
+
+function RowMenu({ items }: { items: Array<{ label: string; action: () => void }> }) {
+  const [open, setOpen] = useState(false);
+  return <div className="row-menu"><button className="icon-button" onClick={() => setOpen(!open)} aria-label="Open row actions"><MoreHorizontal size={18} /></button>{open ? <div className="menu-panel">{items.map((item) => <button key={item.label} onClick={() => { item.action(); setOpen(false); }}>{item.label}</button>)}</div> : null}</div>;
+}

```

## apps/web/src/styles.css

```diff
diff --git a/apps/web/src/styles.css b/apps/web/src/styles.css
new file mode 100644
index 0000000..021575c
--- /dev/null
+++ b/apps/web/src/styles.css
@@ -0,0 +1,109 @@
+:root {
+  color-scheme: light;
+  --surface: #ffffff;
+  --surface-muted: #f8fafc;
+  --surface-strong: #f1f5f9;
+  --ink: #020817;
+  --ink-muted: #64748b;
+  --border: #e2e8f0;
+  --primary: #7c3aed;
+  --primary-foreground: #ffffff;
+  --primary-soft: #f5f3ff;
+  --success: #006d3d;
+  --warning: #7d5800;
+  --danger: #b3261e;
+  --info: #005ac1;
+  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
+  background: var(--surface-muted);
+  color: var(--ink);
+}
+* { box-sizing: border-box; }
+body { margin: 0; min-width: 320px; background: var(--surface-muted); }
+a { color: inherit; }
+button, input, textarea, select { font: inherit; }
+button { cursor: pointer; }
+.app-shell { min-height: 100vh; display: flex; flex-direction: column; }
+.site-header { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 20px; justify-content: space-between; padding: 14px clamp(20px, 5vw, 64px); background: rgba(255,255,255,.92); border-bottom: 1px solid var(--border); backdrop-filter: blur(14px); }
+.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; min-width: 190px; }
+.brand-mark { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: var(--primary); color: white; font-weight: 800; }
+.brand small, td small { display: block; color: var(--ink-muted); margin-top: 3px; }
+.main-nav { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
+.main-nav a { text-decoration: none; color: var(--ink-muted); padding: 8px 10px; border-radius: 8px; font-size: 14px; }
+.main-nav a.active, .main-nav a:hover { color: var(--ink); background: var(--surface-strong); }
+.auth-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
+.user-chip { display: inline-flex; align-items: center; gap: 6px; color: var(--ink-muted); font-size: 14px; }
+.button { min-height: 40px; border-radius: 8px; border: 1px solid transparent; padding: 9px 14px; display: inline-flex; align-items: center; gap: 8px; justify-content: center; font-weight: 650; }
+.button.primary { background: var(--primary); color: var(--primary-foreground); }
+.button.secondary { background: white; border-color: var(--border); color: var(--ink); }
+.button:hover { filter: brightness(.98); }
+.link-button { border: 0; background: transparent; text-decoration: underline; color: var(--ink-muted); }
+.notice { margin: 16px clamp(20px, 5vw, 64px) 0; padding: 12px 14px; border: 1px solid #ddd6fe; background: var(--primary-soft); border-radius: 12px; display: flex; justify-content: space-between; gap: 16px; }
+.notice button { border: 0; background: transparent; font-size: 18px; }
+.hero { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 28px; padding: 64px clamp(20px, 5vw, 64px) 36px; align-items: end; }
+.hero h1 { font-size: clamp(34px, 6vw, 64px); line-height: 1.05; letter-spacing: -.04em; margin: 8px 0 18px; max-width: 850px; }
+.hero p { color: var(--ink-muted); font-size: 18px; line-height: 1.7; max-width: 680px; }
+.eyebrow { color: #5b21b6; font-weight: 750; font-size: 13px; letter-spacing: .04em; }
+.hero-card, .metric, .empty-state, .table-card, .dialog { background: white; border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 12px 35px rgba(15, 23, 42, .05); }
+.hero-card { padding: 24px; }
+.hero-card strong { font-size: 54px; display: block; }
+.hero-card span { font-weight: 700; display: block; }
+.hero-card small { color: var(--ink-muted); }
+.content-section { padding: 32px clamp(20px, 5vw, 64px); }
+.content-section.narrow { max-width: 860px; }
+.section-heading { display: flex; justify-content: space-between; gap: 18px; margin-bottom: 18px; align-items: end; }
+.section-heading h2, .content-section h1 { margin: 0 0 8px; font-size: 30px; letter-spacing: -.02em; }
+.section-heading p, .content-section p { color: var(--ink-muted); line-height: 1.65; margin: 0; }
+.with-action { align-items: center; }
+.table-card { overflow: visible; }
+table { width: 100%; border-collapse: collapse; }
+th { text-align: left; color: var(--ink-muted); background: var(--surface-muted); font-size: 13px; }
+th, td { padding: 15px; border-bottom: 1px solid var(--border); vertical-align: top; }
+tr:last-child td { border-bottom: 0; }
+td a { display: inline-flex; align-items: center; gap: 4px; color: var(--info); text-decoration: none; }
+.badge { display: inline-flex; align-items: center; white-space: nowrap; border-radius: 999px; padding: 5px 10px; font-size: 12px; font-weight: 750; background: var(--surface-strong); color: var(--ink-muted); }
+.badge.approved, .badge.attending, .badge.published { background: #e6f4ea; color: var(--success); }
+.badge.pending, .badge.unknown, .badge.draft { background: #fff4d6; color: var(--warning); }
+.badge.declined, .badge.not_attending, .badge.archived { background: #fde2e2; color: var(--danger); }
+.row-menu { position: relative; display: inline-block; }
+.icon-button { width: 40px; height: 40px; border: 1px solid var(--border); background: white; border-radius: 10px; display: grid; place-items: center; }
+.menu-panel { position: absolute; right: 0; top: 44px; z-index: 15; min-width: 190px; background: white; border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 18px 35px rgba(15, 23, 42, .16); padding: 6px; }
+.menu-panel button { display: block; width: 100%; text-align: left; padding: 9px 10px; border-radius: 8px; border: 0; background: white; }
+.menu-panel button:hover { background: var(--surface-strong); }
+.stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-bottom: 20px; }
+.metric { padding: 18px; }
+.metric strong { display: block; font-size: 34px; }
+.metric span { color: var(--ink-muted); }
+.empty-state { padding: 30px; color: var(--ink-muted); }
+.dialog-backdrop { position: fixed; inset: 0; z-index: 50; background: rgba(15, 23, 42, .45); display: grid; place-items: center; padding: 20px; }
+.dialog { position: relative; width: min(760px, 100%); max-height: min(88vh, 900px); overflow: auto; padding: 26px; }
+.dialog-close { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; border: 1px solid var(--border); background: white; border-radius: 999px; }
+.dialog-content h2 { margin: 8px 0 12px; font-size: 28px; }
+.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 18px 0; }
+.detail { padding: 12px; background: var(--surface-muted); border-radius: 12px; }
+.detail span { display: block; color: var(--ink-muted); font-size: 13px; margin-bottom: 4px; }
+.form-stack { display: grid; gap: 14px; }
+label { display: grid; gap: 6px; font-weight: 650; }
+input, textarea, select { width: 100%; min-height: 42px; border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; background: white; color: var(--ink); }
+textarea { min-height: 90px; resize: vertical; }
+fieldset { border: 1px solid var(--border); border-radius: 12px; padding: 14px; display: grid; gap: 10px; }
+legend { color: var(--ink-muted); padding: 0 6px; }
+.age-row { grid-template-columns: 1fr 120px; align-items: center; }
+.error-summary { border: 1px solid #fecaca; background: #fef2f2; color: var(--danger); padding: 12px; border-radius: 12px; }
+.site-footer { margin-top: auto; padding: 24px clamp(20px, 5vw, 64px); display: flex; gap: 16px; justify-content: space-between; color: var(--ink-muted); border-top: 1px solid var(--border); flex-wrap: wrap; }
+@media (max-width: 820px) {
+  .site-header, .hero, .section-heading, .site-footer { display: block; }
+  .main-nav, .auth-actions { margin-top: 12px; justify-content: flex-start; }
+  .hero { padding-top: 34px; }
+  .hero-card { margin-top: 24px; }
+  .stats-grid, .detail-grid { grid-template-columns: 1fr; }
+  table, thead, tbody, tr, td, th { display: block; }
+  thead { display: none; }
+  tr { border-bottom: 1px solid var(--border); padding: 10px 0; }
+  td { border-bottom: 0; padding: 9px 14px; }
+  td::before { content: attr(data-label); display: block; color: var(--ink-muted); font-size: 12px; }
+}
+@media print {
+  .site-header, .site-footer, .dialog-close, .no-print { display: none !important; }
+  .dialog-backdrop { position: static; background: white; padding: 0; }
+  .dialog { box-shadow: none; border: 0; max-height: unset; width: 100%; }
+}

```

## packages/domain/package.json

```diff
diff --git a/packages/domain/package.json b/packages/domain/package.json
new file mode 100644
index 0000000..38e4ec2
--- /dev/null
+++ b/packages/domain/package.json
@@ -0,0 +1,18 @@
+{
+  "name": "@ottawa-church/domain",
+  "version": "0.1.0",
+  "private": true,
+  "type": "module",
+  "main": "src/index.ts",
+  "types": "src/index.ts",
+  "exports": {
+    ".": {
+      "types": "./src/index.ts",
+      "import": "./src/index.ts"
+    }
+  },
+  "scripts": {
+    "build": "tsc --noEmit -p tsconfig.json",
+    "typecheck": "tsc --noEmit -p tsconfig.json"
+  }
+}

```

## packages/domain/tsconfig.json

```diff
diff --git a/packages/domain/tsconfig.json b/packages/domain/tsconfig.json
new file mode 100644
index 0000000..b3804f8
--- /dev/null
+++ b/packages/domain/tsconfig.json
@@ -0,0 +1,7 @@
+{
+  "extends": "../../tsconfig.base.json",
+  "compilerOptions": {
+    "rootDir": "."
+  },
+  "include": ["src/**/*.ts"]
+}

```

## packages/domain/src/index.ts

```diff
diff --git a/packages/domain/src/index.ts b/packages/domain/src/index.ts
new file mode 100644
index 0000000..1623ef3
--- /dev/null
+++ b/packages/domain/src/index.ts
@@ -0,0 +1,314 @@
+export type ApprovalStatus = 'not_registered' | 'pending' | 'approved' | 'declined';
+export type RsvpStatus = 'unknown' | 'attending' | 'not_attending';
+export type EventStatus = 'draft' | 'published' | 'archived';
+export type AgeRangeKey = '0-3' | '4-12' | '13-17' | '18+';
+
+export type ChurchEvent = {
+  id: string;
+  title: string;
+  status: EventStatus;
+  startsAt: string;
+  endsAt: string;
+  summary: string;
+  description: string;
+  location: string;
+  mapsUrl: string;
+  capacity: number;
+  cost: string;
+  ageGroup: string;
+  requiredItems: string;
+  waiver: string;
+  transportation: string;
+  volunteerNeeds: string;
+  registrationOpen: boolean;
+};
+
+export type User = {
+  id: string;
+  name: string;
+  email: string;
+  phone: string;
+  notes?: string;
+  isAdmin: boolean;
+};
+
+export type Registration = {
+  id: string;
+  eventId: string;
+  userId: string;
+  participantName: string;
+  email: string;
+  phone: string;
+  accompanyingCount: number;
+  ageCounts: Record<AgeRangeKey, number>;
+  notes: string;
+  approvalStatus: Exclude<ApprovalStatus, 'not_registered'>;
+  rsvpStatus: RsvpStatus;
+  decidedBy?: string;
+  decidedAt?: string;
+  createdAt: string;
+};
+
+export type AppState = {
+  events: ChurchEvent[];
+  users: User[];
+  registrations: Registration[];
+  activeUserId: string | null;
+};
+
+export type RegistrationInput = {
+  eventId: string;
+  user: User;
+  accompanyingCount: number;
+  ageCounts: Record<AgeRangeKey, number>;
+  notes: string;
+};
+
+export type EventTotals = {
+  pending: number;
+  approved: number;
+  declined: number;
+  attending: number;
+  notAttending: number;
+  people: number;
+  ages: Record<AgeRangeKey, number>;
+};
+
+export const ageRanges: AgeRangeKey[] = ['0-3', '4-12', '13-17', '18+'];
+
+export const initialEvents: ChurchEvent[] = [
+  {
+    id: 'harvest-strawberries',
+    title: 'Harvest Strawberries Morning',
+    status: 'published',
+    startsAt: '2026-07-11T09:30:00-04:00',
+    endsAt: '2026-07-11T13:00:00-04:00',
+    summary: 'A family-friendly morning serving together at the community farm.',
+    description: 'Join the church community for a practical morning harvesting strawberries, sharing lunch, and welcoming newcomers.',
+    location: 'Ottawa Community Farm, 45 Greenbank Rd, Ottawa',
+    mapsUrl: 'https://maps.google.com/?q=Ottawa+Community+Farm',
+    capacity: 60,
+    cost: 'Free. Bring a packed lunch if needed.',
+    ageGroup: 'All ages welcome',
+    requiredItems: 'Water bottle, hat, sunscreen, closed-toe shoes.',
+    waiver: 'Parent or guardian supervision required for children.',
+    transportation: 'Carpool coordination available after approval.',
+    volunteerNeeds: 'Drivers, lunch setup, and cleanup helpers.',
+    registrationOpen: true,
+  },
+  {
+    id: 'summer-bbq',
+    title: 'Summer Community BBQ',
+    status: 'published',
+    startsAt: '2026-07-25T16:00:00-04:00',
+    endsAt: '2026-07-25T19:30:00-04:00',
+    summary: 'Food, games, and conversation for members, friends, and visitors.',
+    description: 'A relaxed BBQ for the church family and guests. Invite a friend and bring a lawn chair.',
+    location: 'Church Backyard, 120 Riverside Dr, Ottawa',
+    mapsUrl: 'https://maps.google.com/?q=120+Riverside+Dr+Ottawa',
+    capacity: 120,
+    cost: 'Suggested donation optional.',
+    ageGroup: 'All ages',
+    requiredItems: 'Lawn chair, picnic blanket.',
+    waiver: '',
+    transportation: 'Limited parking; transit recommended.',
+    volunteerNeeds: 'Grill team, kids games, welcome table.',
+    registrationOpen: true,
+  },
+  {
+    id: 'fall-camping',
+    title: 'Fall Camping Weekend',
+    status: 'published',
+    startsAt: '2026-09-11T17:00:00-04:00',
+    endsAt: '2026-09-13T11:00:00-04:00',
+    summary: 'A weekend of worship, meals, and outdoor activities.',
+    description: 'Families and individuals are welcome. Approval helps organizers plan sites, meals, and supervision.',
+    location: 'Rideau River Provincial Park',
+    mapsUrl: 'https://maps.google.com/?q=Rideau+River+Provincial+Park',
+    capacity: 45,
+    cost: 'Estimated $35/person. Payment handled offline.',
+    ageGroup: 'Families and adults',
+    requiredItems: 'Tent, sleeping bag, warm clothing, flashlight.',
+    waiver: 'Consent required for minors attending without parents.',
+    transportation: 'Carpool signup available after approval.',
+    volunteerNeeds: 'Meal prep, worship setup, activity leads.',
+    registrationOpen: true,
+  },
+];
+
+export const initialUsers: User[] = [
+  { id: 'admin-ana', name: 'Ana Admin', email: 'admin@ottawachurch.test', phone: '613-555-0101', isAdmin: true },
+  { id: 'joao', name: 'João Silva', email: 'joao@example.com', phone: '613-555-0111', isAdmin: false },
+];
+
+export const initialRegistrations: Registration[] = [
+  {
+    id: 'reg-joao-bbq',
+    eventId: 'summer-bbq',
+    userId: 'joao',
+    participantName: 'João Silva',
+    email: 'joao@example.com',
+    phone: '613-555-0111',
+    accompanyingCount: 2,
+    ageCounts: { '0-3': 0, '4-12': 2, '13-17': 0, '18+': 1 },
+    notes: 'Can help with cleanup.',
+    approvalStatus: 'approved',
+    rsvpStatus: 'attending',
+    decidedBy: 'Ana Admin',
+    decidedAt: '2026-06-20T12:00:00-04:00',
+    createdAt: '2026-06-18T10:30:00-04:00',
+  },
+];
+
+export const initialState: AppState = {
+  events: initialEvents,
+  users: initialUsers,
+  registrations: initialRegistrations,
+  activeUserId: null,
+};
+
+export function emptyAgeCounts(): Record<AgeRangeKey, number> {
+  return { '0-3': 0, '4-12': 0, '13-17': 0, '18+': 1 };
+}
+
+export function formatDateTime(value: string) {
+  return new Intl.DateTimeFormat('en-CA', {
+    dateStyle: 'medium',
+    timeStyle: 'short',
+  }).format(new Date(value));
+}
+
+export function statusLabel(status: ApprovalStatus | RsvpStatus | EventStatus) {
+  return status.replaceAll('_', ' ').replace(/^\w/, (char) => char.toUpperCase());
+}
+
+export function validateRegistration(input: Pick<RegistrationInput, 'accompanyingCount' | 'ageCounts'>) {
+  const errors: string[] = [];
+  if (!Number.isInteger(input.accompanyingCount) || input.accompanyingCount < 0) {
+    errors.push('Accompanying people must be zero or greater.');
+  }
+  for (const range of ageRanges) {
+    const value = input.ageCounts[range];
+    if (!Number.isInteger(value) || value < 0) errors.push(`Age range ${range} must be zero or greater.`);
+  }
+  const ageTotal = ageRanges.reduce((sum, range) => sum + input.ageCounts[range], 0);
+  const expectedTotal = 1 + input.accompanyingCount;
+  if (ageTotal !== expectedTotal) {
+    errors.push(`Age ranges must total ${expectedTotal}. Include yourself in the age ranges.`);
+  }
+  return errors;
+}
+
+export function registerForEvent(state: AppState, input: RegistrationInput, now = new Date().toISOString()) {
+  const errors = validateRegistration(input);
+  if (errors.length) return { state, errors };
+  const duplicate = state.registrations.some((registration) => registration.eventId === input.eventId && registration.userId === input.user.id && registration.approvalStatus !== 'declined');
+  if (duplicate) return { state, errors: ['You already have an active registration for this event.'] };
+  const registration: Registration = {
+    id: `reg-${input.eventId}-${input.user.id}-${now.replace(/\W/g, '')}`,
+    eventId: input.eventId,
+    userId: input.user.id,
+    participantName: input.user.name,
+    email: input.user.email,
+    phone: input.user.phone,
+    accompanyingCount: input.accompanyingCount,
+    ageCounts: input.ageCounts,
+    notes: input.notes,
+    approvalStatus: 'pending',
+    rsvpStatus: 'unknown',
+    createdAt: now,
+  };
+  return { state: { ...state, registrations: [...state.registrations, registration] }, errors: [] };
+}
+
+export function updateApproval(state: AppState, registrationId: string, approvalStatus: 'approved' | 'declined', adminName: string, now = new Date().toISOString()) {
+  return {
+    ...state,
+    registrations: state.registrations.map((registration) => registration.id === registrationId
+      ? { ...registration, approvalStatus, decidedBy: adminName, decidedAt: now }
+      : registration),
+  };
+}
+
+export function updateRsvp(state: AppState, registrationId: string, rsvpStatus: RsvpStatus) {
+  return {
+    ...state,
+    registrations: state.registrations.map((registration) => registration.id === registrationId ? { ...registration, rsvpStatus } : registration),
+  };
+}
+
+export function eventTotals(eventId: string, registrations: Registration[]): EventTotals {
+  const eventRegistrations = registrations.filter((registration) => registration.eventId === eventId);
+  const totals: EventTotals = {
+    pending: 0,
+    approved: 0,
+    declined: 0,
+    attending: 0,
+    notAttending: 0,
+    people: 0,
+    ages: { '0-3': 0, '4-12': 0, '13-17': 0, '18+': 0 },
+  };
+  for (const registration of eventRegistrations) {
+    if (registration.approvalStatus === 'pending') totals.pending += 1;
+    if (registration.approvalStatus === 'approved') totals.approved += 1;
+    if (registration.approvalStatus === 'declined') totals.declined += 1;
+    if (registration.rsvpStatus === 'attending') totals.attending += 1;
+    if (registration.rsvpStatus === 'not_attending') totals.notAttending += 1;
+    if (registration.approvalStatus !== 'declined') {
+      totals.people += 1 + registration.accompanyingCount;
+      for (const range of ageRanges) totals.ages[range] += registration.ageCounts[range];
+    }
+  }
+  return totals;
+}
+
+function escapeText(value: string) {
+  return value.replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n');
+}
+
+function icsDate(value: string) {
+  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
+}
+
+export function generateIcs(event: ChurchEvent, siteUrl = 'http://localhost:3000') {
+  return [
+    'BEGIN:VCALENDAR',
+    'VERSION:2.0',
+    'PRODID:-//Ottawa Church//Events//EN',
+    'BEGIN:VEVENT',
+    `UID:${event.id}@ottawa-church`,
+    `DTSTAMP:${icsDate(new Date().toISOString())}`,
+    `DTSTART:${icsDate(event.startsAt)}`,
+    `DTEND:${icsDate(event.endsAt)}`,
+    `SUMMARY:${escapeText(event.title)}`,
+    `LOCATION:${escapeText(event.location)}`,
+    `DESCRIPTION:${escapeText(`${event.description} ${siteUrl}/events/${event.id}`)}`,
+    'END:VEVENT',
+    'END:VCALENDAR',
+  ].join('\r\n');
+}
+
+function csvCell(value: string | number) {
+  const text = String(value);
+  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
+}
+
+export function generateRosterCsv(event: ChurchEvent, registrations: Registration[]) {
+  const rows = registrations
+    .filter((registration) => registration.eventId === event.id)
+    .map((registration) => [
+      registration.participantName,
+      registration.email,
+      registration.phone,
+      registration.approvalStatus,
+      registration.rsvpStatus,
+      registration.accompanyingCount,
+      registration.ageCounts['0-3'],
+      registration.ageCounts['4-12'],
+      registration.ageCounts['13-17'],
+      registration.ageCounts['18+'],
+      registration.notes,
+    ]);
+  const header = ['Participant', 'Email', 'Phone', 'Approval Status', 'RSVP Status', 'Accompanying', 'Age 0-3', 'Age 4-12', 'Age 13-17', 'Age 18+', 'Notes'];
+  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
+}

```

## packages/domain/src/index.test.ts

```diff
diff --git a/packages/domain/src/index.test.ts b/packages/domain/src/index.test.ts
new file mode 100644
index 0000000..85752d3
--- /dev/null
+++ b/packages/domain/src/index.test.ts
@@ -0,0 +1,73 @@
+import { describe, expect, it } from 'bun:test';
+import {
+  eventTotals,
+  generateIcs,
+  generateRosterCsv,
+  initialEvents,
+  initialState,
+  initialUsers,
+  registerForEvent,
+  updateApproval,
+  updateRsvp,
+  validateRegistration,
+} from './index';
+
+describe('registration validation', () => {
+  it('rejects age totals that do not include participant plus accompanying people', () => {
+    const errors = validateRegistration({
+      accompanyingCount: 2,
+      ageCounts: { '0-3': 0, '4-12': 1, '13-17': 0, '18+': 1 },
+    });
+
+    expect(errors.join(' ')).toContain('Age ranges must total 3');
+  });
+
+  it('creates pending registration when counts are valid', () => {
+    const user = initialUsers[1]!;
+    const result = registerForEvent(initialState, {
+      eventId: 'harvest-strawberries',
+      user,
+      accompanyingCount: 1,
+      ageCounts: { '0-3': 0, '4-12': 1, '13-17': 0, '18+': 1 },
+      notes: 'First time visitor.',
+    }, '2026-06-21T12:00:00Z');
+
+    expect(result.errors).toEqual([]);
+    expect(result.state.registrations.at(-1)?.approvalStatus).toBe('pending');
+  });
+});
+
+describe('approval and totals', () => {
+  it('updates approval and RSVP totals', () => {
+    const user = initialUsers[1]!;
+    const registered = registerForEvent(initialState, {
+      eventId: 'harvest-strawberries',
+      user,
+      accompanyingCount: 1,
+      ageCounts: { '0-3': 0, '4-12': 1, '13-17': 0, '18+': 1 },
+      notes: '',
+    }, '2026-06-21T12:00:00Z').state;
+    const registration = registered.registrations.find((item) => item.eventId === 'harvest-strawberries')!;
+    const approved = updateApproval(registered, registration.id, 'approved', 'Ana Admin', '2026-06-21T13:00:00Z');
+    const attending = updateRsvp(approved, registration.id, 'attending');
+
+    expect(eventTotals('harvest-strawberries', attending.registrations)).toMatchObject({
+      approved: 1,
+      attending: 1,
+      people: 2,
+    });
+  });
+});
+
+describe('exports', () => {
+  it('generates calendar and roster outputs', () => {
+    const event = initialEvents[0]!;
+    const ics = generateIcs(event, 'https://ottawa-church.pages.dev');
+    const csv = generateRosterCsv(initialEvents[1]!, initialState.registrations);
+
+    expect(ics).toContain('BEGIN:VCALENDAR');
+    expect(ics).toContain('SUMMARY:Harvest Strawberries Morning');
+    expect(csv).toContain('Participant,Email,Phone');
+    expect(csv).toContain('João Silva');
+  });
+});

```

## _bmad-output/implementation-artifacts/spec-build-mvp.md

```diff
diff --git a/_bmad-output/implementation-artifacts/spec-build-mvp.md b/_bmad-output/implementation-artifacts/spec-build-mvp.md
new file mode 100644
index 0000000..0a17f1f
--- /dev/null
+++ b/_bmad-output/implementation-artifacts/spec-build-mvp.md
@@ -0,0 +1,78 @@
+---
+title: 'Build Church Events MVP'
+type: 'feature'
+created: '2026-06-21'
+status: 'in-review'
+baseline_commit: 'b6607ae3a27b26ad2a76ee34caf9804bf29a7a7f'
+context:
+  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/prd.md
+  - _bmad-output/planning-artifacts/architecture.md
+  - _bmad-output/planning-artifacts/epics.md
+  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/DESIGN.md
+  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/EXPERIENCE.md
+---
+
+<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">
+
+## Intent
+
+**Problem:** The repository has complete product, UX, architecture, and story artifacts, but no working application. The user wants an end-to-end MVP rather than more planning checkpoints.
+
+**Approach:** Build a Bun/Turbo monorepo guided by `/Users/mendes/Git/clariti/project-surf`: a TanStack Start React web app under `apps/web` plus domain code under `packages/domain`. Use Tailwind v4/shadcn-style primitives and local persistence for the first working product, while keeping Supabase/Resend-ready boundaries for Cloudflare Pages + Supabase/Resend free-tier deployment later.
+
+## Boundaries & Constraints
+
+**Always:** Follow the `project-surf` technology shape where appropriate: Bun package manager, Turbo workspace, TanStack Start, TanStack Router/Query, Tailwind v4, shadcn-style UI primitives, strict TypeScript, and feature/domain organization. Keep free-tier constraints: no WorkOS, AWS/Pulumi, Temporal, paid queues, or paid infrastructure in the MVP. Implement all core flows from the epics: public pages, events list/details, signup/signin state, event registration with accompanying + age counts, approval states, RSVP, admin create/manage/review/approve/decline, `.ics`, CSV, and printable roster.
+
+**Ask First:** None for this run; the user explicitly requested autonomous drive-to-working-product execution.
+
+**Never:** Do not use Next.js. Do not introduce GraphQL, microservices, payments, waitlists, complex roles, live check-in/out, heavy animations, carousels, infinite scroll, drag-and-drop, or nested modal stacks.
+
+## I/O & Edge-Case Matrix
+
+| Scenario | Input / State | Expected Output / Behavior | Error Handling |
+|----------|--------------|---------------------------|----------------|
+| Visitor discovers event | Public user opens Events | Published upcoming events show title, date, location, status, details/register/calendar actions | Empty state shown if no events |
+| Signup and register | Visitor signs up then registers | User becomes signed in and submits pending event registration | Inline validation blocks bad/missing fields |
+| Age count mismatch | Accompanying count + age counts do not total participant group | Submission blocked with explicit helper/error | Keep modal open and preserve entered values |
+| Admin approves | Admin opens pending queue and approves | Status changes to approved, totals update, participant status changes | Unauthorized state blocks admin-only actions |
+| RSVP update | Participant marks not attending | RSVP status updates and totals reflect it | Failed/invalid update shows error and keeps previous state |
+| Export event | User selects calendar or admin selects CSV/print | Valid `.ics`, CSV download, and print view are produced | Export actions remain disabled if event data is unavailable |
+
+</frozen-after-approval>
+
+## Code Map
+
+- `package.json`, `turbo.json`, `tsconfig.base.json` -- Bun/Turbo workspace root.
+- `apps/web/package.json`, `apps/web/vite.config.ts`, `apps/web/src/*` -- TanStack Start web app for public, portal, and admin surfaces.
+- `packages/domain/package.json`, `packages/domain/src/index.ts` -- domain types, seed data, validation, totals, exports, local persistence helpers.
+- `apps/web/src/routes/*` -- TanStack routes.
+- `apps/web/src/features/*` -- feature components and orchestration.
+- `apps/web/src/styles.css` -- shadcn-style tokens, Tailwind v4 compatible app styles.
+- `packages/domain/src/index.test.ts` -- domain/flow smoke coverage.
+
+## Tasks & Acceptance
+
+**Execution:**
+- [x] `package.json`, `turbo.json`, `tsconfig.base.json` -- create Bun/Turbo monorepo root -- mirrors the reference project shape without paid infrastructure.
+- [x] `apps/web/*` -- create TanStack Start web app -- browser can load public, portal, and admin surfaces.
+- [x] `packages/domain/*` -- implement event/registration/user domain, validation, totals, `.ics`, CSV, storage -- supports core flows without backend.
+- [x] `apps/web/src/features/*` and `apps/web/src/routes/*` -- implement public pages, auth state, registration/details/create-event/admin modals, row menus, statuses, RSVP, approvals, exports -- covers MVP user journeys.
+- [x] `apps/web/src/styles.css` -- implement approved visual system, responsive tables/cards, accessible controls/modals -- matches UX direction.
+- [x] `packages/domain/src/index.test.ts` -- add focused tests for validation, approval/totals, calendar, CSV -- protect core behavior.
+
+**Acceptance Criteria:**
+- Given a clean checkout, when `bun install` and `bun run build` run, then the app builds successfully.
+- Given the app is open, when a visitor browses public pages and events, then public church/event information is visible without sign in.
+- Given a signed-in participant registers with valid group counts, when they submit, then a pending registration appears in participant and admin views.
+- Given an Admin approves/declines, when participant status is viewed, then the new status is visible and totals update.
+- Given a participant updates RSVP, when admin totals are viewed, then RSVP totals reflect the change.
+- Given calendar/CSV/print actions are used, when exports are generated, then files/views contain the expected event or roster data.
+
+## Verification
+
+**Commands:**
+- `bun install` -- expected: dependencies install.
+- `bun run typecheck` -- expected: workspace TypeScript checks pass.
+- `bun run build` -- expected: Turbo builds the web app and packages.
+- `bun test` -- expected: domain tests pass.

```

## _bmad-output/planning-artifacts/architecture.md

```diff
diff --git a/_bmad-output/planning-artifacts/architecture.md b/_bmad-output/planning-artifacts/architecture.md
new file mode 100644
index 0000000..26961db
--- /dev/null
+++ b/_bmad-output/planning-artifacts/architecture.md
@@ -0,0 +1,645 @@
+---
+stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
+inputDocuments:
+  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/prd.md
+  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/addendum.md
+  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/DESIGN.md
+  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/EXPERIENCE.md
+  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/reconcile-prd.md
+  - _bmad-output/planning-artifacts/research/technical-free-tier-church-portal-research-2026-06-16.md
+  - _bmad-output/planning-artifacts/briefs/brief-web-ottawa-church-2026-06-16/brief.md
+workflowType: 'architecture'
+project_name: 'web-ottawa-church'
+user_name: 'Douglas'
+date: '2026-06-17'
+updatedAt: '2026-06-21'
+lastStep: 8
+status: 'complete'
+completedAt: '2026-06-18'
+---
+
+# Architecture Decision Document
+
+_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._
+
+## Initialization
+
+Architecture workflow initialized on 2026-06-17. Source documents have been discovered and listed in frontmatter. Full source analysis begins after user confirmation.
+
+### Architecture Amendment: Project Surf Stack Alignment
+
+On 2026-06-21, the implementation direction was amended to use `/Users/mendes/Git/clariti/project-surf` as the technology and framework guide while preserving free-tier constraints. This amendment supersedes earlier single-app TanStack CLI + pnpm + Netlify-first starter language where it conflicts. The selected implementation shape is now a Bun/Turbo monorepo with a TanStack Start React app, Tailwind v4/shadcn-style UI, domain packages, and free-tier-compatible persistence/integration boundaries. Paid/heavy Project Surf infrastructure such as WorkOS, AWS/Pulumi, Temporal, Kubernetes, and worker orchestration is explicitly excluded from the MVP.
+
+## Project Context Analysis
+
+### Requirements Overview
+
+**Functional Requirements:**
+The MVP has 20 functional requirements across public church content, public event discovery, account creation, participant profiles, event registration, admin event management, approval workflows, participant RSVP status, notifications, calendar export, and roster export. Architecturally, this requires three clear surfaces: public website, participant portal, and admin area, backed by shared event and registration domain logic.
+
+**Non-Functional Requirements:**
+The architecture is shaped by mobile Core Web Vitals, public/admin bundle separation, server-side authorization, Supabase RLS, privacy-by-minimization for child/family data, free-tier-friendly operations, WCAG 2.2 AA accessibility, and single-developer maintainability.
+
+**Scale & Complexity:**
+
+- Primary domain: full-stack web application
+- Complexity level: medium
+- Estimated architectural components: public site, auth, participant portal, admin, event domain, registration domain, notifications, exports, database/RLS
+
+### Technical Constraints & Dependencies
+
+The selected direction is a Project Surf-guided Bun/Turbo monorepo using TypeScript, TanStack Start, TanStack Router, TanStack Query, Tailwind v4, shadcn-style primitives, domain packages, and free-tier-friendly service boundaries. Persistence should remain Supabase/Postgres-compatible for free-tier deployment, with local adapters acceptable for the first working product. Resend-compatible email, generated `.ics` files, CSV exports, and a Cloudflare Pages deployment remain in scope. Next.js, GraphQL, microservices, realtime infrastructure, WorkOS, AWS/Pulumi, Temporal, waitlists, payments, and complex roles are explicitly out of MVP scope.
+
+### Cross-Cutting Concerns Identified
+
+- Authorization must be enforced both in server functions/routes and Supabase RLS.
+- Public pages must avoid loading admin/portal code.
+- Event registration validation must keep accompanying count and age-range totals consistent.
+- Admin workflows need auditability for approval/decline actions.
+- Email failures must not roll back saved registration state.
+- Calendar and CSV exports need deterministic, testable generation.
+- UX must preserve shadcn-style consistency across dialogs, tables, menus, forms, and status badges.
+
+## Starter Template Evaluation
+
+### Primary Technology Domain
+
+Project Surf-guided full-stack TypeScript web application using a Bun/Turbo monorepo and TanStack Start.
+
+### Starter Options Considered
+
+1. **Project Surf monorepo pattern**
+   - Best fit after user correction. Provides the desired technology posture: Bun workspace, Turbo tasks, TanStack Start web apps, Tailwind v4, shadcn-style primitives, feature folders, and shared packages.
+   - Must be adapted for free-tier and personal-project scope by excluding paid/heavy infrastructure.
+
+2. **Official TanStack CLI single-app starter**
+   - Still useful as a reference for TanStack Start conventions, but no longer the primary project shape.
+   - Rejected as the main starter because the user explicitly wants Project Surf as the technology/framework guide.
+
+3. **Project Surf full infrastructure clone**
+   - Rejected. WorkOS, AWS/Pulumi, Temporal, Kubernetes, separate workers, and enterprise auth are not appropriate for this free-tier church MVP.
+
+4. **Vite SPA**
+   - Rejected for MVP foundation because we need TanStack Start conventions, route structure, server-ready boundaries, auth/session boundaries, and clean public/admin/portal separation.
+
+### Selected Starter: Project Surf-Inspired Bun/Turbo Monorepo
+
+**Rationale for Selection:**
+Use Project Surf's technology shape without its paid infrastructure: Bun package manager, Turbo workspace, TanStack Start app, Tailwind v4, shadcn-style primitives, strict TypeScript, shared domain package, and explicit app/package boundaries. This satisfies the user's framework preference while keeping the deployment and operations free-tier friendly.
+
+**Initialization Shape:**
+
+```text
+web-ottawa-church/
+├── package.json              # Bun workspace + Turbo scripts
+├── turbo.json                # build/dev/typecheck task graph
+├── tsconfig.base.json        # strict shared TS config
+├── apps/
+│   └── web/                  # TanStack Start React app for public, portal, admin
+└── packages/
+    └── domain/               # church event domain, validation, exports
+```
+
+**Architectural Decisions Provided by Starter:**
+
+**Language & Runtime:**
+TypeScript, Bun, React, TanStack Start, SSR-capable route structure, server-ready feature boundaries.
+
+**Styling Solution:**
+Tailwind v4 plus shadcn-style primitives compatible with the approved UX.
+
+**Build Tooling:**
+Bun workspace scripts and Turbo task orchestration, following Project Surf's root/app/package separation.
+
+**Testing Framework:**
+Bun test for domain logic and smoke behavior initially; Playwright can be added later for end-to-end flows.
+
+**Code Organization:**
+Use `apps/web` for public/portal/admin UI and `packages/domain` for event, registration, approval, RSVP, calendar, and roster logic. Add `packages/db` only when Supabase/Drizzle persistence is implemented.
+
+**Development Experience:**
+Bun install/dev/test, Turbo build/typecheck, TanStack Router/Query conventions, Tailwind v4, shadcn-style UI components, and strict TypeScript.
+
+**Note:**
+Project initialization using this monorepo shape should remain the first implementation story.
+
+## Core Architectural Decisions
+
+### Decision Priority Analysis
+
+**Critical Decisions:**
+
+- App shape: Project Surf-inspired Bun/Turbo monorepo.
+- Web framework: TanStack Start React app under `apps/web`.
+- UI: Tailwind v4 plus shadcn-style primitives and the approved violet/neutral design tokens.
+- Domain: shared TypeScript package under `packages/domain` for events, registrations, approvals, RSVP, `.ics`, and CSV logic.
+- Data: start with local/free-tier-compatible adapters for the working MVP; keep the persistence boundary Supabase/Postgres-compatible for free-tier production.
+- Auth/security: MVP may use local/demo auth state, but architecture must preserve a future Supabase Auth + server authorization + RLS path.
+- API: TanStack Start server-ready functions/routes when persistence is introduced; no GraphQL/public API for MVP.
+- Deployment: Cloudflare Pages deployment first; avoid paid Project Surf infrastructure.
+
+**Important Decisions:**
+
+- Runtime/package manager: Bun, matching Project Surf.
+- Build orchestration: Turbo workspace tasks.
+- Validation: shared TypeScript validation in `packages/domain`; Zod can be added where schema validation becomes necessary.
+- Deterministic generated exports for `.ics` and CSV.
+- Testing: Bun test for domain logic initially; Playwright later for core browser flows.
+
+**Deferred Decisions:**
+
+- Supabase production persistence, RLS SQL policies, Resend transactional sending, Playwright E2E, analytics, reusable family profiles, recurring events, background jobs, realtime updates, queues, payments, waitlists, complex roles, and live check-in/out remain post-first-working-product unless specifically pulled forward.
+
+### Data Architecture
+
+The first working product may use local browser persistence through a narrow domain adapter so the product can run with no paid services. The production-ready path remains Supabase Postgres/Auth/RLS because it satisfies the free-tier and privacy constraints better than enterprise services.
+
+Model core domain concepts around `profiles`, `admin_users`, `events`, `registrations`, `registration_age_counts`, `notification_log`, and `audit_log`. When database persistence is introduced, prefer a `packages/db` package using Drizzle/Postgres patterns similar to Project Surf, backed by Supabase Postgres for free-tier hosting.
+
+### Authentication & Security
+
+Use demo/local auth for the first working product only. Preserve clear boundaries so Supabase Auth can replace the local adapter without changing feature UI contracts. Admin access remains a simple allowlist concept, not a complex role hierarchy.
+
+Authorization layers for production path:
+
+- Server-side checks for all admin mutations and exports.
+- Supabase RLS for participant-owned and admin-only rows.
+- No service-role key or provider secret in browser code.
+- Approval/decline audit trail with actor and timestamp.
+
+### API & Communication Patterns
+
+Use TanStack Start route/server boundaries and domain package functions. In the local MVP, UI calls domain/storage adapters directly. In the production path, route/server functions call Supabase/Drizzle adapters and Resend-compatible email senders.
+
+Use explicit domain actions for:
+
+- event create/edit/archive/delete;
+- registration submit;
+- approval/decline;
+- RSVP updates;
+- reminders;
+- CSV roster export;
+- `.ics` calendar export.
+
+Email failure must be logged and must not roll back successful domain persistence.
+
+### Frontend Architecture
+
+Use TanStack Router file-based routes in `apps/web/src/routes` with public, auth, portal, and admin surfaces. Public routes must not import admin-only components unless the bundle boundary remains safe.
+
+Use:
+
+- TanStack Start + TanStack Router for app/routing conventions.
+- TanStack Query when server state is introduced.
+- React local state for modal/form state in the first local MVP.
+- Tailwind v4/shadcn-style components for buttons, dialogs, menus, tables, badges, inputs, and selects.
+- `packages/domain` for shared domain logic and export generation.
+
+### Infrastructure & Deployment
+
+Use free-tier-compatible deployment first: one web app deployment for `apps/web`. Avoid Project Surf's AWS/Pulumi/Temporal/Kubernetes/WorkOS infrastructure for MVP.
+
+Environment groups for production path:
+
+- public Supabase URL and publishable key;
+- server Supabase service role key;
+- Resend API key;
+- site URL;
+- deployment/runtime mode.
+
+Testing:
+
+- Bun test for domain logic, `.ics`, CSV, and service behavior.
+- Playwright later for registration/admin approval flows.
+
+### Decision Impact Analysis
+
+**Implementation Sequence:**
+
+1. Create Bun/Turbo workspace root.
+2. Create `apps/web` TanStack Start app shell.
+3. Create `packages/domain` with event/registration/approval/RSVP/export logic.
+4. Build public event listing/detail and church pages.
+5. Add local signup/signin/profile state.
+6. Add event registration flow with validation.
+7. Add admin event management and approval workflows.
+8. Add calendar, CSV, and print exports.
+9. Add free-tier persistence/email adapters after the working local product is stable.
+10. Add performance and security hardening.
+
+**Cross-Component Dependencies:**
+
+- Registration validation affects UI forms, domain package logic, future database constraints, and admin totals.
+- Auth/authorization boundaries affect every portal/admin route and export.
+- Public/admin route separation affects performance and bundle boundaries.
+- Event schema affects details modal, registration form, calendar export, reminders, and roster export.
+
+## Implementation Patterns & Consistency Rules
+
+### Pattern Categories Defined
+
+**Critical Conflict Points Identified:**
+Eight areas need consistency: database naming, route naming, server action shape, validation, errors, loading states, file placement, and export generation.
+
+### Naming Patterns
+
+**Database Naming Conventions:**
+
+- Tables use plural `snake_case`: `profiles`, `events`, `registrations`, `registration_age_counts`.
+- Columns use `snake_case`: `event_id`, `approval_status`, `created_at`.
+- Foreign keys use `{table_singular}_id`: `event_id`, `registration_id`, `user_id`.
+- Indexes use `idx_{table}_{columns}`: `idx_registrations_event_id`.
+
+**API Naming Conventions:**
+
+- TanStack route paths use kebab-case URL segments: `/admin/events`, `/portal/registrations`.
+- Route params use `$id` in file routes and `id` in code.
+- Query/search params use camelCase in app code and URL-safe names: `approvalStatus=pending`.
+
+**Code Naming Conventions:**
+
+- React components use PascalCase: `EventDetailsDialog`.
+- Component files use kebab-case: `event-details-dialog.tsx`.
+- Functions and variables use camelCase: `submitRegistration`, `eventId`.
+- Zod schemas use `{Name}Schema`: `registrationFormSchema`.
+- Server actions use verb-first names: `createEvent`, `approveRegistration`, `updateRsvpStatus`.
+
+### Structure Patterns
+
+**Project Organization:**
+
+- Organize app code by domain, not technical type first.
+- Keep route files thin; route files call domain modules.
+- Co-locate component tests as `*.test.ts` or `*.test.tsx` near the domain/component.
+- Keep shared UI primitives separate from domain components.
+
+**File Structure Patterns:**
+
+- Shared UI primitives live under `apps/web/src/components/ui`.
+- Feature components live under `apps/web/src/features/{feature}`.
+- Route files live under `apps/web/src/routes` and stay thin.
+- Domain types, validation, totals, and exports live under `packages/domain/src`.
+- Future database adapters live under `packages/db` when Supabase/Drizzle persistence is added.
+
+### Format Patterns
+
+**API Response Formats:**
+
+- Server actions return typed domain results, not arbitrary response shapes.
+- Expected validation failures use a consistent app error shape:
+  `{ code: string; message: string; fieldErrors?: Record<string, string[]> }`.
+- Unexpected server failures are logged and returned as safe generic messages.
+
+**Data Exchange Formats:**
+
+- Database records stay `snake_case`.
+- UI/domain objects use camelCase.
+- Date/time crossing boundaries uses ISO 8601 strings.
+- Money/cost fields remain display text for MVP unless payments are added later.
+- Age-range counts are stored as rows, not JSON blobs.
+
+### Communication Patterns
+
+**Event System Patterns:**
+
+- No internal event bus for MVP.
+- Domain side effects are explicit function calls from server actions.
+- Email/log side effects must not roll back successful domain persistence unless the domain action itself fails.
+
+**State Management Patterns:**
+
+- TanStack Query owns server state.
+- Local React state is only for dialog open state, form-local UI state, and temporary controls.
+- Query keys use array format: `['events', eventId]`, `['admin', 'registrations', eventId]`.
+- Mutations invalidate exact affected query groups.
+
+### Process Patterns
+
+**Error Handling Patterns:**
+
+- Validation errors show inline near fields.
+- Permission errors show “You do not have access to this page/action.”
+- Email failures are non-blocking and logged.
+- Admin destructive actions require confirmation.
+
+**Loading State Patterns:**
+
+- Public pages prefer server-rendered content over client skeletons.
+- Portal/admin tables can use compact skeleton rows.
+- Form submit buttons show pending state and prevent duplicate submits.
+
+### Enforcement Guidelines
+
+**All AI Agents MUST:**
+
+- Keep public, portal, and admin concerns separated.
+- Put authorization checks in server actions and RLS, not only UI.
+- Validate registration age counts on client and server.
+- Use shadcn-style primitives consistently.
+- Keep route files thin and domain logic in feature modules.
+- Write deterministic generators for `.ics` and CSV.
+
+**Pattern Enforcement:**
+
+- Tests verify validation, export generation, and critical domain transitions.
+- Code review checks database naming, route naming, server-action shape, and authorization.
+- Pattern changes must update this architecture document before implementation diverges.
+
+### Pattern Examples
+
+**Good Examples:**
+
+- `registration_age_counts.registration_id`
+- `apps/web/src/features/registrations/registration-dialog.tsx`
+- `apps/web/src/features/events/event-details-dialog.tsx`
+- `registrationFormSchema`
+- `['registrations', 'mine']`
+
+**Anti-Patterns:**
+
+- Admin checks only in React components.
+- Mixed `userId` and `user_id` in database columns.
+- JSON age-count blobs when relational rows are needed for reporting.
+- Public routes importing admin components.
+- Email failure causing an approved registration to revert.
+
+## Project Structure & Boundaries
+
+### Complete Project Directory Structure
+
+```text
+web-ottawa-church/
+├── README.md
+├── package.json
+├── bun.lock
+├── turbo.json
+├── tsconfig.json
+├── tsconfig.base.json
+├── .env.example
+├── apps/
+│   └── web/
+│       ├── package.json
+│       ├── vite.config.ts
+│       ├── tsconfig.json
+│       └── src/
+│           ├── routeTree.gen.ts
+│           ├── router.tsx
+│           ├── routes/
+│           │   ├── __root.tsx
+│           │   ├── index.tsx
+│           │   ├── about.tsx
+│           │   ├── service-times-location.tsx
+│           │   ├── contact.tsx
+│           │   ├── events/
+│           │   │   ├── index.tsx
+│           │   │   └── $eventId.tsx
+│           │   ├── auth/
+│           │   │   ├── sign-in.tsx
+│           │   │   └── callback.tsx
+│           │   ├── portal/
+│           │   │   ├── index.tsx
+│           │   │   ├── registrations.tsx
+│           │   │   └── profile.tsx
+│           │   └── admin/
+│           │       ├── index.tsx
+│           │       ├── events.tsx
+│           │       └── events/
+│           │           └── $eventId.tsx
+│           ├── components/
+│           │   ├── ui/
+│           │   ├── app-header.tsx
+│           │   └── app-footer.tsx
+│           ├── features/
+│           │   ├── auth/
+│           │   ├── public-site/
+│           │   ├── events/
+│           │   ├── registrations/
+│           │   ├── admin/
+│           │   ├── notifications/
+│           │   └── exports/
+│           ├── lib/
+│           │   ├── env.ts
+│           │   ├── errors.ts
+│           │   └── storage.ts
+│           └── styles.css
+├── packages/
+│   └── domain/
+│       ├── package.json
+│       ├── tsconfig.json
+│       └── src/
+│           ├── index.ts
+│           └── index.test.ts
+├── tests/
+│   └── e2e/
+└── _bmad-output/
+```
+
+### Architectural Boundaries
+
+**API Boundaries:**
+
+- First working product: UI calls `packages/domain` and local storage adapters directly.
+- Production path: TanStack Start server functions/routes call Supabase/Drizzle adapters and email senders.
+- Public reads: published event and church content queries only.
+- Participant actions: registration submit, RSVP update, profile update.
+- Admin actions: event management, approval/decline, reminders, CSV/print exports.
+- Export routes: `.ics` is public for published event details; CSV is admin-only.
+
+**Component Boundaries:**
+
+- `apps/web/src/components/ui` contains reusable shadcn-style primitives only.
+- Feature components live under `apps/web/src/features/{feature}`.
+- Shared domain behavior lives in `packages/domain`, not in route files.
+
+**Service Boundaries:**
+
+- Local MVP storage lives behind a small adapter in `apps/web/src/lib/storage.ts`.
+- Production persistence should move behind `packages/db` and server functions without rewriting UI flows.
+- Auth guards are centralized in the web app and later backed by Supabase Auth.
+
+**Data Boundaries:**
+
+- `packages/domain` owns domain types and validation.
+- Database rows should use `snake_case` when persistence is added; app-facing objects use camelCase.
+- RLS remains mandatory for production participant-owned and admin-only tables.
+- Provider secrets are server-only.
+
+### Requirements to Structure Mapping
+
+**Public Church Website and Event Discovery:**
+FR-1 to FR-3 live in `apps/web/src/routes`, `apps/web/src/features/public-site`, `apps/web/src/features/events`, and `packages/domain`.
+
+**Account and Participant Profile:**
+FR-4 to FR-5 live in `apps/web/src/features/auth`, `apps/web/src/routes/auth`, and `apps/web/src/routes/portal/profile.tsx`.
+
+**Event Registration:**
+FR-6 to FR-9 live in `apps/web/src/features/registrations`, `apps/web/src/features/events`, and `packages/domain`.
+
+**Admin Event Management and Approval:**
+FR-10 to FR-14 live in `apps/web/src/features/admin`, `apps/web/src/routes/admin`, and `packages/domain`.
+
+**Participant Portal and RSVP:**
+FR-15 to FR-16 live in `apps/web/src/routes/portal`, `apps/web/src/features/registrations`, and `packages/domain`.
+
+**Notifications, Calendar, and Exports:**
+FR-17 to FR-20 live in `apps/web/src/features/notifications`, `apps/web/src/features/exports`, and `packages/domain`.
+
+### Integration Points
+
+**Internal Communication:**
+Routes call feature components/actions. Feature modules call `packages/domain` for validation, transitions, totals, calendar export, and roster export.
+
+**External Integrations:**
+
+- First working product: local browser storage and generated downloads.
+- Production path: Supabase Auth/Postgres/RLS, Resend-compatible email, `.ics`, CSV, print.
+
+**Data Flow:**
+Public event data flows from the domain/storage adapter into route components. Authenticated mutations flow from forms through validation, domain actions, local/future persistence, optional notification logging, and UI invalidation/state refresh.
+
+### File Organization Patterns
+
+**Configuration Files:**
+Root-level Bun/Turbo/TypeScript config; app-level Vite/TanStack config.
+
+**Source Organization:**
+Routes are thin. Feature UI lives in `apps/web/src/features`. Shared domain logic lives in `packages/domain`. Shared UI primitives live in `apps/web/src/components/ui`.
+
+**Test Organization:**
+Domain tests live next to `packages/domain/src/index.ts`. E2E tests live in `tests/e2e` when added.
+
+**Asset Organization:**
+Static public assets live under the web app. Uploaded/event-managed media is deferred; if needed later, use Supabase Storage with explicit policy design.
+
+### Development Workflow Integration
+
+**Development Server Structure:**
+Bun runs Turbo workspace scripts. `apps/web` owns the TanStack Start dev server.
+
+**Build Process Structure:**
+Turbo builds packages before apps. Public routes should remain independent from admin-only imports where practical.
+
+**Deployment Structure:**
+Deploy `apps/web` to Cloudflare Pages first. Supabase and Resend are optional production adapters, not required for local MVP operation.
+
+## Architecture Validation Results
+
+### Coherence Validation ✅
+
+**Decision Compatibility:**
+The amended stack is coherent: Bun, Turbo, TanStack Start, TanStack Router, Tailwind v4, shadcn-style UI, shared domain packages, Supabase-compatible persistence boundaries, Resend-compatible email, `.ics`, CSV, and Bun tests fit a free-tier-friendly modular monorepo. No decision introduces Next.js, GraphQL, paid enterprise auth, AWS/Pulumi, Temporal, microservices, realtime, payment, or role hierarchy conflict.
+
+**Pattern Consistency:**
+The implementation patterns support the decisions: database naming is SQL/RLS-friendly, route naming matches TanStack file routing, server-action naming supports explicit domain flows, and data format rules cleanly separate database `snake_case` from TypeScript `camelCase`.
+
+**Structure Alignment:**
+The structure supports public, portal, and admin separation while keeping shared domain logic in `packages/domain`. UI primitives, feature components, local/future persistence boundaries, exports, and notification seams have clear homes.
+
+### Requirements Coverage Validation ✅
+
+**Feature Coverage:**
+All MVP feature areas are mapped: public church pages, public event discovery, account signup/sign-in, participant profile, event registration, admin event management, approval queue, RSVP updates, emails, calendar export, CSV export, and printable rosters.
+
+**Functional Requirements Coverage:**
+FR-1 through FR-20 are architecturally supported through the route structure, feature modules, `packages/domain`, local/future persistence adapters, notification seams, and export modules.
+
+**Non-Functional Requirements Coverage:**
+Performance is addressed through public/admin separation, TanStack Start routing, and bundle boundaries. Security is addressed through admin allowlist boundaries now and a preserved Supabase Auth/RLS/server-check path for production. Privacy is addressed by storing age-range counts instead of unnecessary child details. Maintainability is addressed through a Bun/Turbo monorepo and domain-first structure.
+
+### Implementation Readiness Validation ✅
+
+**Decision Completeness:**
+Critical decisions are documented with current package versions and rationale. Deferred decisions are explicit and do not block MVP implementation.
+
+**Structure Completeness:**
+The project tree is specific enough for implementation agents to start without inventing major structure. It defines Bun/Turbo root config, `apps/web`, routes, features, `packages/domain`, tests, and free-tier deployment boundaries.
+
+**Pattern Completeness:**
+Naming, structure, response/error formats, state management, loading states, side effects, and enforcement rules are defined with examples and anti-patterns.
+
+### Gap Analysis Results
+
+**Critical Gaps:**
+None.
+
+**Important Gaps:**
+
+- The exact Supabase RLS policies are not written yet; they belong in the later production persistence adapter stories.
+- The exact database column list is not fully enumerated; it should be defined during migration implementation.
+- The exact public church content model is not final because church name/branding/content are still open product inputs.
+
+**Nice-to-Have Gaps:**
+
+- Add a lightweight `docs/architecture-decisions/` folder later if decisions grow.
+- Add Playwright E2E once the first vertical slice is implemented.
+- Add performance budget checks once real pages exist.
+
+### Validation Issues Addressed
+
+No blocking issues found. The remaining gaps are implementation-detail gaps, not architecture blockers.
+
+### Architecture Completeness Checklist
+
+**Requirements Analysis**
+
+- [x] Project context thoroughly analyzed
+- [x] Scale and complexity assessed
+- [x] Technical constraints identified
+- [x] Cross-cutting concerns mapped
+
+**Architectural Decisions**
+
+- [x] Critical decisions documented with versions
+- [x] Technology stack fully specified
+- [x] Integration patterns defined
+- [x] Performance considerations addressed
+
+**Implementation Patterns**
+
+- [x] Naming conventions established
+- [x] Structure patterns defined
+- [x] Communication patterns specified
+- [x] Process patterns documented
+
+**Project Structure**
+
+- [x] Complete directory structure defined
+- [x] Component boundaries established
+- [x] Integration points mapped
+- [x] Requirements to structure mapping complete
+
+### Architecture Readiness Assessment
+
+**Overall Status:** READY FOR IMPLEMENTATION
+
+**Confidence Level:** High
+
+**Key Strengths:**
+
+- Strong alignment with your TanStack preference and performance goal.
+- Simple enough for a personal project while still serious about auth/RLS/security.
+- Clear route and feature boundaries for public, participant, and admin surfaces.
+- Explicit anti-patterns reduce AI-agent implementation drift.
+- Export/email/calendar concerns are isolated and testable.
+
+**Areas for Future Enhancement:**
+
+- Reusable family profiles.
+- Multilingual public pages.
+- Event recurrence.
+- Volunteer role assignment.
+- Live check-in/check-out if later confirmed.
+- Background jobs if reminders/reports become heavy.
+
+### Implementation Handoff
+
+**AI Agent Guidelines:**
+
+- Follow all architectural decisions exactly as documented.
+- Use implementation patterns consistently across all components.
+- Respect project structure and public/admin/portal boundaries.
+- Refer to this document for architectural questions.
+- Do not introduce Next.js, GraphQL, microservices, realtime, payments, waitlists, or complex roles in MVP.
+
+**First Implementation Priority:**
+Initialize the TanStack Start project using the selected CLI command, then implement the first vertical slice: published event → signup/sign-in → registration submit → admin approval → participant status.

```

## _bmad-output/planning-artifacts/epics.md

```diff
diff --git a/_bmad-output/planning-artifacts/epics.md b/_bmad-output/planning-artifacts/epics.md
new file mode 100644
index 0000000..ee928c5
--- /dev/null
+++ b/_bmad-output/planning-artifacts/epics.md
@@ -0,0 +1,685 @@
+---
+stepsCompleted: [1, 2, 3, 4]
+workflowType: 'epics-and-stories'
+status: 'complete'
+completedAt: '2026-06-21'
+inputDocuments:
+  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/prd.md
+  - _bmad-output/planning-artifacts/architecture.md
+  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/DESIGN.md
+  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/EXPERIENCE.md
+---
+
+# web-ottawa-church - Epic Breakdown
+
+## Overview
+
+This document provides the complete epic and story breakdown for web-ottawa-church, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.
+
+## Requirements Inventory
+
+### Functional Requirements
+
+FR1: Visitors can view public church information including service times, location, contact information, about content, and basic ministry information.
+
+FR2: Visitors can view a list of published Events with title, date/time, summary, location, and registration availability; draft or archived Events are not visible publicly and Events can be sorted by upcoming date.
+
+FR3: Visitors can view Event details including capacity, price/payment note, location, age group, required items, waiver/consent note, transportation note, and volunteer needs when provided; empty optional fields are hidden and approval requirements are clear.
+
+FR4: Visitors can create an Account without an invitation; Account creation does not require Admin approval and remains separate from Event Registration approval.
+
+FR5: Participants can maintain basic profile information needed for event coordination: name, email, phone, and optional notes; Admins can view profile data only where needed for Event coordination.
+
+FR6: Authenticated Participants can submit a Registration for a published Event; submitted Registrations start as `pending` and duplicate active Registrations for the same Event are not allowed.
+
+FR7: Participants can enter the number of people accompanying them for an Event; the value must be zero or greater and available in Admin planning views.
+
+FR8: Participants can enter Age Range counts for their registration group; counts must be zero or greater and the sum must equal `1 + accompanying people count`; Admins can view aggregate counts by Age Range.
+
+FR9: Participants can provide optional notes or answer event-specific prompts when configured by an Admin; notes are visible to Admins and not public.
+
+FR10: Admins can create, edit, publish, archive, and delete Events; drafts are not public and archived Events are hidden from default public views while remaining available for Admin history.
+
+FR11: Admins can configure Event fields for capacity, price/payment note, location, age group, required items, waiver/consent note, transportation note, volunteer needs, and registration availability; title, date/time, location, and publication status are required.
+
+FR12: Admins can view pending Registrations for an Event with Participant details, accompanying count, Age Range counts, and submitted notes; Admins can filter by Approval Status and see totals for pending, approved, and declined Registrations.
+
+FR13: Admins can approve or decline a Registration; changes are timestamped, record the deciding Admin, and are visible to the Participant in the portal.
+
+FR14: Admins can view aggregate Event totals by Approval Status, RSVP Status, accompanying count, and Age Range; totals update after approval and RSVP changes and distinguish pending from approved participants.
+
+FR15: Participants can view their Registrations grouped by Approval Status and Event date; Participants can see pending, approved, and declined Registrations but cannot view other Participants' Registrations.
+
+FR16: Participants can change RSVP Status for their own Registration; changes are visible to Admins, cannot be made for another Participant, and do not override Approval Status.
+
+FR17: The system sends email notifications for registration submission, approval, and decline; email failures are logged and marketing/newsletter emails are not in MVP.
+
+FR18: Admins can send reminder emails for an Event; reminders respect provider limits, avoid accidental duplicate sends, and roster exports remain a fallback.
+
+FR19: Participants and visitors can download or open an Event calendar file using `.ics`; the file includes title, date/time, location, description, and event URL, with no two-way calendar sync.
+
+FR20: Admins can export Event rosters as CSV and view a printable roster; roster exports include Participant details, Approval Status, RSVP Status, accompanying count, and Age Range counts and are Admin-only.
+
+### NonFunctional Requirements
+
+NFR1: Public pages should pass Core Web Vitals on mobile: LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1.
+
+NFR2: Public pages should not load unnecessary admin or portal functionality.
+
+NFR3: Users can only access their own Participant data unless they are an Admin.
+
+NFR4: Admin-only actions require explicit server-side authorization checks.
+
+NFR5: The system should collect age-range counts rather than unnecessary individual child details.
+
+NFR6: The MVP should use free-tier-friendly services where practical and avoid infrastructure requiring ongoing paid operations.
+
+NFR7: Public pages and core forms should be usable with keyboard navigation and readable by assistive technologies.
+
+NFR8: The system should be simple enough for one developer to build and operate.
+
+### Additional Requirements
+
+- Initialize the project using the Project Surf-inspired Bun/Turbo monorepo shape with `apps/web` for TanStack Start UI and `packages/domain` for shared church event domain logic.
+- Use Bun, Turbo, TypeScript, TanStack Start, TanStack Router, TanStack Query when server state is introduced, Tailwind v4, and shadcn-style UI.
+- Keep persistence Supabase Postgres/Auth/RLS-compatible for free-tier production, while allowing local storage adapters for the first working product.
+- Preserve the data model for future `profiles`, `admin_users`, `events`, `registrations`, `registration_age_counts`, `notification_log`, `audit_log`, and RLS policies; implement local equivalents first if needed for a working product.
+- Use local/demo auth for the first working product and preserve a Supabase Auth replacement path; use an `admin_users` allowlist concept for Admin access.
+- Enforce authorization through both server-side checks and Supabase RLS; never expose the service-role key to browser code.
+- Use TanStack Start server functions/routes for app-owned mutations and exports.
+- Implement explicit server actions for event create/edit/archive/delete, registration submission, approval/decline, RSVP updates, reminders, CSV export, and `.ics` export.
+- Use Resend for transactional registration and reminder emails; log email failures without rolling back successful domain actions.
+- Generate deterministic `.ics` calendar files and CSV roster exports.
+- Use environment validation when production adapters are introduced, covering Supabase public keys, service-role key, Resend API key, site URL, and runtime mode.
+- Keep public, portal, and admin concerns separated so public routes do not import admin/portal-only modules.
+- Organize implementation with Project Surf-style boundaries: `apps/web/src/features`, `apps/web/src/components/ui`, `apps/web/src/routes`, and `packages/domain`.
+- Use database `snake_case`, app-facing TypeScript `camelCase`, kebab-case route paths, PascalCase React components, kebab-case component files, and verb-first server actions.
+- Use Bun test for validation, domain logic, `.ics`, CSV, and service behavior; add Playwright later for core E2E flows.
+- Do not introduce Next.js, GraphQL, microservices, realtime infrastructure, payments, waitlists, complex role hierarchy, or live check-in/check-out in MVP.
+
+### UX Design Requirements
+
+UX-DR1: Implement the approved shadcn-style visual identity using white/raised surfaces, muted slate neutrals, violet primary actions, semantic status colors, restrained borders, and soft card/dialog/menu shadows.
+
+UX-DR2: Implement design tokens for colors, typography, spacing, and radii from `DESIGN.md`, with public pages using display/headline scale and portal/admin screens using compact app-style typography.
+
+UX-DR3: Use conventional shadcn-compatible Card, Button, Badge, Dialog, Input, Select, Table, and Form primitives instead of experimental custom layouts.
+
+UX-DR4: Implement responsive public navigation with Home, About, Service Times & Location, Events, Contact, and Sign in; mobile navigation must collapse and close after navigation.
+
+UX-DR5: Implement authenticated participant navigation with Dashboard, Events, Profile, and Sign out.
+
+UX-DR6: Implement Admin navigation centered on Dashboard, Events, Registrations/Pending, Exports, and Sign out.
+
+UX-DR7: Implement Events list and status-heavy participant views using rows/tables where status and actions matter, rather than loose card grids.
+
+UX-DR8: Implement Event detail surfaces with date/time, location, registration state, and calendar action before long description.
+
+UX-DR9: Implement an Event details modal from Event row Details/Event title that shows date, linked Location, capacity, cost, required items, transportation, waiver/consent, volunteer needs, and signed-in-only attendance context.
+
+UX-DR10: Ensure public visitors never see participant names or private participant details in Event details or attendance context.
+
+UX-DR11: Implement a Website sign-up modal from header Sign up that captures Account fields only: name, email, phone, and password.
+
+UX-DR12: Implement an Event registration modal from Event row Register that requires a signed-in Account and captures accompanying people, Age Range counts, and notes.
+
+UX-DR13: Implement Age Range count inputs as numeric controls with inline validation requiring the total to equal `1 + accompanying people count`.
+
+UX-DR14: Display helper copy explaining: “Include yourself in the age ranges. Example: if you are coming with 2 children, accompanying people = 2 and age ranges total = 3.”
+
+UX-DR15: Implement text-bearing status badges for Pending, Approved, Declined, Attending, and Not attending; status may not rely on color alone.
+
+UX-DR16: Implement row action menus using a three-dot menu for Details, Register, Add to calendar, View status, Update RSVP, Review, Roster, Send reminder, Approve, and Decline as applicable.
+
+UX-DR17: Implement Admin event management rows showing Event status, pending count, approved count, Age Range signal, and row action menu.
+
+UX-DR18: Implement Create Event modal fields for title, date/time, Location, maps link, description, capacity, cost, required items, transportation note, waiver/consent note, volunteer needs, and publication status.
+
+UX-DR19: Implement confirmation dialogs for destructive or planning-sensitive actions, including decline, reminder send, and RSVP status changes; approval can be one click only if undo/logging exists.
+
+UX-DR20: Implement roster export as CSV and printable roster as a print-optimized view.
+
+UX-DR21: Implement a single “Add to calendar” action that downloads/opens `.ics`, with a fallback if the browser cannot open it automatically.
+
+UX-DR22: Implement defined empty/loading/error states: no upcoming Events, registration closed, unauthenticated registration attempt, registration submitted, approved, declined, RSVP unknown, no pending registrations, email send failure, and permission denied.
+
+UX-DR23: Use direct, calm microcopy such as “Your registration is pending approval,” “Approved. You’re registered for this event,” and “You marked this event as not attending.”
+
+UX-DR24: Ensure all interactions are tap/click accessible with no hover-only functionality, explicit form submit buttons, and visible selected/saved states.
+
+UX-DR25: Implement inline validation near fields and repeat errors in a summary when submission fails.
+
+UX-DR26: Keep date/time and location visible consistently on every Event surface.
+
+UX-DR27: Implement Admin list filters for Approval Status, RSVP Status, search, and Event date using simple controls.
+
+UX-DR28: Meet the accessibility floor: WCAG 2.2 AA target, keyboard reachable controls, visible labels, focus order matching visual order, meaningful error messages, 44px practical touch targets, reduced-motion respect, accessible table headers, and label/value meaning in stacked mobile cards.
+
+UX-DR29: Implement responsive behavior at `< 640px`, `640–1023px`, and `≥ 1024px`, with mobile-first participant flows and desktop-optimized Admin tables.
+
+UX-DR30: Avoid banned MVP patterns: carousels, heavy hero animations, infinite scroll, drag-and-drop, and nested modal stacks.
+
+UX-DR31: Avoid collecting children’s names, exact ages, or unnecessary personal details; Age Range counts are enough for MVP planning.
+
+### FR Coverage Map
+
+FR1: Epic 1 - Public church information
+
+FR2: Epic 1 - Published event listing
+
+FR3: Epic 1 - Event details
+
+FR4: Epic 2 - Open account creation
+
+FR5: Epic 2 - Participant profile
+
+FR6: Epic 3 - Registration submission
+
+FR7: Epic 3 - Accompanying count
+
+FR8: Epic 3 - Age-range counts
+
+FR9: Epic 3 - Event-specific notes
+
+FR10: Epic 4 - Event management
+
+FR11: Epic 4 - Event detail configuration
+
+FR12: Epic 4 - Pending registration review
+
+FR13: Epic 4 - Approval and decline
+
+FR14: Epic 4 - Planning totals
+
+FR15: Epic 3 - Personal registration view
+
+FR16: Epic 3 - RSVP update
+
+FR17: Epic 5 - Registration status emails
+
+FR18: Epic 5 - Reminder emails
+
+FR19: Epic 1 - Calendar export
+
+FR20: Epic 5 - CSV and print rosters
+
+## Epic List
+
+### Epic 1: Public Website Foundation and Event Discovery
+
+Visitors can learn about the church, browse upcoming published events, view event details, and add events to their calendar from a fast, accessible public site.
+
+**FRs covered:** FR1, FR2, FR3, FR19
+
+### Epic 2: Account Access and Participant Profile
+
+Visitors can create an account, sign in, and maintain the minimal profile needed for event coordination.
+
+**FRs covered:** FR4, FR5
+
+### Epic 3: Participant Event Registration and RSVP
+
+Signed-in participants can register for events, provide accompanying people and age-range counts, see their registration status, and update RSVP status.
+
+**FRs covered:** FR6, FR7, FR8, FR9, FR15, FR16
+
+### Epic 4: Admin Event Management and Approval
+
+Admins can manage events, review registrations, approve/decline participants, and view planning totals for event coordination.
+
+**FRs covered:** FR10, FR11, FR12, FR13, FR14
+
+### Epic 5: Communication, Rosters, and Operational Exports
+
+Admins and participants get practical operational outputs: registration emails, reminders, CSV rosters, printable rosters, and reliable export behavior.
+
+**FRs covered:** FR17, FR18, FR20
+
+## Epic 1: Public Website Foundation and Event Discovery
+
+Visitors can learn about the church, browse upcoming published events, view event details, and add events to their calendar from a fast, accessible public site.
+
+### Story 1.1: Initialize TanStack Start Public App Foundation
+
+As a visitor,
+I want a fast public website shell with clear navigation,
+So that I can quickly find church information and events.
+
+**Acceptance Criteria:**
+
+**Given** the repository is ready for implementation
+**When** the developer initializes the app
+**Then** the project is created using the approved Project Surf-inspired Bun/Turbo monorepo shape with `apps/web`, `packages/domain`, TanStack Start, Tailwind v4, and shadcn-style primitives
+**And** required base configuration files are present for Bun workspaces, Turbo, TypeScript, Vite/TanStack Start, Tailwind v4, and shadcn-style UI
+**And** a visitor can open the home page and see a responsive public layout with header, footer, and navigation
+**And** navigation includes Home, About, Service Times & Location, Events, Contact, and Sign in
+**And** the app uses the approved shadcn-style visual tokens and primitives
+**And** public routes do not import admin or portal-only modules.
+
+### Story 1.2: Public Church Information Pages
+
+As a visitor,
+I want church information pages,
+So that I can understand service times, location, contact details, and basic church context.
+
+**Acceptance Criteria:**
+
+**Given** public church content exists
+**When** a visitor opens About, Service Times & Location, or Contact
+**Then** the page shows relevant church information without requiring sign in
+**And** empty optional content is not shown as broken placeholders
+**And** pages are keyboard navigable and readable by assistive technologies.
+
+### Story 1.3: Published Upcoming Events List
+
+As a visitor,
+I want to browse upcoming published events,
+So that I can decide which church/community events I may want to attend.
+
+**Acceptance Criteria:**
+
+**Given** published, draft, and archived events exist
+**When** a visitor opens the Events page
+**Then** only published upcoming events are shown
+**And** each event row shows title, date/time, summary, location, registration availability, status/action menu, and calendar action where available
+**And** draft and archived events are hidden from the public list
+**And** the empty state says no upcoming events are published when none exist.
+
+### Story 1.4: Public Event Details
+
+As a visitor,
+I want to view complete event details,
+So that I know whether the event is relevant and what I need to prepare.
+
+**Acceptance Criteria:**
+
+**Given** a published event has optional details
+**When** a visitor opens the event detail page or details modal
+**Then** they see date/time, linked location, capacity, price/payment note, age group, required items, waiver/consent note, transportation note, volunteer needs, and registration approval note when provided
+**And** empty optional fields are hidden
+**And** public visitors do not see participant names or private participant details
+**And** date/time and location appear before long descriptions.
+
+### Story 1.5: Public Calendar Export
+
+As a visitor or participant,
+I want to add an event to my calendar,
+So that I can keep the event details in my personal calendar app.
+
+**Acceptance Criteria:**
+
+**Given** a published event has title, date/time, location, description, and URL
+**When** a visitor selects Add to calendar
+**Then** the system downloads or opens a valid `.ics` file
+**And** the file includes event title, date/time, location, description, and event URL
+**And** no two-way calendar synchronization is required
+**And** if automatic opening fails, the user still receives a download fallback.
+
+### Story 1.6: Public Performance and Accessibility Baseline
+
+As a mobile visitor,
+I want public pages to load quickly and work accessibly,
+So that I can discover church information and events without friction.
+
+**Acceptance Criteria:**
+
+**Given** the public home, church info, events list, and event detail pages exist
+**When** they are tested on mobile
+**Then** public pages target LCP ≤ 2.5s, INP ≤ 200ms, and CLS ≤ 0.1
+**And** touch targets are at least 44px where practical
+**And** status and actions do not rely on color alone
+**And** no carousels, heavy hero animations, infinite scroll, drag-and-drop, or nested modal stacks are used.
+
+## Epic 2: Account Access and Participant Profile
+
+Visitors can create an account, sign in, and maintain the minimal profile needed for event coordination.
+
+### Story 2.1: Account Sign Up
+
+As a visitor,
+I want to create an account without an invitation,
+So that I can register for church events.
+
+**Acceptance Criteria:**
+
+**Given** a visitor is on the public site
+**When** they open Sign up
+**Then** a website sign-up modal opens
+**And** the modal captures name, email, phone, and password only
+**And** it does not capture event-specific registration details
+**And** successful account creation signs in or routes the user into an authenticated state
+**And** account creation does not require Admin approval.
+
+### Story 2.2: Sign In and Auth Callback
+
+As a participant,
+I want to sign in securely,
+So that I can access my profile, registrations, and event actions.
+
+**Acceptance Criteria:**
+
+**Given** a participant has an account
+**When** they sign in
+**Then** the system authenticates through Supabase Auth
+**And** the auth callback establishes the session correctly
+**And** Sign in remains reachable from public navigation
+**And** unauthenticated event registration attempts route to Sign in and return to the event after authentication.
+
+### Story 2.3: Participant Profile Management
+
+As a participant,
+I want to maintain my basic profile,
+So that event organizers have the coordination information they need.
+
+**Acceptance Criteria:**
+
+**Given** a participant is signed in
+**When** they open Profile
+**Then** they can view and update name, email, phone, and optional notes
+**And** validation prevents missing required profile fields
+**And** profile data is only visible to the participant and Admins where needed for event coordination
+**And** the profile page uses visible labels and inline validation.
+
+### Story 2.4: Authenticated Navigation and Access States
+
+As a signed-in participant,
+I want navigation that reflects my account state,
+So that I can reach my dashboard, events, profile, and sign out actions.
+
+**Acceptance Criteria:**
+
+**Given** a visitor is signed out
+**When** they view public navigation
+**Then** they see Sign in and Sign up actions
+**And** they do not see participant-only navigation
+**Given** a participant is signed in
+**When** they view authenticated navigation
+**Then** they see Dashboard, Events, Profile, and Sign out
+**And** mobile navigation remains keyboard and touch accessible.
+
+## Epic 3: Participant Event Registration and RSVP
+
+Signed-in participants can register for events, provide accompanying people and age-range counts, see their registration status, and update RSVP status.
+
+### Story 3.1: Event Registration Entry Flow
+
+As a signed-in participant,
+I want to register from an event row or detail surface,
+So that I can submit my intent to attend a specific event.
+
+**Acceptance Criteria:**
+
+**Given** a participant is signed in and a published event allows registration
+**When** they select Register from the event row action menu or event detail
+**Then** an Event registration modal opens for that specific event
+**And** the modal clearly identifies the event title, date/time, and location
+**And** the modal captures event-specific details only
+**And** a signed-out visitor attempting registration is routed to Sign in before returning to the event.
+
+### Story 3.2: Registration Group Counts and Notes
+
+As a participant,
+I want to provide accompanying people, age-range counts, and notes,
+So that organizers have the planning information they need.
+
+**Acceptance Criteria:**
+
+**Given** the registration modal is open
+**When** the participant enters accompanying count, Age Range counts, and optional notes
+**Then** counts must be zero or greater
+**And** Age Range counts must total `1 + accompanying people count`
+**And** helper text explains that the participant must include themselves in the age ranges
+**And** validation errors appear inline near the relevant fields and in a submission summary when needed
+**And** notes are saved for Admin review but never shown publicly.
+
+### Story 3.3: Submit Registration and Pending State
+
+As a participant,
+I want to submit my registration,
+So that the Admin team can review and approve my participation.
+
+**Acceptance Criteria:**
+
+**Given** a participant has completed a valid registration form
+**When** they submit the form
+**Then** a Registration is created with Approval Status `pending`
+**And** duplicate active Registrations for the same participant and event are prevented
+**And** the confirmation message says “Your registration is pending approval.”
+**And** the confirmation includes a route to the participant dashboard or status view
+**And** submit controls prevent duplicate submissions while pending.
+
+### Story 3.4: Participant Registration Status List
+
+As a participant,
+I want to see my event registration statuses,
+So that I know whether I am pending, approved, declined, or not attending.
+
+**Acceptance Criteria:**
+
+**Given** a participant has registrations
+**When** they open their dashboard, registrations page, or authenticated Events status list
+**Then** their Registrations are grouped or sorted by Approval Status and Event date
+**And** each row shows event title, date/time, location, Approval Status, RSVP Status, and row action menu
+**And** status badges include text labels and do not rely on color alone
+**And** the participant cannot see other Participants' Registrations.
+
+### Story 3.5: RSVP Status Update
+
+As an approved participant,
+I want to update whether I will attend,
+So that organizers have accurate planning totals.
+
+**Acceptance Criteria:**
+
+**Given** a participant has a Registration they own
+**When** they change RSVP Status to Attending or Not attending
+**Then** the system saves the new status only for their Registration
+**And** RSVP Status does not override Approval Status
+**And** planning-sensitive changes require clear confirmation
+**And** the UI confirms “You marked this event as not attending.” when applicable
+**And** failed saves revert the selected state and show a useful error.
+
+### Story 3.6: Participant Registration Privacy and Security
+
+As a participant,
+I want my registration details protected,
+So that only I and authorized Admins can access them.
+
+**Acceptance Criteria:**
+
+**Given** registration data exists
+**When** a participant requests registration data
+**Then** they can access only their own Registrations
+**And** server-side authorization and Supabase RLS enforce ownership
+**And** exact child names, exact ages, and unnecessary child details are not collected
+**And** public event details never expose private participant data.
+
+## Epic 4: Admin Event Management and Approval
+
+Admins can manage events, review registrations, approve/decline participants, and view planning totals for event coordination.
+
+### Story 4.1: Admin Access and Event-Centered Navigation
+
+As an Admin,
+I want secure Admin access and event-centered navigation,
+So that I can manage church event operations.
+
+**Acceptance Criteria:**
+
+**Given** a signed-in user is in the `admin_users` allowlist
+**When** they open Admin
+**Then** they can access Admin dashboard, Events, Registrations/Pending, and Exports navigation
+**And** non-admin users are denied access with “You do not have access to this page.”
+**And** every Admin route and mutation performs server-side authorization
+**And** Admin navigation remains usable on mobile for simple review tasks.
+
+### Story 4.2: Create Event
+
+As an Admin,
+I want to create an event with all planning details,
+So that participants can discover and register for it.
+
+**Acceptance Criteria:**
+
+**Given** an Admin is on Admin events
+**When** they open Create Event
+**Then** a modal captures title, date/time, Location, maps link, description, capacity, cost, required items, transportation note, waiver/consent note, volunteer needs, registration availability, and publication status
+**And** title, date/time, location, and publication status are required
+**And** optional empty fields are not shown as public placeholders
+**And** created draft events are not visible publicly.
+
+### Story 4.3: Edit, Publish, Archive, and Delete Events
+
+As an Admin,
+I want to manage event lifecycle,
+So that public event listings stay accurate.
+
+**Acceptance Criteria:**
+
+**Given** an event exists
+**When** an Admin edits, publishes, archives, or deletes it
+**Then** the change is saved through an authorized server action
+**And** published events can appear on the public event list
+**And** archived events are hidden from default public views but remain available for Admin history
+**And** destructive actions require confirmation.
+
+### Story 4.4: Admin Event Management Rows
+
+As an Admin,
+I want event rows with planning signals,
+So that I can quickly identify events needing attention.
+
+**Acceptance Criteria:**
+
+**Given** events and registrations exist
+**When** an Admin opens Admin events
+**Then** each event row shows Event status, pending count, approved count, Age Range signal, and row action menu
+**And** row actions include Review, Roster, Send reminder, and other applicable actions
+**And** Admin tables become labeled stacked cards on small screens
+**And** filters include Approval Status, RSVP Status, search, and Event date where applicable.
+
+### Story 4.5: Review Pending Registrations
+
+As an Admin,
+I want to review pending registrations for an event,
+So that I can decide who should be approved.
+
+**Acceptance Criteria:**
+
+**Given** pending Registrations exist for an event
+**When** an Admin opens the event detail or approval queue
+**Then** each row shows Participant details, accompanying count, Age Range counts, submitted notes, Approval Status, and actions
+**And** the Admin can filter by Approval Status
+**And** the Admin does not lose event context while reviewing registrations
+**And** the no-pending state says “No pending registrations.”
+
+### Story 4.6: Approve and Decline Registrations
+
+As an Admin,
+I want to approve or decline registrations,
+So that the participant list reflects accepted attendance.
+
+**Acceptance Criteria:**
+
+**Given** an Admin reviews a pending Registration
+**When** they approve or decline it
+**Then** Approval Status updates with timestamp and deciding Admin
+**And** the participant can see the updated status in their portal
+**And** decline requires confirmation
+**And** approval can be one click only if audit logging exists
+**And** authorization prevents non-admin approval or decline.
+
+### Story 4.7: Admin Planning Totals
+
+As an Admin,
+I want aggregate planning totals,
+So that I can plan food, space, transportation, and supervision.
+
+**Acceptance Criteria:**
+
+**Given** registrations exist for an event
+**When** an Admin views event planning totals
+**Then** totals show Approval Status, RSVP Status, accompanying count, and Age Range aggregates
+**And** totals update after approval changes and RSVP changes
+**And** totals distinguish pending from approved participants
+**And** Age Range counts are stored and queried as relational rows, not JSON blobs.
+
+## Epic 5: Communication, Rosters, and Operational Exports
+
+Admins and participants get practical operational outputs: registration emails, reminders, CSV rosters, printable rosters, and reliable export behavior.
+
+### Story 5.1: Registration Status Email Notifications
+
+As a participant,
+I want registration status emails,
+So that I know when my registration is submitted, approved, or declined.
+
+**Acceptance Criteria:**
+
+**Given** a registration is submitted, approved, or declined
+**When** the status-changing action succeeds
+**Then** the system attempts to send the appropriate transactional email through Resend
+**And** the email contains event title, date/time, location, and current status
+**And** email failures are logged for Admin/debugging review
+**And** email failure does not roll back the saved registration/status change
+**And** marketing/newsletter emails are not sent in MVP.
+
+### Story 5.2: Admin Event Reminder Emails
+
+As an Admin,
+I want to send reminder emails for an event,
+So that approved participants receive practical event details before attending.
+
+**Acceptance Criteria:**
+
+**Given** an Admin is viewing an event with approved participants
+**When** they choose Send reminder
+**Then** the system asks for confirmation before sending
+**And** reminders respect provider limits and avoid accidental duplicate sends
+**And** email send failures are logged without changing registration data
+**And** exported rosters remain available as fallback if email sending is unavailable.
+
+### Story 5.3: CSV Roster Export
+
+As an Admin,
+I want to export an event roster as CSV,
+So that I can use participant and planning data outside the system.
+
+**Acceptance Criteria:**
+
+**Given** an Admin is viewing an event
+**When** they export CSV
+**Then** the generated roster includes Participant details, Approval Status, RSVP Status, accompanying count, and Age Range counts
+**And** the export is Admin-only
+**And** the CSV generation is deterministic and testable
+**And** unauthorized users cannot access roster export data.
+
+### Story 5.4: Printable Roster View
+
+As an Admin,
+I want a printable event roster,
+So that I can use a clean paper copy during planning or event operations.
+
+**Acceptance Criteria:**
+
+**Given** an Admin is viewing an event
+**When** they open the printable roster
+**Then** the page uses print-optimized formatting
+**And** it includes participant, approval, RSVP, accompanying, and Age Range planning data
+**And** it avoids unnecessary navigation and decorative UI in print layout
+**And** access remains Admin-only.
+
+### Story 5.5: Operational Logging and Export Tests
+
+As an operator,
+I want emails and exports to be logged and tested,
+So that communication and planning outputs are reliable.
+
+**Acceptance Criteria:**
+
+**Given** notification and export features exist
+**When** emails, `.ics`, CSV, and printable roster behavior are tested
+**Then** Bun tests cover deterministic `.ics` generation, CSV generation, registration status email side effects, reminder side effects, and failure logging
+**And** logged failures include enough context for debugging without exposing secrets
+**And** service-role keys and provider API keys are never exposed to browser code
+**And** environment validation blocks missing required server keys.

```


