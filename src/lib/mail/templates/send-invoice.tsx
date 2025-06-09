import * as React from "react";

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";

export default function SendInvoiceWithPdf({
  clientContactFirstName,
  dueDate,
  invoiceId,
  organizationName,
}: {
  clientContactFirstName: string;
  dueDate: string | null;
  invoiceId: string;
  organizationName: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{dueDate ? `Due date: ${dueDate}` : "Invoice attached"}</Preview>
      <Body
        style={{
          backgroundColor: "#ffffff",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            maxWidth: "560px",
            padding: "20px 0 48px",
          }}
        >
          <Text>Hello {clientContactFirstName},</Text>
          <Text>
            Please find your invoice with ID {invoiceId} attached.
            {dueDate && (
              <>
                {" "}
                The due date for this invoice is <b>{dueDate}</b>.
              </>
            )}
          </Text>
          <Text>
            Thank you for your business! If you have any questions, feel free to
            reach out.
          </Text>
          <Text>Best regards,</Text>
          <Text>{organizationName}</Text>
        </Container>
      </Body>
    </Html>
  );
}
