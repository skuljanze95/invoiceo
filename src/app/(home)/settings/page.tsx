import { AddressForm } from "@/components/settings/organization/address-form";
import { IbanForm } from "@/components/settings/organization/iban-form";
import { NameForm } from "@/components/settings/organization/name-form";
import { VatForm } from "@/components/settings/organization/vat-form";
import { ErrorComponent } from "@/components/shared/error-component";
import { getOrganization } from "@/lib/actions/organization";

export default async function Page() {
  const { data: organization, error } = await getOrganization();

  if (error) return <ErrorComponent message={error.message} />;

  const id = organization?.id ?? "";
  const name = organization?.name ?? "";
  const streetAddress = organization?.streetAddress ?? "";
  const city = organization?.city ?? "";
  const state = organization?.state ?? "";
  const zipCode = organization?.zipCode ?? "";
  const country = organization?.country ?? "";
  const vatNumber = organization?.vatNumber ?? "";
  const bankIban = organization?.bankIban ?? "";

  return (
    <div className="flex flex-col gap-8">
      <NameForm id={id} name={name} />
      <AddressForm
        city={city}
        country={country}
        id={id}
        state={state}
        streetAddress={streetAddress}
        zipCode={zipCode}
      />
      <IbanForm bankIban={bankIban} id={id} />
      <VatForm id={id} vatNumber={vatNumber} />
    </div>
  );
}
