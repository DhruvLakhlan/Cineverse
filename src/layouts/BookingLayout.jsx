import Navbar from "../components/layout/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import "./BookingLayout.css";

const STEPS = [
  { path: "/customer/movies", label: "Movie" },
  { path: "/customer/location", label: "City" },
  { path: "/customer/theatre", label: "Theatre" },
  { path: "/customer/screen", label: "Screen" },
  { path: "/customer/showtime", label: "Show" },
  { path: "/customer/seats", label: "Seats" },
  { path: "/customer/summary", label: "Summary" },
  { path: "/customer/confirmation", label: "Confirm" },
];

export default function BookingLayout() {
  const location = useLocation();
  const currentIdx = STEPS.findIndex(s => location.pathname.startsWith(s.path));
  const isBookingFlow = currentIdx >= 1;

  return (
    <>
      <Navbar />
      <div className="booking-layout">
        {isBookingFlow && (
          <div className="booking-progress">
            <div className="booking-progress-inner">
              {STEPS.slice(1).map((step, idx) => {
                const realIdx = idx + 1;
                const isActive = currentIdx === realIdx;
                const isCompleted = currentIdx > realIdx;
                return (
                  <div key={step.path} className="booking-step">
                    <div className="booking-step-node">
                      <div className={`booking-step-circle ${isCompleted ? "completed" : isActive ? "active" : ""}`}>
                        {isCompleted ? "✓" : realIdx}
                      </div>
                      <span className={`booking-step-label ${isCompleted ? "completed" : isActive ? "active" : ""}`}>
                        {step.label}
                      </span>
                    </div>
                    {idx < STEPS.length - 2 && (
                      <div className={`booking-step-line ${isCompleted ? "completed" : ""}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="booking-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
