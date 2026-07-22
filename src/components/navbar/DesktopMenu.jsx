import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

import NavButton from "./NavButton";
import Button from "../ui/Button";

export default function DesktopMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <NavButton to="/">Home</NavButton>

      <NavButton to="/#features">Features</NavButton>

      <NavButton to="/#membership">Membership</NavButton>

      <NavButton to="/#courses">Courses</NavButton>

      <NavButton to="/#testimonials">Reviews</NavButton>

      <NavButton to="/#faq">FAQ</NavButton>

      <NavButton to="/#contact">Contact</NavButton>

      <div className="ml-4 flex items-center gap-3">
        {user ? (
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Dashboard
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </Button>
        )}

        <Button
          onClick={() =>
            (window.location.href = user
              ? "/member-dashboard"
              : "/membership")
          }
        >
          {user ? "Member Area" : "Become Premium"}
        </Button>
      </div>
    </div>
  );
}