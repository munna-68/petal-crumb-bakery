import React, { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "./DashboardLayout";
import TodayTab from "./TodayTab";
import OrdersTab from "./OrdersTab";
import BakeSheetTab from "./BakeSheetTab";
import MenuTab from "./MenuTab";
import InquiriesTab from "./InquiriesTab";
import InsightsTab from "./InsightsTab";
import CustomersTab from "./CustomersTab";
import MoneyTab from "./MoneyTab";
import SettingsTab from "./SettingsTab";
import KitchenMode from "./KitchenMode";
import { NewManualOrderModal } from "./OrderDialogs";

export default function Dashboard() {
  const [location] = useLocation();
  const [kitchenModeOpen, setKitchenModeOpen] = useState(false);
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  // Normalize path
  const path = location.replace(/\/$/, "");

  let ContentComponent: React.ReactNode;

  if (path === "/dashboard/orders") {
    ContentComponent = <OrdersTab />;
  } else if (path === "/dashboard/bake") {
    ContentComponent = <BakeSheetTab />;
  } else if (path === "/dashboard/menu") {
    ContentComponent = <MenuTab />;
  } else if (path === "/dashboard/inquiries") {
    ContentComponent = <InquiriesTab />;
  } else if (path === "/dashboard/insights") {
    ContentComponent = <InsightsTab />;
  } else if (path === "/dashboard/customers") {
    ContentComponent = <CustomersTab />;
  } else if (path === "/dashboard/money") {
    ContentComponent = <MoneyTab />;
  } else if (path === "/dashboard/settings") {
    ContentComponent = <SettingsTab />;
  } else {
    // Default to /dashboard (TodayTab)
    ContentComponent = (
      <TodayTab
        onOpenNewOrder={() => setNewOrderOpen(true)}
        onOpenKitchenMode={() => setKitchenModeOpen(true)}
      />
    );
  }

  return (
    <>
      <DashboardLayout>
        {ContentComponent}
      </DashboardLayout>

      {kitchenModeOpen && (
        <KitchenMode onClose={() => setKitchenModeOpen(false)} />
      )}

      <NewManualOrderModal
        open={newOrderOpen}
        onOpenChange={setNewOrderOpen}
      />
    </>
  );
}
