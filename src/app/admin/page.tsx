"use client";
import { Admin, Resource, ListGuesser } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

export default function AdminPage() {
  const dataProvider = simpleRestProvider("/api/admin");
  return (
    <div style={{ height: "100vh" }}>
      <Admin dataProvider={dataProvider}>
        <Resource name="users" list={ListGuesser} />
        <Resource name="campaigns" list={ListGuesser} />
      </Admin>
    </div>
  );
}
