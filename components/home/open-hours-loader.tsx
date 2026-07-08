import { getCurrentWeekStart, getOpeningHoursWeek } from "@/app/admin/settings/actions";
import { OpenHoursSection, type OpeningHourRow } from "./open-hours-section";

const FALLBACK_HOURS: OpeningHourRow[] = [
  { day_key: "sunday", day_label: "ראשון", sort_order: 1, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "monday", day_label: "שני", sort_order: 2, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "tuesday", day_label: "שלישי", sort_order: 3, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "wednesday", day_label: "רביעי", sort_order: 4, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "thursday", day_label: "חמישי", sort_order: 5, is_open: true, open_time: "08:00", close_time: "18:00", note: null },
  { day_key: "friday", day_label: "שישי", sort_order: 6, is_open: false, open_time: null, close_time: null, note: null },
  { day_key: "saturday", day_label: "שבת", sort_order: 7, is_open: false, open_time: null, close_time: null, note: null },
];

export async function OpenHoursLoader() {
  const rows = await getOpeningHoursWeek(await getCurrentWeekStart());

  return <OpenHoursSection rows={rows.length === 7 ? rows : FALLBACK_HOURS} />;
}
