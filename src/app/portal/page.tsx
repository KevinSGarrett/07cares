import { currentUser } from "@clerk/nextjs/server";

export default async function Portal() {
  const user = await currentUser();
  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome{user?.firstName ? `, ${user.firstName}` : ""}</h1>
      <p className="text-gray-600">Your dashboard lives here.</p>
    </div>
  );
}
