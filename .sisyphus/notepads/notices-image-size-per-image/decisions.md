2026-02-03
- Store numeric widths as `data-notice-width` using a safe literal format: `<number><unit>` where unit is `px` or `%`.
- When applying `data-notice-width`, remove `data-notice-size` to prevent styling conflicts with legacy presets.
- Clear action removes only `data-notice-width` (does not modify legacy size attribute).
