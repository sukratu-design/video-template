# viral-clone

Hypit project for remaking a reference (viral) video with generated media, using a Monid workspace for generation.

- `hypit.runtime.json`: Runtime Profile. `monid.default` (`@hypit/provider-monid`) serves Seedance 2 / 2 Fast / 2 Mini / 2.5, MiniMax H3 and Wan 2.7 Image / Image Pro, bound explicitly because HypiHub offers the same models.
- The Monid API key is read from the `MONID_API_KEY` environment variable through `@hypit/credential-store-env`; the profile names only the variable, never the value.
- `npm i` once per clone, plus `npm i -g @hypit/hypit @monid-ai/cli` and `npx skills add hypit-ai/hypit -g`.
- Check with `hypit doctor --endpoint monid.default`.

Status: connected (`hypit doctor` clean); waiting on the reference video and a budget.
