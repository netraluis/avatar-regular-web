"use client";
import { WelcomeMessage } from "./welcome-message";
import { Banner } from "./banner";
import { Footer } from "./footer";
import Menu from "./menu";

export default function Interface() {
  return (
    <div>
      <WelcomeMessage />
      <Menu />
      <Banner />
      <Footer />
    </div>
  );
}
