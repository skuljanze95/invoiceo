import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { type InsertOrganizationType } from "./db/schema/organization";
import { type InvoiceFormType } from "./form-schema/invoice-form";
import { formatCurrency, formatDate } from "./utils";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

interface Props {
  invoice: InvoiceFormType;
  organization?: InsertOrganizationType;
}

export function PdfDocument({ invoice, organization }: Props) {
  return (
    <Document>
      <Page
        style={{
          color: "#18181b",
          fontFamily: "Inter",
          padding: 40,
          position: "relative",
        }}
        size="A4"
      >
        {!invoice.issuedAt && (
          <View
            style={{
              alignItems: "center",
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
              transform: "rotate(-45deg)",
            }}
            fixed
          >
            <Text
              style={{
                fontSize: 100,
                fontWeight: "bold",
                opacity: 0.2,
                zIndex: -100,
              }}
            >
              DRAFT
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <View>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image component does not have `alt` prop */}
              <Image src={baseUrl + "/invoiceo-logo.png"} style={styles.logo} />
            </View>
            <View style={styles.organization}>
              <Text style={{ fontWeight: "bold" }}>
                {organization?.name ?? "Organization name"}
              </Text>
              <Text>{organization?.streetAddress ?? "Street address"}</Text>
              <Text>
                {organization?.zipCode ?? "Zip code"}
                {", "}
                {organization?.city ?? "City"}
              </Text>
              <Text>{organization?.country ?? "Country"}</Text>
            </View>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={{ fontWeight: "bold" }}>
              Invoice ID: {invoice?.invoiceId}
            </Text>

            <Text>
              Sent Date:{" "}
              {invoice?.issuedAt ? formatDate(invoice.issuedAt) : "N/A"}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#18181a",
            height: 6,
            marginVertical: 20,
            width: "100%",
          }}
        />
        <View>
          <Text
            style={{
              fontFamily: "Inter",
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            {invoice?.client?.name ?? "Client name"}
          </Text>

          <View style={styles.section}>
            <View style={styles.info}>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                BILL TO
              </Text>

              <Text>{invoice?.client?.name}</Text>
              <Text>{invoice?.client?.streetAddress}</Text>
              <Text>
                {invoice?.client?.zipCode}
                {", "}
                {invoice?.client?.city}
              </Text>
              <Text>{invoice?.client?.country}</Text>
            </View>
            <View style={styles.info}>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                DETAILS
              </Text>
              <Text>{invoice?.invoiceDetails}</Text>
            </View>
            <View style={styles.info}>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                PAYMENT
              </Text>
              <Text>
                Due date:{" "}
                {invoice?.dueDate ? formatDate(invoice.dueDate) : "N/A"}
              </Text>
              {organization?.bankIban && (
                <Text>IBAN: {organization?.bankIban}</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.items}>
          <View style={styles.itemsTitle}>
            <Text
              style={{ fontWeight: "bold", textAlign: "left", width: "100%" }}
            >
              Description
            </Text>
            <Text style={{ fontWeight: "bold", width: "25%" }}>Unit Price</Text>
            <Text style={{ fontWeight: "bold", width: "25%" }}>Quantity</Text>
            <Text style={{ fontWeight: "bold", width: "17%" }}>Tax</Text>
            <Text
              style={{ fontWeight: "bold", textAlign: "right", width: "22%" }}
            >
              Total
            </Text>
          </View>
          {invoice?.items?.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={{ textAlign: "left", width: "100%" }}>
                {item.title}
              </Text>
              <Text style={{ width: "25%" }}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={{ width: "25%" }}>{item.quantity}</Text>
              <Text style={{ width: "17%" }}>{item.tax}%</Text>
              <Text style={{ textAlign: "right", width: "22%" }}>
                {formatCurrency(
                  item.quantity * item.unitPrice * (1 + item.tax / 100),
                )}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.total}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ marginRight: "auto" }}>Subtotal</Text>
            <Text>{formatCurrency(invoice.subtotal ?? 0)}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", marginTop: 5 }}>
            <Text style={{ marginRight: "auto" }}>Tax</Text>
            <Text>{formatCurrency(invoice.tax ?? 0)}</Text>
          </View>
          <View
            style={{
              borderBottom: "2px solid #e4e4e7",
              borderTop: "2px solid #e4e4e7",
              display: "flex",
              flexDirection: "row",
              marginTop: 5,
              paddingVertical: 8,
            }}
          >
            <Text style={{ fontWeight: "bold", marginRight: "auto" }}>
              Total
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              {formatCurrency(invoice.total ?? 0)}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>
            Terms and Conditions
          </Text>
          <Text style={{ fontSize: 10 }}>{invoice.termsAndConditions}</Text>
        </View>
      </Page>
    </Document>
  );
}

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
    },
    {
      fontWeight: "bold",
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
    },
  ],
});

const styles = StyleSheet.create({
  footer: {
    display: "flex",
    marginTop: "auto",
  },
  info: {
    borderTop: "2px solid #e4e4e7",
    fontSize: 10,
    lineHeight: 1.2,
    paddingTop: 10,
    width: "100%",
  },
  invoiceInfo: {
    fontSize: 10,
    lineHeight: 1.2,
  },
  item: {
    borderBottom: "1px solid #e4e4e7",
    display: "flex",
    flexDirection: "row",
    fontSize: 10,
    paddingVertical: 8,
    textAlign: "center",
  },
  items: {
    borderTop: "2px solid #e4e4e7",
    display: "flex",
    marginTop: 20,
    paddingTop: 10,
  },
  itemsTitle: {
    borderBottom: "1px solid #e4e4e7",
    display: "flex",
    flexDirection: "row",
    fontSize: 10,
    paddingBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
    width: "100%",
  },
  logo: { height: 40, width: 40 },
  organization: {
    fontSize: 10,
    lineHeight: 1,
  },
  page: {
    backgroundColor: "#e4e4e7",
    flexDirection: "row",
  },
  section: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  total: {
    fontSize: 10,
    lineHeight: 1.2,
    marginTop: 20,
  },
});
