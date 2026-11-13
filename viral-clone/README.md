# viral-clone

Hypit project for remaking a reference (viral) video with generated media, using a Monid workspace for generation.

- `hypit.runtime.json`: Runtime Profile. `monid.default` (`@hypit/provider-monid`) serves Seedance 2 / 2 Fast / 2 Mini / 2.5, MiniMax H3 and Wan 2.7 Image / Image Pro, bound explicitly because HypiHub offers the same models.
- The Monid API key is not in the repo. Store it with `hypit auth login monid.default --from <file>` and `monid keys add -k <key> -l main`.
- `npm i` once per clone, plus `npm i -g @hypit/hypit @monid-ai/cli` and `npx skills add hypit-ai/hypit -g`.
- Check with `hypit doctor --endpoint monid.default`.

Status: wired; waiting on a Monid API key and the reference video to clone.
