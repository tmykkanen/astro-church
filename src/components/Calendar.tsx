import googleCalendarPlugin from "@fullcalendar/google-calendar";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const { PUBLIC_GOOGLE_CALENDAR_ID, PUBLIC_GOOGLE_CALENDAR_API_KEY } =
  import.meta.env;

const Calendar = () => {
  const calendarRef = useRef<FullCalendar>(null);

  useHotkeys("ArrowLeft", () => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
  });

  useHotkeys("ArrowRight", () => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
  });

  useHotkeys("t", () => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  });

  return (
    <FullCalendar
      plugins={[listPlugin, googleCalendarPlugin]}
      initialView="listMonth"
      contentHeight={"auto"}
      events={{
        googleCalendarId: PUBLIC_GOOGLE_CALENDAR_ID,
        googleCalendarApiKey: PUBLIC_GOOGLE_CALENDAR_API_KEY,
      }}
      ref={calendarRef}
    />
  );
};

export default Calendar;
