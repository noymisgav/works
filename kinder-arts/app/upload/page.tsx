import { getKindergartenYears } from "@/lib/wix";
import UploadClient from "./UploadClient";
import Navbar from "@/components/Navbar";

export default async function UploadPage() {
  const years = await getKindergartenYears();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <UploadClient years={years} />
      </main>
    </>
  );
}
