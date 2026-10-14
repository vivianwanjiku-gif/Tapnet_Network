import PageHeader from "../../components/PageHeader";
import PlanGrid from "../../components/PlanGrid";

export default function Packages() {
  return (
    <div className="space-y-8">
      <PageHeader title="Internet packages" lede="Subscribe starts payment for that plan. You can still switch the package on the next screen." />
      <PlanGrid mode="account" />
    </div>
  );
}
