# Wireframe-to-Story Mapping

**Created**: 2026-02-12
**Purpose**: Cross-reference between epics/stories and wireframe assets for visual layout reference during implementation.

> **Wireframes are layout references only.** For canonical design tokens (colors, icons, fonts, spacing), use `docs/design/style-guide.md`. The original wireframes (generated with Google Stitch) contain known limitations (Material Icons, hex values, teal/purple primary colors) documented in `docs/design/phase-a-summary.md`. New wireframes should be generated with Figma Make — see prompt files for updated usage notes.

## Mapping Table

| Story | Screen (UX #) | Desktop Wireframe | Mobile Wireframe(s) | Notes |
| ----- | ------------- | ----------------- | ------------------- | ----- |
| 1.1c | App Shell | tripos_main_layout_shell | — | Desktop sidebar + header shell |
| 1.2 | Sign Up (#2) | tripos_sign_up_screen | sign_up_(ios), sign_up_(android) | |
| 1.3 | Sign In (#2) | tripos_sign_in_screen | sign_in_(ios), sign_in_(android) | |
| 1.3 | Forgot Password | tripos_forgot_password_screen | forgot_password_(android) | iOS variant missing |
| 1.4 | Invite Accept (#3) | tripos_trip_invitation_screen | invite_accept_(ios) | Android variant missing |
| 1.5 | Profile & Settings (#24) | user_profile_settings | tripos_profile_&_settings | |
| 1.5 | Account Security | account_management_&_security | change_password_sheet, delete_account_confirmation | |
| 1.6 | Notifications (#23) | notification_preferences | notification_center_sheet | |
| 1.7 | UI State Patterns | tripos_global_ui_state_patterns | — | Loading, error, empty states reference |
| 2.1 | Dashboard (#4) | my_trips_dashboard_grid | ios_my_trips_dashboard, android_my_trips_dashboard | |
| 2.1 | Dashboard Empty | — | android_empty_state_dashboard, trips_empty_state | |
| 2.1 | Dashboard Foundation | — | dashboard_ios_foundation, dashboard_android_foundation | Tab bar + shell |
| 2.2 | Create Trip (#5) | create_trip_modal_overlay | ios_create_trip_sheet | Android sheet missing |
| 2.3 | Trip Overview (#6) | trip_overview:_summer_in_santorini | ios_trip_overview, android_trip_overview | |
| 2.3 | Trip Workspace | — | trip_workspace_ios_foundation, trip_workspace_android_foundation | 5-tab workspace shell |
| 3.1 | Members & Invites (#7) | trip_members_management_view | trip_members_ios_view, trip_members_android_view | |
| 3.1 | Invite Modal | invite_members_modal_overlay | — | Mobile uses bottom sheet |
| 4.1 | Day Timeline (#8) | tripos_day_itinerary_timeline | trip_itinerary_ios_view | |
| 4.1 | Itinerary Empty | — | empty_itinerary_day_android | |
| 4.1 | Itinerary Loading | — | itinerary_loading_state | Skeleton loader reference |
| 4.2 | Add/Edit Activity (#9) | add_activity_modal | add_activity_bottom_sheet | |
| 4.3 | Map View (#10) | tripos_interactive_map_view | tripos_map_view_(ios), tripos_map_view_(android) | |
| 4.6 | Itinerary Reorder | — | itinerary_reorder_android_view | Drag-to-reorder |
| 5.1 | Create Poll (#12) | tripos_create_poll_modal | android_create_poll_sheet | iOS sheet missing |
| 5.2a | Ranked Choice (#14) | ranked_choice_voting_interface | android_ranked_choice_vote_screen | |
| 5.2b | Approval Vote (#15) | approval_voting_interface | ios_approval_vote_screen | |
| 5.3 | Yes/No Vote (#13) | — | ios_yes | Desktop uses poll list |
| 5.4 | Poll List (#11) | tripos_votes_dashboard | ios_trip_polls_list | |
| 5.7 | Poll Results (#16) | tripos_poll_results_dashboard | ios_poll_results_decided_yes, android_poll_results_tie_state, ios_poll_results_no_quorum_approval | Multiple result states |
| 5.8 | Poll Delete | — | polls_delete_confirmation | Confirmation dialog |
| 6.1 | My Budget (#17) | blind_budgeting_input_&_privacy_details | ios_blind_budgeting_setup, android_blind_budgeting_setup | |
| 6.2 | Budget Saved State | blind_budgeting_saved_state | — | |
| 6.3 | Group Range (#18) | blind_budgeting_dashboard | blind_budgeting_group_view_ios, blind_budgeting_group_view_android | |
| 6.4 | Explainer (#19) | blind_budgeting_explainer_modal_step_3 | — | Mobile wireframe missing |
| 7.1 | Expenses List (#20) | tripos_expense_dashboard | expenses_list_view, expenses_list_(android) | |
| 7.1 | Add Expense | add_expense_modal_view | add_new_expense_sheet | |
| 7.5 | Settlement (#21) | — | expense_settlement_summary | Desktop wireframe missing |
| 7.7 | Expenses Offline | — | expenses_offline_state | Offline fallback reference |
| 8.1 | Activity Feed (#22) | tripos_activity_feed_timeline | trip_activity_feed_and_toasts | |
| 8.1 | Notifications | tripos_activity_&_notifications | — | Combined activity + notifications |
| 9.1 | Bottom Sheet Pattern | — | ios_bottom_sheet_pattern, android_bottom_sheet_pattern | Reusable pattern reference |
| 12.1 | Landing Page (#1) | tripos_marketing_landing_page | — | Mobile wireframe missing |
| 12.2 | Features Page (#25) | tripos_features_marketing_page | — | Mobile wireframe missing |
| 12.4 | Pricing Page (#26) | tripos_pricing_page | — | Mobile wireframe missing |

## Coverage Summary

- **Stories with wireframes**: 35+ story-screen mappings across 98 stories
- **Desktop wireframes**: 34 (covers all 26 UX spec screens + modals, states, shell)
- **Mobile wireframes**: 51 (covers 22 of 26 UX spec screens with iOS/Android variants)
- **Mobile gaps**: Marketing Landing (#1), Budgeting Explainer (#19), Marketing Features (#25), Marketing Pricing (#26)

## Notes

- Stories not listed here are backend-only, cross-cutting (Epic 13), or sub-features of a screen already mapped
- Desktop wireframe `yes/` appears to be a test/placeholder directory
- Mobile wireframes include platform-specific patterns (bottom sheets, tab bars) not in desktop set
- Some stories map to multiple wireframes (e.g., poll results has 3 state variants on mobile)
