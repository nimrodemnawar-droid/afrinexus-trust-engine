# Finish Afrinexus management and trade experience

## Scope
- Replace the placeholder contact details with `afrinexus91@gmail.com`, WhatsApp `0708859780`, and the supplied LinkedIn profile. Remove unconfirmed social links and office addresses so visitors only see accurate contact information.
- Rebuild Pricing around the supplied Free, Pro, and Business plans, KSh transaction bands, Logistics Centre margin example, Green Africa revenue model, and value-created principle.
- Read published plans and fees from the database, with reliable built-in defaults if the data cannot load.
- Finish the admin console with a Pricing tab where admins can edit plan details, feature lists, publication state, display order, transaction fee bands, and other fee information.
- Add the complete Afrinexus trade journey as a clear vertical step-by-step flow, from business discovery through trade history and the next transaction.
- Redesign the signed-in dashboard using the supplied reference: compact navy navigation, summary cards, applications/deals workspace, activity, logistics, and next-action areas. Areas not yet backed by live trade records will use honest empty or “coming later” states rather than invented deals.

## Technical details
- Keep all writes protected by the existing admin-role checks and database policies.
- Update existing pricing records through database data operations, not schema migrations.
- Use existing Afrinexus design tokens, UI controls, and responsive patterns; the uploaded image is design reference only.
- Verify type safety, current build status, public pricing/contact/trade-flow screens, admin access states, and desktop/mobile dashboard layout.
